# AUTH-04.1 verification — 2026-10-24

**Later update:** The linked AUTH-02 guard migration was applied after owner authorization. The table below is the earlier read-only snapshot; see [post-apply evidence](AUTH-04.1-migration-release-2026-10-24.md). Real OAuth E2E and production gameplay verification remain NOT RUN.

**Result: PROVISIONAL; current-checkout Production release NO-GO.** Local ownership, persistence, reward integrity and regression tests pass. The deployed Production application is reachable and starts the Google OAuth redirect, but real Google consent/callback, two-account isolation and live progress writes were not performed. This report follows the owner's decision to skip staging. [Redacted machine-readable evidence](../../output/auth04/verification-2026-10-24.json).

| Oracle | Environment/version | Observed result | Status |
| --- | --- | --- | --- |
| TypeScript, lint, build | Local branch `codex/auth-02-player-ownership`, HEAD `d03faabda3d6eefb249ecf3a20feba776d655c56` plus uncommitted AUTH-04 changes | TypeScript and build pass; lint 0 errors, 7 image warnings | PASS |
| Identity/auth fixture | Local signed fixtures | Spoofed/invalid sessions, origin checks and API flow pass | PASS (fixture) |
| Owner, rewards, checkpoint | Disposable PostgreSQL/PostgREST | 19 scenarios pass, including 32-way first-clear races, lost-response retry, transaction rollback, RLS and account isolation | PASS (local DB) |
| Browser and Tokyo | Local Brave mobile/desktop fixture and travel regression | Browser auth/recovery and Tokyo/Forest regression pass | PASS (fixture) |
| Production HTTP | `atlas-hub-beige.vercel.app`, deployment `dpl_AwEYhZ7RfL8Mjhw7PpLgQiTH9bKt`, SHA `ce79e5914a3f8337dbfb4736e07ac72768060599` | `/` 200; `/api/health` 200 with `persistence=supabase`; unauthenticated `/api/vocabulary` 401 | PASS (read-only HTTP) |
| OAuth entry | Same Production deployment | `/auth/google` 307 to project `jyzeararymcahczbovei`, with `redirect_to=https://atlas-hub-beige.vercel.app/auth/callback`; public GoTrue settings say Google enabled | PASS (start redirect only) |
| Database migration history | Linked Supabase `jyzeararymcahczbovei` | First three migrations applied; AUTH-02 guard `20261021090000` pending | PASS (read-only fact); release blocker |
| Existing expedition compatibility | Same Supabase project | Exactly one expedition; its document was inspected in memory and passes the migration's key shape, XP and ledger-uniqueness predicates. No row content or ID was printed or saved. | PASS (application-side preflight only) |
| Real Google login/GoTrue session | Production | No authorized test-account consent, callback, refresh or expiry test | NOT RUN |
| Live ownership and progress | Production | No profile, reward, checkpoint or second-account writes/reads were attempted | NOT RUN |
| Release configuration | Vercel Preview/Production | Both point to the same Supabase project; Preview lacks `SUPABASE_SECRET_KEY`; neither target has `ATLAS_AUTH_ALLOWED_ORIGINS` | FAIL for current-checkout release readiness |

The production SHA differs from local HEAD, and the uncommitted origin-guard change is not in either deployed commit. Production HTTP results therefore verify the **currently deployed version only**, not the current checkout. A 307 proves that OAuth starts; it does not prove Google consent, PKCE/callback, cookie creation or session refresh. The in-memory expedition check is not a PostgreSQL `VALIDATE CONSTRAINT` and does not replace a restorable backup/recovery check. No Production migration, deployment, configuration change or player-data mutation occurred.

The next release gate is concrete: verify a restorable backup; confirm the exact Supabase redirect allowlist and intended canonical domain; review the current diff and migration; add the exact Production origin setting; then obtain separate approval for migration/configuration/deployment and a low-impact real-OAuth smoke using authorized accounts. Keep concurrency and fault-injection tests on disposable local PostgreSQL. See the [direct-to-Production preflight](AUTH-04.1-production-preflight.md).
