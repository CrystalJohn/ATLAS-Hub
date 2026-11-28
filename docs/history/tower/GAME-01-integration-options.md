# GAME-01 — Integration Options Analysis

Three realistic integration architectures evaluated against the verified ATLAS architecture (see `GAME-01-existing-architecture.md`). Scoring is evidence-based per criterion, 1 (poor) – 5 (excellent); scores are justified inline, not arbitrary.

## Option A — Extend the existing mission/encounter engine

Represent the tower inside the existing infrastructure: either as a Nature-Realm mission (`attempts` model) or as World Travel encounters (`TravelStep`/`TravelAction` extensions).

**Evidence-based assessment:**

- The attempt model is semantically incompatible: attempts only have `ACTIVE`/`COMPLETED` statuses; wrong answers produce feedback and allow unlimited retry (`lib/atlas/service.ts:130,133`). A restart-on-failure tower would need a `FAILED` terminal state, run-immutability after failure, and restart-at-floor-1 semantics — exceptions that cut across `evaluate()`, unlock rules, and the checkpoint model.
- The travel model requires extending two closed unions: `TravelStep` (`content/travel/types.ts:16`) and `TravelAction` (types.ts:23), plus `evaluateTravel` (`packages/mission-engine/src/travel.ts:19-55`). Tower floors are not travel scenes; this overloads a cohesive travel model (flagged smell: "overloaded mission models").
- First-clear semantics conflict: travel/missions award once per `(missionId, contentVersion)` on *completion*; the tower's first-clear is on *full clear* while failed runs and replays must be XP-free. Expressing "failed attempt consumed the encounter" in the travel model would corrupt the existing append-only `completedAt` guard (`20261021090000…sql:86-90`).
- The one global checkpoint pointer (`d.checkpoint`, `lib/atlas/checkpoint.ts:48-55`) would be contended between tower runs and travel/nature resume — GAME-01 explicitly requires the travel pointer to be preserved.

| Criterion | Score | Justification |
|---|---|---|
| Compatibility with existing architecture | 2 | Requires semantic exceptions in retry-always-correct models |
| Reusable code | 4 | Identity/CAS/ledger reused (as in every option) |
| Duplication | 3 | Some logic forced into exception branches |
| Coupling/cohesion | 1 | Travel unions + mission engine overloaded with tower concepts |
| Correctness of game-state transitions | 2 | Failure/reset semantics bolted onto retry-until-correct engine |
| Data integrity/security | 2 | Checkpoint pointer contention; guard-trigger interactions risky |
| Ease of testing | 2 | Exceptions multiply cases in existing tests |
| UX integration | 3 | Travel-encounter renderer doesn't fit tower screens anyway |
| Content scalability | 2 | TravelStep union grows unboundedly |
| Implementation effort | 2 | Refactors of shared engine needed |
| Runtime/build complexity | 5 | No change |
| Long-term maintainability | 2 | Every future mini-game would repeat the overload |
| Migration/regression risk | 2 | Touches core mission/travel paths used by all current players |

**Total: 32/65.** Rejected.

## Option B — Native feature module (distinct run-state model, shared services) ✅ RECOMMENDED

Add Memory Tower as a cohesive feature that follows the repo's established patterns: content in `content/tower/`, a pure evaluator in a small `packages/tower-engine/` (mirroring `mission-engine`/`english-engine`), orchestration in `lib/atlas/tower-*.ts` wired into the existing catch-all dispatch, presentation in `app/components/tower/`, and tower state as a **new `tower` namespace inside the existing expedition document** — no new table, no migration for the MVP (the DB validator permits extra document keys; XP still moves only through the guarded ledger).

Reuses as-is: identity gate + ownership (`vercel-handler.ts:27-31`), CAS storage loop (`service.ts:54-167`), `awardFirstClear`/`rewardFor` ledger (L22-29), DB integrity trigger, zod-strict/same-origin/16 KB conventions, `Bilingual`/`vi.ts` localization, existing UI patterns, and the `test-auth02-*` fixture stack.

| Criterion | Score | Justification |
|---|---|---|
| Compatibility | 5 | Follows every existing convention (content/engine/lib-atlas/components layering; ADR-001/003 patterns) |
| Reusable code | 5 | All security, persistence, reward, localization, test infra |
| Duplication | 4 | Only run-state machine is new; no duplicated reward/progress logic |
| Coupling/cohesion | 5 | Tower namespace is additive; zero edits to mission/travel paths except the dispatch table and `Expedition` type (one optional field) |
| Correctness of transitions | 5 | Clean 8-state run contract; stale-revision vs wrong-answer semantics cleanly separated |
| Data integrity/security | 5 | Rewards via existing ledger + trigger; ownership via existing gate; client can't claim anything |
| Ease of testing | 5 | Pure evaluator (like `evaluateTravel`) + in-process handler tests + real-PG fixture reuse |
| UX integration | 4 | Entry card in existing travel hub; new screens composed from existing patterns |
| Content scalability | 4 | Tower bank schema separate; versioned like existing content |
| Implementation effort | 4 | Package's 16–23 person-day estimate plausible; smallest new surface of all options |
| Runtime/build complexity | 5 | No new deps, no build changes |
| Long-term maintainability | 4 | Tower evolves independently; a 3rd mini-game can later inform extraction |
| Migration/regression risk | 5 | No changes to existing routes/state; additive `tower?` field ignored by current code |

**Total: 56/65.**

**Migration note:** no migration is required for MVP because the validator `atlas_valid_expedition` only constrains known keys (xp/ledger/completed) and the trigger only guards ledger/completed/stamps — an optional `tower` key passes. A **future** migration would only be needed if tower data were normalized into tables (not justified: read/write volume per run is a handful of CAS updates; the 64 KiB budget guards document growth).

## Option C — Shared game-engine extension (extract generic primitives)

Extract a generic "game run" framework (runs, floors/stages, evaluation hooks, reward policies) serving World Travel, Nature missions, and the tower.

**Assessment:** The two existing consumers have irreconcilably different failure models (retry-until-correct vs fail-terminal) and different progression shapes (sequential missions; encounter graphs; floor ladder). A generic abstraction today would be built from one data point (tower) against two hard-coded models, adding a layer of indirection over ~200 lines of actual shared logic (CAS loop + ledger). ADR-001/ADR-003 show the repo's real shared substrate is already extracted: storage, identity, ledger, checkpoint. Extraction now is speculative; the smell list explicitly warns against "excessive generic abstractions" and "new packages with no justified ownership boundary."

| Criterion | Score | Justification |
|---|---|---|
| Compatibility | 2 | Introduces a layer that doesn't exist; migration of working models required |
| Reusable code | 4 | Same substrate reused |
| Duplication | 4 | Long-run lower, but duplicated *today* during migration |
| Coupling/cohesion | 3 | New shared package couples all games to one contract |
| Correctness | 3 | Generic engine must express both failure models — leaky |
| Data integrity/security | 4 | Same substrate |
| Ease of testing | 3 | Abstraction tests + per-game tests |
| UX integration | 3 | No UX benefit |
| Content scalability | 4 | Good in theory |
| Implementation effort | 1 | Extraction + migration + regression on live features |
| Runtime/build complexity | 4 | No change |
| Long-term maintainability | 3 | Pays off only at 3+ games with compatible shapes |
| Migration/regression risk | 1 | Touches all existing player flows |

**Total: 39/65.** Rejected for now; revisit if a third mini-game with a compatible run shape appears.

## Option D (observed alternative) — Content-only reuse of existing step kinds

Because `TravelAction` includes `compose`/`order` (selection-style steps), a tower *could* be authored as travel encounters with zero runtime-code change. Rejected: it cannot express run failure/reset, personal best, practice mode, or reward-once-on-full-clear — i.e., it fails most Core Gameplay requirements. Mentioned only to show the zero-touch boundary was tested.

## Strongest rejected alternative

**Option A** loses primarily on *correctness of game-state transitions* and *coupling*: the existing engine's retry-until-correct contract and the travel model's closed unions would force exception branches through the most safety-critical paths (reward, checkpoint, completion guards), while Option B achieves the same reuse of every shared service with a strictly additive footprint.

## Recommendation

**Option B — Native feature module.** It is the simplest option that meets all verified requirements: new namespaced run-state model where the failure model demands it (tower runs), full reuse of the authoritative substrate (identity, CAS document, ledger rewards, DB guards) where the systems agree, and zero modification of World Travel / Nature Realm behavior.

## Decision gate

**ESTABLISHED** for the architecture choice (Option B) — supported by direct inspection of `lib/atlas/service.ts`, `checkpoint.ts`, the migrations, and the UI layer. **PROVISIONAL** for release readiness — hosted OAuth verification and deployment checks (AUTH-04) remain open and are prerequisites for any release, per `GAME-01-implementation-readiness.md`. Product-owner approval is still required for content (+40 XP, question bank) before implementation.
