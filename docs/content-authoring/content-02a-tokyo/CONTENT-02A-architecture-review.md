# CONTENT-02A — architecture review

**Review date:** 2026-11-01 · **Decision:** PROVISIONAL — use a reviewed editorial sidecar for this pack; no runtime/schema change.

## Evidence inspected

Read the full CONTENT-01 package at docs/content-1, including the eight required research documents, priority backlog and country opportunity map. CONTENT-01 proposes Tokyo, Singapore and London as initial packs; includes 55 daily-scene ideas (DE-001–DE-055), a communication-intent taxonomy, content pipeline, source/license boundaries, Tower content research and assessment limits. Its source inventory is READY TO AUTHOR / RESEARCH COMPLETE — EDITORIAL REQUIRED; it is not an approved set of player lessons.

Inspected current source files: content/travel/types.ts, content/travel/japan.ts, current Tokyo encounters, vocabulary/localization/source records, content/tower/types.ts, existing content docs and GAME-01 C0 contract/review files. Existing structures include CountryPack, TravelEncounter, TravelSource, bilingual Copy, versioned content and interaction step kinds. These are directly reusable delivery conventions; the current executable model is narrower than the proposed editorial metadata.

The workspace has unrelated local work. No runtime file, configuration, migration or database was changed in this stage. Git status access was unavailable in this session, so this report makes no branch-cleanliness claim.

## Architecture decision

**PROVISIONAL DECISION — extend current authoring concepts with a documentation-only editorial sidecar.** Keep the structured scenario JSON canonical for this pack, with generated human-readable review views. Treat future mapping to CountryPack/TravelEncounter as a separate adapter proposal after content review.

Do not force the current draft into an executable country pack now: existing content requires reward/stamp fields and fixed version/type rules, while this pack must not invent reward policy or mix answer keys, teaching passages, media and review metadata. Do not build a general CMS or introduce country-specific runtime types.

## Reuse, extension and gaps

| Capability | Reuse now | Gap / decision |
|---|---|---|
| Country/destination/location and encounter IDs | Existing JP/Tokyo locations and current encounter IDs as provenance/navigation context | New lesson and scenario IDs are separate; do not claim legacy jp-arrival teaches the new material |
| CountryPack / TravelEncounter / TravelSource | Delivery vocabulary and source-ID pattern for a later adapter | No live pack object now; no XP, stamp or reward requirement is invented |
| inspect, target, dialogue, route, order, compose | Existing interaction patterns where appropriate | compare, match, recall and decision remain editorial pedagogic labels unless an existing renderer supports them |
| LearningObjective | Stable objective IDs and descriptions | Need intent, observable evidence, support/demand dimensions and evidence limitations in authoring docs |
| VocabularyEntry / GlossaryEntry | Original context example, part-of-speech/meaning and EN/VI concepts | Current flat/local content does not express reusable sense IDs, region variation or confusion sets; sidecar IDs VS-* add this for review |
| Copy / LevelText | Existing English and Vietnamese copy conventions | Keep canonical EN, learner-support VI and interface localization distinct; VI support changes assessment evidence if exposed pre-response |
| Tower types | Existing server-private scoring separation and stable content references | C0 source enum/floor structure is narrow by design; this bank is not a replacement. Candidate answer keys are separate and DRAFT |
| Audio | None required to author this pack | Script and render asset are separate; no provider-specific voice fields in Scenario; no audio generated |
| Source/asset provenance | Existing TravelSource concepts and CONTENT-01 research family | Need exact claim scope, volatility, license/creator, adaptation and privacy checks per item; fictional scene data must be clearly marked |
| Localization | Existing bilingual authoring is useful | No UI label is inserted into a learning objective or dialogue; optional VI must be tracked as support |

## Maintainability answers

1. **Does content depend unnecessarily on Tokyo?** Scene names and fictional geography do; intent, objective, sense and chunk IDs do not.
2. **Singapore MRT?** Yes, same route/transfer intent can be represented, but new operator data and local lesson passages must be researched and taught.
3. **London café/workplace?** Yes, requests, ordering, bill/check variation and repair fit the same contract; local register and facts need review.
4. **Are communication intents reusable?** Yes; scenarios implement ASK_LOCATION, FOLLOW_DIRECTIONS, COMPARE_TRAVEL_INFORMATION, REQUEST_TRANSACTION, CLARIFY_FOOD_ORDER, REQUEST_REPETITION and CLARIFY_AND_CONFIRM.
5. **Are vocabulary senses reusable?** Yes when sense IDs remain explicit; “change lines” must not be merged with money/clothes senses.
6. **Stable IDs/versioning?** Scenario, lesson, retry family and Tower candidate IDs are stable for the same concept. Revision TOKYO-DAILY-r1 and per-passage SHA-256 pin exact bilingual text; text edits require re-review.
7. **Is UI copy separated?** Yes; all files are learning content/review metadata, not screen labels.
8. **Are sources separate from authored content?** Yes; external facts and language references have registry IDs, while ATLAS lesson text is explicitly original.
9. **Are assets separate?** Yes; exact candidate asset records are in TOKYO-assets.md; none is downloaded or integrated.
10. **Is audio rendering separate?** Yes; scripts are independent; rendering fields are future metadata only.
11. **Can Tower reuse without runtime state?** Yes at the editorial level: candidates link to objective, scenario, exact taught passage, revision/hash, retry family and evidence type. No run state is stored.
12. **Would one dialogue edit require editing many files?** JSON is canonical; scenario and Tower Markdown are review views. In this candidate pack, generated views must be regenerated and verifier rerun after any edit. No independent copies should be edited by hand.

## Architecture change classes

### REQUIRED NOW — editorial package only

- Stable scenario, passage, objective, vocabulary-sense, chunk, retry-family and candidate IDs.
- Exact bilingual lesson references and hashes for every scored variant.
- Separation of public prompt/choices from private key/rationales.
- Source registry separating original writing from researched facts.
- Explicit DRAFT and pending-review state; fictional/volatile claim boundaries.
- A single canonical structured record and consistency verifier.

No runtime changes are required in this stage.

### USEFUL SOON — after independent review and repeated cross-city authoring

- A minimal content manifest/adapter that validates one reviewed revision and exposes only presentation-safe data to the existing server-side Tower integration.
- Optional reusable intent/sense/chunk metadata on content records; version the existing schema deliberately.
- A generic read-only link from a Tower candidate back to the exact lesson revision. Reviewing content must not rewind World Travel or award XP.
- A reviewed rubric for genuinely productive responses; current MC, route and tile-compose tasks do not prove open-ended mastery.
- Normalize a sense/chunk only when an independently reviewed second pack reuses it.

### DEFER

Universal ontology/graph, CMS, country-specific TypeScript types, AI free-text grading, pronunciation scoring, automated CEFR calibration, global synonym engine, adaptive placement and vendor-specific fields in generic scenarios. This pack supplies no evidence that these are needed.

## Singapore and London paper maps

| Reusable intent | Tokyo candidate | Singapore | London |
|---|---|---|---|
| FOLLOW_DIRECTIONS / transit change | Fictional two-line network with taught station labels | Same pattern for MRT, but source every actual interchange and author a new passage | Office route is possible, but rail “change lines” sense does not transfer automatically |
| ASK_LOCATION | Fictional station/shop labels | New airport/shop map and taught vocabulary | Meeting room/café map; “platform” is a different sense and should not be reused |
| REQUEST_TRANSACTION | Fictional receipt/bag/payment choices | New store context; local payment and bag policy researched or kept fictional | Café/workplace request; bill/check region and relationship/register reviewed |
| REQUEST_REPETITION | Ask staff to repeat time/number | Same intent with staff-role and context reviewed | Same intent at work with relationship/register review |

These are model-fit examples only, not authored lessons or proof of cross-city runtime behavior.

## Risks and remaining evidence

- The model fit is established only as an editorial sidecar; runtime adapter compatibility remains untested.
- Original passages, EN/VI translations, pragmatics, distractors and accepted alternatives still require independent bilingual educator review.
- Exact real-world local procedures are not encoded as answer facts; any future factual change needs a source refresh.
- CC BY-SA assets have commercial-use language but require legal/attribution, adaptation, brand and privacy review before inclusion.
- Accessibility, visual board legibility, audio timing, learner performance and CEFR alignment are untested.
- No copied exam items, ESL passages or dictionary examples are intended; automated source-text plagiarism checking was not performed.

## Gate

Architecture: **PROVISIONAL**. CONTENT-01 has been reconciled and read; the prior blocker “CONTENT-01 missing” is removed. Remaining blockers are independent educational/editorial review and any future runtime adapter authorization. This documentation-only iteration stops at the authoring review gate.
