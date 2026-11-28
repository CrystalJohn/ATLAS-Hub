# Contextual word popover — 2026-10-19

Supersedes the bottom mini modal in `word-help-modal`. The current ChapterEnglish reading passage uses one shared Base UI Popover with detached word triggers. Base UI was already installed; no dependency or service was added.

The popup sits above the selected word with an arrow, flips below when needed, and shifts within the viewport. It is non-modal: no backdrop, page scroll lock or focus trap. A visible alternative word can be selected directly; the active trigger is highlighted. Escape, the close button and outside interaction dismiss it. Existing glossary content and Vietnamese support are preserved. No audio, generated translation, dictionary service or word-saving feature is implied by this UI change.

Only presentation and the existing SSR test compiler imports changed. The glossary lookup flag continues to be set on word activation. Question queues, answer submission, reward calculations, mission evaluation and progression were not edited.

## Browser verification

Actual ChapterEnglish content was rendered in a temporary isolated QA fixture, with no player identity or API writes. The fixture was removed before build/publication.

- 320px viewport: 288px popup; no horizontal document overflow. Native pointer selection switched directly from canopy to insects while the popup was open.
- 390px viewport: 350px bilingual popup with an arrow pointing at insects. Opening/closing with Escape kept the reading scrollTop at 139px and restored focus to that trigger.
- Native background scrolling changed placement from below to above as available space changed; the popup tracked its word without locking the page.
- Outside checkbox interaction dismissed the popup and changed language assistance in the same interaction.
- 768px viewport: 350px English-only popup, with no Vietnamese content. Enter and Space open it; Escape closes and returns focus to the word.
- TypeScript and the existing chapter UI/translation checks pass. The production build runs the existing scientific evidence publication gate.

`mobile-popover.jpg` is the actual 390px browser viewport crop; external QA controls were removed. This is Chromium component verification, not a physical iPhone/Safari or authenticated mission completion test.
