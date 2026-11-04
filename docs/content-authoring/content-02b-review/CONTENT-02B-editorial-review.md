# CONTENT-02B editorial review

2026-11-04 · AI adversarial review · DRAFT corrections only.

## Reviewer independence and scope

This is a fresh adversarial AI review of the CONTENT-02A package. The same assistant participated in authoring, so it is not independent human educator signoff. No external ESL educator, bilingual human editor or assessment reviewer was available. Human identity/signature fields remain null. Review categories describe observed text quality; they do not certify education, CEFR, learning efficacy or production rights.

Read all 14 files under content-02a-tokyo, including structured records, their Markdown views, private keys, source/asset register, architecture, objectives, matrix, final report and verifier. The structured records are authoritative for detailed field checks. The source snapshot records a SHA-256 for every input file. Matrix includes 310 review units: scenarios, EN/VI lessons, interaction plans, scenario metadata, objectives, every Tower family/variant/option, glossary/chunk rows, sources, assets and scripts. Documentation and generated views are assessed as system artifacts; no separate independent learner record is invented for duplicate text.

Current product context was inspected in content/travel/japan.ts, content/travel/types.ts and content/tower/types.ts. The live authored Tokyo pack uses inspect/target/dialogue/route/order/compose, bilingual Copy and fictional route/menu contexts. Its airport lesson covers signs, a station request and locating the station; it cannot establish exposure to this expansion. Current Tower schema has narrow P01–P08 source references, cued-recognition evidence, five floors and two-part boss semantics. This expansion's metadata is not plug-compatible with it.

## Findings requiring correction

1. **MAJOR EDIT / AMBIGUOUS — BLOCK: TWR-TKY-007-V1 and V2.** The stem only asks for no egg/onions. Both vegetable and chicken orders can satisfy that preference. The private key assumes a desired dish not specified in the question. r2 names both desired dish and omitted ingredient in source and prompt. This is a material correction; structural r1 PASS did not detect it.
2. **MAJOR EDIT: TKY-DAILY-012-L1/L2.** A learner who thinks they heard 40 should ask about 40, then receive correction to 14. r1 magically asks about 14. r2 restores suspected detail → correction → confirmation. Removed unused mean/I meant references from this scene; they are not taught by the original passage.
3. **MAJOR EDIT: TKY-DAILY-006-L2.** Bag choice and payment choice occur after payment in r1. r2 moves these before payment, then asks for receipt. Script 005 v2 separates the compressed cashier prompt into turns; final request occurs after payment.
4. **MAJOR EDIT: TWR-TKY-010 evidenceType.** Selecting a repetition phrase is recognition. r2 corrects this; no MC variant establishes spontaneous repair, speaking or productive recall.
5. **MAJOR EDIT: TKY-DAILY-009/011/012 listening labels.** There is no audio. r2 labels current modality TEXT_ONLY and makes future audio explicit. r1 deliberately missed detail is a scripted role-play premise, not measured auditory difficulty.
6. **MAJOR EDIT: retries 003 and 010.** Renamed stops/lines or exit labels with the same reasoning are WEAK. Do not count them as robust replay variety. These remain unresolved rather than padding the bank with new scenarios.
7. **MAJOR EDIT: 003 distractor.** Get off and stay on the same line is internally inconsistent as written. r2 substitutes a reversed transfer/destination route. The weak family retry still needs revision.
8. **MAJOR EDIT: 008 feedback.** Ask for payment describes a server collecting money, not a diner requesting the bill. r2 corrects the role. Praise/preference distractors remain weak; no silent approval.
9. **MAJOR EDIT: unprovided stimulus/map support.** Several questions assume a board or map is visible, but the presentation JSON has no neutral stimulus field. The lesson embeds modeled answers; copying it wholesale into assessment leaks the answer. Define reviewed neutral stimulus separately before integration.
10. **MINOR EDIT: VI 011 local train.** Tàu thường is vague. r2 describes a train stopping at stations along the route. Do not overtranslate this as an operational rule about actual Tokyo service.
11. **MINOR EDIT: VI direct.** Đi thẳng may mean a straight physical direction; use không cần đổi chuyến when this is the intended service condition.
12. **MAJOR/MINOR glossary gaps.** VS-order-food merges noun/verb and links incorrectly to 006; by-card lacks a CH ID; VS-room-number example introduces upstairs without teaching it; CH-ask-directions/CH-ask-departure-time are named but not modeled in linked source; VS-nearest needs comparative geometry or explicit staff instruction. Definitions alone are not taught content.

## English, VI and difficulty judgments

English is mostly grammatical and usable in staff/customer scenes. Short service replies and Can/Could variants should not be ranked as universally right/wrong. Bill/check are accepted restaurant variants. I didn't catch that can implicitly request repetition in context; it must not be marked wrong merely because it lacks an explicit repeat verb.

VI paragraphs often summarize English turns rather than preserving their functional forms. That is acceptable as explanatory support, but insufficient as an equivalent alternate test form or a bilingual script lock. Full passages/VI values must stay out of pre-answer listening assessment; otherwise evidence is supported reading. No assumption that translations are independently reviewed.

A2–B1 remains an editorial hypothesis. Multi-service conditions, role-correct repair, and landmark routes may create B1 workload even with short sentences. Information counts are inconsistent: 002 tracks three services, departure/change properties and two goal constraints, not simply four facts. Use a consistent counting rule before calibration. Token-compose is controlled construction. Reading a model then selecting it is recognition. Repeating a time from memory is narrow recall, not mastery. No item currently measures cross-country transfer.

## Cultural, source and asset decisions

Fictional route, time, menu and price claims remain explicitly scene-bound. Keep all real operator procedures REFRESH_REQUIRED_BEFORE_PUBLICATION. Narita rail and British Council request guidance were reopened on 2026-11-04; neither authors our dialogue or validates fictional data. Cambridge catch returned 403, so no fresh dictionary verification is claimed. Asset license records are inherited candidate evidence and were not legally re-cleared.

References: [British Council requests](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/requests-offers-invitations), [Narita rail](https://www.narita-airport.jp/en/access/train/). These pages support contextual usage and real rail access only. No external passages, exercise items, media or dictionary examples were imported.

## Correction provenance and unresolved work

Original CONTENT-02A files remain unchanged. TOKYO-scenarios.r2.json, TOKYO-tower-candidates.r2.json and private r2 keys are correction proposals, not releases. IDs are retained; revision becomes TOKYO-DAILY-r2; exact lesson hashes and all candidate dependencies are recomputed. CONTENT-02B-change-log.json records explicit text changes. Compare r1/r2 JSON for full metadata changes, including evidencePolicy, source references and modality labels.

The remaining work is concrete: meaningful retries 003/010; retry table-number input in 011; complete intended language exposure/glossary links; independent bilingual review; neutral assessment stimuli; oriented maps/menus/boards; plausible distractors and accepted paraphrases; measured audio/visual/accessibility QA. Do not treat source linkage or hash validity as proof these tasks are educationally sound.
