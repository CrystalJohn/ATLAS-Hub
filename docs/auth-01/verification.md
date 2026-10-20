# AUTH-01 verification — 2026-10-20

## Passed

- Native Vercel Next production build, including TypeScript and the evidence publication gate.
- Sites Vinext/Cloudflare production build (existing large-chunk advisory remains).
- Lint on the new auth routes, Supabase modules, storage adapters, origin guard and AuthGate.
- Existing actual D1 tests: Forest progression, World Travel, chapter English and vocabulary persistence. These cover account isolation, concurrent rewards and replay protection.
- Supabase SDK + mocked PostgREST integration tests: verified player IDs, rejected spoofed Sites headers, same-origin mutation checks, initialization without overwrites, returning sessions, account isolation, 12 concurrent first-clear requests and CAS retry, replay, schema-specific health errors and expired sessions.
- Native Next HTTP tests with local provider fixtures: home 200; no-session POST /api/session 401; cross-origin mutations 403; missing schema /api/health 503; callback/provider failure recovery redirects; bilingual recovery page; logout CSRF rejection.
- Native client bundles were scanned and did not contain the server secret environment name or test secret values.

## Confirmed external blockers

Read-only Supabase public API checks returned:

- GET /auth/v1/settings: HTTP 200, Google provider false.
- GET /rest/v1/atlas_expeditions?select=player_id&limit=0: HTTP 404, PGRST205.

The SQL migration and Google provider setup in [supabase-setup.md](supabase-setup.md) are required before live sign-in + persistence can pass.

## Not passed / not executed

- Real Google consent, PKCE callback and session refresh with a signed-in user.
- Live Supabase table permissions, document saves and concurrent CAS updates against PostgreSQL. The fixture tests are not proof that the migration has been applied.
- Legacy Sites-to-Google account linking or data migration; none is performed.
- Automated mobile/desktop browser QA and screenshots: the available Playwright package had no Chromium executable. The optional browser check could not launch. HTTP and static accessibility checks do not establish full keyboard/screen-reader/mobile usability.
- Protected deployment HTTP verification through Vercel: the connection previously returned project/team 403. Do not treat a READY build as end-to-end gameplay verification.

## Release gate

Keep the new implementation on the feature branch preview until the SQL migration, Google provider/redirect configuration, replacement secret and live browser sign-in/persistence checks are complete. The previously published production build is not a working Supabase-backed game.
