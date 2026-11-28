# AUTH-02 production readiness

Date: 2026-10-22. Classification: **PROVISIONAL**.

The implementation and local PostgreSQL guarantees are established by real-database and actual Next HTTP tests, rather than mocked repository results alone. The complete hosted Supabase Auth/Google story is not established. **Ready for controlled staging verification; not approved for production deployment.**

## Completion gate

| Requirement | State |
| --- | --- |
| Stable verified-user → one profile | Implemented; actual SDK boundary + 24-way PG uniqueness verified with signed Auth fixture |
| Owned durable progress/XP/level/mission/stamps/ledger | Implemented; real PostgreSQL and API/role isolation verified |
| Atomic duplicate-safe first-clear | Verified: separate 32-request Forest and Tokyo races, commit-time rollback, lost-response retry |
| Latest valid resume target | Implemented and verified, including stale/concurrent selection, legacy fallback and fresh test session |
| Existing Tokyo pilot and Forest/English behavior | Regression suites and full real-PG runs pass |
| Migration compatibility/recovery | Versioned non-destructive guard migration and explicit recovery script tested on local PostgreSQL |
| Migration applied to hosted staging/production | NOT DONE; new version is pending remotely |
| Google OAuth/GoTrue authenticated browser E2E | NOT RUN; no dedicated staging project/test account, as confirmed by user |
| Full repository lint | PASS: 0 errors, 7 image optimization warnings |
| Production deployment | NOT PERFORMED |

## Database rollout and compatibility

Only new schema change: `supabase/migrations/20261021090000_auth02_expedition_integrity.sql`. It reuses existing `atlas_profiles` and `atlas_expeditions` with Auth UUID primary/foreign keys. Checkpoint and activity-revision metadata live in the existing document; there is no duplicate player, checkpoint, ledger, companion, coin or inventory table.

The migration adds a document validity check and one integrity trigger. It scans existing ledger/progress data before committing; an incompatible row aborts the migration rather than rewriting it. It does not delete, reset, import, merge or update player documents. New accounts start without rewards; compatible historical accounts retain existing XP/ledger balances. Runtime still uses the original CAS update; the migration supplies additional database protection.

Before hosted rollout:

1. Provision an isolated staging Supabase project and authorized Google test account. Verify the selected CLI project/environment; never use production for destructive/concurrency suites.
2. Review existing columns, PK/FK/RLS/grants, ledger validity, migration history and a restorable backup. Dry-run reports pending files, but does not validate actual row contents.
3. Apply the guard migration to staging through the recorded CLI workflow. If validation fails, preserve data and investigate with a separate reviewed repair migration; do not clear or deduplicate rewards automatically.
4. Run the manual OAuth + persistence oracle below and re-run ownership/concurrency against isolated staging fixtures if hosted parity is required.
5. Review seven remaining `<img>` optimization warnings when image loading is next updated; no lint rules are suppressed. The build script selects Webpack because Turbopack's CSS worker failed on the local Windows host; verify the same build script in staging CI.
6. Obtain explicit approval before applying to production or deploying. No such action was performed by AUTH-02.

## Recovery

Prefer rolling back application code while leaving the additive guard in place: the previous valid document/CAS behavior remains compatible. Player data and new optional checkpoint fields can stay intact.

If the database guard itself needs recovery, `supabase/rollback/20261021090000_auth02_expedition_integrity.sql` contains the reviewed removal of only the trigger/check/functions, with no row/table deletion. For a hosted environment, copy the approved recovery SQL into a **new timestamped forward migration** and apply through CLI so history remains auditable. Do not silently edit production, erase migration history, run `db reset`, drop player tables or repair balances outside a reviewed recovery process. Local rollback/reapply and incompatible-data abort behavior were tested on disposable data.

## Manual hosted Google/persistence verification still required

Use dedicated test accounts A and B, recording only redacted identities and expected results:

| Action | Required oracle |
| --- | --- |
| Google consent → callback → first login A | Verified Auth UUID, exactly one profile and expedition; no email-based account merge |
| Returning login A | Same identity/name/preferences; no initial/default overwrite |
| Start Tokyo, complete airport | Server/database show exactly +30 XP, one first-clear ledger entry and one stamp |
| Start next stop, save one step, refresh | Resume target has current revision, `jp-directions`, step 1; no completion reset |
| Sign out and sign in again | Same XP/ledger/stamp and checkpoint; refreshed/cleared cookies behave correctly on the real HTTPS origin |
| Sign in B | Separate profile/progress; A attempt/checkpoint/selector access rejected without A data |
| Expired/invalid session | Protected operations rejected, no writes; verify actual GoTrue refresh/revocation behavior |
| Replay or retry completed encounter | Already-processed reward, no additional XP/stamp |
| Production low-risk smoke after approval | Compare UI/API against authoritative state for dedicated accounts, without destructive or high-concurrency operations |

## Security limitations and residual risks

- Service-role clients bypass RLS. Security depends on the trusted route invoking `auth.getUser()` and using that UUID for every player query. These boundaries are implemented/tested; a compromised server secret or future unscoped privileged query would still be privileged. Admin module has a `server-only` import; the configured secret was absent from all client static files.
- Direct anon/authenticated access to private tables is denied. Actual local PG/PostgREST checks cover grants and RLS separately. Remote smoke verified anonymous denial only; a real hosted authenticated user was unavailable.
- The Auth fixture verifies signed test sessions, not Google consent, GoTrue session refresh/revocation or hosted auth schema parity. No production authentication bypass or second password system was added. Hosted OAuth is explicitly NOT RUN.
- Older documents without activity ordering receive a validated best-effort legacy fallback; exact historic browser view cannot be reconstructed when it was never persisted. New actions use server commit revisions. Changed content versions are not auto-resumed; completed data is preserved.
- Per-player documents and append-only history grow over time. Guard validation and CAS retries have a cost; the existing 16-attempt conflict bound can return 409. Tested concurrency is correctness evidence, not an SLA or capacity benchmark.
- No rate-limiting/retention overhaul, economy, companions or new Japan chapter was added. D1 source/data remain historical only; there is no automatic legacy-account import.

See [implementation](AUTH-02-implementation-report.md) and [evidence](AUTH-02-test-evidence.md). Working branch: `codex/auth-02-player-ownership`; the AUTH-02 migration has not been applied remotely, and the branch has not been pushed or deployed.
