-- Fixes garage creation, which is broken as shipped in 0004:
--
--   1. garage_members_insert (with check (user_id = auth.uid())) lets any
--      authenticated user who learns another garage's UUID insert
--      themselves into it with any role, including owner — every tenant
--      RLS policy trusts is_garage_member(), so this grants full access to
--      that garage's data.
--   2. createGarage() did two separate client inserts (garage_settings,
--      then garage_members). RETURNING on the first insert is filtered by
--      the garage_settings_select policy, which requires a membership row
--      that doesn't exist yet at that point — so it could never report the
--      new garage's id back, and "Add a Garage" always failed with
--      "new row violates row-level security policy for table
--      garage_settings".
--   3. The invoice-numbering trigger could race: two invoices inserted
--      concurrently for the same garage could both read the same count()
--      and generate the same number.
--
-- This is a NEW migration rather than an edit to 0004 on purpose — 0004 may
-- already be recorded as applied (via `supabase db push` or otherwise) on
-- some databases, and a migration runner would skip a file it already has a
-- record for, silently leaving these fixes uninstalled. Safe to run
-- multiple times.
--
-- Run this once against the project's Postgres database (Supabase SQL
-- Editor, or `supabase db push`).

-- No insert/update/delete policy for garage_members: membership is granted
-- only through create_garage_with_owner() (security definer, below), so an
-- authenticated user can never write themselves into a garage — including
-- one they aren't yet a member of — via a direct table call.
drop policy if exists "garage_members_insert" on garage_members;

-- Creates a new garage and its founding owner membership atomically. This
-- has to be security definer: a plain client-side insert into garage_settings
-- followed by a separate insert into garage_members can't work, because the
-- garage_settings_select policy only exposes rows the caller is already a
-- member of, and RETURNING is filtered by the SELECT policy — so the first
-- insert alone could never report the new row's id back, and there is no
-- direct-insert policy on garage_members for the second step at all.
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

-- garage_settings_insert (with check (true), from 0004) stays as a
-- deliberate belt-and-suspenders measure: create_garage_with_owner() does
-- the insert itself as SECURITY DEFINER, but that only bypasses RLS if the
-- function's owner is also the table owner, which isn't guaranteed on every
-- Postgres/Supabase setup. It's safe to leave open either way — a
-- garage_settings row with no matching garage_members row is invisible
-- under garage_settings_select, so an orphan insert here can't be read or
-- used by anyone.

-- Serialize invoice number allocation per garage: without this, two
-- invoices inserted concurrently for the same garage could both read the
-- same count() and generate the same number, tripping
-- invoices_garage_number_key. Transaction-scoped, so it releases
-- automatically at commit/rollback.
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

  perform pg_advisory_xact_lock(hashtext(new.garage_id::text));

  select coalesce(invoice_prefix, 'INV') into prefix
  from garage_settings where id = new.garage_id;

  select count(*) + 1 into next_seq from invoices where garage_id = new.garage_id;

  new.number := coalesce(prefix, 'INV') || '-' || lpad(next_seq::text, 4, '0');
  return new;
end;
$$;
