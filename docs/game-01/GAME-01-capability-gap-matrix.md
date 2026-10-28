# GAME-01 — Capability Gap Matrix

Maps Memory Tower requirements (from the GAME-01 review package, `ATLAS-GAME-01-review-package.zip` — **design inputs, explicitly PROVISIONAL and not implementation-approved**) onto verified existing capabilities. Reuse classifications: **as-is / small extension / significant refactor / missing / incompatible**.

Sources: R = research, GDD = game design doc, LD = learning design, TF = technical feasibility, MVP = mvp plan, UX = ux-ui spec (all under the extracted package).

## 1. Core Gameplay

| Requirement | Existing capability | Reuse potential | Architectural gap | Evidence |
|---|---|---|---|---|
| 5-floor tower, 1 question/floor, F5 boss (2 parts, 1 submit) | Missions have step/phases; travel encounters have `steps[]` | **Missing** as a run concept; nothing models a floor ladder | New run-state model needed; travel `TravelStep` union is closed and semantically travel-specific | `content/travel/types.ts:16,23`; `lib/atlas/service.ts:78-102` |
| Two-stage select → explicit "Check answer" submit | Mission subject answers POST once (`submit`); travel actions POST per step | **As-is** (pattern) | None — same one-shot POST shape, zod-strict body | `Game.tsx:89-92`; `service.ts:126-137` |
| Advance on correct | Travel: `evaluateTravel` advances `step` cursor | **Small extension** | Tower cursor lives in tower run, not travel encounter progress | `packages/mission-engine/src/travel.ts:19-55` |
| **Reset run on wrong answer** | **Nothing.** All existing flows are retry-until-correct; wrong answers give feedback + another try | **Incompatible** with mission/encounter attempt model | Genuinely new: terminal `FAILED` status, immutable run, restart at floor 1. Attempt model has only `ACTIVE`/`COMPLETED` | `service.ts:130,133`; `Attempt` type L16 |
| Question sampling (1/floor bucket, freeze bank+evaluator revisions at run start, LRU, stored sequence, refresh never rerolls) | Content versioning exists per mission/encounter (`version:1` fields) | **Small extension** | No sampling machinery; no per-run content pinning. New pure function in a tower engine | `content/travel/japan.ts:20-32`; `checkpoint.ts:64` (version-mismatch recovery pattern) |
| Boss floor (2 parts, all-or-nothing, per-part feedback) | REASONING missions require 2 selections (answer + 2 evidence) | **As-is** (pattern) | Part-scoped evaluation logic is new; evaluation itself trivial | `Game.tsx:125` |
| Personal best (floors cleared), run history (cap 20) | No per-activity best/history; journal shows per-item review state | **Missing** | New namespaced state in the expedition document | `service.ts:18` (document shape) |
| No timer / no speed bonus | Nothing to reuse or conflict | **As-is** (absence) | None | GDD |
| Never fail on network/revision/content errors (only a committed wrong answer fails a run) | Existing 409 `STALE_REVISION` → client "reload" UX; retry loop in service | **As-is** (pattern) | Tower must distinguish stale-revision from wrong-answer — new, but consistent with existing error taxonomy | `service.ts:67,168,170-172` |

## 2. Learning

| Requirement | Existing capability | Reuse potential | Architectural gap | Evidence |
|---|---|---|---|---|
| Vocabulary recall / sentence recognition / contextual items | Travel steps already do vocabulary + reading + situational choices; `evaluateEnglishItem` grades per band | **As-is** (content + evaluation pattern) | New question bank authored against tower objectives (existing `jp-arrival` content is source material, not the bank) | `content/travel/japan.ts`; `packages/english-engine/src/chapter.ts:6-29` |
| Learning objectives per item | `LearningObjective` type in travel content; `skill:'reading'|'vocabulary'` | **Small extension** | Tower uses 5 new objective IDs (AIR-*) — same shape | `content/travel/types.ts:12` |
| Server-only answer keys | Keys stripped from client payloads; `travel-rules.ts` server-only | **As-is** | Tower bank needs public-projection vs server-key split (same convention) | `content/missions/index.ts:35-36`; `lib/atlas/travel-rules.ts:3-8` |
| EN/VI feedback, VI on-demand | `Bilingual`/`UiText` + `vi.ts` dictionary + `vi-copy` pattern | **As-is** | New copy strings; theGAME-01 review gate applies | `Bilingual.tsx:20-31`; `Game.tsx:128` |
| Mistake records (per item revision, per objective) | `englishReview` projection from submissions; `englishEvidence` dedup keys | **Small extension** | Tower mistakes must store question revision + chosen option + objective — a new namespaced structure | `service.ts:31-34,145-147` |
| Practice mode (3-item corrective round, assistance recorded, no score) | Journal "Retry my tricky questions" replays wrong items (`reviewItems`) | **Small extension** | Practice run shape differs from challenge run; same run contract with different rules | `Game.tsx:135` (journal retry); UX S13 |
| Review scheduling (24h/~7d proposals) | Nothing | **Missing** (proposed, non-MVP-adjacent) | Compute at visit from stored mistakes; no background jobs | LD; TF `reviewDue` |
| Difficulty calibration flags | Nothing | **Missing** (post-MVP) | Counts only, no automatic behavior | LD |
| Content publication gate (educator review, signed manifest) | `validateEvidence` + coverage snapshot as build gate | **As-is** (pattern to replicate for tower content) | New validation script/checklist for tower bank | `content/evidence/validate.ts:2-50`; `scripts/validate-evidence.mts` |

## 3. Player Progression

| Requirement | Existing capability | Reuse potential | Architectural gap | Evidence |
|---|---|---|---|---|
| +40 XP first Challenge clear, exactly once | `awardFirstClear` + `ledger` + `rewardFor` (`AWARDED/ALREADY_PROCESSED/NOT_ELIGIBLE`) | **As-is** — the core reuse | Ledger dedup keys on `(missionId, contentVersion)`; `missionId` is a free string so `tower:narita-airport-survival` fits. **Caution:** `contentVersion` must be a stable reward-policy version, never the bank revision | `lib/atlas/service.ts:22-29,88-89`; DB trigger `20261021090000…sql:74-81` |
| Reward idempotency under concurrency | CAS loop + ledger uniqueness + DB trigger (XP delta == ledger delta); 32-way concurrent test proves exactly-once | **As-is** | None | `service.ts:54-167`; `test-auth02-postgres.mts` scenarios |
| Ownership (run belongs to authenticated player) | Identity gate + player-scoped CAS storage + deny-all RLS | **As-is** | None | `vercel-handler.ts:27-31`; `supabase-storage.ts`; migrations |
| World Travel isolation (failure never resets travel completion/stamps/checkpoint) | Travel state is a separate namespaced key (`d.travel`) with append-only DB guards; XP never decreases (validator) | **As-is** — provided tower uses its own namespace and never touches `d.travel`/`d.checkpoint` | Tower must not write the single global `d.checkpoint` pointer | `service.ts:18`; trigger L82-90; `checkpoint.ts:24` |
| Practice/tutorial never reach reward path | Reward only awarded inside `travel/action` complete / `attempts/{id}/submit` correct paths | **As-is** (pattern) | Tower handlers gate by mode — new check | `service.ts:88,133` |
| Tower run resume separate from travel resume | One global checkpoint pointer exists; GAME-01/T tech defers a global "resume tower" contract | **Small extension** | Tower `activeRun` inside its own namespace; do NOT extend `ResumeTarget` union in MVP | `checkpoint.ts:10-22`; TF |
| Content changes don't invalidate history | `CONTENT_CHANGED` resume recovery; ledger stores `contentVersion` | **As-is** (pattern) | Tower history entries should pin `definitionVersion`/`bankVersion` | `checkpoint.ts:64`; TF |

## 4. Presentation

| Requirement | Existing capability | Reuse potential | Architectural gap | Evidence |
|---|---|---|---|---|
| Entry from World Travel hub (side-activity card) | World Travel hub screen exists inside `WorldTravel.tsx` modes | **Small extension** | One new card + route into tower screens; no global nav change | `app/components/travel/WorldTravel.tsx:16-44` |
| 3-option radio choice UI with lettered options | `choice-grid` fieldset pattern | **As-is** (pattern to extract/copy) | Tower-specific component for full-width ≥56px cards | `Game.tsx:124` |
| Feedback panels (correct/incorrect, EN/VI) | `answer-feedback retry` card pattern; `vi-copy` | **As-is** (pattern) | None | `Game.tsx:128` |
| Floor progress display | `chapter-phase-path` stepped list with `aria-current` | **As-is** (pattern) | Tower floor list component | `Game.tsx:116` |
| Mistake review screen | Journal view with per-item status chips | **Small extension** | New tower review list fed by tower mistakes | `Game.tsx:135` |
| History / personal best screen | Nothing per-activity | **Missing** | New S12 screen (bounded list) | UX S12 |
| Responsive 320px+, ≥48px targets, WCAG 2.2 AA target, reduced motion | Existing mobile-first Tailwind layout; `use-mobile.ts` | **As-is** (conventions) | Per-screen compliance work only | `hooks/use-mobile.ts`; UX spec numbers |
| Bilingual copy throughout | `Bilingual` + `vi.ts` | **As-is** | New strings | `Bilingual.tsx` |

## 5. Summary of genuinely new capabilities

1. **A failure-terminal run state machine** (ACTIVE → CLEARED/FAILED/ABANDONED) — the only capability fundamentally incompatible with existing models (both are retry-until-correct).
2. **Per-run content pinning and server-side question sequencing** (sampling at run start).
3. **Tower-namespaced state** in the expedition document: activeRun, bestByTower, history (cap 20), mistakes (cap 100), learningByObjective.
4. **New `/api/tower*` routes** in the existing catch-all dispatch.
5. **New content area** (`content/tower/`) with public-projection/server-key split and a publication gate.
6. **New UI screens** (S01–S15), largely composed from existing patterns.

Everything else — identity, ownership, CAS persistence, reward idempotency, XP ledger, DB integrity guards, localization, UI conventions, test infrastructure — is **reusable as-is**. No new dependency, package manager, or database table is required by any GAME-01 requirement.

**Not production content:** the package's 25 records (`PILOT_FIXTURE_V0_1`), +40 XP amount ("pending economy review"), and illustrative UX copy are samples; they require owner approval and the LD publication gate before release.
