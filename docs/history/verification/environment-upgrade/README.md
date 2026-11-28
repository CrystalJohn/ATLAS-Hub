# ATLAS environment artwork upgrade

Scope: The Disappearing Lake location cards only. Official owner-supplied artwork now identifies Shaded Stream and Sunlit Bay in the existing investigation and revisit presentation. The scientific schematic remains available under “Compare the site schematic”; the comparison chart, measurements, claims, citations, source library and disclaimers are preserved.

## Asset mapping and provenance

| Supplied asset label | Project file | Source dimensions |
| --- | --- | --- |
| sunlit_mossy_forest_stream.png | public/assets/regions/nature-realm/shaded-stream.png | 1448 × 1086 |
| sunlit_turquoise_forest_lake.png | public/assets/regions/nature-realm/sunlit-bay.png | 1448 × 1086 |

The actual uploads were JPEG files `49EA4D01-2F29-40E0-9110-9DE158E30008.jpeg` and `458857DA-E6B3-498A-A2A7-2AD39E7C9251.jpeg`. Required PNG copies preserve their decoded RGB pixels without retouching, text, resizing or destructive cropping. `artwork-provenance.json` records hashes, dimensions, derivatives and the limited owner-authorized ATLAS usage context. No third-party license or general redistribution rights are asserted.

Each PNG has WebP derivatives at 480, 960 and 1448 pixels wide, quality 86, Lanczos resizing. The 480px files are 76,604 / 75,602 bytes; 960px files are 249,480 / 245,046 bytes. Responsive picture sources reduce mobile transfer; required PNGs remain fallbacks. Full-scene WebP files are 469,962 / 448,840 bytes.

## Components and presentation

- `app/components/LakeInvestigation.tsx` renders artwork inside each existing location card, ahead of the original inspect/revisit control and readings.
- `app/components/LocationArtwork.tsx` provides the accessible image button, bilingual caption/provenance and native full-scene dialog.
- `content/artwork/nature-realm.ts` holds typed scene metadata separately from scientific evidence.
- `app/chapter.css` adds scoped styling using the current card, color and button system.

Card artwork uses a 4:5 portrait viewport, `object-fit: cover`, focal position 50% 58% for the stream and 58% 50% for the bay. This keeps canopy, cascades, water, shoreline and distant landscape in view. Expansion shows the complete 4:3 composition with `object-fit: contain`. Text remains HTML outside the image. Only wide hover-capable screens without reduced-motion preference receive a 1.025× hover zoom; mobile stays static. Expanding artwork does not inspect, record or award anything.

## Verification — 2026-10-18

Browser checks used the actual production components in a temporary local QA fixture with pre-recorded clues, no player identity and no API writes. The fixture was removed before packaging. Screenshots show the same bilingual returning-player/revisit state before and after.

- 320px, 390px, 768px and 1024px iframe viewport widths: no document horizontal overflow. Both location images load; 390px view initially selects the 480px WebP variants.
- English-only and Vietnamese assistance: scene labels, alt text, captions and dialog controls follow the existing setting; scientific translations remain visible when enabled.
- Enter and Space open the dialog. Escape and the close button dismiss it and restore focus to its image trigger. At the 320px viewport, the dialog fits within the available width and contains the full image.
- Existing measurement table, simulated-data warnings, hypothesis classification and 22 rendered USGS/EPA citation links remain present in the completed fixture.
- TypeScript, existing evidence-render checks, chapter UI checks and evidence publication validator pass. Citation and evidence records were not edited; no new scientific claims were added.

This is component-level browser verification in Chromium, not a fresh authenticated mission completion or a physical iPhone/Safari test. Mission evaluation, reward, progression, unlock and server API files are unchanged.

## Screenshots

- `before-mobile.jpg`: baseline, 390 × 780.
- `after-shaded-stream.jpg` and `after-sunlit-bay.jpg`: 390 × 936 mobile viewport crops of browser screenshots; only the external QA control area was removed.
- `before-after.png`: labeled side-by-side composition of those screenshots, with no fabricated interface content.
