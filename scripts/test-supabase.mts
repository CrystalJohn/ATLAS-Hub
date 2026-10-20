import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createClient, type User } from '@supabase/supabase-js';
import { handleVercelAtlas } from '../lib/atlas/vercel-handler.ts';
import { sameOrigin, requestOrigin } from '../lib/atlas/origin.ts';

const proxied = new Request('https://localhost:3000/api/session', { headers: { host: 'atlas.test', origin: 'https://atlas.test', 'x-forwarded-host': 'evil.test' } });
assert.equal(requestOrigin(proxied), 'https://atlas.test');
assert.equal(sameOrigin(proxied), true);
assert.equal(sameOrigin(new Request('https://atlas.test/api/session', { headers: { host: 'atlas.test', origin: 'https://evil.test', 'x-forwarded-host': 'evil.test' } })), false);

// Exercise the real Supabase SDK against a deterministic PostgREST fixture.
// This checks request semantics + the mission engine, not a live Postgres schema.
const rows = new Map<string, { revision: number; document: string }>();
let missingTable = false, mutations = 0;
const fixtureFetch: typeof fetch = async (input, init) => {
  const req = new Request(input, init), url = new URL(req.url);
  assert.equal(url.pathname, '/rest/v1/atlas_expeditions');
  assert.equal(req.headers.get('apikey'), 'sb_secret_test_fixture');
  const json = (data: unknown, status = 200) => Response.json(data, { status });
  if (missingTable) return json({ code: 'PGRST205', message: 'Table not found' }, 404);
  if (req.method === 'HEAD') return new Response(null, { status: 200 });
  if (req.method === 'GET' && url.searchParams.get('limit') === '0') return json([]);
  if (req.method === 'POST') {
    assert.ok(req.headers.get('prefer')?.includes('resolution=ignore-duplicates'));
    const { player_id, revision, document } = await req.json() as { player_id: string; revision: number; document: string };
    if (!rows.has(player_id)) { rows.set(player_id, { revision, document }); mutations++; }
    return new Response(null, { status: 201 });
  }
  const playerId = url.searchParams.get('player_id')?.slice(3);
  assert.ok(playerId, 'Every select/update must be scoped to the verified player');
  const row = rows.get(playerId);
  if (req.method === 'GET') return json(row ? [{ ...row }] : []);
  if (req.method === 'PATCH') {
    const revision = Number(url.searchParams.get('revision')?.slice(3));
    const next = await req.json() as { revision: number; document: string };
    assert.equal(next.revision, revision + 1);
    // Model the database predicate and mutation as one synchronous operation.
    const current = rows.get(playerId);
    if (!current || current.revision !== revision) return json([]);
    rows.set(playerId, next); mutations++;
    return json([{ revision: next.revision }]);
  }
  throw new Error(`Unexpected fixture method: ${req.method}`);
};
const client = createClient('https://fixture.supabase.co', 'sb_secret_test_fixture', {
  global: { fetch: fixtureFetch }, auth: { persistSession: false, autoRefreshToken: false },
});
const alice = '11111111-1111-4111-8111-111111111111', bob = '22222222-2222-4222-8222-222222222222';
async function call(path: string, body?: unknown, user: string | null = alice, origin: string | null = 'https://atlas.test', spoof = bob) {
  const response = await handleVercelAtlas(new Request(`https://atlas.test/api/${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'oai-authenticated-user-id': spoof, 'Content-Type': 'application/json', ...(origin ? { origin } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }), { getUser: async () => user ? { id: user } as User : null, getAdmin: () => client });
  assert.ok(response.headers.get('cache-control')?.includes('no-store'));
  return { status: response.status, body: await response.json() as any };
}

assert.equal((await call('health', undefined, null)).status, 200);
assert.equal((await call('session', {}, null)).status, 401, 'Spoofed Sites header must not authenticate a Vercel request');
assert.equal(rows.size, 0, 'Unauthenticated requests cannot initialize progress');
assert.equal((await call('session', {}, alice, 'https://evil.test')).status, 403);
assert.equal((await call('session', {}, alice, null)).status, 403);
assert.equal((await call('session', {}, 'invalid-user-id')).status, 401);
assert.equal((await call('session', {})).body.xp, 0);
assert.equal(rows.size, 1);
assert.ok(rows.has(alice) && !rows.has(bob));
const attempt = (await call('attempts', { missionId: 'silent-forest' })).body;
for (const clueId of ['canopy', 'stream', 'wildlife']) await call(`attempts/${attempt.id}/observe`, { clueId });
assert.equal((await call(`attempts/${attempt.id}/submit`, { type: 'DISCOVERY', answer: 'linked', xp: 99999 })).status, 400);
const clears = await Promise.all(Array.from({ length: 12 }, () => call(`attempts/${attempt.id}/submit`, { type: 'DISCOVERY', answer: 'linked' })));
assert.ok(clears.every(r => r.status === 201));
assert.equal(clears.reduce((sum, r) => sum + r.body.awardedXp, 0), 30);
assert.equal((await call('session', {})).body.xp, 30, 'Returning session must preserve progress');
assert.equal((await call('session', {}, bob)).body.xp, 0);
assert.equal((await call(`attempts/${attempt.id}/observe`, { clueId: 'stream' }, bob)).status, 404);
assert.equal((await call(`attempts/${attempt.id}/submit`, { type: 'DISCOVERY', answer: 'linked' })).body.awardedXp, 0);
assert.equal((await call('session', {})).body.ledger.length, 1);
const saved = mutations;
await call('state', undefined, null);
assert.equal(mutations, saved, 'Expired session cannot write progress');
missingTable = true;
assert.equal((await call('health', undefined, null)).body.code, 'DATABASE_SETUP_REQUIRED');
assert.equal((await call('session', {})).status, 503);
missingTable = false;
const unavailable = await handleVercelAtlas(new Request('https://atlas.test/api/state'), {
  getUser: async () => { throw new Error('Token verification unavailable'); }, getAdmin: () => client,
});
assert.equal(unavailable.status, 503);
assert.equal(mutations, saved);
const migration = await readFile('supabase/migrations/20261020090000_atlas_expeditions.sql', 'utf8');
assert.ok(migration.includes('enable row level security'));
assert.ok(migration.includes('revoke all on public.atlas_expeditions from public, anon, authenticated'));
assert.ok(migration.includes('references auth.users(id)'));
console.log('PASS Supabase adapter + API fixtures: verified identity, spoofed headers rejected, auth/origin, initialization, reload/isolation, strict rewards, 12 concurrent clears, CAS retry/replay, expired session, health/schema recovery. SQL permissions reviewed statically; live OAuth/Postgres not exercised.');
