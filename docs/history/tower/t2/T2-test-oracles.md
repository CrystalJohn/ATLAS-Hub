# T2 verification oracles

2026-10-28. The executable source is `scripts/test-tower-postgres.mts`. Machine evidence is `output/game-01/t2/postgres-oracles.json`: each major oracle records initial SQL state, action, expected result, observed SQL state, revision, document bytes and SHA-256. Assertions compare actual document fields and revisions, not HTTP statuses alone.

The suite uses the existing `scripts/auth02/local-stack.mts`: real native PostgreSQL + PostgREST, existing migrations applied only to a disposable DB, real loopback HTTP Tower requests, synthetic users and HMAC-verifying Auth fixture. It does not exercise hosted Supabase Auth or Google OAuth. Exact PostgreSQL version/migrations are recorded in evidence `info`. SQL fixture edits are explicitly test-only.

| Oracle | Initial/action → expected and observed (PASS) |
|---|---|
| 01 | Old document without Tower; disabled runtime then isolated start → unavailable production path unchanged; test start pins five records |
| 02 | Discard evaluator memory and rebuild; GET → same identity, question/options and no database write |
| 03 | Confirm correct F1 and retry same operation at stale revision → one floor/receipt/revision |
| 04 | Stale, malformed, unconfirmed, changed-payload and ownership/XP injection → error and identical DB state |
| 05 | Confirm a known wrong choice → FAILED, precise mistake, retained PB |
| 06 | Restart failed run twice; retry old wrong operation → fresh identity/F1 once; historical replay does not change it |
| 07 | 32 simultaneous HTTP duplicates → one CAS winner, 31 replays, exactly one DB advancement |
| 08 | Competing IDs at one cursor → one 201, one 409, one committed receipt |
| 09 | Force first CAS collision → reread; second CAS commits once |
| 10 | Force 16 collisions, then storage exception → 409/503, unchanged DB and no uncommitted state advertised |
| 11 | Destroy real HTTP response after commit; resend original → stored outcome recovered, one DB transition |
| 12 | Bob submits Alice run; selector spoof; invalid auth → owned 404/400/401, Alice unchanged |
| 13 × 3 | Partial boss is rejected without write; FT/TF/FF separately → FAILED, four floors, correct subparts remain correct |
| 14 | TT → COMPLETED, best 5, no XP/stamp/ledger; retry without evaluator still returns committed outcome |
| 15 | Concurrent Bob Tower confirmation and airport sign inspection → both updates survive CAS |
| 16 | Tower fail/restart while travel checkpoint exists → travel/checkpoint equal initial snapshots |
| 17 | Real SQL transaction update then ROLLBACK → complete document restored |
| 18 | Temporary local PostgreSQL trigger rejects submit commit → 503, no receipt/score/reward write |
| 19 | Revision-2 evaluator against pinned revision-1 run → CONTENT_MISMATCH, no regrade/reroll |
| 20 | 32 boss submissions under test-only 7 XP policy → one lifetime ledger entry, DB XP exactly 7 |
| 21 | Test-only admin clears challenge slot while preserving ledger/completion; second clear under bank 2/amount 9 → XP remains 7, one ledger row |
| 22 | Artificial existing padding exceeds budget; submit → RECOVERY_CAPACITY, all old data retained |
| 23 | Corrupted stored cursor fixture → INVALID_TOWER_STATE, no further mutation |

There are 25 recorded oracle entries because oracle 13 runs three wrong-answer combinations. These are local correctness observations, not load/performance or hosted-production guarantees. Creation replay is also verified in oracle 06; new submission receipts are checked before stale/terminal/content validation. Public browser bundle scanning found no candidate IDs, fixture importer, bank filename or accepted-choice metadata in `.next/static`.

## Commands and results

| Command | Result |
|---|---|
| `node scripts/test-tower.mts` | PASS 27 before integration and PASS 27 regression |
| `node scripts/test-tower-postgres.mts` | PASS 25 recorded oracles; final log `postgres-final.log` |
| `node scripts/test-profile.mts` | PASS fixture suite |
| `node scripts/test-supabase.mts` | PASS adapter/auth fixture suite |
| `node scripts/test-auth02-postgres.mts` | PASS 19 native PostgreSQL/PostgREST scenarios, including full Tokyo/Nature regression and RLS/integrity constraints |
| `node scripts/test-travel.mts` | PASS legacy D1 travel regression |
| `node scripts/test-atlas.mts` | PASS legacy D1 mission regression |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false` | PASS |
| `node node_modules/eslint/bin/eslint.js . --ignore-pattern dist --ignore-pattern .next` | PASS zero errors, seven pre-existing image warnings |
| `node scripts/run-framework.mjs build --webpack` | PASS optimized Next build, evidence gate, typecheck and static generation |

Logs live under `output/game-01/t2/`; no dependencies were installed. The AUTH-02 run generated its tracked evidence file; the fresh evidence was copied into T2 and the original restored byte-for-byte. The source preservation audit reports only intentional pre-existing-file changes: service type/shared writer import, authenticated dispatch, and T1 import-boundary assertion adapting to the authorized backend integration. C0/audit/T1 docs and pure engine remain unchanged.

Development failures resolved before final verification: Node strip-only mode rejected constructor parameter properties (replaced with ordinary fields); a capacity test accidentally used the revision-2 evaluator for a revision-1 run (fixture corrected). Review found that a mutable error snapshot could advertise an uncommitted transition (fixed with an isolated snapshot and tested). No migration or external configuration repair was needed.
