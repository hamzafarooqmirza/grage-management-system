-- Adds:
--   1. an "estimate" value to invoice_status, so estimates reuse the invoices
--      table instead of a separate one (an estimate is just an invoice with
--      status = 'estimate' until it's converted).
--   2. "checked_in" and "vehicle_released" values to job_status, so the job
--      board can track a vehicle from arrival through to hand-back.
--   3. a "priority" column on job_cards (low / medium / high, defaults to
--      medium) so jobs can be triaged.
--
-- Run this once against the project's Postgres database (Supabase SQL
-- Editor, or `supabase db push` if you're using the CLI locally).

alter type invoice_status add value if not exists 'estimate';

alter type job_status add value if not exists 'checked_in';
alter type job_status add value if not exists 'vehicle_released';

alter table job_cards
  add column if not exists priority text not null default 'medium';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'job_cards_priority_check'
  ) then
    alter table job_cards
      add constraint job_cards_priority_check check (priority in ('low', 'medium', 'high'));
  end if;
end $$;
