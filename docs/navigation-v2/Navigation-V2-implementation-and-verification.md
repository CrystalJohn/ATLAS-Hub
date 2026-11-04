# Navigation V2 — local implementation and verification

Date: 2026-10-30. Branch: codex/game-01-t3-dungeon-ui. Local review only; no commit, push, deployment or production data operation.

## Delivered behavior

Two equal world destinations, one contextual section navigation, global My Journal/How to Play utilities. Travel has World Map / My Journey / Passport. Nature has Realm Map / My Journey / Field Journal. Current world and section derive from fragment URLs, including browser history. Travel resume uses the authenticated resume target; nature mission refresh restores the authorized attempt through the existing entry path. No progression, reward, auth or schema implementation changed.

Passport retains stamps and achievements; global Journal retains shared saved words. Field Journal exposes the real existing nature lesson/retry/notebook functionality. Existing account settings and language remain accessible. Reading preferences are removed from unrelated Passport/map pages. Mobile uses an in-flow world switch and section row, no fixed bottom bar, with 44px navigation targets and visible keyboard focus. Maps, mission content and Tower rules are preserved.

## Files introduced or modified for this task

| File | Responsibility |
|---|---|
| app/components/atlas-navigation.ts | Validated world/section URL parser, history subscription and navigation |
| app/components/WorldNavigation.tsx | Shared links, world selector, contextual sections and header utilities |
| app/components/Game.tsx | Global shell, route-derived nature screens, mission restoration, journal separation |
| app/components/travel/WorldTravel.tsx | Route-derived travel screens, safe unavailable-link recovery, authoritative resume and empty journey action |
| app/navigation.css | Desktop/mobile composition, world accents, focus and reduced motion |
| app/layout.tsx | Load navigation styles after existing styles |
| scripts/test-navigation-v2.mts | Pure URL contract tests |
| scripts/test-navigation-v2-browser.mts | Disposable PostgreSQL/synthetic-auth browser flow and responsive assertions |
| docs/navigation-v2/Navigation-V2-audit-and-spec.md | Audit, actual destination ownership and specification |
| docs/navigation-v2/Navigation-V2-implementation-and-verification.md | This report and decision log |

Existing dirty TowerProgress.tsx, TowerReview.tsx, tower.css, GAME-01 docs/output and root planning files were preserved. They are not changes made for Navigation V2. Dedicated scratch planning lives in work/navigation-v2 (ignored work area). No dependencies, server handlers, migrations, production configuration or gameplay content were added/changed for Navigation V2.

## Actual verification

| Command / check | Result | Evidence and scope |
|---|---|---|
| node scripts/test-navigation-v2.mts | PASS 3/3 | URL round trips, legacy anchors, malformed/cross-world recovery |
| node scripts/test-navigation-v2-browser.mts | PASS 18 groups | output/navigation-v2/browser-results.json and browser-test.log |
| node scripts/test-travel.mts | PASS | Existing pack/actions, locks, all four encounters, five stamps, concurrent rewards, saved vocabulary and Forest preservation; existing D1-style fixture suite |
| node scripts/test-atlas.mts | PASS | Existing D1 schema fixtures, mission completion, 210 XP chapter, replay and concurrent first-clear checks |
| node scripts/test-profile.mts | PASS | SDK/API fixtures; SQL static only |
| node scripts/test-supabase.mts | PASS | SDK/API fixtures; no hosted OAuth or PostgreSQL in this particular suite |
| npx tsc --noEmit | PASS | output/navigation-v2/typescript.log; build also typechecked |
| npm run lint | PASS with warnings | 0 errors, 9 warnings: seven existing img warnings, two pre-existing work/game-01-t3 unused helpers. No new Navigation V2 warning |
| npm run build | PASS | Next webpack production build; output/navigation-v2/build.log |
| node scripts/test-tower.mts | FAIL 1/27; behavior 26/26 PASS | Existing static import guard rejects type-only TowerPresentation import in the pre-existing uncommitted TowerProgress.tsx; output/navigation-v2/tower.log. No engine/runtime change made here |

Initial verification exposed a screenshot scroll/sticky capture artifact; captures now scroll to the top before mobile screenshots. The initial browser reporter had a missing fs import and the first reusable harness lacked TypeScript annotations; both were corrected and rerun successfully. These failures were in the test harness, not reported as passed runs.

Browser fixture forwards UI/static requests to local Next on port 3000 and intercepts every /api/* request using existing handlers with synthetic auth, disposable PostgreSQL/PostgREST and an isolated draft Tower runtime. It does not use the signed-in player's hosted database. Test assumes local Next is already running and uses the installed Chrome/bundled Playwright path recorded in the script; no dependency installation required.

### Browser oracles observed

- Travel map -> Japan chapter -> jp-arrival encounter, URL and content agree.
- Resume from My Journey returns the server checkpoint; Passport remains reachable and has no reading selector.
- Travel -> Nature -> Travel state snapshots are deeply equal: browsing worlds writes no progression.
- Nature map -> journey -> silent-forest mission; refresh restores the authorized mission screen.
- Back/Forward change URL-derived sections correctly. Direct travel encounter URL survives refresh.
- Global saved vocabulary and actual nature review/notebook screens are still reachable. Help is accessible.
- At 320, 390, 768, 1024 and 1440px: both world maps have no document horizontal overflow; navigation links are at least 44px high. Focus styles inspected; keyboard Enter navigation and aria-current asserted. Reduced-motion preference is honored.
- Invalid encounter ID has a safe recovery destination.
- Navigation does not award XP or complete missions (authoritative snapshots).
- Bob has independent empty progression and a working empty-journey action. Expired cookies yield API 401 and remove authenticated world navigation. Alice login restores the original checkpoint and travel state.

## Screenshots

1440px desktop and 390px mobile, synthetic account only:

- ../../output/navigation-v2/travel-desktop.png
- ../../output/navigation-v2/nature-desktop.png
- ../../output/navigation-v2/travel-mobile.png
- ../../output/navigation-v2/nature-mobile.png

Screenshots were visually inspected. UI imagery/content were preserved. Screenshots reflect dev-mode Next indicator; no production deployment inferred.

## Decision log

1. Use fragment routes inside the existing single Next page. This adds deep-link/history behavior without moving auth/API routes, adding a router or introducing server route aliases. Existing #chapter-screen remains a keyboard skip action without overwriting the navigation URL.
2. Keep My Journal global for saved vocabulary; move the existing nature field lesson/retry/notebook view into Field Journal, with an explicit link from global Journal. No fabricated collection screen.
3. World switching lands on the selected world's map and writes no checkpoint. My Journey obtains resume from server state, not XP or local step selection.
4. Remove the timed travel arrival auto-redirect. Entering a country goes directly to its real hub; an unvisited empty journey offers Choose a destination. This makes history stable and removes an animation-driven navigation transition.
5. Use compact in-flow mobile tabs rather than bottom navigation. All destinations stay accessible; gameplay actions are not covered. Full navigation remains available in missions as a clear exit. More immersive collapsing can be evaluated separately with learners.
6. Preserve underlying reading-band preference values and validation. Human labels describe selectable reading style, not verified proficiency; existing field review retains its explicit non-certification explanation.
7. Preserve unrelated Tower work and document its static test warning instead of altering that subsystem during this navigation task.

## Unverified and remaining review

- Real Google sign-in and real /auth/logout redirect flow were NOT RUN here. Auth code is unchanged; login/session expiry/isolation were exercised with synthetic accounts only. A hosted-auth check requires an authorized isolated environment.
- No screen-reader device session or broad cross-browser/device test; semantic landmarks/current states, keyboard behavior and responsive geometry were inspected/tested in Chrome.
- Saved-word navigation is browser-verified; save/reward/mission completion regression is covered by existing API/domain fixture suites rather than a complete new end-to-end playthrough of every lesson.
- Tower content remains DRAFT; economy/content approval gates and production availability are unchanged. Static Tower import-guard failure remains visible for the separate Tower work.
- Local verification is established for the tested paths. Production release readiness is not claimed. Stop for user review.
