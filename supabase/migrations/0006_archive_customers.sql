-- Adds a soft-delete ("archive") option for customers, as an alternative
-- to permanently deleting them and all their related data.
--
-- Run this once against the project's Postgres database (Supabase SQL
-- Editor, or `supabase db push`).

alter table customers
  add column if not exists archived boolean not null default false;

create index if not exists customers_archived_idx on customers(garage_id, archived);
