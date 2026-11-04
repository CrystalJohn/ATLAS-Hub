# Navigation V2 audit and specification

## Existing responsibility matrix

| Surface | Owner | Real responsibility | Issue |
|---|---|---|---|
| Game Journey | Nature | Nature chapter, cards, badges, resume | Global label masks world ownership |
| Game World map | Shared shell | Select travel/nature, then map | Repeats world switch and inner travel map tabs |
| WorldTravel World | Travel | Country browsing | Duplicate map terminology |
| WorldTravel My journey | Travel | Japan hub, encounter, Tower | Local React state; lost on refresh |
| WorldTravel Passport | Travel | Existing stamps/visited statistics | Reading controls shown unnecessarily |
| Game My journal | Global utility | Saved words across worlds, nature field lessons, retries, notebook | Must keep all working content |
| Game How to play | Global utility | Existing instructions | Consumes equal primary nav priority |
| Game mission / summary | Nature | Nature gameplay / expedition recap | Transient selection/attempt state |

One Next page (`/`) owns the client app. Authentication routes and `/api/[...path]` remain unchanged. Server session/resume/checkpoint data provide player identity and authoritative progress. No existing world navigation URL contract was present; `#chapter-screen` is a skip anchor. Difficulty is a stored reading preference, not assessed proficiency. No GSAP/Motion dependency is required.

## Target specification

Two equal world links: World Travel / Nature Realm. Contextual destinations: Travel = World Map / My Journey / Passport; Nature = Realm Map / My Journey / Field Journal (existing nature lesson review within the shared Journal). My Journal stays a global utility with saved words from both worlds. Help remains a header utility. Nature recap/badges stay accessible from Nature Journey and map.

Canonical fragment URLs: `#/travel/map`, `#/travel/journey`, `#/travel/passport`, `#/travel/country/JP`, `#/travel/encounter/jp-arrival`, `#/travel/tower/JP`; `#/nature/map`, `#/nature/journey`, `#/nature/mission/<id>`, `#/nature/summary`, `#/nature/field-journal`; `#/travel/journal`, `#/travel/help`, with equivalent nature utility routes. No fragment defaults to Travel Map. Unknown IDs have explicit safe recovery; URL never supplies progress/unlocks. Hash routes preserve the existing root/auth endpoints and support browser history without a new router/framework.

World switching only changes the URL to that world's map. No checkpoint write on world switch or opening journey. Explicit mission entry/resume uses existing authorized APIs. Travel My Journey shows chapter progress and a resume action grounded in server resume target. Nature direct mission entry restores an existing authorized attempt/checkpoint where possible, using the existing mission entry path otherwise. Account changes remount world content and clear transient mission data; URLs contain no player identity.

Desktop: compact brand/account header, utility Journal and Help, then a single area combining world selector and contextual links. Mobile: the same destinations in a two-row in-flow nav, no additional fixed bottom tabs; 44px targets, safe areas, no sticky gameplay obstruction. Current world and section use distinct active indicators. Reading options appear on supported lesson/encounter review surfaces only, using Starter/Explorer/Adventurer/Challenger labels backed by unchanged internal reading-band values.

Implementation/testing results and deviations are recorded separately before local handoff. No production deployment or real Google OAuth validation is implied.

