# GAME-01 T1/T2 Git checkpoint

2026-10-28. Dedicated local branch: `codex/game-01-t1-t2-checkpoint`, based on `e1d07867e799e36bec6c550dca9e4f1dcf258dfe` from `codex/auth-02-player-ownership`. This is a local version-control checkpoint, not publication or release. The commit containing this document is the checkpoint identity; no unrelated commit was amended or rewritten.

## Audited scope

The index was initially empty. Only two tracked files differed from HEAD: `lib/atlas/service.ts` and `lib/atlas/vercel-handler.ts`. Their changes are the Tower namespace/shared reward extraction and authenticated Tower dispatch. Existing AUTH work is already in the base history and is not amended. No AUTH docs, migration, database fixture, UI, package/dependency, environment, deployment configuration or production record is included as a new checkpoint change.

The checkpoint includes 10 implementation/test files:

- `content/tower/types.ts`
- `content/tower/c0-fixture-adapter.ts`
- `packages/tower-engine/src/index.ts`
- `lib/atlas/tower-state.ts`
- `lib/atlas/tower-handlers.ts`
- `lib/atlas/rewards.ts`
- `lib/atlas/service.ts`
- `lib/atlas/vercel-handler.ts`
- `scripts/test-tower.mts`
- `scripts/test-tower-postgres.mts`

It also includes the five GAME-01 architecture audit documents, seven C0 files (including the DRAFT JSON required by the test scripts), three T1 documents, five T2 documents, and this checkpoint record: 21 documentation files, 31 files total. C0 and architecture documents are included so the implemented contract and source provenance can be reviewed with the code; their historical gate reports remain dated records.

Excluded and preserved locally: the original `ATLAS-GAME-01-review-package.zip`; root `task_plan.md`, `findings.md`, `progress.md` audit scratch files; ignored `work/` plans; `output/game-01/` generated logs and synthetic database snapshots; `output/game-content/` exports; existing Playwright outputs; and all local environment/tool state. Fresh regression output from tracked `output/auth02/postgres-evidence.json` was copied into the local checkpoint output folder and the original restored from the unchanged base before staging. No raw database snapshots are staged.

## Verification rerun for this checkpoint

| Actual command | Result |
|---|---|
| `node scripts/test-tower.mts` | PASS 27 tests |
| `node scripts/test-tower-postgres.mts` | PASS 25 real local PostgreSQL/PostgREST/HTTP oracle entries, including concurrency and lost response |
| `node scripts/test-auth02-postgres.mts` | PASS 19 existing ownership/integrity/regression scenarios |
| `node scripts/test-travel.mts` | PASS existing travel regression |
| `node scripts/test-atlas.mts` | PASS existing mission regression |
| `node scripts/test-profile.mts` | PASS |
| `node scripts/test-supabase.mts` | PASS |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false` | PASS |
| `node node_modules/eslint/bin/eslint.js . --ignore-pattern dist --ignore-pattern .next` | PASS, zero errors and seven existing image warnings |
| `node scripts/run-framework.mjs build --webpack` | PASS optimized Next build and existing evidence gate |

Logs remain local in `output/game-01/checkpoint/`. The T2 fixture explicitly confirms that the normal handler without a test runtime reports UNPUBLISHED and rejects new Tower writes. The real Next route supplies no test runtime. The browser build was scanned for candidate IDs, draft importer/bank filename and accepted-choice metadata: no matches in `.next/static`. Production Tower rewards remain disabled; only isolated server-injected test policies award fixture XP. No passport stamp path is added.

The explicit file allowlist excludes credentials, `.env*`, `.vercel`, private keys, migration files and raw player data. Candidate files were checked for credential patterns and exact local secret values without logging those values. Source tests use synthetic Auth users and disposable local databases; they do not contain production records. The staged diff is reviewed before creating the commit.

## Push safety decision

**Do not push this checkpoint.** Read-only Vercel checks on 2026-10-28 confirm that Preview and Production `NEXT_PUBLIC_SUPABASE_URL` still refer to the same Supabase project. Only those two public URL values were read for comparison; no secret key value was retrieved. Environment metadata shows `SUPABASE_SECRET_KEY` only in Production, not Preview; that missing key does not establish safe database isolation.

Vercel's latest READY non-production deployment for this repository is `dpl_EeJxoZJfMg48Yr31KKsccdEfb8yJ`, source `git`, branch `codex/auth-02-player-ownership`, SHA `e1d07867e799e36bec6c550dca9e4f1dcf258dfe`. The deployment list also contains other Git branch previews. This establishes an active Git-to-Preview path; no branch-specific exemption for this new branch has been established. A new branch push must therefore be treated as capable of triggering Preview. Because isolation is disproved, no push is attempted. No deployment trigger, environment variable or hosted setting was changed to work around this boundary.

## Remaining T3 prerequisites

T3 needs separate authorization, an isolated local UI harness or independently approved published bank, C0 rules/confirmation/recovery UX, exact read-only lesson-fragment return, accessibility verification and receipt capacity/retention decisions. Independent bilingual educator/adversarial review and economy approval remain open. Real hosted OAuth and production verification remain separate release gates. Completed-run repeat/practice behavior must be explicitly designed. No T3 work is started by this checkpoint.

LOCAL-T1/T2 verification remains PASS; **RELEASE-NO-GO** and **PUSH BLOCKED by shared Preview/Production data** remain independent decisions.
