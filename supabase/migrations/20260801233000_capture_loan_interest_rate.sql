create or replace function public.api_submit_loan(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, zsacco_private
as $$
declare
  s sessions%rowtype;
  mid uuid := nullif(payload->>'memberId', '')::uuid;
  amt numeric := coalesce(nullif(payload->>'amount', '')::numeric, 0);
  term_value integer := coalesce(nullif(payload->>'term', '')::integer, 0);
  rate_value numeric := coalesce(nullif(payload->>'interestRate', '')::numeric, -1);
  product_value text := trim(coalesce(payload->>'product', ''));
  purpose_value text := trim(coalesce(payload->>'purpose', ''));
begin
  select * into s from sessions where token = payload->>'token' and role = 'admin';
  if not found then raise exception 'Only admins can submit loans.'; end if;
  if amt <= 0 or term_value < 1 or term_value > 60 or rate_value < 0 or rate_value > 100
    or product_value = '' or purpose_value = '' then
    raise exception 'Complete all required loan application fields.';
  end if;
  if not exists(select 1 from members where id = mid and sacco_id = s.sacco_id) then
    raise exception 'Member not found.';
  end if;

  insert into loans(
    loan_number, sacco_id, member_id, product, requested_amount, term_months,
    purpose, annual_rate, repaid_amount, installment_amount, status, progress_percent
  ) values(
    'LN-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
    s.sacco_id, mid, product_value, amt, term_value,
    purpose_value, rate_value, 0, 0, 'Pending', 0
  );
  return zsacco_private.app_data(payload->>'token');
end
$$;

create or replace function public.api_decide_loan(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, zsacco_private
as $$
declare
  s sessions%rowtype;
  l loans%rowtype;
  decision text := lower(payload->>'decision');
  total_payable numeric;
begin
  select * into s from sessions where token = payload->>'token' and role = 'admin';
  if not found then raise exception 'Only admins can decide loans.'; end if;
  if decision not in ('approve', 'reject') then raise exception 'Invalid loan decision.'; end if;

  select * into l from loans
  where id = (payload->>'loanId')::uuid and sacco_id = s.sacco_id
  for update;
  if not found then raise exception 'Loan not found.'; end if;
  if l.status <> 'Pending' then raise exception 'Only pending loan applications can be decided.'; end if;

  total_payable := l.requested_amount * (1 + ((l.annual_rate * l.term_months) / 1200));
  update loans
  set
    status = case when decision = 'approve' then 'Performing' else 'Rejected' end,
    approved_amount = case when decision = 'approve' then requested_amount else 0 end,
    repaid_amount = 0,
    progress_percent = 0,
    installment_amount = case when decision = 'approve' then ceil(total_payable / greatest(term_months, 1)) else 0 end,
    next_due = case when decision = 'approve' then (current_date + interval '1 month')::date else null end,
    decided_at = now()
  where id = l.id;

  return zsacco_private.app_data(payload->>'token');
end
$$;

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
  amt numeric := coalesce(nullif(payload->>'amount', '')::numeric, 0);
  typ text := lower(payload->>'transactionType');
  transaction_label text;
  total_payable numeric;
  outstanding numeric;
  new_repaid numeric;
begin
  select * into s from sessions where token = payload->>'token' and role = 'admin';
  if not found then raise exception 'Only admins can post transactions.'; end if;

  select * into a from accounts
  where id = (payload->>'accountId')::uuid and sacco_id = s.sacco_id
  for update;
  if not found then raise exception 'Account not found.'; end if;

  if amt <= 0 or typ not in ('deposit', 'savings deposit', 'share contribution', 'loan repayment', 'withdrawal') then
    raise exception 'Select a valid transaction type and amount.';
  end if;
  if coalesce(trim(payload->>'method'), '') = '' then raise exception 'Select a payment method.'; end if;

  if typ = 'loan repayment' then
    select * into l from loans
    where id = nullif(payload->>'loanId', '')::uuid
      and member_id = a.member_id
      and sacco_id = s.sacco_id
      and status = 'Performing'
    for update;
    if not found then raise exception 'Select an active loan belonging to this member.'; end if;
    total_payable := coalesce(nullif(l.approved_amount, 0), l.requested_amount)
      * (1 + ((l.annual_rate * l.term_months) / 1200));
    outstanding := greatest(0, total_payable - l.repaid_amount);
    if amt > outstanding then raise exception 'Payment exceeds the outstanding loan balance of %.', outstanding; end if;
    new_repaid := l.repaid_amount + amt;
    update loans set
      repaid_amount = new_repaid,
      progress_percent = least(100, round((new_repaid / greatest(total_payable, 1)) * 100)::integer),
      status = case when new_repaid >= total_payable then 'Closed' else status end,
      next_due = case when new_repaid >= total_payable then null else (coalesce(next_due, current_date) + interval '1 month')::date end
    where id = l.id;
  elsif typ in ('deposit', 'savings deposit', 'share contribution') then
    update accounts set balance = balance + amt where id = a.id;
  else
    if amt > a.balance then raise exception 'Insufficient account balance.'; end if;
    update accounts set balance = balance - amt where id = a.id;
  end if;

  transaction_label := case typ
    when 'deposit' then 'Deposit'
    when 'savings deposit' then 'Savings deposit'
    when 'share contribution' then 'Share contribution'
    when 'loan repayment' then 'Loan repayment'
    else 'Withdrawal'
  end;

  insert into transactions(reference, sacco_id, account_id, member_id, transaction_type, amount, method, narration)
  values(
    'TX-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
    s.sacco_id, a.id, a.member_id, transaction_label, amt,
    payload->>'method', coalesce(payload->>'narration', '')
  );

  return zsacco_private.app_data(payload->>'token');
end
$$;

revoke execute on function public.api_submit_loan(jsonb), public.api_decide_loan(jsonb), public.api_post_transaction(jsonb) from public, authenticated;
grant execute on function public.api_submit_loan(jsonb), public.api_decide_loan(jsonb), public.api_post_transaction(jsonb) to anon;

notify pgrst, 'reload schema';
