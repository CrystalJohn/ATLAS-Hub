# ATLAS private test deployment

This is a private review build of ATLAS Forest of Origins, created from ATLAS-Vertical-Slice.zip version 1. The original Next/Nest/PostgreSQL project remains unchanged in that artifact.

Sites uses Vinext/Cloudflare Workers, so this deployment retains the React forest UI, original mission content, domain progression and deterministic subject/English evaluators, with a Sites-specific API adapter in `lib/atlas/service.ts`. A D1 revision-checked document stores progress, attempts, submissions and the reward ledger in one atomic update. Twelve concurrent first-clear submissions are covered by the adapter integration test. This is a small private-pilot storage strategy, not a migration recommendation for the original production architecture.

Sites authentication supplies the stable per-Site player id. Missing identity is rejected; clients cannot select another player. Cross-origin writes and extra reward fields are rejected. Database schema is applied by the versioned Drizzle migration, never by request handling. Previous local cookie/PGlite progress is not imported; this Site starts a new expedition.

## English review scope
The account-private review build deliberately exposes the bilingual POC for the owner to test. This does not remove the canonical project's independent-content-review gate. The page carries a draft banner; no text is represented as educator-reviewed. Do not broaden sharing or treat the pilot as a production learning release before independent review. No AI translation/voice service runs. English items add no XP, and assistance does not reduce the original mission XP. Reading/vocabulary task evidence remains separate from ecology mastery; no CEFR proficiency or listening/speaking result is inferred.

## Checks
`node scripts/test-atlas.mts` uses actual Miniflare D1 and the generated migration, exercising sign-in isolation, origin checks, locked missions, observation prerequisites, strict payloads, wrong answers, bilingual evidence, 12 concurrent first-clear requests, full three-mission chapter at 210 XP, returning identity and replay protection.

`node node_modules/typescript/bin/tsc --noEmit` checks the Sites adapter and UI. Build uses the Sites build helper. Original upstream 28-test evidence is in the ZIP; it is not a substitute for adapter tests. No new live browser-interaction pass is claimed unless separately recorded. Start a new Site expedition to test on your phone.

## Player UX update — 2026-10-18

Based on a mobile player getting stuck at 1/3 clues, the mission UI now provides a next-step card, explicit Observe → Answer → Unlock steps, direct read-next-clue and go-to-question controls, and Help / How to play. A shared optional Vietnamese assistance switch controls both instructional text and the English lesson. English practice is clearly marked optional, linked from the guide, and placed after the main subject flow. Active missions hide the decorative vignette on narrower screens; clue/answer text and touch controls are larger. Explicit navigation moves focus and respects reduced motion. Submission moves the player to feedback. No fixed overlay was added over the phone's Site controls.

`node scripts/test-guidance.mts` covers 768 prerequisite combinations, navigation transitions and rendered control states for Vietnamese support on/off and English questions locked/unlocked. This checks state rules and component HTML; it is not live Safari or touch verification. The D1 chapter/concurrency regression and TypeScript checks also pass. No database, reward, unlock or grading rules changed; the existing player's progress remains stored under the same Site and D1 binding. Browser QA is not available through the current Browser plugin surface, so no new screenshot/interactive pass is claimed.

## Complete Learning Chapter — 2026-10-18

The private pilot now has a bright journey hub inspired by the supplied rounded cards, mint/lavender/gold palette and tiered badge references. Trail badges are derived from server-verified mission completions. XP/character level is displayed separately from the selectable A1–B2 reading target. No ranking, streak, language proficiency or listening/speaking assessment is implied by the decorative icons.

All three existing missions keep their content/evaluators and 30/60/120 first-clear rewards. Each mission now follows a focused Story → Discover (when applicable) → English → Decide → Recap flow. Discovery shows one clue at a time. English shows a short versioned reading, contextual vocabulary help, one question at a time, explanatory feedback with a literal passage excerpt, retry of the current wrong item, and a learning recap. English practice can be skipped with no subject XP penalty. The lake and recovery grove each gain fixed A1/A2/B1/B2 English drafts: 12 total reading variants and six English questions per target across the chapter.

The English journal derives per-item latest outcomes from persisted submissions and lets the player retry only the tricky items. Existing completed attempts and legacy forest v1 evidence are retained; returning players can practise English on their completed mission attempts without refarming XP or re-recording clues. Chapter recap distinguishes completed field missions from the six English practice items and links back to the journal and restored world. It does not label immediate practice as delayed transfer, retention or general mastery.

### API/storage
New `POST /api/attempts/:id/english-item` validates mission/lesson/version/band/item/answer and assistance context, checks identity/ownership/unlocks/server-recorded clues, and atomically persists item outcomes with the existing D1 revision check. Old `/english` requests and answer keys remain supported. Correctness keys and explanatory feedback are server-side; the public content module contains only prompts, readings and assistance. No DDL change, player reset or new reward currency is introduced. `state` now includes the current player's attempts and latest English item outcomes for resume/review.

All new language text is a fixed agent-authored review draft. The Site remains owner-private; the canonical MVP content-review gate is unchanged. The existing local Nest/PostgreSQL ZIP is not silently rewritten into the Sites adapter.

### Executed verification
- TypeScript: pass.
- Existing `test-atlas.mts`: actual D1 full chapter, identity isolation, strict payloads, concurrent first-clear, returning progress and replay invariants pass.
- `test-chapter.mts`: 24 target/item cases (12 variants × 2 questions), positive/negative grading, literal feedback excerpt checks; actual D1 bilingual chapter, wrong-item review state, eight concurrent per-item submissions, strict inputs, mission matching, isolation, six unique English evidence records and 210 subject XP pass.
- `test-chapter-ui.mts`: actual component HTML for new/returning journey state, locked paths, all 12 reading variants, single-item review and Vietnamese support on/off passes. These are component-render checks, not browser interactions.
- Official managed Sites preview started. The browser navigation tool hung and ultimately timed out; no screenshot or interactive browser/Safari pass is claimed. Preview was stopped. Do not reuse previous screenshots as evidence for this UI.
- Sites build is run by the publication workflow for the exact pushed source.

Manual acceptance still needs a phone run through Story → three clues → English retry → field conclusion → next mission → final summary, plus keyboard/focus and a second browser-session resume. Bilingual educator calibration remains required before a general learning release. No measured 15–20-minute completion time or learning-efficacy claim is made.

## Vietnamese support consistency fix — 18 October 2026

The checked Vietnamese preference previously revealed only a few generic hints;
mission story, objectives, clues, and choices stayed English-only. The reading
explanation was also hidden in a closed disclosure.

- Added a presentation-only fixed Vietnamese catalog and one context-backed
  bilingual renderer. English remains visible, with Vietnamese assistance directly
  beneath it while the existing preference is enabled. No translation service or
  model runs at runtime. These are private-pilot drafts pending independent review.
- Connected mission titles, story/objectives, all field clues and questions,
  choices, evidence, recovery actions and feedback to this preference. Connected
  navigation, stage labels, principal controls, journal and recap text too.
- Reading explanations now appear inline when support is enabled. Both checkbox
  locations update the same state and existing versioned local preference.
- Extracted the actual mission story for regression coverage of the reported lake
  screen. The UI check renders all 12 mission/band stories and verifies 117 content
  strings with support on/off, plus the existing new/returning player views.
- Server evaluation, mission versions, answer ids, API payloads, XP and saved
  progress are unchanged. TypeScript, UI rendering and existing D1 chapter and
  progression checks are the verification scope. Browser/Safari interactions are
  unverified: the managed preview previously timed out and there is no evidence
  that its infrastructure has recovered, so it was not restarted for this fix.

## Evidence-based lake pilot — 18 October 2026

Scope: only The Disappearing Lake enters the evidence pilot. The forest and grove
retain their previous behavior and are not labeled evidence-validated. Other
regions must not be expanded from this pilot without a separate validation pass.

Product impact:
- The lake now asks players to inspect a shaded stream and sunlit bay, compare
  fixed scenario temperature/oxygen values, record the pollution screen, then
  choose a hypothesis and two supporting observations using the existing server
  challenge. The fictional controlled aeration response (3.1 → 6.0 mg/L and fish
  stop gasping) is available before the decision as a case observation.
- The causal explanation is withheld until a server fieldwork submission returns
  a result or the server has recorded prior mission completion. Lake English
  passages follow the field decision because some contain the explanation.
  Returning players can revisit the sites from the mission recap without XP farming.
- EvidencePanel is reusable and presentation-only. EvidenceSource, VisualEvidence,
  LearningClaim and the mission bundle have explicit TypeScript models. Scientific
  facts, real measurements, fictional scenarios, simulated data, unconfirmed
  hypotheses and in-case inferences are distinct categories. This mission uses
  no real measurement dataset and makes no claim to validate all contaminants.

Source review (2026-10-18, primary/authoritative content read):
- USGS Water Science School, Dissolved Oxygen and Water:
  https://www.usgs.gov/water-science-school/science/dissolved-oxygen-and-water
  Original requested /special-topics/ URL redirected to this canonical page.
  Definition, temperature/capacity distinction and measuring sections were read.
  Displayed date is 2026-08-24; the original publication date is not identified.
  A later fetch to the same canonical page timed out; no permanent link failure
  was inferred from that transient result.
- EPA CADDIS, Dissolved Oxygen:
  https://www.epa.gov/caddis/dissolved-oxygen
  Page updated 2026-09-16. Reviewed solubility, riparian cover, multiple mechanisms,
  biological effects and the warning that symptoms alone do not confirm causality.
- EPA CADDIS, Step 3. Evaluate Data from the Case:
  https://www.epa.gov/caddis/step-3-evaluate-data-case
  Page updated 2026-01-22. Reviewed comparisons, intervention evidence, uncertainty
  and conservative elimination of candidate causes.

The sources support concepts/methods, not ATLAS's fictional values. Each claim has
section-level citation locators and a support/background-only relationship.
Publication dates are shown only when known, separately from updates and the last
verification date. English A1/A2/B1/B2 explanations and optional Vietnamese support
are fixed private-review drafts; no runtime translation/voice generation is used.

All three SVGs are original local teaching assets, licensed CC BY 4.0 with creator,
origin, license link, modification notes and scientific references. They are not
agency photographs or proof of a real event. The comparison chart has separate
zero-based °C and mg/L scales and an accessible HTML table. The oxygen-capacity
schematic uses symbolic dots, not a numerical saturation prediction.

Publication guard:
- scripts/validate-evidence.mts runs before every framework build. It checks the
  evidence-enabled lake's 83 published learning fields against an audited text
  snapshot, resolves cited claims/visuals/sources, and rejects unsupported factual
  fields, missing metadata, future dates, real-data misclassification and missing
  local SVG/license files. Changing content requires updating the citation audit.
- This verifies structural coverage and source provenance; it cannot automatically
  prove semantic truth. The source reading and claim/section mapping above are
  the initial content review. Independent bilingual educator review remains pending.

Verification:
- TypeScript, evidence validation/rejection cases, 4 bands × 2 support modes,
  before/after explanation rendering, original bilingual UI tests, and actual D1
  grading/progression tests pass. Existing mission API, scoring, rewards, content
  versions, identity enforcement and stored progress were not modified.
- Managed Chrome UI QA used the actual new components in a temporary, explicitly
  ungraded fixture. Enter/Space inspected sites, recorded comparison/report and
  opened vocabulary, sources and visual credits. Explanation and conceptual diagram
  were absent before a sample submission and present afterward. Vietnamese toggle
  and B2 selection were exercised. Source links had correct HTTPS hrefs, _blank
  and noopener/noreferrer; source contents/license were checked with web retrieval.
- Viewports tested through same-origin QA iframes: ~388px (one site column),
  ~766px and ~1022px (two columns); document widths stayed within each viewport.
  All local SVGs loaded. The fixture is removed before source packaging.
- Limit: managed preview did not provide signed-in Sites identity to the private
  API, so authenticated browser-to-D1 end-to-end interaction remains unverified.
  D1 integration tests cover that service path separately. Safari was not tested.
