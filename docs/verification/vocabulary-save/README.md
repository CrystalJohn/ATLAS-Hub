# IPA and saved vocabulary — 2026-10-19

The contextual reading popover now shows reviewed US/UK IPA for all 12 glossary entries, a dictionary reference link, and a Save word / Saved word toggle. Save sits ahead of the example so it remains prominent in a constrained popover. My journal now includes My saved words, meanings/examples with optional Vietnamese, IPA and removal controls. Existing encountered-word and exercise-review sections remain.

## Data and evidence

`content/english/pronunciation.ts` stores reviewed IPA, source organization, exact reference URL, verification date and derivation notes. Cambridge Dictionary pronunciation pages were checked through indexed source retrieval; direct page retrieval returned 403. The plural insects is explicitly derived from insect with /s/ after /t/. Monitoring is checked against the monitor inflection and the monitoring portion of the electronic-monitoring pronunciation. No source audio or example text was copied. IPA is educational reference content; displaying it or saving a word does not demonstrate pronunciation, speaking or listening mastery.

## Persistence

Authenticated GET/POST `/api/vocabulary` uses the existing player-scoped D1 expedition document with an optional savedVocabulary property. Old documents need no schema migration. The server accepts only known lesson/version/word identities and a desired saved boolean. Saved words are idempotent, bounded by the authored glossary and filtered by existing mission access when adding. No client text, timestamps or reward fields are accepted. Removal and save responses are confirmed before the UI reports success. Load/save failures expose retry controls.

Vocabulary updates use the existing document revision compare-and-swap and preserve progress, submissions and the ledger. The provider submits explicit identity fields, including when removing a journal row containing a savedAt field. No local-only fallback claims account persistence.

## Verification

- `test-vocabulary.mts`: real local D1; old documents, authenticated isolation, origin/strict input/catalog validation, locked lessons, duplicate/concurrent saves, remove/reload, and a reward submitted concurrently with a save.
- `test-atlas.mts`: complete original chapter, 12 concurrent reward requests, 210 XP, persistence/replay protection and isolation.
- `test-chapter.mts`: all 24 band/item combinations, per-item retry, eight concurrent English submissions, preserved old attempts and mastery boundaries.
- `test-chapter-ui.mts`: existing SSR translation/mission rendering checks, plus the expanded component dependency graph.
- TypeScript and production build with the scientific evidence publication gate.

Browser verification was attempted but the cloud browser rejected the preview with ERR_BLOCKED_BY_CLIENT; a subsequent observation was rejected by its URL policy. No workaround was attempted. The temporary controlled-response visual fixture was removed. There is no new browser screenshot or claim of authenticated browser/Safari verification for this change.
