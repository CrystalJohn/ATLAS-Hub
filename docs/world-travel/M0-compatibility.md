# World Travel M0 — compatibility and implementation direction

Historical M0 baseline. AUTH-02 (2026-10-21) replaces the active Sites/D1 runtime with native Next/Supabase only; gameplay/content contracts below remain relevant. See [ADR-003](../auth-02/ADR-003-player-ownership.md).

Baseline: Sites ATLAS source 9c2fc154aff3f25633c37cf3026f6458c8c16614.

The active deployment is React 19/Vinext on Cloudflare Workers with authenticated Sites identity and a D1 revision-checked expedition document. The upstream Nest/PostgreSQL artifact is not the live Site runtime. This feature extends the deployed adapter; it does not rebuild or migrate the original artifact.

## Existing systems and compatibility

| Existing system | Travel integration |
|---|---|
| `lib/atlas/service.ts` authenticated CAS transaction | Travel actions, stamps, XP and English evidence commit in the same revision update. Old documents default to empty travel state. |
| First-clear ledger and `levelForXp` | One `awardFirstClear` helper now serves both forest and travel, keyed by mission/version. No new currency or independent reward store. |
| Forest completion and subject mastery | Remain separate. Travel never inserts forest evidence or completes an ecology mission. |
| English task evidence and proficiency rules | Travel adds reading/vocabulary practice evidence. Listening/speaking remain unassessed; CEFR stays null. |
| Saved vocabulary API and UI | Accepts validated travel glossary entries and reuses account saves, IPA display and My journal collection. |
| Existing World map navigation | Adds a World Travel / Nature Realm selector. The original forest map remains available. |

## Country Pack contract

`content/travel/types.ts` defines Country, Destination, Location, Hotspot, TravelEncounter, NPCDialogue, LearningObjective, VocabularyEntry, PassportStamp and PlayerTravelProgress. Category `WORLD_TRAVEL` supplements `NATURE_REALM`.

`content/travel/japan.ts` supplies the public Japan pack. Server-only answer data lives in `lib/atlas/travel-rules.ts`. The generic travel evaluator is an extension of the existing mission-engine package. React branches on encounter interaction type (inspect, dialogue, route, order, compose), not country-specific answer rules.

Hierarchy: world country catalog → pack → destination → location → encounter → deterministic sequence of mission interactions. Add another country pack and its versioned evaluation data, then register it in travelPacks; existing view components remain reusable.

## User flow

World map → country preview (accurate availability) → server-recorded visit → short arrival transition → destination trail → scene/object discovery → NPC request → embodied activity → server-verified completion → passport stamp → next stop.

Japan starts independently of character level and forest completion. Travel stops unlock sequentially within the pack. Country selection itself is never a character-level gate. Kyoto is explicitly coming soon, without gameplay. Vietnam has a small sourced map preview; all other catalog entries are coming soon.

## Visual direction

Original pastel travel-adventure illustration, lavender UI inherited from ATLAS, teal map water, cream land, coral preview markers and ink-stamp passport. Environmental scenes, scene-coordinate hotspot buttons, UI panels, mission state, dialogue content, evaluation and short CSS transition remain separate.

References consulted for direction (inspiration only; no assets copied):
- Behance, Travel App For Japan: https://www.behance.net/gallery/154662787/Travel-App-For-Japan
- Behance travel-map illustration collection: https://www.behance.net/search/projects/travel%20maps
- JNTO official Shibuya/Asakusa travel imagery and GO TOKYO destination material.

Use SVG paths from public-domain Natural Earth rather than a network map SDK. It supports drag pan, zoom controls, keyboard pan/zoom and an equivalent searchable country list. Original raster scenes use responsive WebP; route navigation is an exact code-rendered practice grid. No Three.js, Phaser, GIS SDK, or additional animation dependency is required.
