-- Adds a nullable JSONB column for service-specific booking details (tyre
-- size/quantity, vehicle storage dates & rate, recovery details, etc).
-- Nullable and additive, so existing bookings without this data are
-- unaffected — they simply read back with service_details = null.
--
-- Run this once against the project's Postgres database (Supabase SQL
-- Editor, or `supabase db push`).

alter table bookings
  add column if not exists service_details jsonb;
