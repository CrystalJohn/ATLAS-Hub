import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// Real Next.js HTTP routes, with a local Supabase settings/schema fixture.
// No real Google account, production secret or production database is used.
const fixture = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/auth/v1/settings') return res.end(JSON.stringify({ external: { google: false } }));
  res.statusCode = 404;
  res.end(JSON.stringify({ code: 'PGRST205', message: 'Missing fixture schema' }));
});
fixture.listen(0, '127.0.0.1');
await once(fixture, 'listening');
const address = fixture.address();
assert.ok(address && typeof address === 'object');
const base = 'http://127.0.0.1:3209';
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3209'], {
  env: { ...process.env, VERCEL: '1', NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${address.port}`, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_http_fixture', SUPABASE_SECRET_KEY: 'sb_secret_http_fixture' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let logs = '';
child.stdout.on('data', chunk => { logs += String(chunk); });
child.stderr.on('data', chunk => { logs += String(chunk); });
try {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => { clearInterval(poll); reject(new Error('Next server did not become ready')); }, 20000);
    const poll = setInterval(() => {
      if (logs.includes('Ready in')) { clearTimeout(timer); clearInterval(poll); resolve(); }
      else if (child.exitCode !== null) { clearTimeout(timer); clearInterval(poll); reject(new Error('Next server exited')); }
    }, 50);
  });
  const home = await fetch(base);
  assert.equal(home.status, 200);
  const html = await home.text();
  assert.ok(html.includes('ATLAS'));
  assert.ok(!html.includes('sb_secret_http_fixture'));
  const session = await fetch(`${base}/api/session`, { method: 'POST', headers: { origin: base, 'Content-Type': 'application/json', 'oai-authenticated-user-id': '11111111-1111-4111-8111-111111111111' }, body: '{}' });
  assert.equal(session.status, 401);
  assert.equal((await session.json() as {code:string}).code, 'SIGN_IN_REQUIRED');
  assert.ok(session.headers.get('cache-control')?.includes('no-store'));
  const crossOrigin = await fetch(`${base}/api/session`, { method: 'POST', headers: { origin: 'https://evil.test' }, body: '{}' });
  assert.equal(crossOrigin.status, 403);
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 503);
  assert.equal((await health.json() as {code:string}).code, 'DATABASE_SETUP_REQUIRED');
  for (const path of ['/auth/callback', '/auth/google']) {
    const response = await fetch(`${base}${path}`, { redirect: 'manual' });
    assert.equal(response.status, 307);
    assert.ok(response.headers.get('location')?.includes('/auth/error'));
  }
  const errorPage = await fetch(`${base}/auth/error?reason=unavailable`);
  assert.equal(errorPage.status, 200);
  assert.ok((await errorPage.text()).includes('Google sign-in will be ready soon.'));
  assert.equal((await fetch(`${base}/auth/logout`, { method: 'POST', headers: { origin: 'https://evil.test' } })).status, 403);
  if (process.env.ATLAS_BROWSER_QA === '1') {
    const runtime = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
    assert.ok(runtime, 'Browser QA requires the provided runtime Playwright install');
    const playwright = await import(pathToFileURL(`${runtime}/playwright/index.js`).href);
    const { chromium } = playwright.default ?? playwright;
    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
    await mkdir('docs/auth-01/screenshots', { recursive: true });
    try {
      for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1440, 1000]] as const) {
        const page = await browser.newPage({ viewport: { width, height } });
        const errors: string[] = [];
        page.on('pageerror', (error: Error) => errors.push(error.message));
        await page.goto(base);
        const signIn = page.getByRole('link', { name: /Continue with Google/ });
        await signIn.waitFor({ state: 'visible' });
        assert.equal(await signIn.getAttribute('href'), '/auth/google');
        assert.ok(await page.getByText('Đăng nhập bằng Google', { exact: true }).isVisible());
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
        await signIn.focus();
        assert.equal(await signIn.evaluate((element: Element) => element === document.activeElement), true);
        await page.screenshot({ path: `docs/auth-01/screenshots/${name}.png`, fullPage: true });
        await signIn.press('Enter');
        await page.waitForURL('**/auth/error?reason=unavailable');
        assert.ok(await page.getByRole('heading', { name: 'Google sign-in will be ready soon.' }).isVisible());
        assert.deepEqual(errors, []);
        await page.close();
      }
      console.log('PASS browser fixtures: mobile/desktop sign-in CTA, Vietnamese support, no horizontal overflow, keyboard Enter, provider-unavailable recovery and no page errors. Screenshots saved.');
    } finally { await browser.close(); }
  }
  console.log('PASS native Next HTTP: home 200, unauthenticated/spoofed session 401, cross-origin 403, schema-specific health 503, callback/provider recovery redirects, bilingual error page, logout CSRF guard. Auth/database provider are fixtures, not live OAuth/Postgres.');
} finally {
  child.kill('SIGTERM');
  await new Promise<void>(resolve => fixture.close(() => resolve()));
}
