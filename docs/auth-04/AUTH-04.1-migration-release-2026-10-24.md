# AUTH-04.1 linked migration and branch release — 2026-10-24

The owner authorized a GitHub push and application of the pending migration to the currently linked Supabase project `jyzeararymcahczbovei`. This record supersedes the earlier **pending migration** observation in the preflight reports; those reports remain dated snapshots. Production application deployment and real Google OAuth E2E remain outside this release.

| Check | Observed result |
| --- | --- |
| Target and dry run | Linked ref `jyzeararymcahczbovei`; `supabase db push --linked --dry-run` listed only `20261021090000_auth02_expedition_integrity.sql`. |
| Existing data | One `atlas_expeditions` row and zero `atlas_profiles` rows. The existing expedition passed an in-memory structural preflight. No document or user ID was written to this repository. |
| Recovery copy | Two public ATLAS tables were read twice with matching snapshots, encrypted with Windows DPAPI CurrentUser outside Git, and decrypted in memory to verify recovery. Path: `C:\Users\tranp\AppData\Local\Temp\atlas-auth02-pre-migration-20261024-120757\atlas-public-tables.json.dpapi`. This temporary, user-bound copy is **not** a managed database backup or a full-cluster dump. The standard Supabase dump could not run because Docker/Podman is absent. Preserve the file until a durable backup is available. |
| Migration apply | `supabase db push --linked --skip-vault --yes` completed successfully. Post-apply `migration list --linked` shows all four versions applied, including `20261021090000`. Vault updates were skipped. |
| Post-apply preservation | Expedition count remained one; the hash over its `player_id`, `revision`, and `document` was unchanged: `e0f67de027d7569fc7a8392de2bf9aabd3621bceb9e08cc08fee862ecbd61978`. No production progress write or concurrency test was performed. |
| Guard access | Server-key read-only function probes returned true for a valid synthetic document and false for an invalid duplicate-ledger document. Anonymous invocation was rejected with HTTP 401 / PostgreSQL 42501. |
| Hosted application | Production `/api/health` returned HTTP 200 with Supabase persistence after migration. This is a health check, not an authenticated gameplay test. |

The migration is already version-controlled in the branch. The GitHub push publishes the reviewed branch changes; it does not deploy the Production application. Real Google consent/callback, two-account isolation and production gameplay persistence remain **NOT RUN**. The current Vercel Production deployment still serves the older SHA until a separately authorized rollout. Preview shares the Production Supabase project and lacks the server secret; it is not an isolated substitute for these tests. Current-checkout Production readiness remains **PROVISIONAL / NO-GO**.
