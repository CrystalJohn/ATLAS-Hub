import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import type { SavedWord, VocabularyResponse } from '../content/english/vocabulary.ts';
import type { Expedition } from '../lib/atlas/service.ts';
import { handleVercelAtlas } from '../lib/atlas/vercel-handler.ts';
import { createLocalStack, ids } from './auth02/local-stack.mts';

const stack = await createLocalStack();
const origin = 'https://atlas.test';
const savedWord = { lessonId: 'forest-field-note', version: 1, word: 'canopy' } as const;
const ownerToken = stack.token(ids.legacy);
const bobToken = stack.token(ids.bob);

async function call<T>(route: string, token: string, body?: object, admin = stack.admin) {
  const response = await handleVercelAtlas(new Request(`${origin}/api/${route}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }), {
    getUser: async () => (await stack.auth.auth.getUser(token)).data.user,
    getAdmin: () => admin,
  });
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  return { status: response.status, body: await response.json() as T };
}

async function row(id: string) {
  const result = await stack.sql.query('select document, revision from public.atlas_expeditions where player_id=$1', [id]);
  assert.equal(result.rowCount, 1);
  return { document: JSON.parse(result.rows[0].document) as Expedition, revision: Number(result.rows[0].revision) };
}

async function seedVocabulary(id: string, words: SavedWord[]) {
  const original = await row(id);
  const result = await stack.sql.query(
    'update public.atlas_expeditions set document=$1, revision=revision+1 where player_id=$2 and revision=$3',
    [JSON.stringify({ ...original.document, savedVocabulary: words }), id, original.revision],
  );
  assert.equal(result.rowCount, 1);
}

async function prepareForest(token: string) {
  const attempt = await call<{ id: string }>('attempts', token, { missionId: 'silent-forest' });
  assert.equal(attempt.status, 201);
  for (const clueId of ['canopy', 'stream', 'wildlife']) {
    assert.equal((await call(`attempts/${attempt.body.id}/observe`, token, { clueId })).status, 201);
  }
  return `attempts/${attempt.body.id}/submit`;
}

try {
  const savedAt = '2026-10-20T00:00:00Z';
  const supported = { ...savedWord, savedAt };
  const orphanCases = [
    { entry: { ...supported, lessonId: 'retired-field-note' }, message: 'Unknown vocabulary lesson' },
    { entry: { ...supported, word: 'retired-glossary-word' }, message: 'Unknown vocabulary word' },
    { entry: { ...supported, version: 2 }, message: 'Invalid challenge response' },
  ];
  const seededWords = [supported, ...orphanCases.map(({ entry }) => entry)];
  await seedVocabulary(ids.legacy, seededWords);
  const seeded = await row(ids.legacy);
  const retrieved = await call<VocabularyResponse>('vocabulary', ownerToken);
  assert.equal(retrieved.status, 200);
  assert.deepEqual(retrieved.body.words, seededWords);
  assert.equal((await call('vocabulary', 'invalid')).status, 401);
  assert.equal((await call(`vocabulary?playerId=${ids.legacy}`, bobToken)).status, 400);
  assert.equal((await call('vocabulary', bobToken, { ...savedWord, saved: false, playerId: ids.legacy })).status, 400);
  assert.deepEqual((await call<VocabularyResponse>('vocabulary', bobToken)).body.words, []);

  const repeat = await call<VocabularyResponse>('vocabulary', ownerToken, { ...savedWord, saved: true });
  assert.equal(repeat.status, 201);
  assert.deepEqual(repeat.body.words, seededWords);
  assert.deepEqual(await row(ids.legacy), seeded);

  for (const invalid of [
    { ...savedWord, lessonId: '' },
    { ...savedWord, word: '   ' },
    { ...savedWord, lessonId: 'x'.repeat(101) },
    { ...savedWord, word: 'x'.repeat(81) },
    { ...savedWord, version: 0 },
    { ...savedWord, version: 1.5 },
    { ...savedWord, version: Number.MAX_SAFE_INTEGER + 1 },
    { ...savedWord, version: '1' },
    { ...savedWord, savedAt },
  ]) {
    const result = await call<{ message: string }>('vocabulary', ownerToken, { ...invalid, saved: false });
    assert.equal(result.status, 400);
    assert.equal(result.body.message, 'Invalid challenge response');
  }
  assert.deepEqual(await row(ids.legacy), seeded);

  const remaining = [...seededWords];
  for (const { entry, message } of orphanCases) {
    const { lessonId, version, word } = entry;
    const identity = { lessonId, version, word };
    const before = await row(ids.legacy);
    const strangerBefore = await row(ids.bob);
    const stranger = await call<VocabularyResponse>('vocabulary', bobToken, { ...identity, saved: false });
    assert.equal(stranger.status, 201);
    assert.deepEqual(stranger.body.words, []);
    assert.deepEqual(await row(ids.bob), strangerBefore);
    const newSave = await call<{ message: string }>('vocabulary', ownerToken, { ...identity, saved: true });
    assert.equal(newSave.status, 400);
    assert.equal(newSave.body.message, message);
    assert.deepEqual(await row(ids.legacy), before);
    const removal = await call<VocabularyResponse>('vocabulary', ownerToken, { ...identity, saved: false });
    remaining.splice(remaining.indexOf(entry), 1);
    assert.equal(removal.status, 201);
    assert.deepEqual(removal.body.words, remaining);
    assert.deepEqual((await call<VocabularyResponse>('vocabulary', ownerToken)).body.words, remaining);
    const after = { revision: before.revision + 1, document: { ...before.document, savedVocabulary: remaining } };
    assert.deepEqual(await row(ids.legacy), after);
    const repeated = await call<VocabularyResponse>('vocabulary', ownerToken, { ...identity, saved: false });
    assert.equal(repeated.status, 201);
    assert.deepEqual(repeated.body.words, remaining);
    assert.deepEqual(await row(ids.legacy), after);
  }
  console.log('PASS orphan visibility in GET, owner-only removal and idempotency for missing lesson, word and version; invalid identities and saves rejected.');

  const removal = await call<VocabularyResponse>('vocabulary', ownerToken, { ...savedWord, saved: false });
  assert.equal(removal.status, 201);
  assert.deepEqual(removal.body.words, []);
  const afterRemoval = await row(ids.legacy);
  assert.equal(afterRemoval.revision, seeded.revision + orphanCases.length + 1);
  assert.equal((await call('vocabulary', ownerToken, { ...savedWord, saved: false })).status, 201);
  assert.deepEqual(await row(ids.legacy), afterRemoval);
  console.log('PASS legacy read, isolation, supported removal and idempotent retries.');

  const { lessonId, version, word } = orphanCases[2].entry;
  const orphanIdentity = { lessonId, version, word };
  const races = [
    { id: ids.alice, saved: true, identity: savedWord, label: 'save' },
    { id: ids.failure, saved: false, identity: savedWord, label: 'remove' },
    { id: ids.bob, saved: false, identity: orphanIdentity, label: 'orphan removal' },
  ] as const;
  for (const { id, saved, identity, label } of races) {
    const token = stack.token(id);
    const submit = await prepareForest(token);
    if (label === 'remove') assert.equal((await call('vocabulary', token, { ...identity, saved: true })).status, 201);
    if (label === 'orphan removal') await seedVocabulary(id, [{ ...identity, savedAt }]);
    const before = await row(id);
    const attemptedRevisions: number[] = [];
    let conflictingWrites = 0;
    const barrier = Promise.withResolvers<void>();
    const timeout = AbortSignal.timeout(5000);
    const deadline = new Promise<never>((_, reject) => {
      timeout.addEventListener('abort', () => reject(timeout.reason), { once: true });
    });
    const racingAdmin = createClient(stack.url, stack.serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: async (input, init) => {
        const request = new Request(input, init);
        const url = new URL(request.url);
        const isExpeditionWrite = request.method === 'PATCH' && url.pathname === '/rest/v1/atlas_expeditions';
        if (isExpeditionWrite) {
          assert.equal(url.searchParams.get('player_id'), `eq.${id}`);
          attemptedRevisions.push(Number(url.searchParams.get('revision')?.slice(3)));
          if (attemptedRevisions.length === 2) barrier.resolve();
          if (attemptedRevisions.length <= 2) await Promise.race([barrier.promise, deadline]);
        }
        const response = await fetch(request);
        if (isExpeditionWrite && response.ok && (await response.clone().json()).length === 0) conflictingWrites++;
        return response;
      } },
    });

    const [vocabulary, reward] = await Promise.all([
      call<VocabularyResponse>('vocabulary', token, { ...identity, saved }, racingAdmin),
      call<{ awardedXp: number }>(submit, token, { type: 'DISCOVERY', answer: 'linked' }, racingAdmin),
    ]);
    assert.equal(vocabulary.status, 201);
    assert.equal(reward.status, 201);
    assert.equal(reward.body.awardedXp, 30);
    assert.deepEqual(attemptedRevisions, [before.revision, before.revision, before.revision + 1]);
    assert.equal(conflictingWrites, 1);
    const after = await row(id);
    assert.equal(after.revision, before.revision + 2);
    assert.equal(after.document.progress.xp, before.document.progress.xp + 30);
    assert.deepEqual(after.document.progress.completed, [...before.document.progress.completed, 'silent-forest']);
    assert.equal(after.document.ledger.length, before.document.ledger.length + 1);
    assert.equal(after.document.ledger.filter(entry => entry.missionId === 'silent-forest' && entry.contentVersion === 1).length, 1);
    assert.equal(after.document.checkpoint, null);
    assert.deepEqual(after.document.travel, before.document.travel);
    assert.deepEqual(after.document.tower, before.document.tower);
    assert.deepEqual(after.document.progress.englishEvidence, before.document.progress.englishEvidence);
    assert.ok(before.document.studyHistory?.days.every(day => after.document.studyHistory?.days.includes(day)));
    assert.deepEqual(after.document.savedVocabulary?.map(({ lessonId, version, word }) => ({ lessonId, version, word })), saved ? [identity] : []);
    assert.deepEqual((await call<VocabularyResponse>('vocabulary', token)).body.words, after.document.savedVocabulary);
    assert.equal((await call('vocabulary', token, { ...identity, saved })).status, 201);
    assert.deepEqual(await row(id), after);
    console.log(`PASS PostgreSQL vocabulary ${label} with first-clear reward: one CAS conflict, two revisions, one reward, no lost data.`);
  }
} finally {
  await stack.close();
}
