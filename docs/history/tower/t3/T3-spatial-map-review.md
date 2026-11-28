# Spatial progression map review — 2026-10-30

Scope: local frontend redesign based on the supplied Dungeon Map reference; no backend, state engine, reward policy, content bank, dependency or deployment change.

The previous TowerProgress combined a horizontal tracker with a vertical expanded list. It now renders exactly one presentation at a time: spatial destinations connected by four cubic SVG route segments in expanded mode, or a compact five-stage tracker while playing. Mobile uses separate vertical route geometry and matching destination positions. Floor and final-gate nodes remain DOM elements with status labels and no navigation handlers. Route segments derive from destination state. Current run derives from authoritative clearedFloors/status; personal best remains separate. Expansion is ephemeral UI state and does not replace answer selections.

TowerReview displays Airport Survival · Level 1, compact rules and optional expanded challenge details. The existing travel reading-level control is hidden only while Tower is open. Boss has FINAL GATE / BOSS presentation in the map. The original notebook and illustration remain in use.

Actual verification:
- npx tsc --noEmit: PASS.
- npm run lint: PASS with nine pre-existing warnings (seven image warnings, two scratch helper warnings); no errors.
- npm run build: PASS.
- node work/game-01-t3/test-dungeon-ui.mjs: PASS initial state, all floors, boss two-part question, non-navigable locked destinations, failure/restart, personal best, reload restoration within the isolated fixture, keyboard expansion, mobile overflow, touch-toggle size and reduced-motion preference.
- node scripts/test-tower.mts: 26/27 PASS. The source-import guard still rejects type-only Tower imports in the existing T3 frontend. No claim of a full engine suite pass.

Screenshots in output/game-01/t3/dungeon-*.png were refreshed for this design. Desktop viewport: 1920x1080; mobile: 390x844. Tests used separate synthetic accounts and isolated local PostgreSQL through a test proxy; no production account was used. Normal npm dev Tower remains volatile, with no durability across server restart. No manual screen-reader or learner-usability signoff is claimed. No commit, push or deploy performed for this revision.
