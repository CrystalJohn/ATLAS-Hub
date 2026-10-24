# AUTH-04 test oracle matrix

Date: 2026-10-23. `PASS` means the stated **environment** was actually exercised; fixture/local PASS does not imply staging or production PASS. `BLOCKED` needs external access/accounts; `NOT RUN` is an available scenario without an executed harness.

| Test ID | Requirement | Environment | Initial state | Action | Expected result | Observed result | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| O01 | Google identity | Staging | New account A, Google enabled | Consent → callback | Verified UUID and one owned profile | No staging project/account; settings alone showed Google enabled | [E2E report](AUTH-04-e2e-test-report.md) | BLOCKED |
| O02 | Profile uniqueness | Local PostgreSQL | No A profile | 24 simultaneous `/api/session` calls | One A profile/expedition, metadata retained later | Exactly one of each; returning edits preserved | [PG evidence](../../output/auth02/postgres-evidence.json) | PASS |
| O03 | Session restoration | Local Next + PG | Saved A checkpoint | Reload/new signed fixture login | Same profile, XP, checkpoint | Exact checkpoint and 30 XP restored | [HTTP evidence](../../output/auth02/http-evidence.json) | PASS |
| O04 | Token refresh | Staging GoTrue | Expiring real session | Wait/refresh then protected API | Valid refresh succeeds; failed refresh denies | No real GoTrue session | [E2E report](AUTH-04-e2e-test-report.md) | BLOCKED |
| O05 | Session expiration | Local signed fixture | Expired/invalid token | Protected API request | 401 and zero writes | 401; no profile/expedition write | [PG evidence](../../output/auth02/postgres-evidence.json) | PASS |
| O06 | Revoked real session | Staging GoTrue | Revoked A session | Protected API request | Rejected without write | No real GoTrue revocation test | [E2E report](AUTH-04-e2e-test-report.md) | BLOCKED |
| O07 | Logout | Local Next + PG | Signed A fixture | POST logout, retry protected API | Cookie cleared and API denied; saved DB unchanged | Fixture logout cleared cookie, denied stale session, retained progress | [HTTP evidence](../../output/auth02/http-evidence.json) | PASS |
| O08 | Account switching | Local Next + PG | A progress then B signed fixture | Full navigation A→logout→B | No A profile/progress/checkpoint for B | B saw separate zero-XP state; A row unchanged | [HTTP evidence](../../output/auth02/http-evidence.json) | PASS |
| O09 | Delayed account switch | Staging browser | A profile/vocabulary requests pending | Logout, B login, release A responses | No A data appears in B document | No same-document race harness or provider accounts | [Security assessment](AUTH-04-security-assessment.md) | NOT RUN |
| O10 | Data isolation | Local API + PG/RLS | A and B rows | B selects/updates A attempt, reward, profile, checkpoint | Denied, A row unchanged | 400/404; no A row change; direct anon/authenticated table access denied | [PG evidence](../../output/auth02/postgres-evidence.json) | PASS |
| O11 | XP persistence | Local Next + PG | A completes Forest/Tokyo | Reload/new fixture login; query SQL | Exact XP/level/ledger from authoritative row | 370 XP, level 3, seven ledger entries in full regression; 30 XP retained in HTTP fixture | [PG evidence](../../output/auth02/postgres-evidence.json), [HTTP evidence](../../output/auth02/http-evidence.json) | PASS |
| O12 | Checkpoint persistence | Local Next + PG | Tokyo step 1 saved | Reload/new fixture login; stale write | Exact owned target; stale write 409; completions retained | Exact `ask-staff` target; stale 409; no completion reset | [PG evidence](../../output/auth02/postgres-evidence.json) | PASS |
| O13 | Reward idempotency | Local PostgreSQL | Eligible first-clear | Submit, replay, simulate lost response | One 30-XP ledger award; retries zero | One award; replay/lost-response retry zero | [PG evidence](../../output/auth02/postgres-evidence.json) | PASS |
| O14 | Concurrency safety | Local PostgreSQL | Same eligible encounter | 32 concurrent Forest and 32 Tokyo clears | One effective award/stamp each | 30 aggregate XP per race, one Forest ledger entry and Tokyo stamp | [PG evidence](../../output/auth02/postgres-evidence.json) | PASS |
| O15 | Transaction failure | Local PostgreSQL | Eligible Tokyo clear | Inject deferred commit exception | No partial XP/ledger/revision | 503, identical row; clean retry awarded once | [PG evidence](../../output/auth02/postgres-evidence.json) | PASS |
| O16 | OAuth redirect safety | Local unit + Next HTTP | Approved/hostile Hosts, returnTo payload | Start/callback requests | Only approved origin or safe rejection; no external Location | Pure origin guard rejects hostile host; Next local redirect stayed local; returnTo ignored | `scripts/test-supabase.mts`, `scripts/test-auth-http.mts` | PASS |
| O17 | Hosted OAuth redirect allowlist | Staging/Vercel/Supabase | Exact production/preview aliases | Review config and complete Google callback | Matching exact origins, no wildcard bypass | Vercel detail 403; Supabase allowlist not accessible | [Deployment report](AUTH-04-deployment-readiness.md) | BLOCKED |
| O18 | Deployment configuration | Production | Exact Vercel deployment | Inspect SHA/env project ref, health and migration versions | Intended DB, current migrations, healthy app | Vercel detail 403; alias SSO; linked CLI confirms AUTH-02 guard migration pending | [Deployment report](AUTH-04-deployment-readiness.md), [read-only record](../../output/auth04/hosted-readonly.json) | BLOCKED |
| O19 | Production smoke | Production | Approved deployment/test accounts | Google login, controlled progress, reload/logout | API/UI/DB agreement and denied post-logout access | No approval/accounts; no production mutation | [Production report](AUTH-04-production-verification.md) | BLOCKED |

## AUTH-04.1 execution addendum — 2026-10-23

Deployment version is listed explicitly to prevent a local fixture result being mistaken for a hosted release result. [Redacted evidence](../../output/auth04/auth04-1-evidence.json); [blocker analysis](AUTH-04.1-blocker-resolution.md); [staging report](AUTH-04.1-staging-verification.md).

| Test ID | Environment | Deployment version | Expected result | Observed result | Redacted evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| A41-01 | Local checkout | HEAD `d03faab` plus uncommitted changes | TypeScript, lint and build succeed | TypeScript PASS; lint 0 errors/7 image warnings; build PASS on filesystem-permitted retry | [AUTH-04.1 evidence](../../output/auth04/auth04-1-evidence.json) | PASS |
| A41-02 | Local fixtures | Same checkout | Auth rejects spoofing, invalid sessions and hostile origins | Auth fixture and native Next HTTP tests PASS | `scripts/test-supabase.mts`, `scripts/test-auth-http.mts` | PASS |
| A41-03 | Disposable PostgreSQL/PostgREST | Same checkout; all four migrations | One effective first-clear award under concurrency; failed commit rolls back | 19 scenarios PASS; two 32-way races, lost-response retry and rollback PASS | [PostgreSQL assertions](../../output/auth02/postgres-evidence.json) | PASS |
| A41-04 | Local Next + disposable PostgreSQL | Same checkout; all four migrations | Cookie/API progress survives reload/login and is account scoped | HTTP integration PASS | [HTTP assertions](../../output/auth02/http-evidence.json) | PASS |
| A41-05 | Local Brave desktop/mobile | Same checkout; fixture provider | Sign-in/recovery flow responsive, no page errors | Browser fixture PASS; not a Google E2E | [Browser screenshots](../../output/auth04/screenshots) | PASS |
| A41-06 | Local travel fixture | Same checkout | Tokyo pilot and Forest regression intact | PASS on loopback-permitted retry | `scripts/test-travel.mts` output, [AUTH-04.1 evidence](../../output/auth04/auth04-1-evidence.json) | PASS |
| A41-07 | Linked Supabase `jyzeararymcahczbovei` (production designation unconfirmed) | Remote app SHA unknown; three migrations applied | Identify migration gap without hosted mutation | Guard `20261021090000` pending; count-only reads: 1 expedition, 0 profiles; Google enabled | [AUTH-04.1 evidence](../../output/auth04/auth04-1-evidence.json) | PASS (read-only facts only) |
| A41-08 | Vercel team project | Deployment ID/SHA unknown | Inspect project, Preview and Production config through authorized connection | Project/deployment requests 403 for team scope; no exact origin or env target | [Blocker analysis](AUTH-04.1-blocker-resolution.md) | BLOCKED |
| A41-09 | Isolated Supabase staging + Vercel Preview | No staging deployment | Separate refs, exact origin/callback, applied guard, two-account real Google/GoTrue OAuth with isolation, refresh and persistence | No dedicated staging project, Preview access or authorized test accounts | [Staging report](AUTH-04.1-staging-verification.md) | BLOCKED |
| A41-10 | Production | Current deployment unknown | Approved migration/deploy then controlled smoke matches authoritative DB | No production approval, migration or smoke execution | [Production preflight](AUTH-04.1-production-preflight.md) | BLOCKED |

### Status update — 2026-10-24

Rows A41-08 and A41-10 above describe the 2026-10-23 snapshot. Vercel team-scope access is now restored. The following rows supersede only the deployment-access observation; all OAuth and database verification gates remain unchanged.

| Test ID | Environment | Deployment version | Expected result | Observed result | Redacted evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| A41-11 | Vercel `atlas-hub` Preview | `d03faabda3d6eefb249ecf3a20feba776d655c56` | Read project/deployment metadata under intended team | Project, READY Preview, alias and environment-name targets returned; previous 403 gone | [Vercel record](../../output/auth04/auth04-1-vercel-access-2026-10-24.json) | PASS (read-only access) |
| A41-12 | Preview vs Production configuration | Preview `d03faab`; Production `ce79e591` | Separate Supabase refs, server secret and exact auth origin per target | Both public URLs use ref `jyzeararymcahczbovei`; Preview lacks server secret; both lack `ATLAS_AUTH_ALLOWED_ORIGINS` | [Vercel record](../../output/auth04/auth04-1-vercel-access-2026-10-24.json) | FAIL (staging gate) |
| A41-13 | Production deployment metadata | `ce79e5914a3f8337dbfb4736e07ac72768060599` | Identify READY deployment, aliases and variable names | READY deployment and three aliases identified; canonical origin, redirect allowlist and runtime behavior unverified | [Vercel record](../../output/auth04/auth04-1-vercel-access-2026-10-24.json) | PASS (metadata only) |

Owner decision 2026-10-24: no separate staging is required at the current scale. A41-09 remains a record of a test **not run**, not a required staging setup action. Real-provider OAuth and hosted persistence move to a separately approved, low-impact Production smoke plan; see [direct-to-Production preflight](AUTH-04.1-production-preflight.md). Local concurrency/rollback tests remain the only concurrency evidence. No Production mutation is authorized by this decision.

### Read-only Production and local rerun — 2026-10-24

| Test ID | Environment | Deployment version | Expected result | Observed result | Redacted evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| A41-14 | Local checkout | `d03faab` plus uncommitted AUTH-04 code | TS/lint/build and auth/DB/browser/Tokyo regressions pass | All pass; lint has 7 image warnings; DB has 19 scenarios | [Verification report](AUTH-04.1-verification-2026-10-24.md) | PASS (local) |
| A41-15 | Production public HTTP | `ce79e5914a3f8337dbfb4736e07ac72768060599` | App and Supabase health available; unauthorized API denied; OAuth starts at correct callback | Home 200, health 200 `supabase`, vocabulary 401, Google 307 to configured Supabase with canonical-domain callback | [Read-only evidence](../../output/auth04/verification-2026-10-24.json) | PASS (entry points only) |
| A41-16 | Linked Supabase | Three migrations applied; guard pending | Existing row shape compatible before migration | 1/1 expedition documents passed in-memory shape/ledger preflight; backup and database constraint validation not verified | [Read-only evidence](../../output/auth04/verification-2026-10-24.json) | PASS (limited preflight) |
| A41-17 | Real provider and Production player data | Production SHA `ce79e591` | Two-account login, refresh, owned progress, first-clear and resume observed | No authorized test-account consent or Production write; current checkout not deployed | [Verification report](AUTH-04.1-verification-2026-10-24.md) | NOT RUN |
