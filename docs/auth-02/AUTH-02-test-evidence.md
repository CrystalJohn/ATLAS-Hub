# AUTH-02 test evidence

Date: 2026-10-22. Outcome: **PROVISIONAL**. Core ownership/reward/checkpoint guarantees are verified on real local PostgreSQL; hosted Google/GoTrue verification is **NOT RUN**.

## Test topology and boundaries

- Native PostgreSQL 17.10, Windows x64, real PostgREST 12.2.3 and the real Supabase JavaScript SDK.
- Every database suite creates a dedicated cluster on loopback, seeds synthetic Auth UUIDs, applies the version-controlled SQL and shuts down its owned processes. No production connection is accepted by the test helper. The fixture `auth.users` table supplies the UUID/FK contract; it is not a full GoTrue installation.
- The Auth HTTP fixture checks HMAC signatures, known test subjects, expiry and revoked fixture sessions. It is not Google OAuth. Application routes still call the actual `auth.getUser()` SDK method; there is no test-auth bypass in production code.
- The HTTP suite starts the built production Next server **without `VERCEL`**, uses HttpOnly Supabase-format cookies, and exercises the real route handlers through SDK → PostgREST → PostgreSQL.
- Historic D1 tests are supplemental gameplay regressions only. Their concurrency results are not used as PostgreSQL evidence.

## Automated results

| Check | Status | Evidence |
| --- | --- | --- |
| Native PostgreSQL ownership/integrity suite | PASS — 18 scenarios | [postgres-evidence.json](../../output/auth02/postgres-evidence.json) |
| Built Next HTTP/cookie integration | PASS | [http-evidence.json](../../output/auth02/http-evidence.json) |
| Profile SDK/API validation fixture | PASS | `node scripts/test-profile.mts` |
| Existing profile HTTP fixture regression | PASS | `node scripts/test-profile-http.mts` with owned `profile-preview` running; in-memory provider/storage, supplemental only |
| Supabase SDK/API auth/origin/reward fixture | PASS | `node scripts/test-supabase.mts` |
| Tokyo pilot full regression | PASS | `node scripts/test-travel.mts`; real PG suite also completes all four encounters |
| Forest progression full regression | PASS | `node scripts/test-atlas.mts`; real PG suite also completes all three missions |
| English chapter and evidence | PASS | `node scripts/test-chapter.mts`, `node scripts/test-evidence.mts` |
| Vocabulary save/isolation/concurrent reward | PASS | `node scripts/test-vocabulary.mts` |
| Guidance and interest recommendations | PASS | `node scripts/test-guidance.mts`, `node scripts/test-interests.mts` |
| SSR/localization | PASS | `node scripts/test-chapter-ui.mts`; SSR uses an explicit account projection stub, not authentication evidence |
| TypeScript | PASS | `tsc --noEmit`; production build also typechecks |
| Production build | PASS | `pnpm.cmd build` uses Next 16.3.4 Webpack plus evidence publication gate; Turbopack CSS worker failed locally on this Windows host |
| AUTH-02 runtime/new-test lint | PASS — zero errors | [targeted lint](../../output/auth02/lint-targeted.json) |
| Full repository lint | PASS with 7 warnings | 0 errors across 181 files. Remaining warnings are existing raw `<img>` usage; [full report](../../output/auth02/lint-full.json), [summary](../../output/auth02/lint-summary.json) |
| Browser client secret scan | PASS | [client-secret-scan.json](../../output/auth02/client-secret-scan.json), configured server secret absent from all 15 client static files |
| Google OAuth/GoTrue real account E2E | NOT RUN | User confirmed no staging project/dedicated Google account |
| Hosted Auth refresh/revocation behavior | NOT RUN | Signed Auth fixture does not establish hosted Auth behavior |
| Production gameplay/concurrency | NOT RUN | Not authorized/appropriate for destructive or concurrent testing |

## Persistence and identity oracle

| Scenario | Oracle | Observed |
| --- | --- | --- |
| First verified test login | Exactly one profile and expedition | 24 concurrent session calls; SQL count = 1 each |
| Returning login | Same UUID/profile, no defaults overwrite | Name, B1/interests retained; later 12 concurrent returning sessions preserve renamed profile and full expedition bytes/revision |
| Missing/invalid/expired session | Protected operation rejected; no player write | 401; no first-login profile created; cross-origin POST 403 |
| Save/load progress | Authoritative DB matches server projection | Combined Forest + Tokyo: 370 XP, level 3, 7 ledger entries, 3 completed Forest missions, 5 passport stamps |
| Another account | No profile/progress/attempt/checkpoint disclosure or mutation | B starts separately; foreign attempt/reward 404, foreign checkpoint/selector/profile identity injection 400; A row unchanged |
| Checkpoint prerequisites | Only valid owned unlocked reference | Unobserved English phase 400; locked Tokyo stop 403 |
| Resume | Latest valid target and current canonical step | Travel `jp-directions`, step 1 / `ask-route`; same target after fresh test session |
| Stale checkpoint | Cannot overwrite newer commit | 409; two concurrent selections yield one 201 and one 409 |
| Completed latest adventure | Recover newest still-unfinished adventure | Server revision ordering returns the earlier pending Lake; delayed old completion leaves it unchanged |
| Invalid/deleted/legacy checkpoint | Safe recovery without resets | Valid owned legacy fallback; invalid reference marked recovered; changed content version returns null; old completed Forest and XP retained |
| First clear | Exact published award once | Forest 30 XP once; Tokyo airport 30 XP and one stamp once |
| Duplicate/concurrent completion | No additional first-clear reward | 32 concurrent Forest submits: one AWARDED, 31 ALREADY_PROCESSED, total 30 XP. Separately 32 Tokyo completions: total 30 XP and one stamp |
| Database commit failure | No partial authoritative update | Deferred trigger fails at COMMIT: API 503, document and revision byte-equivalent to before; retry awards 30 once |
| Response lost after commit | Safe retry against authoritative ledger | Transport response intentionally lost after actual PG update; next request returns ALREADY_PROCESSED, total XP30/one ledger entry |
| Direct privileged invalid write | SQL rejects invalid owner/revision/reward | 23514 for owner change/revision jump/prefunded genesis/duplicate or removed ledger/XP without ledger/completion or stamp removal; FK orphan 23503 |
| Direct browser table access | Denied even with another player selector | Actual PostgREST anon/authenticated GET/PATCH denied. Independent RLS test with temporary SELECT grant returns zero rows, then revokes grant |
| Migration/recovery | No historical progression overwritten | Legacy row bytes/revision unchanged; incompatible duplicate ledger aborts migration transaction unchanged; explicit local rollback/reapply preserves all player rows |

## Browser evidence

The in-app browser operated the actual Next dev app on the real PG/PostgREST stack. Synthetic signed-fixture sessions were used; **the Google button/consent flow was not used or certified**.

1. Created/saved `AUTH02 Browser Alice` profile and Travel interest.
2. Entered Japan/Tokyo, opened airport encounter and read the signs.
3. Refreshed; Resume adventure restored airport step 1 (`ask-staff`).
4. Completed the airport encounter: navbar 30 XP, one server-recorded reward and stamp.
5. Opened Shibuya and read its map, saving step 1 (`ask-route`).
6. Used Account → Sign out; app showed the Google sign-in gate.
7. Issued a new signed fixture session, clicked Resume: restored Shibuya step 1, same 30 XP.
8. Compared authoritative SQL snapshots before logout and after login: identical player revision/document-derived state.
9. Switched to Bob, completed his naming form: 0 XP, no Alice checkpoint and no Resume button. Browser error console was empty.

Evidence: [browser run](../../output/auth02/browser-evidence.json), [before logout](../../output/auth02/browser-before-logout.json), [after login](../../output/auth02/browser-after-login.json), [screenshot](../../output/auth02/resume-after-login.jpg).

## Low-risk remote smoke

Only zero-row schema/grants reads were performed on the configured ATLAS project: server probes for expedition and profile columns returned 200; anonymous reads of both returned 401 / 42501. No production player row was read or written. [Evidence](../../output/auth02/remote-schema-smoke.json).

Read-only CLI migration history showed baseline versions 20261020090000, 20261020110000 and 20261020130000 applied; 20261021090000 is local-only/pending remotely. No production migration, reward test, account creation or deployment was performed.

## Failures resolved during implementation

- Native PostgREST initially lacked DLLs on PATH; the helper adds the installed PostgreSQL native bin/lib paths only to the owned child process.
- PostgreSQL bigint revisions initially appeared as strings in the SQL test oracle. Normalized them to numbers and asserted actual constraint error codes before accepting invalid-write tests.
- Existing in-memory profile fixtures assumed every POST was merge-upsert; updated them to model ignore-duplicates initialization correctly.
- Vocabulary's old whole-response equality oracle did not allow the new transport revision fields. It now explicitly permits only those revision changes and still compares progression, mastery and resume target.
- Full repository lint now passes with zero errors. Seven image optimization warnings remain; no lint rules were suppressed.
- Default Turbopack build failed on this Windows host while spawning its CSS/PostCSS worker, including outside the sandbox. The supported Next Webpack build completed compilation, TypeScript, static generation and trace collection; the project build script now selects Webpack explicitly.

## Reproduce on Windows

```powershell
pnpm.cmd install --frozen-lockfile
node scripts/setup-auth02-tools.mjs
pnpm.cmd test:auth02
pnpm.cmd build
pnpm.cmd test:auth02:http
pnpm.cmd test:auth:http
```

For browser testing: `pnpm.cmd preview:auth02`; use the printed fixture login links. Other platforms need a compatible installed `ATLAS_POSTGREST_BIN`; this run verifies Windows only. Generated native clusters/tool downloads stay under ignored `.sites-runtime/`; evidence is under `output/auth02/`.
