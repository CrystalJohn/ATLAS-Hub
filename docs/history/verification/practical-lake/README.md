# Everyday English direction correction — 2026-10-19

## What changed

The lake introduction, selected-level A1/A2/B1/B2 readings, comprehension choices and feedback now use short practical comparisons and ranger dialogue. The primary field path explains oxygen in plain language and provides every observation needed for the decision. It requires no calculation or external scientific knowledge.

After visiting both sites, players can ask Elara three questions and revisit four focus expressions. This is an optional reading interaction, not a listening/speaking assessment. No audio or automated translation/evaluation service is introduced.

Charts, full pollution report, citations, original technical notes and advanced explanations remain available through native Learn More disclosures. The original fictional-data tags, artwork attribution and reveal-after-attempt restriction are preserved. Technical notes shipped to the browser omit evaluation keys.

The general direction is documented in docs/LEARNING-CONTENT-DIRECTION.md. The rest of the game, content regions and UI design system are not redesigned.

## Verification

Browser QA used the actual LakeInvestigation, LakeConversation, ChapterEnglish, EvidencePanel and MissionStory components in a temporary presentation fixture. No player identity or production API writes were used. Fixture observation callbacks are local UI state; server behavior was tested separately with the existing D1 tests. The route was removed before publication.

- At 1280px desktop and 390px mobile iframe width, controls and responses render correctly. Mobile document width/scrollWidth both 375px (scrollbar excluded); no horizontal overflow.
- Inspected both sites, recorded the comparison and ranger note, and reached the enabled continuation with the science disclosure still closed.
- Enter activates a ranger question. The response changes with A1/A2/B1/B2 selection.
- Turning Vietnamese off removes Vietnamese spans in the lake investigation.
- Learn More opens with Enter, exposes all three authoritative source links and original technical notes. Opening sources is not part of completion.
- The English reading is conversational; its Vietnamese summary is collapsed until requested and opens with Enter.

Actual D1 tests verify full chapter completion, unchanged 30/60/120 XP rewards (210 total), retries, concurrent submission idempotency, strict validation, persisted attempts and separate English evidence. The full-chapter test also completes the lake with no lake English items submitted. English CEFR proficiency stays unassigned and speaking stays NOT_ASSESSED.

The publication audit covers 187 fields, including new dialogue and retained technical copy. Existing USGS/EPA sources and measured/simulated classifications remain intact; no factual source was replaced. Independent educator/CEFR review of editorial content is still pending, as displayed by the private pilot.

Screenshots are actual browser captures cropped only to remove external QA controls. The UI remains normally scrollable; this change does not claim that the whole investigation fits one viewport.
