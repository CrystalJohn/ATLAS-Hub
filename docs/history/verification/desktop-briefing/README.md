# Desktop mission briefings — 2026-10-19

The presentation-only browser fixture rendered the actual MissionStory component and production chrome styles, with authored B2 content and Vietnamese enabled. No player identity or API writes were used. The temporary fixture was removed before packaging.

Chromium DOM checks:
- All three mission briefings at 1280×720, parallel bilingual mode: scrollHeight 720 and scrollWidth 1280. Start buttons ended at y=556, 617 and 576 respectively.
- Restore the Ecosystem at 1360×768 and 1920×1080: document height equals viewport height, no horizontal overflow; two columns.
- Mobile iframe 390×844: usable content width 375 after scrollbar; scrollWidth 375, single column, normal vertical scrolling.
- Enter opens the native Vietnamese disclosure. Parallel mode remains selected after reload. Start invokes the unchanged callback.

Screenshots are actual browser captures, cropped only to exclude the external QA controls. Capture scaling yields 1259×708 pixels for the logical 1280×720 viewport.

The no-scroll result applies to these mission introductions at normal text sizing, not arbitrarily expanded disclosures, larger accessibility text, or every gameplay stage. Scientific content, citations, mission evaluation and server-authoritative rewards/progression are unchanged.
