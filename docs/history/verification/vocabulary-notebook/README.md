# Vocabulary notebook — 2026-10-19

Replaces only the journal's encountered-word accordion with a responsive study-card collection. The existing practised-lesson filter, account vocabulary API, progression and reward handling are preserved.

Each of the 12 glossary entries has a visual, part of speech, short English definition, existing US/UK IPA reference, original lesson example, contextual chunk and the existing SaveWordButton. Existing Vietnamese meanings, examples and explanations are reused without adding a translation service. Sentence translations open on demand. New English presentation copy remains part of the educator-review draft.

Scene artwork uses existing project-owner assets and per-word crops; responsive 480/960 WebP sources retain original provenance. Eight original lightweight SVG concept illustrations live in public/assets/vocabulary, with provenance.json. They are learning aids, not observational evidence or real measurements. Scientific mission sources are unchanged.

Browser checks used the real VocabularyNotebook and SaveWordButton with a temporary UI-only context fixture, removed before publishing. They do not claim authenticated production end-to-end verification.
- Desktop iframe width 1280: two columns; document content width/scrollWidth 1265, no horizontal overflow.
- Mobile iframe width 390: one column; content width/scrollWidth 375, no horizontal overflow.
- Searching “bóng” returns shade; all 12 terms can be searched.
- Enter expands the native sentence translation disclosure.
- Save and remove update the real button's pressed/confirmation UI using a fixture store.
- Turning Vietnamese off removes all lang=vi content from the notebook.
- Visible illustrations load; below-fold images use native lazy loading.

Actual D1 vocabulary tests separately pass auth/origin validation, catalog validation, duplicate/concurrent saves, remove/reload, isolation and reward integrity. TypeScript, chapter UI checks and the publication evidence gate are also run. IPA metadata and source URLs are retained from the existing registry. Cambridge search results confirmed relevant reference pages; direct retrieval returned 403 for some pages, so this is not an assertion of continuous external-link availability.

Screenshots are actual browser captures of the temporary UI fixture, cropped only to remove its external controls. Native document scrolling is preserved for the word collection.
