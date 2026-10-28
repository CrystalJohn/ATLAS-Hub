# GAME-01 T1 verification gate

Date: 2026-10-28. Base commit: `e1d07867e799e36bec6c550dca9e4f1dcf258dfe`.

**T1 local verification: PASS. RELEASE-GO: NO / BLOCKED.** No content publication or production integration is authorized by this result. Stop here for review.

## Acceptance and authority

The product owner explicitly answered **“Chấp nhận C0; triển khai T1 local”** in this conversation, accepting 12 DRAFT records/14 decisions, five floors with a two-decision Floor 5 boss, no XP and no publication. This satisfies the C0 acceptance prerequisite for **LOCAL-T1-GO: YES**. The historical C0 gate report's pending acceptance entry remains unchanged; this dated record supersedes that prerequisite only. Educator/adversarial/publication signoffs remain null.

All five GAME-01 architecture audit documents and all seven C0 files were checked against the previously inspected copies; hashes matched. Option B is implemented as an isolated native TypeScript module. The older review package does not override C0. In particular, both boss choices are selected then submitted atomically, and the boss is Floor 5, not a sixth floor.

## Files and behavior

| File | Purpose |
|---|---|
| `packages/tower-engine/src/index.ts` | Pure factory, deterministic sampling, four run states, draft selection, confirmation, grading, receipt replay, restart and presentation allowlist |
| `content/tower/types.ts` | Zod content/key schemas, command-result/state types and public presentation type; reuses existing travel `Copy` type |
| `content/tower/c0-fixture-adapter.ts` | Pure local-only parser/splitter of the existing 12-record JSON; preserves metadata/provenance/revisions and separates evaluation keys |
| `scripts/test-tower.mts` | 27 automated tests; loads docs fixtures only in test execution |
| `docs/game-01/t1/T1-state-transitions.md` | Diagram, boss truth table and replay semantics |
| `docs/game-01/t1/T1-T2-prerequisites.md` | Ownership, persistence, concurrency, exposure, learning and UX requirements |

There are no application imports of Tower fixtures or engine. No dependencies, package scripts, API routes, UI, migrations, auth or progression modules were changed. Node's built-in deterministic SHA-256 and existing Zod are used. Keys remain private evaluator inputs; the full internal definition is also not a presentation DTO because it contains authoring metadata. `present` emits only the current English question/options and selected IDs, with DRAFT/publication-ineligible flags. Candidate VI explanations are available only in post-submit receipts; this is not a learner locale feature.

Each run pins five records and choice orders. Identical seed/history produces identical selection. Restart requires a never-used identity within the retained lifecycle, resets to Floor 1 and selects a different record on every floor, using least-recently-seen alternatives before ties. It does not invent variants. Tiny pools eventually repeat and are not mastery evidence.

Unconfirmed choices never grade. Only evaluated confirmed errors produce FAILED. Invalid/unavailable-content commands return errors with the input state unchanged. Submission identity and semantic fingerprint replay original receipts before stale/terminal checks; different payloads conflict. New requests cannot grade terminal states. No engine input/output contains player progression, XP awards or stamp operations.

## Verification evidence

Commands ran from `D:\ATLAS-Hub` using installed dependencies. Logs are in `output/game-01/t1/`.

| Status | Actual command/check | Result / evidence |
|---|---|---|
| PASS | `node scripts/test-tower.mts` | 27 passed, 0 failed; `tower-tests.log` |
| PASS | `node scripts/test-profile.mts` | Existing profile fixture suite; `profile-tests.log` |
| PASS | `node scripts/test-supabase.mts` | Existing auth/adapter/API fixture suite; `auth-tests.log`; no live database/OAuth |
| PASS | `node node_modules/typescript/bin/tsc --noEmit --incremental false` | Exit 0; `typecheck.log` |
| PASS | `node node_modules/eslint/bin/eslint.js . --ignore-pattern dist --ignore-pattern .next` | Exit 0, zero errors, seven existing `no-img-element` warnings; `lint.log` |
| PASS | `node node_modules/eslint/bin/eslint.js scripts/test-tower.mts content/tower packages/tower-engine` | Exit 0, no warnings; `tower-lint.log` |
| PASS | `node scripts/run-framework.mjs build --webpack` | Optimized Next build, typecheck and page generation passed; `build.log` |
| PASS | SHA-256 comparison of initial tracked files plus existing audit/C0/plans/package | 345 checked, zero changed; `preservation.json`; tracked `git diff` empty |
| NOT RUN | Tower UI/API/Supabase integration, real concurrency, hosted auth, educator review | Outside T1 scope; no integration implemented |
| BLOCKED | Production release | C0 review/publication and T2/runtime gates remain open |

The first build attempt failed with Windows EPERM creating `.next/types/app/auth`; the same command passed after approved permission escalation. `pnpm.cmd --version` initially failed with a managed-runtime symlink EPERM, so verification invoked the existing Node binaries directly without installing dependencies. Initial Tower test assertions incorrectly compared separately created states by reference, and TypeScript found a widened status literal; both were corrected before the final passing checks. Lint's initial unused Tower import was removed. The final added invalid-lifecycle test was followed by fresh tests/typecheck/changed-file lint; it changes no build runtime source.

Coverage includes all five-floor success/failure paths; boss TT/TF/FT/FF; incomplete/unconfirmed/changed selections; invalid IDs/states/revisions/seeds; terminal behavior; restart identities; 32 sequential duplicates and lost-response receipt recovery; changed payload conflicts; deterministic sampling across 128 seeds covering all 12 records; immutable inputs/frozen outputs; JSON round-trip and manifest mismatch; malformed content/key schemas; public/private separation; and application-import/side-effect guards.

## Limits and review disposition

These are pure reducer tests, not durable transaction proofs. A result is a proposed state until T2 atomically stores it. State snapshots and evaluator keys must be server-owned; they are not accepted from a future client. Network and service failures have no transition method. T1 does not implement HTTP recovery, a working lesson deep link, accessibility, start/restart transport idempotency, persistent best score, reward policy or repeat practice after completion.

The only accepted keys are the C0 editorial candidates. Tests prove structure and deterministic comparison, not that an educator has validated the language or distractors. All authored source files and null signoffs remain unchanged. No commit, push or deployment was performed.
