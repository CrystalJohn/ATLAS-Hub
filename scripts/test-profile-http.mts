import assert from 'node:assert/strict';
import type {ProfileTestBody} from './test-response-types.ts';

// Run while `pnpm preview:profile` is active. These are real Next HTTP routes,
// verified-cookie sessions and SDK calls against the loopback provider fixture.
const base = 'http://127.0.0.1:3211', fixture = 'http://127.0.0.1:43219';
const login = async (name: string) => (await fetch(`${fixture}/login/${name}`, { redirect: 'manual' })).headers.get('set-cookie')!.split(';')[0];
const alice = await login('alice'), bob = await login('bob');
async function api(cookie: string, body?: unknown, origin = base) {
  const response = await fetch(`${base}/api/profile`, { method: body === undefined ? 'GET' : 'POST', headers: { cookie, origin, 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return { status: response.status, body: await response.json() as ProfileTestBody };
}
const snapshot = async () => await (await fetch(`${fixture}/control/snapshot`)).json() as { expeditions: unknown };
const before = await snapshot(), original = (await api(alice)).body.profile;
assert.equal((await api(alice, { displayName: 'HTTP Nguyễn An', readingBand: 'B2', vietnameseSupport: false, interests: ['food','culture'] })).status, 200);
const reload = (await api(alice)).body.profile;
assert.equal(reload.displayName, 'HTTP Nguyễn An'); assert.equal(reload.readingBand, 'B2'); assert.equal(reload.vietnameseSupport, false);
assert.deepEqual(reload.interests,['food','culture']);
assert.ok(!(await api(bob)).body.profile.interests.includes('food'),'Interests do not leak to a second account');
assert.notEqual((await api(bob)).body.profile.displayName, 'HTTP Nguyễn An');
assert.equal((await api(alice, { displayName: 'spoof', playerId: 'other-player' })).status, 400);
assert.equal((await api(alice, { displayName: 'cross-origin' }, 'https://evil.test')).status, 403);
assert.equal((await api('', { displayName: 'expired' })).status, 401);
await fetch(`${fixture}/control/fail-profile?on=1`);
try { assert.equal((await api(alice, { displayName: 'cannot-save' })).status, 503); }
finally { await fetch(`${fixture}/control/fail-profile?on=0`); }
assert.equal((await api(alice)).body.profile.displayName, 'HTTP Nguyễn An');
await api(alice, { displayName: original.displayName || 'Nguyễn An', readingBand: original.readingBand, vietnameseSupport: original.vietnameseSupport, interests: original.interests ?? [] });
assert.deepEqual((await snapshot()).expeditions, before.expeditions, 'Profile changes must preserve expedition documents and revisions byte-for-byte');
console.log('PASS real local Next HTTP profiles: cookie sessions, save/reload, two-account isolation, ID injection, origin, expiry, failed save/recovery; expedition documents/revisions unchanged. Provider/Postgres are fixtures.');
