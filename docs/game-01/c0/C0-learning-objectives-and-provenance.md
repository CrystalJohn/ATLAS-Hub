# C0 learning objectives and provenance

**DRAFT · 2026-10-26 · research/design/authoring only.** Source checkout: `D:\ATLAS-Hub`, branch `codex/auth-02-player-ownership`, HEAD `e1d07867e799e36bec6c550dca9e4f1dcf258dfe`. No independent educator review has occurred. This document owns source truth; C0 proposals do not amend the original lesson.

## Scope and interpretation

Airport Survival for an **A2–B1 learner audience**, with mostly foundational receptive tasks. Five floors **total**: four ordinary questions, then Floor 5 boss with two decisions submitted together. This follows the package's `memory-tower-game-design-document.md`, “Five-floor vertical slice”; it is not five ordinary floors plus a sixth boss. Owner confirmation of this interpretation is recorded in the [gate](C0-gate-report.md#approvals-and-blockers).

Use only `JP / tokyo / airport / jp-arrival`, encounter version 1, objective `airport-request`. Other Tokyo encounters are audited for boundaries, not silently borrowed for airport questions. No passports, immigration, baggage claims, fares, platform numbers, ticket-counter directions, repeat requests or airport safety advice are taught in this slice. This is a bounded finding about [S1](#s1), not a claim about every possible future ATLAS lesson.

## Taught source register

All P IDs below are **C0 provenance aliases**, not pre-existing lesson IDs. Source-native IDs are reproduced in the locator. Vocabulary entries have a `word` key, not an `id`; do not invent a source-native vocabulary ID. JSON paths are RFC 6901 pointers into the inspected player export; indices were checked against native IDs. Every P entry inherits S1/S2 commit, dates and limitations below.

### P01

`jp-arrival.vocabulary[word=station]`, generated vocabulary lesson ID `travel:jp-arrival` (source `japan.ts:36`). [Native source](../../../content/travel/japan.ts), line 8. Export pointer `/travelPacks/0/encounters/0/vocabulary/0`. Taught: `station`, VI `nhà ga`, clarification `Ở đây là ga tàu.`, example “Where is the train station?” This supports place/vehicle/ticket discrimination, not other meanings of station.

### P02

`jp-arrival.vocabulary[word=ticket]`, source line 8; export `/travelPacks/0/encounters/0/vocabulary/1`. Taught VI `vé`, use for transport or entry, example “I need a train ticket.” Supports ticket meaning and train-ticket context. Does not teach buying, quantity, cost, counter location or payment.

### P03

`jp-arrival.vocabulary[word=please]`, source line 8; export `/travelPacks/0/encounters/0/vocabulary/2`. Taught VI `làm ơn; xin`, polite request function, example “Could you help me, please?” Supports polite-request recognition. Does not justify making “Can you help me?” a wrong answer merely because it uses can.

### P04

`jp-arrival.vocabulary[word=train]`, source line 8; export `/travelPacks/0/encounters/0/vocabulary/3`. Taught rail vehicle sense, example “I would like to take the train.” Supports transport intention. Does not teach all grammar of would/could or the process for taking a real train.

### P05

`locations[airport].hotspots[signs].description`, source line 22; export `/travelPacks/0/locations/0/hotspots/0/description/en`. Exact stimulus: “TRAINS → · BUSES ← · EXIT ↑. These are practice signs in an invented terminal.” Encounter step `jp-arrival/read-signs` (line 28; `/travelPacks/0/encounters/0/steps/0`) requires inspecting hotspot `signs`. Supports this label/arrow map only. Neither flipped train arrows nor additional INFORMATION/TICKETS signs are taught.

### P06

`jp-arrival / ask-staff / airport-help`, source line 28; export `/travelPacks/0/encounters/0/steps/1/dialogue`. A2 prompt: “Welcome! Can I help you?” Correct response native ID `ask`, A2 text: “Excuse me, how can I get to the train station?” A2 reply: “Follow the TRAINS sign to the right.” Source also offers irrelevant `food` and `thanks` replies. Their presence does not teach thanking airport staff or food ordering as an airport objective.

### P07

Same native dialogue, B1 path `responses/0/text/B1/en`: “Excuse me, could you tell me how to get to the train station?” Reply `reply/B1/en`: “Follow the sign to your right. It says TRAINS.” Supports longer-form recognition and referent/direction binding. This is not proof of a validated B1 item. Original A1 request instead says “Where is the train station, please?”; A2/B1 source VI is shared and less explicit than the B1 syntax.

### P08

`jp-arrival/find-train`, source line 28; export `/travelPacks/0/encounters/0/steps/2`. Objective: “Tap the train station entrance in the scene.” Target hotspot `airport/station`, line 22, description: “Follow the TRAINS sign in this practice terminal.” Server rule [travel-rules.ts](../../../lib/atlas/travel-rules.ts), line 4, accepts target `station`. Supports completing this local destination goal; it does not establish an arbitrary browser deep link or an authentic terminal route.

## Objectives, floors and complete item mapping

| C0 objective | Observable behavior and evidence limit | Taught basis | Candidates / return target |
|---|---|---|---|
| AIR-LEX · F1 | Distinguish station, ticket, train and please in the taught airport senses; cued meaning recognition | P01–P04; source objective remains `airport-request` (C0 adds sub-objectives only in docs) | `air-001` P01/P02/P04; `002` P02/P01/P04; `003` P04/P01/P02; `004` P03/P04/P06. R-VOC |
| AIR-SIGN · F2 | Match train goal to original TRAINS label/right arrow | P05/P06; for `006`, P04/P08 also | `air-005`, `006`. R-SIGN |
| AIR-REQUEST · F3 | Select or recognize the taught station-directions request; no spontaneous production | P06/P05 (`007`); P07/P02/P05 (`008`) | `air-007`, `008`. R-ASK |
| AIR-FOLLOW · F4 | Interpret written Mika instruction; bind destination and direction | P06/P08/P05 (`009`); P07/P05 (`010`) | `air-009`, `010`. R-FOLLOW |
| AIR-REQUEST + AIR-SIGN/AIR-FOLLOW · F5 boss | Two recognition observations, one all-or-nothing floor result; no new language objective | `011.p1` P06/P05; `011.p2` P05/P06; `012.p1` P07/P02/P05; `012.p2` P07/P05/P08 | `air-011`, `012`. Each part keeps its own R target |

IDs in this table abbreviate the bank's stable prefix `g01-c0-`. The [bank](C0-question-bank-candidates.md) carries full IDs and per-part sources. R targets are defined in the [content contract](C0-content-contract.md#remediation-targets). “Taught” means authored and available through that encounter; it does **not** mean a given player read/understood it. Vocabulary exposure is optional in the current UI ([S3](#s3)). Proposed Challenge readiness therefore requires the source-learning review described in the contract.

## Bank capacity

**12 draft records / 14 atomic decisions**, distributed 4+2+2+2+2 records. A run serves six decisions over five floors. Do not inflate to 20–30: the source supplies four vocabulary entries, one sign layout and one directions exchange ([P01–P08](#taught-source-register)). Multiple records reuse these facts and are explicitly related variants. They are not 12 independent concepts or calibrated parallel forms.

The package's 25 records are a creative fixture bank, not evidence of 25 already-taught items. Its Q07/Q10/Q22–Q25 introduce changed signs/routes; Q09 adds a counter; Q17/Q19/Q20 introduce purchasing, gratitude or repeat-request goals; Q11–Q15 introduce explicit grammar/collocation scoring. [Package audit](C0-editorial-quality-matrix.md#package-disposition) records each row. Existing examples can support whole-phrase recognition without proving that grammar rules were taught. C0 drops the dedicated grammar floor in favor of interpreting Mika's already-authored instruction.

**Retry limitation:** two variants per higher-floor bucket can alternate over immediate retries but soon repeat. A retry must change the actual record/task, not just option order. These small same-scene pools cannot promise novel situations or unseen content indefinitely. To enlarge them, author and independently review additional **lesson encounters first**, with new source IDs; then derive questions. No such source authoring is executed here.

## CEFR and learning evidence

**INFERENCE:** the material suits foundational rehearsal for an A2–B1 audience; several items may be A1-level recognition. Longer B1-tagged wording is exposure, not calibrated B1 demand. The [official CEFR Companion Volume, 2020](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4#page=56) describes A2 reading of routine signs/information; B1 orientation involves broader information search. Its [reading-instructions scale, p.58](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4#page=58) even includes simple directions at A1. Those descriptors inform a hypothesis; they do not validate these questions. Choosing a request is not performing the [oral travel transactions on p.78](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4#page=78).

| Evidence label | C0 handling |
|---|---|
| Recognition | All bank decisions: visible alternatives cue a response; cloze with options would also be recognition. Correctness is scoped to this context/version/support condition. |
| Controlled construction | Existing Tokyo `jp-culture/share-visit` uses supplied tiles; outside Airport MVP. Even tile ordering is not free recall. |
| Productive recall | Requires an independently reviewed typed/spoken response without answer alternatives and a valid acceptance rubric. Future Practice research only; no productive-recall score in C0. |
| Mastery / retention / transfer | No such claim from a clear, replay or longer phrase. Repeated cues and preceding floor feedback can help the boss. Future claims require separately designed delayed/novel-context and productive evidence with educator review; no invented threshold is certified here. |

## Evidence ledger and inspection limits

### S1

**DIRECT · Tier 1 repository source**, ATLAS authors, [japan.ts](../../../content/travel/japan.ts):3,8–11,20–32,36 and [travel-rules.ts](../../../lib/atlas/travel-rules.ts):3–8; source commit above, accessed 2026-10-26. Four Tokyo encounters, 14 steps, 12 hotspots, 16 vocabulary entries; only 3 steps/4 words belong to `jp-arrival`. Files match the clean tracked tree at inspection. Supports authored scope, IDs and keys. Does not support educator approval, actual learner exposure or deployed behavior. Independent linguistic verification: **not performed**.

### S2

**DIRECT · Tier 1 inspected export**, generated ATLAS player-content JSON and MD, dated 2026-10-26 and same commit. [JSON](../../../output/game-content/2026-10-26/ATLAS-player-content.json), [MD](../../../output/game-content/2026-10-26/ATLAS-player-content.md) §§4–5. SHA256 JSON `1C1EDE93960FE155685D7B412F999A007BCA4E083F3848B35CAEB5B38859112A`; MD `D45B2031DF545F51CD4B651FCBD68C12C6D7C5B4C60E3E9900ACEE003DC1BCC5`. Each matches its attachment recovered from the referenced chat, byte for byte. Native airport content and export content were compared. The export is derivative, **not independent corroboration**. It excludes private evaluator keys; S1 supplies those. No player data was inspected.

### S3

**DIRECT · Tier 1 source**, [travel evaluator](../../../packages/mission-engine/src/travel.ts):24–40 and [TravelEncounterView](../../../app/components/travel/TravelEncounterView.tsx):18–26; same commit/access date. Inspecting the sign advances `read-signs`; choosing the authored `ask` response advances the dialogue. Vocabulary buttons open notes on demand. Thus completion alone does not prove vocabulary exposure/comprehension. [WorldTravel](../../../app/components/travel/WorldTravel.tsx):26–38 and [checkpoint.ts](../../../lib/atlas/checkpoint.ts):9–47 establish current in-app mode/checkpoint handling, not lesson-fragment URLs. Code inspected; no browser execution or learner study in C0.

### S4

**SOURCE_CLAIM · Tier 2 project-authored reports**, five `GAME-01-*.md` architecture audit files in [parent directory](../), 2026-10-26. The ZIP at repository root contains seven Markdown design docs plus PDF/PNG wireframes; all seven Markdown docs were inspected for C0 scope, learning bank, transitions and reward constraints. Package pins older `ce79e59`/`d03faab`; current source controls conflicts. Binary wireframes were not visually audited in this content task. Package assistant “desk reviewed” labels are not educator signoffs. No empirical claims from the package's research bibliography are adopted without verification.

### S5

**DIRECT · Tier 1 official descriptor text**, Council of Europe, *CEFR Companion Volume* (2020), pp.54–58,78, linked above; accessed 2026-10-26. Supports descriptor distinctions only. **DIRECT · Tier 1 pedagogic reference**, British Council, [Requests, offers and invitations](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/requests-offers-invitations), Requests/Offers sections; publication date unavailable, accessed 2026-10-26. Supports request/offer forms, not the claim that only could is grammatical. Neither body reviewed this bank. Local band assignments remain INFERENCE pending independent educator judgment.

### S6

**DIRECT code / SOURCE_CLAIM reports**, [service.ts](../../../lib/atlas/service.ts):16–29 and [checkpoint.ts](../../../lib/atlas/checkpoint.ts):20–47; current commit. Current reward helper deduplicates by mission/content version; checkpoint selects existing progress. [Integration readiness](../GAME-01-implementation-readiness.md) and [AUTH-04.1 release record](../../auth-04/AUTH-04.1-migration-release-2026-10-24.md), including later [owner staging decision](../../auth-04/AUTH-04.1-blocker-resolution.md#owner-decision--2026-10-24), are dated project reports. They report migration application but leave hosted OAuth/deployment verification open. C0 did **not** query hosted configuration or rerun those tests; inherited release blockers require a fresh later audit.
