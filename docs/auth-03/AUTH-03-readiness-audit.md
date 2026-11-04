# ATLAS AUTH-03 readiness audit

Audit date: 2026-10-22
Repository: `D:\ATLAS-Hub`
Branch / commit: `codex/auth-02-player-ownership` / `d03faab` (clean, tracking `origin`)
Scope: inspection and safe local verification only. No application, SQL, environment, OAuth, hosted database, or deployment changes were made.

## Readiness

- Total criteria reviewed: **61** (**60 applicable**, 1 not applicable)
- Complete — Verified: **33**
- Implemented — Unverified: **19**
- Partial: **5**
- Missing: **1**
- Blocked: **2**
- Not Applicable: **1**

Outcome: **PROVISIONAL**. The server-side cookie/session architecture, account ownership, logout, progress persistence, and checkpoint recovery have strong local verification. Hosted Google OAuth, GoTrue refresh/revocation behavior, and deployed host configuration remain unverified because no staging project or dedicated Google test account is available. A few UX and account-state edges also need focused work or browser verification before calling AUTH-03 complete.

## Existing architecture and actual request flow

ATLAS uses a server-only Supabase SSR client. `app/auth/google/route.ts` checks whether Google is enabled and asks Supabase Auth for an OAuth URL with `prompt=select_account`. `app/auth/callback/route.ts` exchanges the returned code for a session and redirects to `/`. `lib/supabase/server.ts` stores the Supabase session in HttpOnly, SameSite=Lax cookies and marks them Secure in production. There is no browser Supabase client, React auth provider, `onAuthStateChange` listener, or middleware/proxy session refresh path.

On page load, `Game` sends one `POST /api/session`. The API route calls `auth.getUser()` using the cookie-backed server client; the trusted handler derives the player UUID from that verified user, creates the profile idempotently, and returns owned progress. The client stores the returned state in React for that document. API 401 responses dispatch one `atlas:sign-in-required` event; the game clears its visible expedition state and renders the Google sign-in gate. Supabase SSR performs cookie refresh when its server client makes an Auth request, but refresh against hosted GoTrue has not been exercised.

Profile retrieval follows with `GET /api/profile`; `useAccountProfile` guards effect responses with an active flag and generation counter. The account menu reads the server profile, opens Profile and Settings dialogs, and posts to `/auth/logout`. Logout calls `signOut({scope:'local'})`, clears this browser's session through response cookies, and redirects to `/`. The account-switch path therefore performs a full document navigation. No custom client auth manager should be added.

Progress and resume state load through the session response. The authenticated server handler scopes queries by the UUID returned from `auth.getUser()`. `/api/resume` resolves the canonical checkpoint from the same player-owned expedition document; the Journey UI consumes `state.resume`. These AUTH-02 contracts are not duplicated by AUTH-03.

The active Next API route uses Supabase. `lib/atlas/legacy-d1.ts` remains for historic D1 tests, and `app/chatgpt-auth.ts` is an unused legacy helper; neither is imported by the active API route. No second auth provider or conflicting Supabase auth listener was found.

## Verified capabilities

- Cookie-backed server session restoration, invalid-session rejection, logout, and new-session login preserved the same PostgreSQL expedition and checkpoint in the local signed-session fixture: `scripts/test-auth02-http.mts` and `output/auth02/http-evidence.json`.
- Profile initialization, returning profile preservation, and concurrent initialization passed on local PostgreSQL. Foreign-account profile, mission, reward, and checkpoint access was rejected in the real API/database fixtures: `scripts/test-auth02-postgres.mts`.
- Logout and invalid-session UI/API behavior passed through the built Next HTTP route fixture: `scripts/test-auth-http.mts` and `scripts/test-auth02-http.mts`.
- Checkpoint restore after reload and a fresh signed fixture login, and the unchanged database snapshot across logout/login, passed in the AUTH-02 browser fixture evidence: `output/auth02/browser-evidence.json`.
- `pnpm.cmd --config.manage-package-manager-versions=false lint`: PASS, 0 errors and 7 `<img>` optimization warnings.
- `pnpm.cmd --config.manage-package-manager-versions=false exec tsc --noEmit`: PASS.
- `pnpm.cmd --config.manage-package-manager-versions=false test:auth`: PASS.
- `pnpm.cmd --config.manage-package-manager-versions=false test:auth:http`: PASS.
- `pnpm.cmd --config.manage-package-manager-versions=false test:auth02`: PASS, 18 real local PostgreSQL/PostgREST scenarios.
- `pnpm.cmd --config.manage-package-manager-versions=false test:auth02:http`: PASS, built Next cookies/API through Supabase SDK, PostgREST, and local PostgreSQL.
- `pnpm.cmd --config.manage-package-manager-versions=false build`: PASS using the repository's Next Webpack build path; TypeScript is also checked by the build.

All database tests used disposable local fixtures. Auth HTTP tests use signed synthetic sessions, not Supabase GoTrue or Google. The optional `ATLAS_BROWSER_QA=1` auth page browser run was not executed in this audit; no real OAuth was initiated. No test or browser accessed a hosted player row.

## Security and correctness findings

The trusted API boundary is strong in the inspected path: identity comes from `auth.getUser()`, body and query selectors are rejected, profile and expedition queries use the verified UUID, mutations require same-origin requests, responses are private/no-store, and the service-role client is guarded by `server-only`. Local PostgreSQL tests exercise grants, RLS, account isolation, invalid/revoked fixture sessions, and cookie handling. The secret scan recorded by AUTH-02 found no configured server secret in client output.

OAuth callback destinations are fixed to `/` or `/auth/error`; there is no client-controlled `returnTo` parameter, so no query-driven open redirect was found. However, the redirect origin is assembled from the request `Host` by `requestOrigin()` and has no application-level canonical-host allowlist. The Supabase redirect URL allowlist and Vercel host behavior are external controls and were not checked against a staging OAuth flow in this audit. Verify those controls before relying on the callback as deployed; consider pinning accepted production/preview origins if the deployment accepts arbitrary Host values.

The main recoverable gaps are: the sign-in anchor has no explicit pending/disabled state; duplicate click suppression is left to document navigation; profile/settings dropdown interactions have not had a browser interaction test in this audit; and no test changes accounts while requests are in flight within one still-mounted React document. Full-page OAuth/logout navigation currently limits the account-switch case, but the client state/cache behavior should be explicitly verified and cleared or keyed if account identity can change without a full reload.

## External verification still required

AUTH-01 historical notes recorded Google disabled and the profile schema missing in the configured hosted project at the time of those checks. AUTH-02 later performed zero-row schema/grant probes, but its new integrity migration remains pending remotely. Neither document proves current Google provider or deployment configuration. Before production readiness, use an isolated Supabase staging project and dedicated Google accounts to verify provider enablement, callback allowlist, cookie refresh, revoked session, account switching, profile display, logout, and progress/checkpoint continuity. Do not use production for destructive or concurrent tests.

See [the complete criterion-by-criterion matrix](AUTH-03-gap-matrix.md) and [minimal execution plan](AUTH-03-minimal-execution-plan.md).
