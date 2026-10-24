# AUTH-04.1 staging verification

Date: 2026-10-23. **Staging: NOT ESTABLISHED.** No Vercel Preview deployment or dedicated Supabase staging project was verified, and no real Google OAuth E2E was run. All passing results below are local. [Machine-readable observations](../../output/auth04/auth04-1-evidence.json).

## Configuration matrix

| Setting | Local test | Staging target | Production target |
| --- | --- | --- | --- |
| Application origin | `http://127.0.0.1` with ephemeral test ports | Exact, stable HTTPS Preview alias: **not yet identified** | Exact live HTTPS origin: **not yet verified**; historical Vercel alias is insufficient |
| Vercel environment/deployment version | None; local HEAD `d03faabda3d6eefb249ecf3a20feba776d655c56` plus uncommitted changes | Preview / SHA **unknown** (403) | Production / SHA **unknown** (403) |
| Supabase project | Disposable PostgreSQL/PostgREST fixtures; `.env.local` separately points to `jyzeararymcahczbovei` | Dedicated project **not found**; must differ from production | Linked `jyzeararymcahczbovei` is the only discovered ATLAS project; production designation must be confirmed |
| OAuth callback | `http://127.0.0.1:<port>/auth/callback` in fixtures | `https://<stable-staging-host>/auth/callback` | `https://<verified-production-host>/auth/callback` |
| Supabase allowed redirect | Fixture allowlist only | Exact callback above: **unverified** | Exact callback above: **unverified** |
| Environment names | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`; local `ATLAS_AUTH_ALLOWED_ORIGINS` absent | Same four names, scoped to Preview; values/targets **unverified** | Same four names, scoped to Production; values/targets **unverified** |
| Applied migrations | All four on disposable PostgreSQL | **Unknown/no staging project** | Linked project: first three applied, `20261021090000` pending |

The two `NEXT_PUBLIC_` values are public connection details; `SUPABASE_SECRET_KEY` is server-only and must be marked Sensitive/Secret in Vercel. `ATLAS_AUTH_ALLOWED_ORIGINS` must include only exact trusted HTTPS origins for the relevant deployment. A Preview deployment must never point at the production Supabase project. Do not configure broad preview wildcards.

## Database preflight and security

Read-only CLI inventory found only one ATLAS Supabase project. Read-only linked migration history reported `20261020090000`, `20261020110000`, and `20261020130000` applied, and `20261021090000` pending. Public GoTrue settings returned Google enabled. Server-key SDK HEAD/count queries returned HTTP 200 with **one** `atlas_expeditions` row and **zero** `atlas_profiles` rows; no row contents were requested. This does not prove that the expedition document passes the new constraint or that every intended profile has been initialized.

Local PostgreSQL 17/PostgREST tests applied all four migrations and passed 19 scenarios, including existing-byte preservation, invalid-document migration abort with rollback, FK/RLS/grant checks, two 32-request first-clear races, lost-response retry and deferred-commit failure with no partial reward. Existing hosted RLS catalog/constraint state, row compatibility, restorable backup and staging migration history remain unverified. The migration's `VALIDATE CONSTRAINT` will reject an incompatible existing document atomically; it is not a substitute for a controlled preflight. [AUTH-04 database report](AUTH-04-database-integrity-report.md) has the full local security evidence.

## Regression rerun

| Check | Observed result | Environment |
| --- | --- | --- |
| TypeScript (`tsc --noEmit`) | PASS | Local |
| ESLint | PASS, zero errors and seven existing `no-img-element` warnings | Local |
| Production build | PASS after retry with filesystem access; first sandboxed attempt failed `EPERM` while writing `.next`, not a compile failure | Local |
| Auth adapter/API fixtures | PASS | Local fixtures |
| AUTH-02 PostgreSQL/PostgREST | PASS, 19 scenarios including concurrency and rollback | Disposable local DB |
| AUTH-02 Next HTTP/cookie→SDK→DB | PASS | Local app + disposable DB |
| Auth HTTP and Brave mobile/desktop | PASS, fixture UI and server checks | Local browser with fixture provider |
| Tokyo travel regression | PASS after loopback-permitted retry; sandboxed attempt failed `EACCES` | Local fixture |
| Real Google OAuth, two accounts, refresh/revocation, delayed account switch | BLOCKED, not run | Staging unavailable |

The local browser test used provider fixtures; it must not be described as real Google or GoTrue verification. Local account isolation and reward integrity passed at API/database boundaries, while hosted isolation is unverified.

## Required staging sequence

1. Recover Vercel team-scoped read access, identify a stable Preview alias and the exact deployment SHA.
2. Establish a separate Supabase staging project; confirm its ref differs from the production project before assigning Preview environment variables. Record only variable names and environment targets, never secret values.
3. Inspect staging migration history, existing row compatibility and a restorable backup. After staging-specific approval, apply the four versioned migrations through the CLI and verify actual constraints, grants, RLS, trigger and history.
4. Configure exact Preview origin and Supabase redirect callback, then run the AUTH-04 oracle with two authorized Google accounts on real GoTrue/PostgreSQL. Verify first/returning login, reload, refresh/expiry, logout, account switching with delayed responses, denied foreign API reads/writes, progress and checkpoint restoration, and hostile-origin rejection.
5. Record the deployment SHA, redacted request/database evidence and observed results before considering a release candidate. No staging claim can be upgraded from local fixture PASS alone.

## Update — 2026-10-24: Vercel access restored

Read-only Vercel inspection now identifies the READY Preview deployment `dpl_9NQ2H4yCnepZp2V4Pqs5SQWYQwg3` at SHA `d03faabda3d6eefb249ecf3a20feba776d655c56`, with stable branch alias `atlas-hub-git-codex-auth-3f723a-phuctptse183992-1459s-projects.vercel.app`. Production deployment `dpl_AwEYhZ7RfL8Mjhw7PpLgQiTH9bKt` is READY at SHA `ce79e5914a3f8337dbfb4736e07ac72768060599`. The branch alias can be an exact-origin candidate only after it is intentionally trusted and configured; no OAuth or protected HTTP flow was tested through it.

Both Preview and Production public Supabase URL variables point to **the same ref** `jyzeararymcahczbovei`. Preview does not list `SUPABASE_SECRET_KEY`; neither target lists `ATLAS_AUTH_ALLOWED_ORIGINS`. Thus the current Preview is not an isolated staging environment and is not ready for AUTH-04.1 provider or persistence E2E. The deployment SHAs are committed code and do not include this checkout's uncommitted AUTH-04 origin changes. [Read-only Vercel evidence](../../output/auth04/auth04-1-vercel-access-2026-10-24.json). No environment variable, migration, deployment or player data was changed.

## Owner decision — 2026-10-24

No separate staging project will be established for now. This document remains as the audit of the existing Preview and explains why it cannot be used as an isolated test environment. Future release verification will use the already-passing local disposable PostgreSQL tests and a controlled Production smoke test only after explicit authorization. The smoke test cannot safely include destructive or high-concurrency experiments; their evidence remains local. No staging migration or OAuth E2E is claimed.
