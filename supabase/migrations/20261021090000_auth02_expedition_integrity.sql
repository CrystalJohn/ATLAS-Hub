-- AUTH-02: retain the existing UUID-owned atomic document and revision CAS.
-- No row reset, backfill, account merge, or reward redefinition.
begin;

create or replace function public.atlas_valid_expedition(raw_document text)
returns boolean language plpgsql immutable strict
set search_path = pg_catalog
as $$
declare d jsonb; xp numeric; item jsonb;
begin
 d := raw_document::jsonb;
 if jsonb_typeof(d) is distinct from 'object'
    or jsonb_typeof(d->'progress') is distinct from 'object'
    or jsonb_typeof(d#>'{progress,completed}') is distinct from 'array'
    or jsonb_typeof(d->'ledger') is distinct from 'array'
    or jsonb_typeof(d#>'{progress,xp}') is distinct from 'number' then return false; end if;
 xp := (d#>>'{progress,xp}')::numeric;
 if xp < 0 or xp > 9007199254740991 or trunc(xp) <> xp then return false; end if;
 for item in select value from jsonb_array_elements(d->'ledger') loop
  if jsonb_typeof(item) is distinct from 'object'
     or jsonb_typeof(item->'id') is distinct from 'string'
     or jsonb_typeof(item->'missionId') is distinct from 'string'
     or jsonb_typeof(item->'contentVersion') is distinct from 'number'
     or jsonb_typeof(item->'amount') is distinct from 'number'
     or (item->>'amount')::numeric <= 0
     or trunc((item->>'amount')::numeric) <> (item->>'amount')::numeric
     or (item->>'contentVersion')::numeric < 1
     or trunc((item->>'contentVersion')::numeric) <> (item->>'contentVersion')::numeric then return false; end if;
 end loop;
 -- Within each player document, one first-clear entry per content/version.
 return (select count(*) = count(distinct (value->>'missionId',(value->>'contentVersion')::numeric))
             and count(*) = count(distinct value->>'id') from jsonb_array_elements(d->'ledger'));
exception when others then return false;
end;
$$;
revoke all on function public.atlas_valid_expedition(text) from public, anon, authenticated;
grant execute on function public.atlas_valid_expedition(text) to service_role;

-- Validate existing data before committing the migration. Any incompatible row
-- aborts this transaction; investigate it rather than rewriting player history.
alter table public.atlas_expeditions add constraint atlas_expeditions_document_valid
 check (public.atlas_valid_expedition(document)) not valid;
alter table public.atlas_expeditions validate constraint atlas_expeditions_document_valid;

create or replace function public.atlas_guard_expedition_update()
returns trigger language plpgsql
set search_path = pg_catalog
as $$
declare previous_doc jsonb; next_doc jsonb; delta numeric;
begin
 if tg_op = 'INSERT' then
  if new.revision <> 0 then raise check_violation using message='New expedition revision must be zero'; end if;
  if not public.atlas_valid_expedition(new.document)
     or (new.document::jsonb#>>'{progress,xp}')::numeric <> 0
     or jsonb_array_length(new.document::jsonb->'ledger') <> 0
     or jsonb_array_length(new.document::jsonb#>'{progress,completed}') <> 0 then
   raise check_violation using message='New expeditions must start without first-clear rewards';
  end if;
  return new;
 end if;
 if new.player_id <> old.player_id or new.revision <> old.revision + 1
    or new.revision > 9007199254740991 then
  raise check_violation using message='Expedition owner/revision invariant';
 end if;
 previous_doc := old.document::jsonb; next_doc := new.document::jsonb;
 if not public.atlas_valid_expedition(new.document) then
  raise check_violation using message='Invalid expedition document';
 end if;
 if exists(select 1 from jsonb_array_elements(previous_doc->'ledger') historical
           where not exists(select 1 from jsonb_array_elements(next_doc->'ledger') current_entry
                            where current_entry = historical)) then
  raise check_violation using message='Historical reward ledger is immutable';
 end if;
 select coalesce(sum((entry->>'amount')::numeric),0) into delta
 from jsonb_array_elements(next_doc->'ledger') entry
 where not exists(select 1 from jsonb_array_elements(previous_doc->'ledger') historical
                  where historical->>'missionId'=entry->>'missionId'
                    and (historical->>'contentVersion')::numeric=(entry->>'contentVersion')::numeric);
 if (next_doc#>>'{progress,xp}')::numeric - (previous_doc#>>'{progress,xp}')::numeric <> delta then
  raise check_violation using message='XP and first-clear ledger must commit together';
 end if;
 if not ((next_doc#>'{progress,completed}') @> (previous_doc#>'{progress,completed}'))
    or not (coalesce(next_doc#>'{travel,stamps}','[]'::jsonb) @> coalesce(previous_doc#>'{travel,stamps}','[]'::jsonb)) then
  raise check_violation using message='Completed missions and passport stamps cannot be removed';
 end if;
 if exists(select 1 from jsonb_each(coalesce(previous_doc#>'{travel,encounters}','{}'::jsonb)) e
           where e.value->>'completedAt' is not null
             and (next_doc#>array['travel','encounters',e.key])->>'completedAt' is distinct from e.value->>'completedAt') then
  raise check_violation using message='Travel first-clear state cannot be reset';
 end if;
 return new;
end;
$$;
revoke all on function public.atlas_guard_expedition_update() from public, anon, authenticated;
grant execute on function public.atlas_guard_expedition_update() to service_role;
create trigger atlas_expeditions_integrity before insert or update on public.atlas_expeditions
 for each row execute function public.atlas_guard_expedition_update();

-- Existing deny-by-default RLS and service-role-only grants stay in force.
commit;
