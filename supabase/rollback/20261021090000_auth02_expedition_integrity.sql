-- Explicit operator recovery only. Do not put this file in migrations/.
-- Roll back application code first if needed; never drop player tables/rows.
begin;
drop trigger if exists atlas_expeditions_integrity on public.atlas_expeditions;
alter table public.atlas_expeditions drop constraint if exists atlas_expeditions_document_valid;
drop function if exists public.atlas_guard_expedition_update();
drop function if exists public.atlas_valid_expedition(text);
commit;
