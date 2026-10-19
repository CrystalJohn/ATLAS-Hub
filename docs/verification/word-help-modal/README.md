# Compact contextual word help

The current `ChapterEnglish` activity now opens contextual word assistance in a small native dialog. Mobile places it near the bottom edge with a safe-area gap; wider screens center a 380px card. The existing meanings, explanations and example sentences are unchanged. Vietnamese assistance follows the existing setting. The reading passage no longer expands to insert a word card.

`WordHelpDialog.tsx` manages presentation only. It locks background scrolling while open, uses the native modal top layer, supports backdrop dismissal, Escape, a 44px close button and “Back to reading”. Tab and Shift+Tab cycle between its two controls; dismissal returns focus to the exact word trigger without scrolling. The existing glossary-use flag still records the lookup; evaluation requests, item queues, answer handling, XP and progression are unchanged.

Verified 2026-10-19 (Asia/Ho_Chi_Minh), using actual ChapterEnglish content in a temporary isolated browser fixture without player identity or API writes:

- 320px: 288px-wide dialog; longest forest entry fits and does not create horizontal overflow.
- 390px: 358px-wide bilingual insects dialog, about 407px high. Passage scrollTop remained 159px across open, Escape, reopening and “Back to reading”.
- 768px: centered 380px English-only dialog with no Vietnamese content.
- Enter, Space, Escape, close button, backdrop dismissal, Tab/Shift+Tab boundary wrapping and focus restoration verified in Chromium. The keyboard cycle was checked on the direct page, separately from the responsive iframe.
- TypeScript and the existing chapter UI/translation checks pass. Production build also runs the unchanged evidence publication gate.

`mobile-modal.jpg` is the actual 390px browser viewport cropped from the QA page to remove external QA controls. The temporary route was removed before publication. No physical iPhone/Safari or authenticated mission completion test was performed for this presentation change.
