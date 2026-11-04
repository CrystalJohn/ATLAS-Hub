# AUTH-04 deployment readiness

Date: 2026-10-23. Local build, TypeScript, lint (0 errors, 7 pre-existing image warnings), auth fixture, 19 PostgreSQL checks, HTTP/database integration and Tokyo regression passed. The local app has not been deployed. Records: [local checks](../../output/auth04/local-checks.json), [hosted read-only probes](../../output/auth04/hosted-readonly.json).

| Gate | Observation | State |
| --- | --- | --- |
| Commit and source | Branch `codex/auth-02-player-ownership`, base `d03faabda3d6eefb249ecf3a20feba776d655c56`; AUTH-03 reports remain uncommitted, AUTH-03.1 implementation not found. | Known local baseline |
| Vercel project/deployment | Project list identified `atlas-hub` (`prj_zjeQBcOL9hpHgTc9qpbqRFDIWPzh`) under team `team_dvpNSCXxfd93YeDMu4OMRVcK`. Project/deployment reads returned 403 (team authorization required). Current deployment ID, SHA, env names/targets and domains are unknown. | BLOCKED |
| Historical production alias | Documented `atlas-hub-phuctptse183992-1459s-projects.vercel.app` returned 302 to `vercel.com/sso-api` for `/` and `/api/health`. It is not an application health PASS. | BLOCKED |
| Local Supabase | `.env.local` contains the three expected key names and resolves to project ref `jyzeararymcahczbovei`; Google settings enabled; zero-row server schema probes 200 and anon probes 401/42501. Secret values were not printed. | Limited read-only verification |
| OAuth origins | Code now requires exact `ATLAS_AUTH_ALLOWED_ORIGINS` for HTTPS. This value is absent from local `.env.local`; Vercel values, preview aliases and Supabase Redirect URLs could not be read. | BLOCKED before deployment |
| Migration | Local four-migration stack passes. Current linked CLI list confirms `20261021090000` pending remotely. Hosted row compatibility, restorable backup and constraints were not inspected. | BLOCKED |
| Secret boundary | Admin module imports `server-only`; configured secret absent from all 30 scanned client static files. | PASS locally |
| Health/error handling | Local `/api/health` distinguishes missing schema/storage; production alias SSO prevents checking deployed response or redacted logs. | BLOCKED hosted |

Before any staging rollout, obtain scoped Vercel team access and an isolated Supabase staging project. Verify the intended Vercel target points to the matching Supabase project ref, review environment variable names/targets without exposing values, confirm exact production and stable preview origins in both Vercel and Supabase, and apply migrations through the auditable CLI after backup/preflight. Run the real-provider oracle before seeking production approval. Do not add a broad wildcard to bypass the origin guard.

Rollback: retain the last known-good Vercel deployment for promotion/rollback after an application-only failure. The additive AUTH-02 integrity guard normally remains in place when app code rolls back. If the database guard itself must be removed, review `../../supabase/rollback/20261021090000_auth02_expedition_integrity.sql`, create a new forward recovery migration, verify a restorable backup, and apply only with separate production authorization. Never reset the production database or silently rewrite player documents.
