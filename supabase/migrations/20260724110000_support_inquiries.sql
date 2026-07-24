create table if not exists zsacco_private.support_inquiries (
  id uuid primary key default gen_random_uuid(),
  sacco_name text not null,
  email text not null,
  phone text not null,
  message text not null,
  channel text not null default 'website',
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now()
);

revoke all on table zsacco_private.support_inquiries from public, anon, authenticated;

create or replace function public.api_submit_inquiry(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, zsacco_private
as $$
declare
  v_id uuid;
  v_sacco_name text := btrim(coalesce(payload->>'saccoName', ''));
  v_email text := lower(btrim(coalesce(payload->>'email', '')));
  v_phone text := btrim(coalesce(payload->>'phone', ''));
  v_message text := btrim(coalesce(payload->>'message', ''));
begin
  if char_length(v_sacco_name) not between 2 and 120 then
    raise exception 'Enter a valid SACCO name.';
  end if;
  if char_length(v_email) > 254 or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid email address.';
  end if;
  if char_length(v_phone) not between 7 and 30 then
    raise exception 'Enter a valid phone number.';
  end if;
  if char_length(v_message) not between 10 and 2000 then
    raise exception 'Your message must be between 10 and 2,000 characters.';
  end if;

  insert into zsacco_private.support_inquiries (sacco_name, email, phone, message)
  values (v_sacco_name, v_email, v_phone, v_message)
  returning id into v_id;

  return jsonb_build_object(
    'message', 'Your inquiry has been received. Our support team will contact you soon.',
    'inquiryId', v_id
  );
end
$$;

revoke all on function public.api_submit_inquiry(jsonb) from public;
grant execute on function public.api_submit_inquiry(jsonb) to anon, authenticated;
