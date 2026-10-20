-- Add topic preferences only. No changes to expedition documents, XP or unlocks.
begin;
alter table public.atlas_profiles
  add column if not exists interests text[] not null default '{}';
alter table public.atlas_profiles drop constraint if exists atlas_profiles_interests_valid;
alter table public.atlas_profiles add constraint atlas_profiles_interests_valid
  check (cardinality(interests) <= 4 and interests <@ array['nature','travel','food','culture']::text[]);
commit;
