create or replace function public.api_post_transaction(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, zsacco_private
as $$
declare
  s sessions%rowtype;
  a accounts%rowtype;
  l loans%rowtype;
  amt numeric := coalesce((payload->>'amount')::numeric, 0);
  typ text := lower(payload->>'transactionType');
  transaction_label text;
  principal numeric;
  progress_increase integer;
begin
  select * into s
  from sessions
  where token = payload->>'token' and role = 'admin';
  if not found then
    raise exception 'Only admins can post transactions.';
  end if;

  select * into a
  from accounts
  where id = (payload->>'accountId')::uuid and sacco_id = s.sacco_id
  for update;
  if not found then
    raise exception 'Account not found.';
  end if;

  if amt <= 0
    or typ not in ('deposit', 'savings deposit', 'share contribution', 'loan repayment', 'withdrawal') then
    raise exception 'Select a valid transaction type and amount.';
  end if;
  if coalesce(trim(payload->>'method'), '') = '' then
    raise exception 'Select a payment method.';
  end if;

  if typ = 'loan repayment' then
    select * into l
    from loans
    where id = nullif(payload->>'loanId', '')::uuid
      and member_id = a.member_id
      and sacco_id = s.sacco_id
      and lower(status) not in ('rejected', 'closed')
    for update;
    if not found then
      raise exception 'Select an active loan belonging to this member.';
    end if;
  end if;

  if typ in ('deposit', 'savings deposit', 'share contribution') then
    update accounts set balance = balance + amt where id = a.id;
  elsif typ = 'withdrawal' then
    if amt > a.balance then
      raise exception 'Insufficient account balance.';
    end if;
    update accounts set balance = balance - amt where id = a.id;
  else
    principal := case when l.approved_amount > 0 then l.approved_amount else l.requested_amount end;
    progress_increase := case when principal > 0 then ceil((amt / principal) * 100)::integer else 0 end;
    update loans
    set progress_percent = least(100, progress_percent + progress_increase),
        status = case when progress_percent + progress_increase >= 100 then 'Closed' else status end
    where id = l.id;
  end if;

  transaction_label := case typ
    when 'deposit' then 'Deposit'
    when 'savings deposit' then 'Savings deposit'
    when 'share contribution' then 'Share contribution'
    when 'loan repayment' then 'Loan repayment'
    else 'Withdrawal'
  end;

  insert into transactions(
    reference, sacco_id, account_id, member_id, transaction_type,
    amount, method, narration
  )
  values(
    'TX-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
    s.sacco_id, a.id, a.member_id, transaction_label,
    amt, payload->>'method', coalesce(payload->>'narration', '')
  );

  return zsacco_private.app_data(payload->>'token');
end
$$;

revoke execute on function public.api_post_transaction(jsonb) from public, authenticated;
grant execute on function public.api_post_transaction(jsonb) to anon;

notify pgrst, 'reload schema';
