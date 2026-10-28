# GAME-01 — Implementation Readiness

Dependencies, security posture, vertical slice, milestones, test oracles, and acceptance criteria for the recommended Option B integration (`GAME-01-proposed-integration-design.md`). **Nothing is implemented or approved yet.**

## 1. Security & deployment dependencies (verified status)

| Item | Status (evidence) | Impact on Memory Tower |
|---|---|---|
| AUTH-02 player ownership (ADR-003) | **Implemented locally, PROVISIONAL** — 18–19 real-PostgreSQL scenarios PASS (`docs/auth-02/AUTH-02-implementation-report.md`; `test-auth02-postgres.mts`) | Tower inherits a verified ownership model; no additional auth work |
| AUTH-02 guard migration `20261021090000` | **Applied to the linked hosted project** 2026-10-24 (`docs/auth-04/AUTH-04.1-migration-release-2026-10-24.md:10`); hosted `/api/health` 200 (L13) | Tower's ledger-based rewards are trigger-guarded in every environment |
| Real Google OAuth E2E (hosted) | **NOT RUN** (`AUTH-04.1-migration-release…:15`) | Blocks release, not development. All tower oracles can run on the local fixture stack |
| Production app deployment | **NOT RUN / NO-GO** (AUTH-04 final readiness, 2026-10-23) | Tower must not ship before the AUTH-04 gate clears |
| Environment separation | Preview and Production Vercel share **one** Supabase ref `jyzeararymcahczbovei`; `ATLAS_AUTH_ALLOWED_ORIGINS` absent hosted; `SUPABASE_SECRET_KEY` production-only (`AUTH-04.1-blocker-resolution.md:23`) | Tower testing beyond local must respect shared data; no staging isolation exists |
| Local development | Fully supported without hosted envs: `test:auth02` (embedded PG17+PostgREST fixture), `test:auth02:http` (real `next start`) | **All tower development and oracles are runnable locally today** |

**Dependency rules:**

- Tower **development, M1–M3** (below): may proceed locally now. No migrations are required (the expedition-document validator/trigger already admit an additive `tower` namespace and already guard any tower XP via the ledger).
- Tower **release (M4)**: must wait for the outstanding AUTH-04 blockers — hosted Google OAuth E2E, `ATLAS_AUTH_ALLOWED_ORIGINS` configuration, and production deployment verification. Reusing the existing AUTH-04 checklist is the correct vehicle; tower-specific items are listed in §5.
- **Forbidden without owner sign-off:** applying any new migration to the linked project; writing tower content counts as production content before the publication gate.

## 2. Vertical slice (H3)

The smallest slice that validates the architecture end-to-end:

**Scope:** Challenge mode only, Floors 1–5, a **reviewed subset of the 25-record bank** (≥1 variant per floor bucket, boss included), strict run reset on wrong answer, personal best persisted, victory screen with first-clear +40 XP **once**, replay with "already earned" state, mistake list (simple), entry card in the Japan travel hub, EN with VI strings for all tower copy.

Deferred until the slice is verified: Practice mode, tutorial S03, mistake review scheduling (`reviewDue`), history screen beyond PB, "report a problem" flow, run replacement/abandon UX polish, reduced-motion audit, six-learner usability study.

**Why this slice:** it exercises every architectural risk — new run state machine, CAS idempotency, ledger reward exactly-once, ownership, travel isolation, and the UI shell — with the least content and UI surface.

## 3. Incremental milestones (H4)

Architectural prerequisites are marked (P); gameplay items (G).

| Milestone | Goal | Scope | Dependencies | Acceptance criteria | Test oracles | Rollback |
|---|---|---|---|---|---|---|
| **M0' Basis confirmation (P)** | Confirm tree state | Owner approves this architecture + economy/content decisions | This audit | Signed decision; content publication gate started | — | — |
| **T1 Engine (P/G)** | Pure run logic | `content/tower/types.ts` + reviewed bank subset + `packages/tower-engine` | M0' | Truth table passes: correct→advance; wrong→FAILED at cleared count; restart→fresh runId, floor 1, retained PB/mistakes; boss all-or-nothing | `scripts/test-tower.mts` | Delete-only; nothing imports it yet |
| **T2 API + persistence (P)** | Server authority | `lib/atlas/tower-handlers.ts` + dispatch + `Expedition.tower?` | T1 | All POST paths: zod-strict, owner-scoped, receipt-idempotent; wrong-answer vs stale-revision distinguished; reward via `awardFirstClear` only | `test-tower-postgres.mts` (F06/F07/F13/F14/C05-C07/S03 analogues); existing suites green | Revert dispatch lines; document shape ignored by old code |
| **T3 UI slice (G)** | Playable tower | `TowerView` + travel-hub entry card + vi.ts strings | T2 | Full play/fail/retry/clear/return flow works by keyboard, touch, 320 px; exit returns to travel hub with resume intact | SSR smoke test; manual matrix; World Travel regression pass | Hide entry card (one-line) |
| **T4 Release gate (G)** | Ship readiness | AUTH-04 outstanding items + tower-specific checks (§5) | T3, AUTH-04 | Owner reviews evidence; separate release authorization | hosted E2E + accessibility pass | Do not deploy |

Each milestone has an independent rollback (git revert / feature is additive and hidden behind the entry card).

## 4. Verification strategy (H5)

Reuse the existing infrastructure (`test:auth02` fixture pattern — embedded PostgreSQL 17 + PostgREST, in-process `handleVercelAtlas`):

| Risk | Automated oracle (adapted from MVP plan, verified numbers) |
|---|---|
| State machine | F06: correct F1 → one clear, cursor 2, no XP. F07: wrong on F4 with 3 cleared → FAILED, best=max(old,3), run immutable |
| Evaluation | Every bank option; boss subparts graded independently (A correct + B wrong → run fails, A not relabeled) |
| Invalid/double submit | Replayed answer POST (same operationId+payload) returns committed outcome, zero new transition; malformed/extra-field bodies → 400 |
| Concurrency | C05: 32 concurrent final-boss answers → exactly one eligible +40 ledger entry / XP delta (mirrors existing 32-way test) |
| Persistence | F13: eligible full clear → terminal CLEARED, best 5, exactly one ledger record, single atomic commit; C06/C07: lost-response retry returns same receipt; storage failure → no partial state |
| Reward idempotency | F14: replay clear / bank revision bump / VI toggle → zero additional XP, stable key |
| Ownership | Cross-account run access → 404; spoofed selectors/XP claims → 400/401; RLS still denies anon/authenticated (reuse existing scenario) |
| World Travel isolation | After FAILED/CLEARED tower runs: travel completion/stamps/checkpoint bytes unchanged; "Resume adventure" still resolves the travel target |
| Localization | vi.ts coverage check for all tower strings (pattern: `test-chapter-ui.mts`) |
| Mobile / accessibility | Manual matrix: keyboard-only flow, ≥48 px targets, focus management, 320 px + 200% text, reduced-motion; contrast computed |
| Regression | Existing suites must remain green: `test:profile`, `test:auth`, `test:auth02`, `test:auth02:http`, evidence build gate |

## 5. Open items & assumptions

**Assumptions:** (1) the +40 XP first-clear and reward-policy version 1 are approved by the owner before T2 (the ledger key `(missionId='tower:narita-airport-survival', contentVersion=1)` becomes permanent once first awarded); (2) the reviewed bank subset passes the publication gate before T3; (3) tower data stays within the 64 KiB document budget for MVP (caps: history 20, mistakes 100 — enforced server-side).

**Unresolved questions:** whether towers should grant passport stamps (GAME-01 says no in MVP — confirm); whether tower entry should also appear on the Journey page; hosted OAuth E2E timing (AUTH-04).

**Blocking conditions:** do not award production XP, apply migrations, or deploy until the AUTH-04 release gate and owner content approval are complete.

## Decision gate

- **Architecture:** ESTABLISHED (Option B — see `GAME-01-integration-options.md`).
- **Implementation readiness:** **GO for local development** of the vertical slice (T1–T3) on this branch.
- **Release readiness:** **BLOCKED** pending AUTH-04 hosted verification (real Google OAuth E2E, `ATLAS_AUTH_ALLOWED_ORIGINS`, production deployment) and owner approval of economy + content.
