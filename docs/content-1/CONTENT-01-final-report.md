# ATLAS CONTENT-01 — Final research report

**Date:** 2026-10-31  
**Outcome:** PROVISIONAL DECISION — ATLAS should adopt a curated, source-provenance-first authoring pipeline, not direct ingestion. Research is complete for a bounded source-discovery and planning gate; editorial/legal review remains before publication.

## Executive decision card

**Current action:** move three packs to editorial authoring specification: Tokyo continuation, Singapore MRT, London transport/café. Use official sources for facts and intent discovery, write original EN/VI content, and keep asset rights in an item-level manifest.

**Confidence:** Medium-high for the pipeline direction; medium for individual pack readiness. The current ATLAS model already stores country/location/encounter/source IDs and bilingual content, while CEFR, assessment and license sources support the need for explicit evidence boundaries rather than copied content. [Source inventory](CONTENT-01-source-inventory.md)

**Decisive uncertainty:** whether product distribution is commercial and whether each selected asset/recording has rights compatible with bundling, modification and attribution. This changes GREEN candidates and can block listening/media work.

## Strongest findings

1. The current source model is sufficient for a bounded authoring pilot: it already represents country packs, locations, encounters, vocabulary, step types and source IDs. A new generalized schema is not justified at this research gate. [CONTENT-01-source-inventory.md](CONTENT-01-source-inventory.md#evidence-boundary)
2. Official ESL/assessment sources are excellent design references, but their presence does not grant permission to copy text, exam items, answer keys, audio or video. British Council, VOA, IELTS, TOEFL and Cambridge are therefore mainly YELLOW/REFERENCE ONLY. [Assessment research](CONTENT-01-assessment-research.md)
3. CC BY/CC BY-SA/NC/ND differences materially affect ATLAS distribution: BY permits commercial adaptation with attribution, SA adds downstream licensing, NC blocks commercial use, and ND blocks distributed adaptations. [Creative Commons license guide](https://creativecommons.org/share-your-work/use-remix/cc-licenses/)
4. Unsplash and Pexels provide useful transformed visual supply, but their own restrictions still require no unmodified resale, no competing-image compilation, and no implied endorsement. [Unsplash license](https://unsplash.com/license), [Pexels license](https://www.pexels.com/license/)
5. The highest-value content unit is a communication intent, not a phrase list: ask direction, clarify, purchase, repair a misunderstanding, report a problem, compare routes and interpret a notice. These intents port across countries while local facts and etiquette remain scoped.

## Biggest current ATLAS gaps

- Narrow breadth: current readable travel content is concentrated in Tokyo and a small set of practical encounters; new packs need source-backed breadth without silently borrowing unsupported C0 language.
- Limited evidence modes: current C0 boundaries are recognition/controlled reading; listening, speaking rehearsal, productive recall, transfer and mastery need separate contracts and review.
- Rights provenance is not yet an asset manifest: source IDs exist for travel facts, but asset-level creator/license/attribution/changes records are required before media bundling.
- Cultural review bottleneck: country packs can easily turn local, venue-specific or regional behavior into a universal rule.
- Current-fact volatility: transport fares, routes, opening hours and airport procedures need source date/version and refresh triggers.

## Recommended next implementation milestone

**Research/content gate only:** produce editorial specifications for the three first packs. Each specification should include 3–5 learning objectives, 8–12 original scenario records, source/rights records, EN review checklist, VI review checklist, and a Tower candidate map. Stop before code/schema/import. Promote only records with GREEN rights or YELLOW fact-only transformation plus all required editorial signoffs.

## Opportunity status decision

| Opportunity | Final status |
|---|---|
| Tokyo continuation: directions, food, airport recovery | READY TO AUTHOR |
| Singapore MRT and Changi arrival | RESEARCH COMPLETE — EDITORIAL REQUIRED |
| London platform/café/workplace English | RESEARCH COMPLETE — EDITORIAL REQUIRED |
| Italy rail/ticket validation/food | RESEARCH COMPLETE — EDITORIAL REQUIRED |
| Paris metro/museum | RESEARCH COMPLETE — EDITORIAL REQUIRED |
| Seoul transfer/kiosk/lost-and-found | RESEARCH COMPLETE — EDITORIAL REQUIRED |
| US/Australia/Canada nature-safety packs | RESEARCH COMPLETE — EDITORIAL REQUIRED |
| Dictionary-derived vocabulary | RESEARCH COMPLETE — EDITORIAL REQUIRED |
| Licensed listening/audio redistribution | BLOCKED until per-item rights are verified |
| Direct exam-bank reuse | REFERENCE ONLY / do not ingest |
| YouTube/copyrighted video download or transcript redistribution | REFERENCE ONLY unless rights explicitly permit |

## Evidence ledger

### E01 — current ATLAS content contract

**Type:** DIRECT · Tier 1 repository source. **Locator:** `D:\ATLAS-Hub\content\travel\types.ts`, `content\travel\japan.ts`, `content\tower\types.ts`, `docs\game-01\c0\C0-content-contract.md`, `docs\game-01\c0\C0-learning-objectives-and-provenance.md`, accessed 2026-10-31. **Supports:** current country-pack, encounter, vocabulary, source-ID, bilingual and step structures; existing C0 scope. **Does not support:** educator approval, CEFR validation, production readiness or deployed behavior. **Independent verification:** not performed; direct file inspection only. **Limitations:** repository Git control access returned Permission denied, so branch/status was not independently inspected.

### E02 — CEFR evidence boundary

**Type:** DIRECT · Tier 1 official source. **Locator:** [Council of Europe CEFR Companion Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions), accessed 2026-10-31. **Supports:** use of illustrative descriptors for communicative activity and level planning. **Does not support:** a validated CEFR label for ATLAS items. **Independent verification:** not performed.

### E03 — open license semantics

**Type:** DIRECT · Tier 1 license owner. **Locator:** [Creative Commons license guide](https://creativecommons.org/share-your-work/use-remix/cc-licenses/) and [FAQ](https://creativecommons.org/faq/), accessed 2026-10-31. **Supports:** BY/BY-SA/NC/ND permission differences and attribution/ShareAlike constraints. **Does not support:** rights to a particular third-party asset until its exact file license is inspected. **Independent verification:** not applicable; license guidance directly inspected.

### E04 — asset repositories

**Type:** SOURCE_CLAIM · Tier 1 publisher terms. **Locator:** [Wikimedia reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia), [Unsplash license](https://unsplash.com/license), [Pexels license](https://www.pexels.com/license/), accessed 2026-10-31. **Supports:** stated repository/license rules and restrictions. **Does not support:** every individual upload’s provenance, model release, trademark or public-personality clearance. **Independent verification:** not performed per asset; item-level check remains required.

### E05 — ESL and daily-English sources

**Type:** SOURCE_CLAIM · Tier 1 publisher pages. **Locator:** [British Council listening](https://learnenglish.britishcouncil.org/free-resources/listening), [audio series](https://learnenglish.britishcouncil.org/free-resources/general/audio-series), [VOA Everyday Grammar](https://learningenglish.voanews.com/p/9392.html), accessed 2026-10-31. **Supports:** situation-based practice, level-organized listening/grammar and everyday communication topics. **Does not support:** permission to reproduce lessons/audio/transcripts. **Independent verification:** not performed.

### E06 — assessment principles

**Type:** SOURCE_CLAIM · Tier 1 official assessment owners. **Locator:** [IELTS format](https://takeielts.britishcouncil.org/en-gb/what-is-ielts/how-it-works/test-format), [IELTS listening types](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-listening), [TOEFL content](https://www.ets.org/content/ets-org/language-master/in/home/toefl/institutions/ibt/about/content-structure.html), [Cambridge assessment approach](https://www.cambridgeassessment.org.uk/cambridge-approach/assessment/), accessed 2026-10-31. **Supports:** published task-format/design observations. **Does not support:** copying proprietary content or claiming ATLAS equivalence. **Independent verification:** not performed.

### E07 — country opportunity sources

**Type:** SOURCE_CLAIM · Tier 1 official tourism/transport sources. **Locator:** JNTO/GO TOKYO, VisitBritain, City of Paris, Italia.it, Tourism Australia, Destination Canada, Visit Singapore, Visit Seoul/Seoul government; links are listed in [country opportunity map](CONTENT-01-country-opportunity-map.md#source-anchors-inspected), accessed 2026-10-31. **Supports:** candidate procedures, locations, transport concepts and source-owner paths. **Does not support:** permanent fares/schedules, universal cultural claims or final mission copy. **Independent verification:** not performed across all local operators; refresh before publication.

## Counterevidence and risks

- A larger bank is not automatically better: current C0 provenance docs explicitly limit the airport slice to a small taught vocabulary/sign/request scope. Expanding item count without new reviewed lessons risks unsupported content. [E01]
- “Open” repositories still have file-specific rights and non-copyright issues such as privacy, publicity, trademarks and endorsement. [E03][E04]
- Assessment formats change and are purpose-specific; IELTS General Training, IELTS Academic and TOEFL cannot be treated as one universal A2–B1 blueprint. [E06]
- Official tourism pages are current but mutable; fares, routes, opening hours and procedures need dated refresh checks. [E07]

## Stop / promotion / revisit gates

- **Promote to authoring:** objective is narrow; source facts are inspected; rights are GREEN or the content is an original transformation of YELLOW facts; source/date and review owner are recorded.
- **Hold for editorial:** any level label, cultural claim, health/emergency wording, Vietnamese nuance, distractor or retry strategy lacks independent review.
- **Block:** audio/video or image rights are unclear; a proposed item copies proprietary material; an ND/NC/SA constraint conflicts with distribution; live operational facts cannot be refreshed.
- **Revisit:** before publication, recheck mutable transport/venue pages and each asset record; after the first player test, revise any item with multiple defensible answers, unreadable evidence, or a mismatch between intended and observed skill.

## Final recommendation

The first three packs should be Tokyo continuation, Singapore MRT and London transport/café. They maximize reuse of ATLAS’s existing travel interactions while broadening practical English. Keep the work at the review gate: author original content only after English/Vietnamese/cultural/licensing checks, and do not implement a new schema until the actual authored pack exposes a contract gap.
