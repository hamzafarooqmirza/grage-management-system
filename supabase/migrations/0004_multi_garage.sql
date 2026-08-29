-- Multi-garage / organization switching.
--
-- garage_settings is repurposed from "the one row describing this garage"
-- into the tenant table itself — every row is now a distinct garage. A new
-- garage_members junction table maps auth users to the garages they belong
-- to, and every tenant-scoped table gets a garage_id column plus RLS
-- policies that check membership via is_garage_member().
--
-- Existing data is backfilled onto the single garage_settings row created
-- by 0003 (or the oldest row if more than one already exists), and every
-- existing auth user is added as an "owner" of that garage — so nothing
-- currently in production loses access.
--
-- Run this once against the project's Postgres database (Supabase SQL
-- Editor, or `supabase db push`).

-- 1. garage_members ---------------------------------------------------------

create table if not exists garage_members (
  id uuid primary key default gen_random_uuid(),
  garage_id uuid not null references garage_settings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  unique (garage_id, user_id)
);

alter table garage_members enable row level security;

drop policy if exists "garage_members_select" on garage_members;
create policy "garage_members_select" on garage_members
  for select to authenticated using (user_id = auth.uid());

-- No insert/update/delete policy for garage_members: membership is granted
-- only through create_garage_with_owner() (security definer, below), so an
-- authenticated user can never write themselves into a garage — including
-- one they aren't yet a member of — via a direct table call.
drop policy if exists "garage_members_insert" on garage_members;

-- 2. membership helper --------------------------------------------------

create or replace function public.is_garage_member(target_garage_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from garage_members
    where garage_id = target_garage_id and user_id = auth.uid()
  );
$$;

grant execute on function public.is_garage_member(uuid) to authenticated;

-- Creates a new garage and its founding owner membership atomically. This
-- has to be security definer: a plain client-side insert into garage_settings
-- followed by a separate insert into garage_members can't work, because the
-- garage_settings_select policy (below) only exposes rows the caller is
-- already a member of, and RETURNING is filtered by the SELECT policy — so
-- the first insert alone could never report the new row's id back, and there
-- is no direct-insert policy on garage_members for the second step at all.
create or replace function public.create_garage_with_owner(p_garage_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_garage_id uuid;
begin
  insert into garage_settings (garage_name)
  values (p_garage_name)
  returning id into new_garage_id;

  insert into garage_members (garage_id, user_id, role)
  values (new_garage_id, auth.uid(), 'owner');

  return new_garage_id;
end;
$$;

grant execute on function public.create_garage_with_owner(text) to authenticated;

-- 3. garage_id columns ----------------------------------------------------

alter table customers add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table vehicles add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table bookings add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table job_cards add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table job_labour_lines add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table job_part_lines add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table invoices add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table invoice_line_items add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table parts add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table employees add column if not exists garage_id uuid references garage_settings(id) on delete cascade;
alter table reminders add column if not exists garage_id uuid references garage_settings(id) on delete cascade;

-- 4. backfill ---------------------------------------------------------------

do $$
declare
  default_garage_id uuid;
begin
  select id into default_garage_id from garage_settings order by updated_at asc limit 1;

  if default_garage_id is not null then
    update customers set garage_id = default_garage_id where garage_id is null;
    update vehicles set garage_id = default_garage_id where garage_id is null;
    update bookings set garage_id = default_garage_id where garage_id is null;
    update job_cards set garage_id = default_garage_id where garage_id is null;
    update parts set garage_id = default_garage_id where garage_id is null;
    update employees set garage_id = default_garage_id where garage_id is null;
    update reminders set garage_id = default_garage_id where garage_id is null;
    update invoices set garage_id = default_garage_id where garage_id is null;

    update job_labour_lines l set garage_id = j.garage_id
      from job_cards j where l.job_id = j.id and l.garage_id is null;
    update job_part_lines l set garage_id = j.garage_id
      from job_cards j where l.job_id = j.id and l.garage_id is null;
    update invoice_line_items l set garage_id = i.garage_id
      from invoices i where l.invoice_id = i.id and l.garage_id is null;

    insert into garage_members (garage_id, user_id, role)
    select default_garage_id, u.id, 'owner' from auth.users u
    on conflict (garage_id, user_id) do nothing;
  end if;
end $$;

-- 5. enforce not-null now that every row is backfilled ----------------------

alter table customers alter column garage_id set not null;
alter table vehicles alter column garage_id set not null;
alter table bookings alter column garage_id set not null;
alter table job_cards alter column garage_id set not null;
alter table job_labour_lines alter column garage_id set not null;
alter table job_part_lines alter column garage_id set not null;
alter table invoices alter column garage_id set not null;
alter table invoice_line_items alter column garage_id set not null;
alter table parts alter column garage_id set not null;
alter table employees alter column garage_id set not null;
alter table reminders alter column garage_id set not null;

create index if not exists customers_garage_id_idx on customers(garage_id);
create index if not exists vehicles_garage_id_idx on vehicles(garage_id);
create index if not exists bookings_garage_id_idx on bookings(garage_id);
create index if not exists job_cards_garage_id_idx on job_cards(garage_id);
create index if not exists job_labour_lines_garage_id_idx on job_labour_lines(garage_id);
create index if not exists job_part_lines_garage_id_idx on job_part_lines(garage_id);
create index if not exists invoices_garage_id_idx on invoices(garage_id);
create index if not exists invoice_line_items_garage_id_idx on invoice_line_items(garage_id);
create index if not exists parts_garage_id_idx on parts(garage_id);
create index if not exists employees_garage_id_idx on employees(garage_id);
create index if not exists reminders_garage_id_idx on reminders(garage_id);
create index if not exists garage_members_user_id_idx on garage_members(user_id);

-- 6. invoice numbering becomes per-garage ------------------------------------

-- Any previous unique constraint on invoices.number was global; replace it
-- with one scoped per garage so two garages can both issue "INV-0001".
do $$
declare
  c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'invoices'::regclass and contype = 'u'
  loop
    execute format('alter table invoices drop constraint %I', c.conname);
  end loop;
end $$;

create unique index if not exists invoices_garage_number_key on invoices (garage_id, number);

alter table invoices alter column number drop default;

create or replace function public.set_invoice_number()
returns trigger
language plpgsql
as $$
declare
  prefix text;
  next_seq int;
begin
  if new.number is not null and new.number <> '' then
    return new;
  end if;

  -- Serialize number allocation per garage: without this, two invoices
  -- inserted concurrently for the same garage could both read the same
  -- count() and generate the same number, tripping invoices_garage_number_key.
  -- Transaction-scoped, so it releases automatically at commit/rollback.
  perform pg_advisory_xact_lock(hashtext(new.garage_id::text));

  select coalesce(invoice_prefix, 'INV') into prefix
  from garage_settings where id = new.garage_id;

  select count(*) + 1 into next_seq from invoices where garage_id = new.garage_id;

  new.number := coalesce(prefix, 'INV') || '-' || lpad(next_seq::text, 4, '0');
  return new;
end;
$$;

drop trigger if exists trg_set_invoice_number on invoices;
create trigger trg_set_invoice_number
  before insert on invoices
  for each row execute function public.set_invoice_number();

-- 7. RLS: drop every existing policy on tenant-scoped tables -----------------

do $$
declare
  tbl text;
  pol record;
begin
  foreach tbl in array array[
    'customers', 'vehicles', 'bookings', 'job_cards', 'job_labour_lines',
    'job_part_lines', 'invoices', 'invoice_line_items', 'parts', 'employees',
    'reminders', 'garage_settings'
  ]
  loop
    for pol in select policyname from pg_policies where schemaname = 'public' and tablename = tbl loop
      execute format('drop policy if exists %I on %I', pol.policyname, tbl);
    end loop;
  end loop;
end $$;

-- 8. RLS: garage-scoped policies ---------------------------------------------

create policy "customers_select" on customers for select to authenticated using (is_garage_member(garage_id));
create policy "customers_insert" on customers for insert to authenticated with check (is_garage_member(garage_id));
create policy "customers_update" on customers for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "customers_delete" on customers for delete to authenticated using (is_garage_member(garage_id));

create policy "vehicles_select" on vehicles for select to authenticated using (is_garage_member(garage_id));
create policy "vehicles_insert" on vehicles for insert to authenticated with check (is_garage_member(garage_id));
create policy "vehicles_update" on vehicles for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "vehicles_delete" on vehicles for delete to authenticated using (is_garage_member(garage_id));

create policy "bookings_select" on bookings for select to authenticated using (is_garage_member(garage_id));
create policy "bookings_insert" on bookings for insert to authenticated with check (is_garage_member(garage_id));
create policy "bookings_update" on bookings for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "bookings_delete" on bookings for delete to authenticated using (is_garage_member(garage_id));

create policy "job_cards_select" on job_cards for select to authenticated using (is_garage_member(garage_id));
create policy "job_cards_insert" on job_cards for insert to authenticated with check (is_garage_member(garage_id));
create policy "job_cards_update" on job_cards for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "job_cards_delete" on job_cards for delete to authenticated using (is_garage_member(garage_id));

create policy "job_labour_lines_select" on job_labour_lines for select to authenticated using (is_garage_member(garage_id));
create policy "job_labour_lines_insert" on job_labour_lines for insert to authenticated with check (is_garage_member(garage_id));
create policy "job_labour_lines_update" on job_labour_lines for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "job_labour_lines_delete" on job_labour_lines for delete to authenticated using (is_garage_member(garage_id));

create policy "job_part_lines_select" on job_part_lines for select to authenticated using (is_garage_member(garage_id));
create policy "job_part_lines_insert" on job_part_lines for insert to authenticated with check (is_garage_member(garage_id));
create policy "job_part_lines_update" on job_part_lines for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "job_part_lines_delete" on job_part_lines for delete to authenticated using (is_garage_member(garage_id));

create policy "invoices_select" on invoices for select to authenticated using (is_garage_member(garage_id));
create policy "invoices_insert" on invoices for insert to authenticated with check (is_garage_member(garage_id));
create policy "invoices_update" on invoices for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "invoices_delete" on invoices for delete to authenticated using (is_garage_member(garage_id));

create policy "invoice_line_items_select" on invoice_line_items for select to authenticated using (is_garage_member(garage_id));
create policy "invoice_line_items_insert" on invoice_line_items for insert to authenticated with check (is_garage_member(garage_id));
create policy "invoice_line_items_update" on invoice_line_items for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "invoice_line_items_delete" on invoice_line_items for delete to authenticated using (is_garage_member(garage_id));

create policy "parts_select" on parts for select to authenticated using (is_garage_member(garage_id));
create policy "parts_insert" on parts for insert to authenticated with check (is_garage_member(garage_id));
create policy "parts_update" on parts for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "parts_delete" on parts for delete to authenticated using (is_garage_member(garage_id));

create policy "employees_select" on employees for select to authenticated using (is_garage_member(garage_id));
create policy "employees_insert" on employees for insert to authenticated with check (is_garage_member(garage_id));
create policy "employees_update" on employees for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "employees_delete" on employees for delete to authenticated using (is_garage_member(garage_id));

create policy "reminders_select" on reminders for select to authenticated using (is_garage_member(garage_id));
create policy "reminders_insert" on reminders for insert to authenticated with check (is_garage_member(garage_id));
create policy "reminders_update" on reminders for update to authenticated using (is_garage_member(garage_id)) with check (is_garage_member(garage_id));
create policy "reminders_delete" on reminders for delete to authenticated using (is_garage_member(garage_id));

-- garage_settings: members can read/update their garage's profile. Insert
-- stays open to any authenticated user (with check (true)) as a deliberate
-- belt-and-suspenders measure: create_garage_with_owner() does the insert
-- itself as SECURITY DEFINER, but that only bypasses RLS if the function's
-- owner is also the table owner, which isn't guaranteed on every Postgres
-- setup — so this policy keeps garage creation working either way. It's
-- safe to leave open: a garage_settings row with no matching garage_members
-- row is invisible under garage_settings_select, so an orphan insert here
-- can't be read or used by anyone.
create policy "garage_settings_select" on garage_settings
  for select to authenticated using (is_garage_member(id));
create policy "garage_settings_insert" on garage_settings
  for insert to authenticated with check (true);
create policy "garage_settings_update" on garage_settings
  for update to authenticated using (is_garage_member(id)) with check (is_garage_member(id));
