create extension if not exists pgcrypto;
create schema if not exists zsacco_private;

create table zsacco_private.saccos (id uuid primary key default gen_random_uuid(), registration_number text unique not null, name text not null, phone text, email text, location text, member_count text, status text default 'active', created_at timestamptz default now());
create table zsacco_private.admins (id uuid primary key default gen_random_uuid(), sacco_id uuid references zsacco_private.saccos on delete cascade, name text not null, email text unique not null, phone text, password_hash text not null, linked_member_id uuid, created_at timestamptz default now());
create table zsacco_private.members (id uuid primary key default gen_random_uuid(), sacco_id uuid references zsacco_private.saccos on delete cascade, member_number text unique not null, name text not null, phone text, email text, branch text, national_id text, member_type text, address text, password_hash text not null, profile_photo text, documents jsonb default '[]', status text default 'Active', created_at timestamptz default now());
alter table zsacco_private.admins add constraint admins_linked_member_fk foreign key (linked_member_id) references zsacco_private.members(id) on delete set null;
create table zsacco_private.sessions (id uuid primary key default gen_random_uuid(), token text unique not null, role text not null check (role in ('admin','member')), user_id uuid not null, sacco_id uuid references zsacco_private.saccos on delete cascade, created_at timestamptz default now());
create table zsacco_private.accounts (id uuid primary key default gen_random_uuid(), sacco_id uuid references zsacco_private.saccos on delete cascade, member_id uuid references zsacco_private.members on delete cascade, account_number text unique not null, account_type text default 'Savings', balance numeric(18,2) default 0 check (balance >= 0), status text default 'Active', created_at timestamptz default now());
create table zsacco_private.transactions (id uuid primary key default gen_random_uuid(), reference text unique not null, sacco_id uuid references zsacco_private.saccos on delete cascade, account_id uuid references zsacco_private.accounts on delete cascade, member_id uuid references zsacco_private.members on delete cascade, transaction_type text not null, amount numeric(18,2) not null check (amount > 0), method text, narration text, status text default 'Completed', created_at timestamptz default now());
create table zsacco_private.loans (id uuid primary key default gen_random_uuid(), loan_number text unique not null, sacco_id uuid references zsacco_private.saccos on delete cascade, member_id uuid references zsacco_private.members on delete cascade, product text, requested_amount numeric(18,2) not null check (requested_amount > 0), approved_amount numeric(18,2) default 0, term_months integer default 12, purpose text, progress_percent integer default 0, status text default 'Pending', created_at timestamptz default now(), decided_at timestamptz);
create table zsacco_private.outbox (id uuid primary key default gen_random_uuid(), recipient text, subject text, body text, status text default 'queued', created_at timestamptz default now());
create table zsacco_private.password_resets (id uuid primary key default gen_random_uuid(), role text, identity text, reset_code text, created_at timestamptz default now());
create index on zsacco_private.sessions(token);
create index on zsacco_private.members(sacco_id);
create index on zsacco_private.accounts(sacco_id, member_id);
create index on zsacco_private.accounts(member_id);
create index on zsacco_private.admins(sacco_id);
create index on zsacco_private.admins(linked_member_id);
create index on zsacco_private.sessions(sacco_id);
create index on zsacco_private.transactions(sacco_id, created_at desc);
create index on zsacco_private.transactions(account_id);
create index on zsacco_private.transactions(member_id);
create index on zsacco_private.loans(sacco_id, created_at desc);
create index on zsacco_private.loans(member_id);

revoke all on schema zsacco_private from public, anon, authenticated;
revoke all on all tables in schema zsacco_private from public, anon, authenticated;

create or replace function zsacco_private.app_data(p_token text) returns jsonb language plpgsql security definer set search_path = pg_catalog, zsacco_private as $$
declare s sessions%rowtype; result jsonb;
begin
  select * into s from sessions where token=p_token;
  if not found then raise exception 'Invalid or expired session.' using errcode='P0001'; end if;
  select jsonb_build_object(
    'sacco', (select jsonb_build_object('id',x.id,'name',x.name,'registrationNumber',x.registration_number,'location',x.location) from saccos x where x.id=s.sacco_id),
    'summary', jsonb_build_object(
      'totalMembers',(select count(*) from members m where m.sacco_id=s.sacco_id and (s.role='admin' or m.id=s.user_id)),
      'totalAccounts',(select count(*) from accounts a where a.sacco_id=s.sacco_id and (s.role='admin' or a.member_id=s.user_id)),
      'totalSavings',(select coalesce(sum(a.balance),0) from accounts a where a.sacco_id=s.sacco_id and (s.role='admin' or a.member_id=s.user_id)),
      'activeLoans',(select count(*) from loans l where l.sacco_id=s.sacco_id and l.status not in ('Rejected','Closed') and (s.role='admin' or l.member_id=s.user_id)),
      'totalTransactions',(select count(*) from transactions t where t.sacco_id=s.sacco_id and (s.role='admin' or t.member_id=s.user_id))),
    'members',coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'memberNumber',m.member_number,'name',m.name,'phone',m.phone,'email',m.email,'branch',m.branch,'profilePhoto',m.profile_photo,'documents',m.documents,'savingsBalance',(select coalesce(sum(a.balance),0) from accounts a where a.member_id=m.id),'loansCount',(select count(*) from loans l where l.member_id=m.id),'status',m.status,'createdAt',m.created_at) order by m.created_at desc) from members m where m.sacco_id=s.sacco_id and (s.role='admin' or m.id=s.user_id)),'[]'::jsonb),
    'accounts',coalesce((select jsonb_agg(jsonb_build_object('id',a.id,'memberId',a.member_id,'memberName',m.name,'accountNumber',a.account_number,'accountType',a.account_type,'balance',a.balance,'status',a.status,'createdAt',a.created_at)) from accounts a join members m on m.id=a.member_id where a.sacco_id=s.sacco_id and (s.role='admin' or a.member_id=s.user_id)),'[]'::jsonb),
    'transactions',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'reference',t.reference,'accountId',t.account_id,'memberId',t.member_id,'memberName',m.name,'transactionType',t.transaction_type,'amount',t.amount,'method',t.method,'narration',t.narration,'status',t.status,'date',t.created_at) order by t.created_at desc) from transactions t join members m on m.id=t.member_id where t.sacco_id=s.sacco_id and (s.role='admin' or t.member_id=s.user_id)),'[]'::jsonb),
    'loans',coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'loanNumber',l.loan_number,'memberId',l.member_id,'memberName',m.name,'product',l.product,'requestedAmount',l.requested_amount,'approvedAmount',l.approved_amount,'termMonths',l.term_months,'purpose',l.purpose,'progressPercent',l.progress_percent,'status',l.status,'createdAt',l.created_at) order by l.created_at desc) from loans l join members m on m.id=l.member_id where l.sacco_id=s.sacco_id and (s.role='admin' or l.member_id=s.user_id)),'[]'::jsonb),
    'staff',case when s.role='admin' then coalesce((select jsonb_agg(jsonb_build_object('id',a.id,'name',a.name,'email',a.email,'phone',a.phone,'role','Admin','branch','Head Office','access','Full access','status','Active')) from admins a where a.sacco_id=s.sacco_id),'[]'::jsonb) else '[]'::jsonb end
  ) into result;
  return result;
end $$;

create or replace function public.api_register_sacco(payload jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,zsacco_private as $$
declare sid uuid:=gen_random_uuid(); aid uuid:=gen_random_uuid(); mid uuid:=gen_random_uuid(); reg text:='ZS-SACCO-'||extract(year from now())::int||'-'||floor(100000+random()*899999)::int; mn text; emailrow outbox%rowtype;
begin
 if coalesce(payload->>'saccoName','')='' or coalesce(payload->>'ownerEmail','')='' or coalesce(payload->>'passwordHash','')='' then raise exception 'Required registration fields are missing.'; end if;
 if exists(select 1 from admins where lower(email)=lower(payload->>'ownerEmail')) then raise exception 'Owner email is already registered.'; end if;
 mn:='ZS-'||(1001+(select count(*) from members));
 insert into saccos(id,registration_number,name,phone,email,location,member_count) values(sid,reg,payload->>'saccoName',payload->>'saccoPhone',payload->>'saccoEmail',payload->>'location',payload->>'memberCount');
 insert into members(id,sacco_id,member_number,name,phone,email,branch,password_hash) values(mid,sid,mn,payload->>'ownerName',payload->>'ownerPhone',payload->>'ownerEmail',coalesce(payload->>'location','Main Branch'),payload->>'passwordHash');
 insert into admins(id,sacco_id,name,email,phone,password_hash,linked_member_id) values(aid,sid,payload->>'ownerName',payload->>'ownerEmail',payload->>'ownerPhone',payload->>'passwordHash',mid);
 insert into accounts(sacco_id,member_id,account_number) values(sid,mid,'SAV-'||mn);
 insert into outbox(recipient,subject,body) values(payload->>'ownerEmail','Z-SACCO registration '||reg,'Z-SACCO account created for '||(payload->>'saccoName')||E'\nRegistration: '||reg) returning * into emailrow;
 return jsonb_build_object('message','SACCO account created. Email has been queued.','sacco',jsonb_build_object('id',sid,'name',payload->>'saccoName','registrationNumber',reg),'admin',jsonb_build_object('id',aid,'role','admin','name',payload->>'ownerName','email',payload->>'ownerEmail','phone',payload->>'ownerPhone','saccoId',sid),'member',jsonb_build_object('id',mid,'role','member','name',payload->>'ownerName','email',payload->>'ownerEmail','phone',payload->>'ownerPhone','memberNumber',mn,'saccoId',sid),'email',to_jsonb(emailrow));
end $$;

create or replace function public.api_login(payload jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,zsacco_private as $$
declare uid uuid; sid uuid; uname text; uemail text; uphone text; umember text; roleval text:=lower(payload->>'role'); tok text:=replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-','');
begin
 if roleval='admin' then select id,sacco_id,name,email,phone into uid,sid,uname,uemail,uphone from admins where lower(email)=lower(payload->>'email') and password_hash=payload->>'passwordHash';
 elsif roleval='member' then select m.id,m.sacco_id,m.name,m.email,m.phone,m.member_number into uid,sid,uname,uemail,uphone,umember from members m join saccos s on s.id=m.sacco_id where m.password_hash=payload->>'passwordHash' and lower(payload->>'identity') in (lower(m.name),lower(m.member_number),lower(s.registration_number)) limit 1;
 else raise exception 'Role must be admin or member.'; end if;
 if uid is null then raise exception 'Invalid login details.'; end if;
 insert into sessions(token,role,user_id,sacco_id) values(tok,roleval,uid,sid);
 return jsonb_build_object('message','Logged in.','token',tok,'user',jsonb_build_object('id',uid,'role',roleval,'name',uname,'email',uemail,'phone',uphone,'memberNumber',umember,'saccoId',sid));
end $$;

create or replace function public.api_logout(payload jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,zsacco_private as $$ begin delete from sessions where token=payload->>'token'; return jsonb_build_object('message','Logged out.'); end $$;
create or replace function public.api_get_app_data(payload jsonb) returns jsonb language sql security definer set search_path=pg_catalog,zsacco_private as $$ select zsacco_private.app_data(payload->>'token') $$;

create or replace function public.api_save_member(payload jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,zsacco_private as $$
declare s sessions%rowtype; mid uuid:=gen_random_uuid(); mn text; docs jsonb:=coalesce(payload->'kycDocuments','[]'::jsonb);
begin
 select * into s from sessions where token=payload->>'token' and role='admin'; if not found then raise exception 'Only admins can manage members.'; end if;
 if exists(select 1 from members where sacco_id=s.sacco_id and lower(email)=lower(payload->>'email')) then raise exception 'Member email is already registered.'; end if;
 mn:='ZS-'||(1001+(select count(*) from members));
 insert into members(id,sacco_id,member_number,name,phone,email,branch,national_id,member_type,address,password_hash,documents,profile_photo) values(mid,s.sacco_id,mn,payload->>'name',payload->>'phone',payload->>'email',payload->>'branch',payload->>'nationalId',payload->>'memberType',payload->>'address',payload->>'passwordHash',docs,(select d->>'dataUrl' from jsonb_array_elements(docs) d where (d->>'isProfilePhoto')::boolean limit 1));
 insert into accounts(sacco_id,member_id,account_number) values(s.sacco_id,mid,'SAV-'||mn);
 insert into outbox(recipient,subject,body) values(payload->>'email','Your Z-SACCO member login details','Member Number: '||mn||E'\nTemporary Password: '||coalesce(payload->>'temporaryPassword',''));
 return zsacco_private.app_data(payload->>'token');
end $$;

create or replace function public.api_post_transaction(payload jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,zsacco_private as $$
declare s sessions%rowtype; a accounts%rowtype; amt numeric:=coalesce((payload->>'amount')::numeric,0); typ text:=lower(payload->>'transactionType');
begin
 select * into s from sessions where token=payload->>'token' and role='admin'; if not found then raise exception 'Only admins can post transactions.'; end if;
 select * into a from accounts where id=(payload->>'accountId')::uuid and sacco_id=s.sacco_id for update; if not found then raise exception 'Account not found.'; end if;
 if amt<=0 or typ not in ('deposit','withdrawal') then raise exception 'Invalid transaction.'; end if; if typ='withdrawal' and amt>a.balance then raise exception 'Insufficient account balance.'; end if;
 update accounts set balance=balance+(case when typ='deposit' then amt else -amt end) where id=a.id;
 insert into transactions(reference,sacco_id,account_id,member_id,transaction_type,amount,method,narration) values('TX-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),s.sacco_id,a.id,a.member_id,initcap(typ),amt,payload->>'method',payload->>'narration');
 return zsacco_private.app_data(payload->>'token');
end $$;

create or replace function public.api_submit_loan(payload jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,zsacco_private as $$
declare s sessions%rowtype; mid uuid:=(payload->>'memberId')::uuid; amt numeric:=coalesce((payload->>'amount')::numeric,0);
begin select * into s from sessions where token=payload->>'token' and role='admin'; if not found then raise exception 'Only admins can submit loans.'; end if; if amt<=0 or not exists(select 1 from members where id=mid and sacco_id=s.sacco_id) then raise exception 'Invalid loan application.'; end if;
 insert into loans(loan_number,sacco_id,member_id,product,requested_amount,term_months,purpose) values('LN-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),s.sacco_id,mid,payload->>'product',amt,coalesce((payload->>'term')::integer,12),payload->>'purpose'); return zsacco_private.app_data(payload->>'token'); end $$;

create or replace function public.api_decide_loan(payload jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,zsacco_private as $$
declare s sessions%rowtype; decision text:=lower(payload->>'decision');
begin select * into s from sessions where token=payload->>'token' and role='admin'; if not found then raise exception 'Only admins can decide loans.'; end if; if decision not in ('approve','reject') then raise exception 'Invalid loan decision.'; end if;
 update loans set status=case when decision='approve' then 'Performing' else 'Rejected' end,approved_amount=case when decision='approve' then requested_amount else 0 end,progress_percent=case when decision='approve' then 5 else 0 end,decided_at=now() where id=(payload->>'loanId')::uuid and sacco_id=s.sacco_id; if not found then raise exception 'Loan not found.'; end if; return zsacco_private.app_data(payload->>'token'); end $$;

create or replace function public.api_forgot_password(payload jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,zsacco_private as $$
declare code text:='RESET-'||floor(100000+random()*899999)::int; recipient text:=payload->>'identity'; e outbox%rowtype;
begin insert into password_resets(role,identity,reset_code) values(payload->>'role',payload->>'identity',code); insert into outbox(recipient,subject,body) values(recipient,'Z-SACCO password reset','Use this reset code: '||code) returning * into e; return jsonb_build_object('message','Password reset instructions queued.','resetCode',code,'email',to_jsonb(e)); end $$;

revoke all on all functions in schema public from public, anon, authenticated;
grant execute on function public.api_register_sacco(jsonb),public.api_login(jsonb),public.api_logout(jsonb),public.api_get_app_data(jsonb),public.api_save_member(jsonb),public.api_post_transaction(jsonb),public.api_submit_loan(jsonb),public.api_decide_loan(jsonb),public.api_forgot_password(jsonb) to anon;
notify pgrst, 'reload schema';
