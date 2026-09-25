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
      and auth_user_id = auth.uid()
  );
$$;

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
    and auth_user_id = auth.uid()
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "self profile updates"
  on public.user_accounts
  for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());
