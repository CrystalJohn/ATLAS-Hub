-- Run against the existing ATLAS Supabase project. Does not import or alter Sites D1 data.
begin;

create table if not exists public.atlas_expeditions (
  player_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 0 check (revision >= 0),
  document text not null check (jsonb_typeof(document::jsonb) = 'object'),
  created_at timestamptz not null default now()
);

-- Only the authenticated application server may write rewards or read progress.
-- Browser clients cannot bypass mission evaluation by using the publishable key.
alter table public.atlas_expeditions enable row level security;
revoke all on public.atlas_expeditions from public, anon, authenticated;
grant select, insert, update on public.atlas_expeditions to service_role;

commit;
