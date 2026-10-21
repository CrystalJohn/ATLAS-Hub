# AUTH-02 implementation report

Outcome: **PROVISIONAL** — implementation complete and locally verified; hosted OAuth/production verification is blocked. Baseline commit 18db705, branch codex/auth-02-player-ownership. Scope authorized 2026-10-21. No production deployment. User selected local PostgreSQL; live Google OAuth E2E is NOT RUN without staging/test account.

## Compatibility matrix (inspection before editing)

| Capability | Existing implementation | Gap | Planned change |
| --- | --- | --- | --- |
| Google Auth | Supabase SSR PKCE, HttpOnly cookies, server getUser | Native local API can select legacy D1; old Google redirect guard | Always use Supabase routes/Google and native Next scripts |
| Stable identity | Auth UUID owns PK/FK of profiles/expeditions | Profile row only created when name saved | ON CONFLICT DO NOTHING get-or-create on session/profile retrieval |
| Profile metadata | Name/interests/settings, safe HTTPS provider avatar | Concurrent first-login not tested on PostgreSQL | Preserve row fields on repeated login, real DB concurrent init test |
| XP/level/rewards | Server engine, one revision CAS document update; ledger shared by Forest/Tokyo | Only mock/D1 concurrency evidence; ledger uniqueness enforced in app | Keep atomic CAS; additive PostgreSQL ledger/revision/append-only guards; real PG concurrency/failure tests |
| Mission/Tokyo/stamps | UUID-scoped expedition with attempts, progress, travel, stamps, ledger | Direct SQL grants only reviewed statically | Verify actual anon/authenticated/service roles and API isolation |
| Resume | Travel cursor in expedition, view selection in unscoped localStorage | No reliable server pointer/latest resume API | Versioned pointer inside existing atomic document, validated GET /resume and stale-safe POST /checkpoint; minimal UI wiring |
| Conditional systems | No companion/economy/inventory implementation in domain | Not applicable | No speculative tables/features |
| Migrations | Three applied Supabase SQL migrations with CLI history | Integrity/checkpoint contract not specified | Add non-destructive migration and tested recovery procedure, no production apply during local testing |
| Verification | API fixtures, SSR, native build, historic D1 suites | No real PostgreSQL/OAuth E2E | Local native PostgreSQL + real PostgREST + app boundary; explicitly separate Google gap |

## Minimal design

Keep existing atlas_profiles and atlas_expeditions, Auth UUID identity, document CAS, content IDs, reward definitions and completed data. Do not normalize into a second ledger or checkpoint table. PostgreSQL row uniqueness plus conditional revision update already provide atomic document commits; add database validation to reject duplicate/modified historical ledger entries and mismatched XP deltas. Checkpoints store only a validated domain pointer and version; step/progress always come from the latest owned document. Client-selected checkpoint updates require the current expedition revision.

## Implemented changes

### Stable identity and profile creation

`lib/atlas/player.ts:5` initializes only `player_id` using SDK ignore-duplicates upsert. Existing UUID primary keys and Auth foreign keys enforce uniqueness; returning/concurrent requests cannot replace names, reading settings or interests with defaults. Verified session initialization and profile retrieval call this operation. Existing strict profile patch validation and provider HTTPS avatar handling remain in place. No email matching, account merge, second password flow or duplicate player table.

### One active persistence path

`app/api/[...path]/route.ts` always delegates to Supabase, derives identity via the existing SSR `auth.getUser()` and uses the trusted handler. `lib/atlas/vercel-handler.ts:27` validates that verified user and scopes every game/profile operation to their UUID; selector query parameters are rejected. Same-origin POST checks are at line 17. Profile/session failures remain recoverable. Health now probes both existing tables.

`dev`, `build` and `start` use native Next on every host; `dev:supabase` is a compatible alias without a platform flag. Active pages/AuthGate offer Google only. The D1 adapter and trusted historical header entry point moved to `lib/atlas/legacy-d1.ts`, imported only by historic tests; the active service no longer imports it. Legacy data/schema/source are preserved, not read/merged/deleted. The unused historic `app/chatgpt-auth.ts` helper is not imported by an active route.

### Atomic reward integrity

The existing `supabaseExpeditionStore.compareAndSwap` remains the commit mechanism: one PostgreSQL UPDATE filters by both verified player and revision and increments that revision. Everything authoritative (XP, mission completion, travel progress, stamps, ledger, checkpoint) is in that one row/document. PostgreSQL's statement transaction and predicate recheck serialize contenders; failed CAS reloads and re-evaluates server rules. There is no unguarded read-then-write award and no cross-table partial reward transaction.

`lib/atlas/service.ts:22` retains first-clear definitions and amounts. Duplicate responses add a stable logical reward key and `AWARDED` / `ALREADY_PROCESSED` / `NOT_ELIGIBLE` status, `awardedXp` and the recorded `firstClearXp`. Completed Forest duplicates return without appending another submission or clearing a newer checkpoint. No-op travel duplicates do not commit another document or replace a newer pointer.

`supabase/migrations/20261021090000_auth02_expedition_integrity.sql` adds a unique content/version and ID check within the existing ledger, immutable historical entries, XP delta equality with new reward entries, retained completions/stamps/first-clear dates, immutable owner, monotonic revision and reward-free genesis. It uses explicit invoker functions with fixed search paths and service-role-only execution. Existing deny-by-default RLS/grants stay in force. No reward definitions or data balances are migrated.

### Resume contract for UX-01

`lib/atlas/checkpoint.ts` validates published references, content versions, ownership through the loaded player document, unlocks, phase prerequisites and step bounds. Saved pointers never contain client-authoritative XP/completion/current-step values. Current cursor/observations are reconstructed from authoritative progress.

- `GET /api/resume` returns `{schemaVersion:1, revision, target, recovered, reason}`.
- A travel target includes country/destination/encounter/content version, canonical step/step ID/route index and replay status. Nature uses the existing mission/attempt/content version, safe phase and observed clues.
- `POST /api/checkpoint` accepts only `{expectedRevision,target}`. Targets are `{kind:'travel',encounterId}` or `{kind:'nature',attemptId,phase}`. It returns the updated state from the same CAS transaction.
- Stale selections/restarts return 409 `STALE_REVISION`; invalid/foreign targets return generic 400/403 without disclosure. New travel restart clients must supply the current revision.
- Checkpoints are saved on attempt creation, new observation, English response, valid decision/travel progress, explicit encounter selection and restart. Completion retires that pointer and can recover the newest remaining unfinished activity by its server commit revision.
- Old documents are not rewritten on login. Missing checkpoint metadata uses a validated deterministic legacy fallback. Invalid/deleted references recover to a valid owned candidate or null. Changed content versions do not auto-resume. No completed mission or first-clear date is reset by restoring a checkpoint.

World Travel no longer reads/writes the unscoped browser `atlas-travel-view-v1` key. Existing maps, Tokyo content and encounter UI remain. A single Journey Resume button and canonical World Travel initialization provide the minimum functional verification wiring, without UX-01 navigation redesign.

### Security boundary

The service role intentionally bypasses RLS, so authorization is enforced before creating/scoping the privileged store. Arbitrary body IDs are rejected by strict schemas, query player selectors are rejected, foreign attempts are not found in the owned document, and XP/rewards/prerequisites are evaluated on the server. Missing, invalid, anonymous or expired sessions are rejected. Mutations require the correct Origin, and private responses are uncached.

`lib/supabase/admin.ts` has the standard `server-only` guard. Public configuration rejects credential-bearing or non-HTTPS/non-loopback URLs. Actual client static files were scanned without exposing the secret value; it was absent. Local SQL/PostgREST tests separately verify table grants, RLS, FK constraints and the service-boundary account isolation behavior. No SQL policy is relied upon to protect an unscoped service-role query.

## Files changed

| Area | Files |
| --- | --- |
| Active runtime/auth | `app/api/[...path]/route.ts`, `app/auth/google/route.ts`, `app/auth/callback/route.ts`, `app/page.tsx`, `app/components/AuthGate.tsx`, `scripts/run-framework.mjs`, `scripts/run-supabase-local.mjs`, `package.json` |
| Identity/storage/security | `lib/atlas/player.ts`, `lib/atlas/profile-handler.ts`, `lib/atlas/vercel-handler.ts`, `lib/atlas/storage.ts`, `lib/atlas/legacy-d1.ts`, `lib/supabase/admin.ts`, `lib/supabase/config.ts` |
| Reward/checkpoint contract | `lib/atlas/service.ts`, `lib/atlas/checkpoint.ts`, `packages/mission-engine/src/travel.ts`, `content/travel/types.ts` |
| Minimal UI/localization | `app/components/Game.tsx`, `app/components/chapter-types.ts`, `app/components/travel/WorldTravel.tsx`, `app/account.css`, `content/localization/vi.ts` |
| SQL | New integrity migration and corresponding script under `supabase/rollback/`; baseline migrations unchanged |
| Real database/HTTP tooling | `scripts/auth02/local-stack.mts`, `scripts/test-auth02-postgres.mts`, `scripts/test-auth02-http.mts`, `scripts/preview-auth02.mts`, `scripts/setup-auth02-tools.mjs` |
| Existing regression fixtures | `scripts/test-profile.mts`, `scripts/test-supabase.mts`, `scripts/test-atlas.mts`, `scripts/test-travel.mts`, `scripts/test-chapter.mts`, `scripts/test-vocabulary.mts`, `scripts/test-chapter-ui.mts`, `scripts/profile-preview.mts` |
| Tooling/config | Pinned development PostgreSQL 17 and types, `server-only`, `pnpm-lock.yaml`, project build approvals in `pnpm-workspace.yaml`; ESLint ignores generated runtime/output folders without suppressing source rules |
| Documentation/evidence | This report, test evidence, production readiness, README/local guide, ADR-003 and historical ADR/Auth-01 annotations, `output/auth02/` |

No new Japan chapter content, companion/friendship/shop/coin/inventory system, alternate database or authentication implementation was created. No such conditional gameplay system was found in the inspected domain.

## Migrations created/applied

- Created `20261021090000_auth02_expedition_integrity.sql`; applied and validated against disposable native PostgreSQL, including pre-existing-row compatibility, invalid-ledger abort, local rollback and reapply.
- Added a version-controlled recovery SQL blueprint outside the migration directory; for hosted recovery use a newly reviewed forward migration so history remains auditable.
- Read-only hosted migration list confirms baseline versions 20261020090000 / 20261020110000 / 20261020130000; new 20261021090000 is not recorded remotely. It was not applied to production by this milestone.
- Read-only remote zero-row probes returned server schema 200 and anonymous denial 401/42501 for both tables. No production player rows were read or written.

## Verification outcome and remaining gate

18 real PostgreSQL/PostgREST scenarios pass, including 24 concurrent first sessions and separate 32-way first-clear races; production Next HTTP/cookie integration, browser fixture persistence/isolation, gameplay regressions, TypeScript, full lint and native Next Webpack build pass. Full lint has zero errors and seven image optimization warnings. See [test evidence](AUTH-02-test-evidence.md) for every PASS/FAIL/NOT RUN and oracle.

AUTH-02 is ready for controlled staging verification. It is **not ESTABLISHED for the hosted end-to-end Google story**, because the user confirmed no dedicated Google account/staging was available. The local signed Auth verifier is not GoTrue. Hosted refresh/revocation behavior, Google consent/callback and production gameplay smoke remain NOT RUN. Document growth/contention and seven image optimization warnings remain explicit limitations. See [production readiness](AUTH-02-production-readiness.md).

Backward compatibility: Auth UUIDs, existing profiles, XP definitions, mission/encounter IDs, stamps and documents are retained. Optional metadata/API fields are additive. The deliberate runtime change retires Sites/D1 active login/data access; no legacy data is silently imported or removed. Duplicate success can use HTTP200 or201. Old restart clients receive409 until they reload/send a revision.

No AUTH-02 commit, push or production deployment has been performed. No production migration/destructive/concurrency test was run. All changes are reviewable in the local working branch.
