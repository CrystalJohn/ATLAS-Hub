import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createClient, type User } from '@supabase/supabase-js';
import { chapterLessons } from '../content/english/chapter.ts';
import { travelVocabularyLessons } from '../content/travel/japan.ts';
import { handleVercelAtlas } from '../lib/atlas/vercel-handler.ts';
import { sameOrigin, requestOrigin, trustedAuthOrigin } from '../lib/atlas/origin.ts';
import type {ResumeState} from '../lib/atlas/contracts/expedition.ts';
import type {AtlasTestBody} from './test-response-types.ts';

const proxied = new Request('https://localhost:3000/api/session', { headers: { host: 'atlas.test', origin: 'https://atlas.test', 'x-forwarded-host': 'evil.test' } });
assert.equal(requestOrigin(proxied), 'https://atlas.test');
assert.equal(sameOrigin(proxied), true);
assert.equal(sameOrigin(new Request('https://atlas.test/api/session', { headers: { host: 'atlas.test', origin: 'https://evil.test', 'x-forwarded-host': 'evil.test' } })), false);
const priorAuthOrigins = process.env.ATLAS_AUTH_ALLOWED_ORIGINS;
const priorNodeEnv = process.env.NODE_ENV;
try {
  delete process.env.ATLAS_AUTH_ALLOWED_ORIGINS;
  assert.throws(() => trustedAuthOrigin(proxied));
  process.env.ATLAS_AUTH_ALLOWED_ORIGINS = 'https://atlas.test,https://preview.atlas.test';
  assert.equal(trustedAuthOrigin(proxied), 'https://atlas.test');
  assert.equal(trustedAuthOrigin(new Request('https://preview.atlas.test/auth/google')), 'https://preview.atlas.test');
  assert.throws(() => trustedAuthOrigin(new Request('https://atlas.test/auth/google', { headers: { host: 'evil.test', 'x-forwarded-host': 'atlas.test' } })));
  assert.throws(() => trustedAuthOrigin(new Request('https://atlas.test/auth/google', { headers: { host: 'atlas.test.evil.test' } })));
  assert.throws(() => trustedAuthOrigin(new Request('https://atlas.test/auth/google', { headers: { host: 'atlas.test@evil.test' } })));
  assert.throws(() => trustedAuthOrigin(new Request('https://atlas.test/auth/google', { headers: { host: 'atlas.test/evil' } })));
  assert.equal(trustedAuthOrigin(new Request('http://127.0.0.1:3000/auth/google')), 'http://127.0.0.1:3000');
  Reflect.set(process.env, 'NODE_ENV', 'production');
  assert.throws(() => trustedAuthOrigin(new Request('http://127.0.0.1:3000/auth/google')));
  process.env.ATLAS_AUTH_ALLOWED_ORIGINS += ',http://127.0.0.1:3000';
  assert.equal(trustedAuthOrigin(new Request('http://127.0.0.1:3000/auth/google')), 'http://127.0.0.1:3000');
} finally {
  if (priorAuthOrigins === undefined) delete process.env.ATLAS_AUTH_ALLOWED_ORIGINS;
  else process.env.ATLAS_AUTH_ALLOWED_ORIGINS = priorAuthOrigins;
  if (priorNodeEnv === undefined) Reflect.deleteProperty(process.env, 'NODE_ENV');
  else Reflect.set(process.env, 'NODE_ENV', priorNodeEnv);
}

// Exercise the real Supabase SDK against a deterministic PostgREST fixture.
// This checks request semantics + the mission engine, not a live Postgres schema.
const rows = new Map<string, { revision: number; document: string }>();
let missingTable = false, mutations = 0, conflicts = 0;
const fixtureFetch: typeof fetch = async (input, init) => {
  const req = new Request(input, init), url = new URL(req.url);
  if(url.pathname==='/rest/v1/atlas_profiles'){
    if(missingTable)return Response.json({code:'PGRST205'},{status:404});
    if(req.method==='GET'&&url.searchParams.get('limit')==='0')return Response.json([]);
    assert.equal(req.method,'POST');assert.ok(req.headers.get('prefer')?.includes('resolution=ignore-duplicates'));
    return new Response(null,{status:201});
  }
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
    if (!current || current.revision !== revision) {
      conflicts++;
      return json([]);
    }
    rows.set(playerId, next); mutations++;
    return json([{ revision: next.revision }]);
  }
  throw new Error(`Unexpected fixture method: ${req.method}`);
};
const client = createClient('https://fixture.supabase.co', 'sb_secret_test_fixture', {
  global: { fetch: fixtureFetch }, auth: { persistSession: false, autoRefreshToken: false },
});
const alice = '11111111-1111-4111-8111-111111111111', bob = '22222222-2222-4222-8222-222222222222';
async function call<T = AtlasTestBody>(path: string, body?: unknown, user: string | null = alice, origin: string | null = 'https://atlas.test', spoof = bob) {
  const response = await handleVercelAtlas(new Request(`https://atlas.test/api/${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'oai-authenticated-user-id': spoof, 'Content-Type': 'application/json', ...(origin ? { origin } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }), { getUser: async () => user ? { id: user } as User : null, getAdmin: () => client });
  assert.ok(response.headers.get('cache-control')?.includes('no-store'));
  return { status: response.status, body: await response.json() as T };
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
assert.ok(clears.every(r => r.status === 200 || r.status === 201));
assert.equal(clears.reduce((sum, r) => sum + r.body.awardedXp, 0), 30);
assert.equal((await call('session', {})).body.xp, 30, 'Returning session must preserve progress');
assert.equal((await call('session', {}, bob)).body.xp, 0);
assert.equal((await call(`attempts/${attempt.id}/observe`, { clueId: 'stream' }, bob)).status, 404);
assert.equal((await call(`attempts/${attempt.id}/submit`, { type: 'DISCOVERY', answer: 'linked' })).body.awardedXp, 0);
assert.equal((await call('session', {})).body.ledger.length, 1);
const start = await call('travel/start', { countryId: 'JP' });
assert.equal(start.status, 201);
assert.deepEqual(start.body.travel.visitedCountries, ['JP']);
const target = { kind: 'travel', encounterId: 'jp-arrival' };
assert.equal((await call('checkpoint', { expectedRevision: start.body.state.revision, target })).status, 201);
const action = (stepId: string, input: object) => ({
  encounterId: target.encounterId, version: 1, stepId, band: 'A2',
  support: { vietnamese: false, glossary: false }, action: input,
});
const readSigns = await call('travel/action', action('read-signs', { kind: 'inspect', target: 'signs' }));
assert.equal(readSigns.status, 201);
const { body: resume } = await call<ResumeState>('resume');
assert.deepEqual(resume, readSigns.body.state.resume);
assert.equal(resume.target?.kind === 'travel' && resume.target.stepId, 'ask-staff');

const nextStop = travelVocabularyLessons.find(lesson => lesson.missionId === 'jp-directions')!;
const travelWord = { lessonId: nextStop.id, version: 1, word: nextStop.glossary[0].word, saved: true };
assert.equal((await call('vocabulary', travelWord)).status, 403);
assert.equal((await call('travel/action', action('ask-staff', { kind: 'say', choice: 'ask' }))).status, 201);

const beforeTravelClear = conflicts;
const finish = action('find-train', { kind: 'target', target: 'station' });
const travelClears = await Promise.all(Array.from({ length: 12 }, () => call('travel/action', finish)));
assert.ok(conflicts > beforeTravelClear, 'Travel must retry after a conflicting write');
assert.ok(travelClears.every(response => response.status === 201));
assert.equal(travelClears.reduce((xp, response) => xp + response.body.awardedXp, 0), 30);
assert.equal((await call('travel')).body.travel.stamps.length, 1);
assert.equal((await call('state')).body.ledger.length, 2);
assert.equal((await call<ResumeState>('resume')).body.target, null);
const staleRestart = await call('travel/action', {
  ...action('', { kind: 'restart' }), expectedRevision: start.body.state.revision,
});
assert.equal(staleRestart.status, 409);
assert.equal(staleRestart.body.code, 'STALE_REVISION');

const [natureLesson] = chapterLessons;
const natureWord = { lessonId: natureLesson.id, version: 1, word: natureLesson.glossary[0].word, saved: true };
const beforeVocabularySaves = conflicts;
const wordSaves = await Promise.all([travelWord, natureWord, travelWord].map(word => call('vocabulary', word)));
assert.ok(conflicts > beforeVocabularySaves, 'Vocabulary must retry after a conflicting write');
assert.ok(wordSaves.every(response => response.status === 201));
const words = (await call('vocabulary')).body.words;
assert.equal(words.length, 2);
assert.deepEqual(words.map(word => word.word).sort(), [travelWord.word, natureWord.word].sort());
const beforeDuplicateSave = mutations;
assert.deepEqual((await call('vocabulary', travelWord)).body.words, words);
assert.equal(mutations, beforeDuplicateSave, 'Duplicate saves must retain the existing word and timestamp');
assert.deepEqual((await call('vocabulary', { ...travelWord, saved: false })).body.words.map(word => word.word), [natureWord.word]);
assert.deepEqual((await call('vocabulary', undefined, bob)).body.words, []);

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
console.log('PASS Supabase adapter + API fixtures: verified identity, spoofed headers rejected, auth/origin, initialization, reload/isolation, strict rewards, concurrent Forest and Travel clears, checkpoint/resume, vocabulary CAS retry/replay, expired session, health/schema recovery. SQL permissions reviewed statically; live OAuth/Postgres not exercised.');
