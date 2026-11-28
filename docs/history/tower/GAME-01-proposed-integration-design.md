# GAME-01 — Proposed Integration Design

Option B (native feature module) made concrete: domain boundaries, data flow, UX entry, change-impact map, and a minimal file-level plan. **Design only — nothing here is implemented.** Proposed paths are labeled `[NEW]`.

## 1. Domain model

Concepts that already exist: `Player` (= `auth.users.id`, ADR-003), `LearningObjective` (`content/travel/types.ts:12`), `Mission`, `Encounter`, `Reward Transaction` (= ledger entry, `lib/atlas/service.ts:17`), `Checkpoint` (pointer in document).

New concepts, and why existing models cannot represent them:

| Concept | Definition | Why new |
|---|---|---|
| **Tower** (`towerId`) | A published tower definition (`tower:narita-airport-survival`), versioned | Content identity distinct from missions/encounters |
| **TowerFloor** | Ordered bucket of eligible question records (MVP: 5) | Pure content structure; no persistence of its own |
| **Question** | Versioned record: public projection + server-only key, per objective | Must not leak keys (existing `publicMission` convention, `content/missions/index.ts:35-36`) |
| **TowerRun** | Ephemeral-until-terminal: runId, mode, frozen sequence, cursor, cleared floors, status | The only genuinely new *state* aggregate — existing attempt models cannot fail terminally |
| **AnswerAttempt** | One committed evaluation per submitted answer | Recorded in run + mistake evidence; analogous to `submissions[]` |
| **MistakeRecord** | Per question-revision unresolved mistake (cap 100) | New projection over tower attempts |
| **PersonalBest** | Max floors cleared per tower (challenge only) | Derived, persisted in tower namespace |
| Reward transaction | **Existing** ledger entry with `missionId='tower:narita-airport-survival'` | **Reused as-is** |

Aggregate boundary: the tower is **not** a new aggregate root for persistence — it is a namespaced section of the single player expedition aggregate (`d.tower`), updated in the same CAS commit as everything else. This preserves the one-writer-per-player atomicity that the DB trigger depends on.

### Isolation invariants (Phase C3) and where they are enforced

| Invariant | Enforcement point |
|---|---|
| Tower failure never resets World Travel progress | Tower handlers only mutate `d.tower` (+ ledger); DB trigger keeps `travel.stamps`/`completedAt` append-only regardless (`20261021090000…sql:82-90`) |
| Tower never touches the travel/nature checkpoint pointer | Tower code never reads/writes `d.checkpoint` (only `saveCheckpoint` callers do) |
| Replay cannot farm first-clear XP | Existing ledger dedup `(missionId, contentVersion)` + `awardFirstClear` returns 0 (`service.ts:22-25`) + DB trigger XP-delta rule |
| Concurrent requests can't corrupt a run | Existing CAS loop → 409; server derives all transitions; run cursor is authoritative server state |
| Question answered more times than permitted | Server-side cursor advance on each CAS commit; `operationId` receipt check makes a replayed POST idempotent (returns the committed outcome, no new transition) |
| Client can't claim rewards or invent correct answers | All evaluation server-side with server-only keys; zod-strict bodies reject extra fields (XP/floor/correct claims); existing identity gate blocks player selectors |
| Run belongs to authenticated player | Run keyed inside the player's own document; owner check implicit + `runId` scoping |
| Content changes don't invalidate history | Run pins `definitionVersion`/`bankVersion` at start (pattern: `checkpoint.ts:64` `CONTENT_CHANGED`) |

All invariants are enforced **server-side / DB-side**; no UI-only safeguards.

## 2. Data flow (tower answer submission)

```
Game client                     app/api/[...path]            lib/atlas (server)                    Supabase
───────────                     ─────────────────            ──────────────────                    ────────
TowerView (dumb renderer)  ──►  vercel-handler          ──►  tower handlers (new)             ──►  atlas_expeditions
  user picks option(s)          identity gate (getUser,       read document (CAS read)                (service_role,
  "Check answer" POST           UUID, same-origin,            towerEngine.evaluate(seq[cursor],       RLS deny-all,
  /api/tower/runs/{id}/answers  zod-strict, 16 KB)            answer, pinnedKey)                      trigger guards)
                                  │                           transition: advance | fail | clear
                                  │                           update d.tower (run/mistakes/best)
                                  │                           if eligible full clear:
                                  │                             awardFirstClear(d,'tower:…',1,40)
                                  │                           compareAndSwap(revision, doc)
                            ◄──  200 {outcome, state}  ◄──        │ or 409 after 16 retries
  setState(outcome.state)                                     ◄── single atomic commit
```

Same commit writes: run transition + mistake evidence + PB + ledger — satisfying the GAME-01 rule "no two-phase complete-then-claim gap".

## 3. UX / information architecture (Phase E)

Verified navigation: 4-item main bar Journey / World map / My journal / How to play (`Game.tsx:100`); World map has a two-realm selector (travel|nature, `Game.tsx:113`); travel renders its own hub.

**Entry-point strategies compared:**

1. **Side-activity card in the World Travel Japan hub (recommended)** — matches the GAME-01 UX spec, matches content provenance (tower derives from the inspected `jp-arrival` pilot), requires no global-nav change, and is discoverable exactly where airport content was learned. Cost: one card + one mode/route inside the travel screen shell.
2. **New global nav item ("Activities")** — rejected: introduces a new global navigation concept for one feature (violates "one clear primary action"; no evidence of need; nav is deliberately minimal).
3. **Journey-page card** — viable secondary surface later; not for MVP.

Answers to the standing UX questions: discovery via the Japan travel hub card (with "Resume Floor {n}" replacing "Enter tower" when an active run exists — per UX spec S01); relation to country content — MVP is Japan-derived, later towers per country; a player can enter before completing a chapter (travel Japan is already playable independently of nature missions — `catalog.ts` availability model); exit via existing travel hub navigation back ("Return to World Travel" resolves through existing checkpoint/resume validation, which tower never disturbs); first action obvious via a single filled CTA per screen (existing `play-button` hierarchy). Mistake review reachable from tower entry (S12/S08 screens); MVP keeps tower resume separate from the global adventure resume.

**Component reuse matrix:**

| Tower screen need | Reuse | New |
|---|---|---|
| Bilingual copy | `Bilingual`, `UiText`, `vi.ts` strings | copy entries |
| Choice UI | `choice-grid` fieldset pattern (`Game.tsx:124`) | `[NEW] app/components/tower/TowerChoices.tsx` (full-width ≥56 px cards) |
| Feedback | `answer-feedback` card pattern (`Game.tsx:128`) | `[NEW] TowerFeedback` (can be inline in TowerView) |
| Floor progress | `chapter-phase-path` stepped list pattern (`Game.tsx:116`) | `[NEW] TowerFloors` (aria-current step list) |
| Error/recovery | `AdventureRecovery` pattern | inline reconnect state (UX S14) |
| CTA hierarchy | `play-button`/`quiet-button` | — |
| Boss two-part fieldsets | checkbox/radio fieldset patterns (`Game.tsx:125`) | composed in TowerView |
| New screens (entry, preview, victory, history, review, practice) | patterns above | `[NEW] app/components/tower/TowerView.tsx` (+ small subcomponents, one file) |

## 4. Change-impact map (Phase G)

| Module | Owner/responsibility today | Why touched | Regression risk | Smaller alternative? |
|---|---|---|---|---|
| `lib/atlas/service.ts` | All API orchestration | Add tower routes to dispatch; add `tower?:` to `Expedition` type (L18) | Low — additive branch in the route switch; existing routes untouched | None (catch-all is the established surface) |
| `lib/atlas/vercel-handler.ts` | Identity gate | None (tower needs no gate changes) | — | — |
| `content/travel/*`, `content/missions/*`, `packages/mission-engine`, `packages/english-engine`, `packages/domain` | Existing game logic | **Untouched** | None | — |
| `lib/atlas/checkpoint.ts` | Adventure resume | **Untouched** in MVP (tower keeps its own resume inside `d.tower.activeRun`) | None | — |
| `app/components/Game.tsx` | Shell | **Untouched** in MVP (tower lives inside WorldTravel's travel shell); journal link can come later | None | — |
| `app/components/travel/WorldTravel.tsx` | Travel shell | Add one tower entry card + conditional tower view | Low — additive render branch | Journey-page card (deferred) |

**New modules** (each with a single responsibility, following the repo's layering):

| `[NEW]` path | Responsibility | Reuses |
|---|---|---|
| `content/tower/narita.ts`, `content/tower/types.ts` | Tower definition + versioned question records (public projection; server key in a sibling server-only module) | content conventions, `Copy`/`LearningObjective` types |
| `content/tower/bank-server.ts` | Server-only answer keys + rationale (`server-only` import guard) | `lib/atlas/travel-rules.ts` convention |
| `packages/tower-engine/src/index.ts` | Pure run reducer + sampling + evaluation (no I/O) | conventions of `mission-engine` |
| `lib/atlas/tower-handlers.ts` | Route handling: preview/runs/answers/abandon/review, idempotent receipts, reward wiring | `service.ts` patterns, `awardFirstClear`, `rewardFor` |
| `app/components/tower/TowerView.tsx` | All tower presentation (state-machine driven) | patterns above |
| `scripts/test-tower.mts`, `scripts/test-tower-postgres.mts` | In-process + real-PG oracles | `test-auth02-*` fixture stack |

**Smell check:** no duplicated progression engine (rewards stay in `awardFirstClear`); single source of truth (document + revision); no new circular deps (content ← engine ← lib ← app, matching existing direction); UI never owns reward rules; no shared module imports tower UI; scoring never client-authoritative; no new packages beyond one pure engine package (justified by the existing 2-package precedent and server-only import hygiene); no new global state; no new dependencies.

**Before/after dependency graph (delta):**

```
Before:  app/components → (fetch) → app/api catch-all → vercel-handler → service.ts → {mission-engine, english-engine, domain, content/*}
                                                  → supabase-storage → Supabase (trigger guards)

After:   app/components/travel/WorldTravel → [NEW] app/components/tower/TowerView
       app/api catch-all → vercel-handler → service.ts ─┬─ (existing branches unchanged)
                                                        └─ [NEW] tower-handlers → [NEW] packages/tower-engine → [NEW] content/tower
```

## 5. Minimal file-level change plan

| File | Status | Responsibility / why | Dependencies | Tests |
|---|---|---|---|---|
| `content/tower/types.ts` | `[NEW]` | TowerDefinition, FloorBucket, QuestionRecord (public/key split), RunState union | `content/travel/types.ts` (Copy) | type-only |
| `content/tower/narita.ts` | `[NEW]` | 5-floor MVP definition (owner-approved bank; versioned) | types | publication-gate script |
| `content/tower/bank-server.ts` | `[NEW]` | Server-only keys | `server-only` | evaluator tests |
| `packages/tower-engine/src/index.ts` | `[NEW]` | `sampleSequence`, `evaluateAnswer`, pure run reducer (ACTIVE→CLEARED/FAILED/ABANDONED), practice reducer | content/tower | new `test-tower.mts` (state-machine truth table, double-submit, invalid payloads) |
| `lib/atlas/tower-handlers.ts` | `[NEW]` | Route bodies for `tower*` paths; receipt idempotency; ledger wiring; bounded projections | tower-engine, service types | `test-tower-postgres.mts` |
| `lib/atlas/service.ts` | **EDIT** (2 touch points) | Add `tower?:TowerState` to `Expedition` (L18); dispatch tower routes to handlers | — | existing suites must stay green |
| `app/components/tower/TowerView.tsx` | `[NEW]` | Presentation for S01–S15 subset (MVP: entry, active, feedback, failed, victory, review) | Bilingual, atlasApi | SSR smoke test (pattern: `test-chapter-ui.mts`) |
| `app/components/travel/WorldTravel.tsx` | **EDIT** | Entry card + mount TowerView | TowerView | existing travel tests + manual |
| `content/localization/vi.ts` | **EDIT** | Tower copy strings | — | coverage check |
| `scripts/test-tower.mts`, `scripts/test-tower-postgres.mts` | `[NEW]` | Oracles F06/F07/F13/F14/C05-C07/S03 analogues | auth02 fixture | package.json script entries |

No migrations. No new npm dependencies. No changes to auth, profiles, travel/mission engines, or DB.

**Open questions for the product owner:** final +40 XP amount (economy review); question-bank sign-off (publication gate); whether tower entry should also appear on the Journey page; VI copy review; whether `reviewDue` scheduling ships in MVP (proposed deferral).
