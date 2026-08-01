alter table zsacco_private.loans
  add column if not exists repaid_amount numeric(18,2) not null default 0,
  add column if not exists annual_rate numeric(5,2) not null default 14,
  add column if not exists installment_amount numeric(18,2) not null default 0,
  add column if not exists next_due date;

update zsacco_private.loans
set
  repaid_amount = least(
    coalesce(nullif(approved_amount, 0), requested_amount),
    round(coalesce(nullif(approved_amount, 0), requested_amount) * coalesce(progress_percent, 0) / 100.0, 2)
  ),
  annual_rate = case lower(coalesce(product, ''))
    when 'agriculture' then 12
    when 'education' then 10
    when 'emergency' then 12
    else 14
  end,
  installment_amount = case
    when status in ('Performing', 'Closed') then ceil(coalesce(nullif(approved_amount, 0), requested_amount) / greatest(term_months, 1))
    else 0
  end,
  next_due = case
    when status = 'Performing' then coalesce(next_due, (coalesce(decided_at, created_at) + interval '1 month')::date)
    else null
  end;

create or replace function zsacco_private.app_data(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, zsacco_private
as $$
declare
  s sessions%rowtype;
  result jsonb;
begin
  select * into s from sessions where token = p_token;
  if not found then
    raise exception 'Invalid or expired session.' using errcode = 'P0001';
  end if;

  select jsonb_build_object(
    'sacco', (select jsonb_build_object('id', x.id, 'name', x.name, 'registrationNumber', x.registration_number, 'location', x.location) from saccos x where x.id = s.sacco_id),
    'summary', jsonb_build_object(
      'totalMembers', (select count(*) from members m where m.sacco_id = s.sacco_id and (s.role = 'admin' or m.id = s.user_id)),
      'totalAccounts', (select count(*) from accounts a where a.sacco_id = s.sacco_id and (s.role = 'admin' or a.member_id = s.user_id)),
      'totalSavings', (select coalesce(sum(a.balance), 0) from accounts a where a.sacco_id = s.sacco_id and (s.role = 'admin' or a.member_id = s.user_id)),
      'activeLoans', (select count(*) from loans l where l.sacco_id = s.sacco_id and l.status not in ('Rejected', 'Closed') and (s.role = 'admin' or l.member_id = s.user_id)),
      'totalTransactions', (select count(*) from transactions t where t.sacco_id = s.sacco_id and (s.role = 'admin' or t.member_id = s.user_id))
    ),
    'members', coalesce((select jsonb_agg(jsonb_build_object(
      'id', m.id, 'memberNumber', m.member_number, 'name', m.name, 'phone', m.phone, 'email', m.email,
      'branch', m.branch, 'nationalId', m.national_id, 'memberType', m.member_type, 'address', m.address,
      'profilePhoto', m.profile_photo, 'documents', m.documents,
      'savingsBalance', (select coalesce(sum(a.balance), 0) from accounts a where a.member_id = m.id),
      'loansCount', (select count(*) from loans l where l.member_id = m.id),
      'status', m.status, 'createdAt', m.created_at
    ) order by m.created_at desc) from members m where m.sacco_id = s.sacco_id and (s.role = 'admin' or m.id = s.user_id)), '[]'::jsonb),
    'accounts', coalesce((select jsonb_agg(jsonb_build_object(
      'id', a.id, 'memberId', a.member_id, 'memberName', m.name, 'accountNumber', a.account_number,
      'accountType', a.account_type, 'balance', a.balance, 'status', a.status, 'createdAt', a.created_at
    )) from accounts a join members m on m.id = a.member_id where a.sacco_id = s.sacco_id and (s.role = 'admin' or a.member_id = s.user_id)), '[]'::jsonb),
    'transactions', coalesce((select jsonb_agg(jsonb_build_object(
      'id', t.id, 'reference', t.reference, 'accountId', t.account_id, 'memberId', t.member_id,
      'memberName', m.name, 'transactionType', t.transaction_type, 'amount', t.amount, 'method', t.method,
      'narration', t.narration, 'status', t.status, 'date', t.created_at
    ) order by t.created_at desc) from transactions t join members m on m.id = t.member_id where t.sacco_id = s.sacco_id and (s.role = 'admin' or t.member_id = s.user_id)), '[]'::jsonb),
    'loans', coalesce((select jsonb_agg(jsonb_build_object(
      'id', l.id, 'loanNumber', l.loan_number, 'memberId', l.member_id, 'memberName', m.name,
      'product', l.product, 'requestedAmount', l.requested_amount, 'approvedAmount', l.approved_amount,
      'repaidAmount', l.repaid_amount, 'annualRate', l.annual_rate, 'installmentAmount', l.installment_amount,
      'termMonths', l.term_months, 'purpose', l.purpose, 'progressPercent', l.progress_percent,
      'nextDue', l.next_due, 'status', l.status, 'createdAt', l.created_at, 'decidedAt', l.decided_at
    ) order by l.created_at desc) from loans l join members m on m.id = l.member_id where l.sacco_id = s.sacco_id and (s.role = 'admin' or l.member_id = s.user_id)), '[]'::jsonb),
    'staff', case when s.role = 'admin' then coalesce((select jsonb_agg(jsonb_build_object(
      'id', a.id, 'name', a.name, 'email', a.email, 'phone', a.phone, 'role', 'Admin',
      'branch', 'Head Office', 'access', 'Full access', 'status', 'Active'
    )) from admins a where a.sacco_id = s.sacco_id), '[]'::jsonb) else '[]'::jsonb end
  ) into result;

  return result;
end
$$;

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
  product_value text := trim(coalesce(payload->>'product', ''));
  purpose_value text := trim(coalesce(payload->>'purpose', ''));
  rate_value numeric := case lower(trim(coalesce(payload->>'product', '')))
    when 'agriculture' then 12
    when 'education' then 10
    when 'emergency' then 12
    else 14
  end;
begin
  select * into s from sessions where token = payload->>'token' and role = 'admin';
  if not found then raise exception 'Only admins can submit loans.'; end if;
  if amt <= 0 or term_value < 1 or term_value > 60 or product_value = '' or purpose_value = '' then
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
begin
  select * into s from sessions where token = payload->>'token' and role = 'admin';
  if not found then raise exception 'Only admins can decide loans.'; end if;
  if decision not in ('approve', 'reject') then raise exception 'Invalid loan decision.'; end if;

  select * into l from loans
  where id = (payload->>'loanId')::uuid and sacco_id = s.sacco_id
  for update;
  if not found then raise exception 'Loan not found.'; end if;
  if l.status <> 'Pending' then raise exception 'Only pending loan applications can be decided.'; end if;

  update loans
  set
    status = case when decision = 'approve' then 'Performing' else 'Rejected' end,
    approved_amount = case when decision = 'approve' then requested_amount else 0 end,
    repaid_amount = 0,
    progress_percent = 0,
    installment_amount = case when decision = 'approve' then ceil(requested_amount / greatest(term_months, 1)) else 0 end,
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
  principal numeric;
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
    principal := coalesce(nullif(l.approved_amount, 0), l.requested_amount);
    outstanding := greatest(0, principal - l.repaid_amount);
    if amt > outstanding then raise exception 'Payment exceeds the outstanding loan balance of %.', outstanding; end if;
    new_repaid := l.repaid_amount + amt;
    update loans set
      repaid_amount = new_repaid,
      progress_percent = least(100, round((new_repaid / greatest(principal, 1)) * 100)::integer),
      status = case when new_repaid >= principal then 'Closed' else status end,
      next_due = case when new_repaid >= principal then null else (coalesce(next_due, current_date) + interval '1 month')::date end
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

revoke execute on function zsacco_private.app_data(text) from public, anon, authenticated;
revoke execute on function public.api_submit_loan(jsonb), public.api_decide_loan(jsonb), public.api_post_transaction(jsonb) from public, authenticated;
grant execute on function public.api_submit_loan(jsonb), public.api_decide_loan(jsonb), public.api_post_transaction(jsonb) to anon;

notify pgrst, 'reload schema';
