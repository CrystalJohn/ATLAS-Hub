import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

// Explicitly launched, loopback-only test fixture. Never imported by application routes.
// In-memory records and fake tokens only; does not contact a real Supabase project.
const origin = 'http://127.0.0.1:3211', fixturePort = 43219;
const ids = { alice: '11111111-1111-4111-8111-111111111111', bob: '22222222-2222-4222-8222-222222222222' };
const profiles = new Map<string, Record<string, unknown>>(), expeditions = new Map<string, Record<string, unknown>>();
let failProfile = false, failExpedition = false;
const fixture = createServer(async (req, res) => {
  const url = new URL(req.url!, `http://127.0.0.1:${fixturePort}`);
  const json = (body: unknown, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
  const user = (id: string) => ({ id, aud: 'authenticated', role: 'authenticated', email: id === ids.alice ? 'alice@fixture.test' : 'bob@fixture.test', app_metadata: { provider: 'google', providers: ['google'] }, user_metadata: { avatar_url: `http://127.0.0.1:${fixturePort}/avatar` }, created_at: new Date().toISOString() });
  if (url.pathname.startsWith('/login/')) {
    const id = ids[url.pathname.endsWith('bob') ? 'bob' : 'alice'];
    const payload = Buffer.from(JSON.stringify({ sub: id, aud: 'authenticated', exp: Math.floor(Date.now() / 1000) + 86400 })).toString('base64url');
    const session = { access_token: `fixture.${payload}.fixture`, refresh_token: 'local-fixture-refresh', token_type: 'bearer', expires_in: 86400, expires_at: Math.floor(Date.now() / 1000) + 86400, user: user(id) };
    res.writeHead(303, { 'Set-Cookie': `sb-127-auth-token=base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}; Path=/; HttpOnly; SameSite=Lax`, Location: origin }); return res.end();
  }
  if (url.pathname === '/control/fail-profile') { failProfile = url.searchParams.get('on') === '1'; return json({ failProfile }); }
  if (url.pathname === '/control/fail-expedition') { failExpedition = url.searchParams.get('on') === '1'; return json({ failExpedition }); }
  if (url.pathname === '/control/snapshot') return json({ profiles: Object.fromEntries(profiles), expeditions: Object.fromEntries(expeditions) });
  if (url.pathname === '/auth/v1/user') {
    try { const token = req.headers.authorization?.split(' ')[1] ?? ''; const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()); return json(user(payload.sub)); }
    catch { return json({ message: 'Invalid fixture session' }, 401); }
  }
  if (url.pathname === '/auth/v1/logout') { res.writeHead(204); return res.end(); }
  if (url.pathname === '/auth/v1/settings') return json({ external: { google: false } });
  const isProfile = url.pathname === '/rest/v1/atlas_profiles', isExpedition = url.pathname === '/rest/v1/atlas_expeditions';
  if (!isProfile && !isExpedition) return json({ message: 'Fixture route not found' }, 404);
  if (isProfile && failProfile) return json({ code: 'PGRST205' }, 404);
  if (isExpedition && failExpedition) return json({ code: 'FIXTURE_UNAVAILABLE' }, 503);
  const table = isProfile ? profiles : expeditions;
  if (req.method === 'GET') {
    if (url.searchParams.get('limit') === '0') return json([]);
    const id = url.searchParams.get('player_id')?.slice(3) ?? '';
    return json(table.has(id) ? [table.get(id)] : []);
  }
  const chunks: Buffer[] = []; for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const body = JSON.parse(Buffer.concat(chunks).toString());
  if (req.method === 'POST') {
    const id = body.player_id;
    if (isProfile) {
      if(req.headers.prefer?.includes('resolution=ignore-duplicates')&&table.has(id)){res.writeHead(201);return res.end();}
      table.set(id, { display_name: null, vietnamese_support: true, reading_band: 'A2', interests: [], ...table.get(id), ...body });
      if(req.headers.prefer?.includes('resolution=ignore-duplicates')){res.writeHead(201);return res.end();}
      return json(table.get(id));
    }
    if (!table.has(id)) table.set(id, body);
    res.writeHead(201); return res.end();
  }
  if (req.method === 'PATCH') {
    const id = url.searchParams.get('player_id')?.slice(3) ?? '', revision = Number(url.searchParams.get('revision')?.slice(3)), current = table.get(id);
    if (!current || current.revision !== revision) return json([]);
    table.set(id, { ...current, ...body }); return json([{ revision: body.revision }]);
  }
  return json({ message: 'Unsupported fixture method' }, 405);
});
fixture.listen(fixturePort, '127.0.0.1'); await once(fixture, 'listening');
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', '3211'], {
  env: { ...process.env, VERCEL: '1', ATLAS_PROFILE_PREVIEW: '1', NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${fixturePort}`, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_local_fixture', SUPABASE_SECRET_KEY: 'sb_secret_local_fixture' },
  stdio: 'inherit',
});
console.log(`LOCAL FIXTURE PREVIEW: http://127.0.0.1:${fixturePort}/login/alice (second account: /login/bob). In-memory data only.`);
child.on('exit', () => { fixture.close(); });
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => { child.kill(); fixture.close(); });
