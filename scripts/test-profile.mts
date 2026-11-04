import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createClient, type User } from '@supabase/supabase-js';
import { handleVercelAtlas } from '../lib/atlas/vercel-handler.ts';
import { playerInitials } from '../lib/atlas/profile.ts';
import type {ProfileTestBody} from './test-response-types.ts';

const profiles = new Map<string, Record<string, unknown>>();
let missing = false, missingInterests = false, writes = 0;
const client = createClient('https://fixture.supabase.co', 'fixture-service-key', {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: async (input, init) => {
    const request = new Request(input, init), url = new URL(request.url);
    assert.equal(url.pathname, '/rest/v1/atlas_profiles', 'Profile actions must never touch expeditions');
    if (missing) return Response.json({ code: 'PGRST205' }, { status: 404 });
    if (request.method === 'GET') {
      const id = url.searchParams.get('player_id')?.slice(3); assert.ok(id);
      return Response.json(profiles.has(id) ? [profiles.get(id)] : []);
    }
    assert.equal(request.method, 'POST');
    const initialize=request.headers.get('prefer')?.includes('resolution=ignore-duplicates');
    if(!initialize){assert.ok(request.headers.get('prefer')?.includes('resolution=merge-duplicates'));assert.ok(request.headers.get('prefer')?.includes('missing=default'));}
    const row = await request.json() as Record<string, unknown>;
    if(missingInterests&&'interests' in row)return Response.json({code:'PGRST204'},{status:400});
    const id = String(row.player_id);
    if(initialize&&profiles.has(id))return new Response(null,{status:201});
    profiles.set(id, { display_name: null, vietnamese_support: true, reading_band: 'A2', ...profiles.get(id), ...row }); writes++;
    if(initialize)return new Response(null,{status:201});
    return Response.json(profiles.get(id));
  } },
});
const alice = '11111111-1111-4111-8111-111111111111', bob = '22222222-2222-4222-8222-222222222222';
async function call(body?: unknown, id: string | null = alice, origin = 'https://atlas.test', avatar = 'https://example.test/avatar.png') {
  const response = await handleVercelAtlas(new Request('https://atlas.test/api/profile', {
    method: body === undefined ? 'GET' : 'POST', headers: { origin, 'oai-authenticated-user-id': bob },
    ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  }), { getAdmin: () => client, getUser: async () => id ? { id, aud: 'authenticated', app_metadata: {}, created_at: '2026-10-20T00:00:00Z', user_metadata: { avatar_url: avatar } } as User : null });
  assert.ok(response.headers.get('cache-control')?.includes('no-store'));
  return { status: response.status, body: await response.json() as ProfileTestBody };
}
assert.equal((await call(undefined, null)).status, 401);
assert.equal((await call({ displayName: 'Nope' }, alice, 'https://evil.test')).status, 403);
assert.equal(writes, 0);
const fresh = (await call()).body.profile;
assert.equal(fresh.playerId, alice); assert.equal(fresh.displayName, null); assert.equal(fresh.readingBand, 'A2');
assert.equal(profiles.size, 1, 'First verified profile load creates exactly one row');
assert.deepEqual(fresh.interests,[]);
assert.equal((await call({ displayName: '  Nguyễn An  ', readingBand: 'B1', vietnameseSupport: false })).body.profile.displayName, 'Nguyễn An');
assert.equal((await call()).body.profile.vietnameseSupport, false);
assert.equal((await call(undefined, bob)).body.profile.displayName, null);
for (const input of [{ displayName: '   ' }, { displayName: 'a'.repeat(41) }, { displayName: 'a\nB' }, { displayName: 'a\u200bB' }, { readingBand: 'C2' }, { vietnameseSupport: 'true' }, { xp: 999 }, { playerId: bob, displayName: 'Hijack' }, {}, '{broken']) assert.equal((await call(input)).status, 400);
assert.equal((await call('x'.repeat(2049))).status, 413);
const renamed = (await call({ displayName: 'An 🌿' })).body.profile;
assert.equal(renamed.readingBand, 'B1'); assert.equal(renamed.vietnameseSupport, false);
await call({ readingBand: 'B2' }); await call({ vietnameseSupport: true });
assert.equal((await call()).body.profile.displayName, 'An 🌿');
assert.equal((await call()).body.profile.readingBand, 'B2');
assert.deepEqual((await call()).body.profile.interests,[],'Old rows without interests still load');
assert.deepEqual((await call({interests:['food','culture']})).body.profile.interests,['food','culture']);
assert.deepEqual((await call(undefined,bob)).body.profile.interests,[],'Interests are account-private');
await call({displayName:'An 🌿',readingBand:'A2'});
assert.deepEqual((await call()).body.profile.interests,['food','culture'],'Name/preferences updates keep interests');
for(const interests of [['unknown'],['nature','nature'],['nature','travel','food','culture','nature'],'nature',[1]])assert.equal((await call({interests})).status,400);
assert.deepEqual((await call({interests:[]})).body.profile.interests,[],'Clearing interests is allowed');
missingInterests=true;
const beforeMissingColumn=writes;
assert.equal((await call({interests:['nature']})).body.code,'PROFILE_SCHEMA_UPDATE_REQUIRED');
assert.equal(writes,beforeMissingColumn,'A missing column never partially saves or reports success');
assert.equal((await call()).status,200,'Existing schema can still load the profile');
missingInterests=false;
assert.equal((await call(undefined, alice, 'https://atlas.test', 'javascript:alert(1)')).body.profile.avatarUrl, null);
assert.equal(playerInitials('Nguyễn An'), 'NA'); assert.equal(playerInitials(null), 'A');
const before = writes;
assert.equal((await call({ displayName: 'Expired' }, null)).status, 401); assert.equal(writes, before);
missing = true; assert.equal((await call()).body.code, 'PROFILE_SETUP_REQUIRED'); assert.equal((await call({ displayName: 'Retry' })).status, 503);
const migration = await readFile('supabase/migrations/20261020110000_atlas_profiles.sql', 'utf8');
assert.ok(migration.includes('references auth.users(id)')); assert.ok(migration.includes('enable row level security')); assert.ok(migration.includes('revoke all'));
assert.ok(!migration.includes('atlas_expeditions'));
console.log('PASS profile SDK/API fixtures: verified ID, onboarding defaults, Unicode names, strict validation, preference persistence, isolation, expiry, safe avatar, missing schema; no expedition reads/writes. SQL reviewed statically only.');
