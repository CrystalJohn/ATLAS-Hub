# GAME-01 T2 verification gate

**LOCAL-T2-PASS · RELEASE-NO-GO.** 2026-10-28, base HEAD `e1d07867e799e36bec6c550dca9e4f1dcf258dfe`. Backend implementation and isolated verification only. Stop at this gate; T3 has not started.

## Preflight and authoritative decisions

Revisited all five GAME-01 architecture audit documents, the seven C0 files including the structured bank, all three T1 documents, the actual engine/adapter/types/tests, and the current server/storage/Auth/SQL fixtures. Re-ran T1 **before source edits: 27/27 PASS**. The existing working tree contained untracked architecture/C0/T1/output work; it was preserved. No C0 violation requiring an engine rewrite was found. The pure engine and authored content were left unchanged.

C0 controls the scope: 12 DRAFT records/14 bank decisions, five floors total, two boss decisions confirmed in one atomic submission. Pinning, immutable transitions, terminal failure, per-part truth and duplicate operation semantics remain T1 behavior. No educator review or content publication is implied. The older package's +40 XP and superseded content do not control this implementation.

## Exact source changes

| File | Change |
|---|---|
| `lib/atlas/tower-handlers.ts` | New authenticated-dispatch target: strict Tower requests, read/resume, start/restart/submit, server identity/seed, operation recovery, CAS, projection and disabled content/reward boundary |
| `lib/atlas/tower-state.ts` | New persisted namespace schemas, run/receipt invariant checks, empty backward-compatible state |
| `lib/atlas/rewards.ts` | Existing first-clear writer extracted unchanged for reuse; no duplicate ledger |
| `lib/atlas/service.ts` | Optional `Expedition.tower` type and shared reward writer import; existing gameplay branches unchanged |
| `lib/atlas/vercel-handler.ts` | Existing verified-user/same-origin dispatcher now routes `tower` paths; optional server-owned isolated test runtime dependency |
| `scripts/test-tower-postgres.mts` | New real local PostgreSQL/PostgREST + HTTP scenarios and SQL oracle evidence |
| `scripts/test-tower.mts` | Adapt T1's import isolation assertion to allow authorized server integration while continuing to reject DRAFT-bank imports in application modules |

Five new deliverables are this report, `T2-api-contract.md`, `T2-state-persistence.md`, `T2-test-oracles.md`, and `T2-T3-prerequisites.md`. Session plans are isolated in `work/game-01-t2/`; test logs/evidence are in `output/game-01/t2/`. No package/dependency, UI, migration, auth configuration or production setting was changed.

## Reused capabilities and behavior

Verified Supabase Auth ownership, the existing catch-all route, no-store responses, strict Zod/origin/body conventions, the single expedition JSON and `supabaseExpeditionStore` revision CAS are reused. Existing AUTH-02 RLS/integrity guards and test stack remain intact. Tower commits state/receipt/mistakes/PB/completion together; test-only rewards use the same guarded ledger commit. There is no schema impact beyond an additive JSON property and no need for a migration.

The ordinary Next route has no approved runtime: availability is UNPUBLISHED and new writes fail safely with CONTENT_UNAVAILABLE. DRAFT content is loaded only by test scripts and injected as a private server dependency. Browser `.next/static` scanning found no fixture importer, candidate IDs, bank filename or accepted-answer metadata. Actual published-bank loading/archival and learner UI are not implemented.

Idempotency includes start/restart, historical submit replay after restart, replay at stale revisions and recovery with the evaluator unavailable. Same operation plus changed payload conflicts. Different operations at one cursor race under CAS; one winner commits. A wrong known answer is a successful FAILED gameplay result; malformed/stale/content/transport/storage errors are separate and do not cause gameplay failure. Draft selection is ephemeral; both boss answers must be present at confirmation.

All receipts are retained within the conservative 64 KiB/1,000-operation limit; exceeding it blocks a new commit without deleting recovery data. Full retention/archival optimization is a pre-release follow-up, documented in state persistence. No automatic reset or permanent World Travel/XP loss occurs.

## Verification and classifications

| Area | Classification | Evidence / result |
|---|---|---|
| T1 regression | ESTABLISHED locally | 27 tests pass before edits and after integration |
| T2 authenticated API | ESTABLISHED locally | 25 recorded real HTTP/PostgreSQL oracles; strict payloads, owner isolation, recovery and public projection |
| Persistent runs and boss | ESTABLISHED locally | SQL snapshots prove start/resume, one-step advancement, failure/restart, stable pins, all four boss outcomes and rollback |
| Account isolation | ESTABLISHED locally | Two synthetic verified Auth users, foreign run 404, selectors rejected; existing AUTH-02 RLS/grants tests pass |
| Concurrency | ESTABLISHED locally | 32 simultaneous duplicate requests → one DB transition; competing IDs, forced CAS retry/exhaustion, lost HTTP response and concurrent travel updates pass |
| Reward idempotency | EXPERIMENT, isolated policies only | 32 full-clear requests yield one test 7 XP ledger entry; bank revision 2/amount 9 cannot farm it; real policy remains DISABLED |
| World Travel / mission regression | ESTABLISHED locally | Existing AUTH-02 19 PostgreSQL scenarios, travel and mission D1 suites pass; Tower fail/restart preserves checkpoint/travel snapshots |
| T3 integration readiness | PROVISIONAL | Backend contract available for separately authorized isolated UI work; published bank, exact lesson resolver, accessibility and UX remain open |
| Hosted OAuth/production release | INSUFFICIENT | Not exercised; independent C0 content/economy and inherited AUTH-04 gates remain open |

Actual commands and logs:

```text
node scripts/test-tower.mts                                      PASS 27
node scripts/test-tower-postgres.mts                             PASS 25 oracles
node scripts/test-profile.mts                                    PASS
node scripts/test-supabase.mts                                   PASS
node scripts/test-auth02-postgres.mts                            PASS 19 scenarios
node scripts/test-travel.mts                                     PASS
node scripts/test-atlas.mts                                      PASS
node node_modules/typescript/bin/tsc --noEmit --incremental false PASS
node node_modules/eslint/bin/eslint.js . --ignore-pattern dist --ignore-pattern .next
                                                               PASS, 0 errors / 7 existing image warnings
node scripts/run-framework.mjs build --webpack                   PASS
```

Final changed-source lint also passes without warnings. The build includes the existing evidence publication gate, TypeScript and Next page generation. Database evidence records PostgreSQL 17.10, PostgREST 12.2.3 and the four existing migrations. Each major oracle includes initial/action/expected/observed state in `postgres-oracles.json`; detailed scope and commands are in the test-oracle document. These tests did not connect to hosted player records.

## Remaining limits and disposition

The existing DB trigger protects ledger/progression integrity but does not independently validate every Tower transition against keys. Application state parsing and server-only evaluation enforce the Tower-specific contract. No adversarial service-role compromise or production performance claim is made. Error snapshots are copies of persisted state, not computed uncommitted state. Start/restart acknowledgement is a server-recorded version claim; T3 must actually present the rules and source learning material.

Receipt capacity can eventually prevent new challenge writes; no silent eviction is used. Completed-run repeat/practice is intentionally not added to the T1 lifecycle. The test-only second-clear reward oracle uses an explicit SQL fixture reset of the run slot, preserving completion/ledger, rather than adding an unapproved player endpoint. Reward policy revisions never create a new entitlement; real amount, retroactive/grandfathering behavior and stamps require separate owner decisions.

No Tower UI, production migration, hosted OAuth change, production player write, content publication, commit, push or deployment occurred. **LOCAL-T2-PASS is independent of RELEASE-NO-GO.**
