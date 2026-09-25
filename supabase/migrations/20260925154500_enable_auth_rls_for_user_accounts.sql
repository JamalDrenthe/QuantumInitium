alter table public.user_accounts
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

alter table public.user_accounts
  drop constraint if exists user_accounts_role_check;

alter table public.user_accounts
  add constraint user_accounts_role_check
  check (role in ('investor', 'shareholder', 'admin'));

create unique index if not exists user_accounts_auth_user_id_idx
  on public.user_accounts(auth_user_id)
  where auth_user_id is not null;

insert into public.user_accounts (
  id, name, email, role, shares_owned, purchase_price, current_price,
  certificate_id, join_date, title
)
values (
  'admin_directie',
  'Directie QuantumInitium',
  'admin@quantuminitium.com',
  'admin',
  0,
  0,
  8.20,
  'QI ADM 0001 LSE',
  '25 september 2026',
  'Directie en beheer'
)
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  role = excluded.role,
  certificate_id = excluded.certificate_id,
  title = excluded.title,
  updated_at = now();

create schema if not exists private;

create or replace function private.is_account_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_accounts
    where role = 'admin'
      and (
        auth_user_id = auth.uid()
        or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

revoke all on function private.is_account_admin() from public;
grant execute on function private.is_account_admin() to authenticated;

alter table public.user_accounts enable row level security;

drop policy if exists "authenticated account access" on public.user_accounts;
drop policy if exists "admin account updates" on public.user_accounts;
drop policy if exists "authenticated account inserts" on public.user_accounts;

create policy "authenticated account access"
  on public.user_accounts
  for select
  to authenticated
  using (
    private.is_account_admin()
    or auth_user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "admin account updates"
  on public.user_accounts
  for update
  to authenticated
  using (private.is_account_admin())
  with check (private.is_account_admin());

create policy "authenticated account inserts"
  on public.user_accounts
  for insert
  to authenticated
  with check (
    role in ('investor', 'shareholder')
    and (
      auth_user_id = auth.uid()
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );
