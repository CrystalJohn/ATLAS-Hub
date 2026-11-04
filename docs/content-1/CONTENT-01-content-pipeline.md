# ATLAS CONTENT-01 — Reusable content-production pipeline

| Stage | Input | Output | Owner | Validation | Blocking condition |
|---|---|---|---|---|---|
| SOURCE | official/OER/asset candidate | source record and URL | researcher | source inspected, tier and date recorded | source inaccessible or provenance unknown |
| SOURCE REVIEW | source record | scoped facts, intents, language observations | researcher + curriculum designer | claim boundaries and contradictions logged | copied text or unsupported generalization |
| RIGHTS / LICENSE CHECK | exact text/audio/image/file | GREEN/YELLOW/RED/REVIEW REQUIRED | licensing reviewer | exact license, attribution, commercial/adaptation check | rights unclear, NC/ND conflict, privacy/trademark concern |
| LEARNING OBJECTIVE | reviewed evidence | measurable objective | curriculum designer | one construct, observable action, no CEFR overclaim | objective depends on untaught content |
| ORIGINAL ATLAS AUTHORING | objective + evidence | EN-first original unit and VI support | content author | provenance, originality, scope labels | source text copied or scenario facts not supported |
| ENGLISH REVIEW | authored EN | corrected English and intent/register notes | independent English reviewer | naturalness, distractor validity, level hypothesis | no independent reviewer |
| VI REVIEW | EN + VI | learner-appropriate Vietnamese support | independent Vietnamese reviewer | meaning, register, cultural clarity | translation adds/removes learning target |
| GAMEPLAY ADAPTATION | reviewed unit | encounter/question/Tower record | game content designer | stable IDs, retry family, feedback/lesson links | runtime contract mismatch |
| QUESTION QA | item set | QA record | assessment/editorial QA | answer uniqueness, rationale, bad distractors, coverage | multiple defensible answers or no evidence |
| PLAYER TEST | build + QA set | observed usability/learning issues | product/UX + educator | no clipped controls, readable copy, behavior logged | test claims exceed tested environment |
| VERSIONED PUBLICATION | approved package | versioned content release | content owner | rights manifest, review signoffs, release diff | pending signoff, unresolved rights, stale live facts |

## Proposed statuses

`DRAFT → SOURCE-REVIEWED → RIGHTS-CHECKED → EN-REVIEWED → VI-REVIEWED → GAMEPLAY-QA → PLAYER-TESTED → PUBLISHED`.

Status is not approval by itself. A source can be rights-cleared while the cultural or language review is still pending.

## Blocking principles

- No production import from the research inventory.
- No exam question or audio redistribution.
- No asset use without item-level rights evidence.
- No country-wide cultural rule from a single city or anecdote.
- No CEFR certification claim from an ATLAS exercise without an independent validation process.
- No listening/speaking claim from a reading or selection interaction.
