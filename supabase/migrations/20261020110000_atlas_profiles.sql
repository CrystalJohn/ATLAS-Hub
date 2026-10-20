-- Account presentation and learning preferences only. No expedition or XP changes.
begin;
create table if not exists public.atlas_profiles (
  player_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(btrim(display_name)) between 1 and 40),
  vietnamese_support boolean not null default true,
  reading_band text not null default 'A2' check (reading_band in ('A1','A2','B1','B2')),
  updated_at timestamptz not null default now()
);
alter table public.atlas_profiles enable row level security;
revoke all on public.atlas_profiles from public, anon, authenticated;
grant select, insert, update on public.atlas_profiles to service_role;
commit;
