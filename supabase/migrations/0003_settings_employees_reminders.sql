-- Adds three new, fully independent tables — none of them touch existing
-- tables or their RLS policies, so this is safe to run alongside live data:
--   1. garage_settings — a single row holding the garage's profile
--      (name, address, VAT number, default VAT rate, invoice prefix).
--   2. employees — staff/technician records.
--   3. reminders — free-standing follow-ups, optionally linked to a
--      customer and/or vehicle (MOT due, callback, etc).
--
-- Run this once against the project's Postgres database (Supabase SQL
-- Editor, or `supabase db push`).

create table if not exists garage_settings (
  id uuid primary key default gen_random_uuid(),
  garage_name text not null default 'My Garage Ltd',
  address_line text not null default '',
  city text not null default '',
  post_code text not null default '',
  vat_number text not null default '',
  default_vat_rate numeric not null default 20,
  invoice_prefix text not null default 'INV',
  updated_at timestamptz not null default now()
);

alter table garage_settings enable row level security;

drop policy if exists "garage_settings_select" on garage_settings;
create policy "garage_settings_select" on garage_settings
  for select to authenticated using (true);

drop policy if exists "garage_settings_insert" on garage_settings;
create policy "garage_settings_insert" on garage_settings
  for insert to authenticated with check (true);

drop policy if exists "garage_settings_update" on garage_settings;
create policy "garage_settings_update" on garage_settings
  for update to authenticated using (true);

insert into garage_settings (garage_name)
select 'My Garage Ltd'
where not exists (select 1 from garage_settings);

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null default 'technician',
  email text,
  phone text,
  hourly_rate numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table employees enable row level security;

drop policy if exists "employees_select" on employees;
create policy "employees_select" on employees
  for select to authenticated using (true);

drop policy if exists "employees_insert" on employees;
create policy "employees_insert" on employees
  for insert to authenticated with check (true);

drop policy if exists "employees_update" on employees;
create policy "employees_update" on employees
  for update to authenticated using (true);

drop policy if exists "employees_delete" on employees;
create policy "employees_delete" on employees
  for delete to authenticated using (true);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  title text not null,
  due_date date not null,
  done boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

alter table reminders enable row level security;

drop policy if exists "reminders_select" on reminders;
create policy "reminders_select" on reminders
  for select to authenticated using (true);

drop policy if exists "reminders_insert" on reminders;
create policy "reminders_insert" on reminders
  for insert to authenticated with check (true);

drop policy if exists "reminders_update" on reminders;
create policy "reminders_update" on reminders
  for update to authenticated using (true);

drop policy if exists "reminders_delete" on reminders;
create policy "reminders_delete" on reminders
  for delete to authenticated using (true);
