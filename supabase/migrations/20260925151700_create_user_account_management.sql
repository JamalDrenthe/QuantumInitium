create table if not exists public.user_accounts (
  id text primary key,
  name text not null,
  email text not null unique,
  role text not null check (role in ('investor', 'shareholder')),
  shares_owned numeric not null default 0,
  purchase_price numeric not null default 0,
  current_price numeric not null default 8.20,
  certificate_id text not null unique,
  join_date text not null,
  wallet_address text,
  title text,
  cash_balance numeric default 0,
  phone text,
  address text,
  postal_code text,
  city text,
  country text,
  iban text,
  tax_id text,
  pin_code text,
  authorized_persons jsonb not null default '[]'::jsonb,
  notifications jsonb not null default '{"emailTransactions":true,"emailDividends":true,"emailReports":true,"priceAlerts":true,"twoFactorEnabled":true,"smsAlerts":false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_accounts_role_idx on public.user_accounts(role);

insert into public.user_accounts (
  id, name, email, role, shares_owned, purchase_price, current_price,
  certificate_id, join_date, wallet_address, title, cash_balance, phone,
  address, postal_code, city, country, iban, tax_id, pin_code, authorized_persons
)
values
  ('inv_alexander', 'Alexander van Heemstra', 'investor@quantuminitium.com', 'investor', 12500, 6.40, 8.20, 'QI INV 8842 NL', '14 januari 2025', '0x71C84B29E30A149F', 'Particuliere Serie A Investeerder', 18450, '+31 6 12345678', 'Keizersgracht 421', '1016 EK', 'Amsterdam', 'Nederland', 'NL91 ABNA 0412 8891 00', 'NL884291882B01', '4821', '[{"id":"AP 1","name":"Eleonora van Heemstra","relation":"Echtgenote / Mede rekeninghouder","email":"e.vanheemstra@quantuminitium.com","phone":"+31 6 87654321"}]'::jsonb),
  ('inv_vanderbilt', 'Vanderbilt Capital Partners', 'partners@vanderbiltcap.com', 'shareholder', 120000, 8.20, 8.20, 'QI INV 1009 UK', '02 december 2024', null, 'Institutionele aandeelhouder', 0, null, null, null, null, 'Verenigd Koninkrijk', null, null, null, '[]'::jsonb),
  ('inv_hendrikus', 'Dr. Hendrikus van der Meer', 'h.vandermeer@neurotech.nl', 'investor', 8000, 8.20, 8.20, 'QI INV 4421 NL', '28 januari 2025', null, 'Serie A Investeerder', 0, null, null, null, null, 'Nederland', null, null, null, '[]'::jsonb),
  ('inv_geneva', 'Geneva Wealth Trust SA', 'familyoffice@genevatrust.ch', 'shareholder', 250000, 8.20, 8.20, 'QI INV 7731 CH', '19 november 2024', null, 'Family Office aandeelhouder', 0, null, null, null, null, 'Zwitserland', null, null, null, '[]'::jsonb),
  ('inv_sophie', 'Sophie de Boer MSc', 's.deboer@amsterdamfin.nl', 'investor', 5000, 8.20, 8.20, 'QI INV 9904 NL', '11 februari 2025', null, 'Particuliere Investeerder', 0, null, null, null, null, 'Nederland', null, null, null, '[]'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  role = excluded.role,
  shares_owned = excluded.shares_owned,
  purchase_price = excluded.purchase_price,
  current_price = excluded.current_price,
  certificate_id = excluded.certificate_id,
  join_date = excluded.join_date,
  wallet_address = excluded.wallet_address,
  title = excluded.title,
  cash_balance = excluded.cash_balance,
  phone = excluded.phone,
  address = excluded.address,
  postal_code = excluded.postal_code,
  city = excluded.city,
  country = excluded.country,
  iban = excluded.iban,
  tax_id = excluded.tax_id,
  pin_code = excluded.pin_code,
  authorized_persons = excluded.authorized_persons,
  updated_at = now();
