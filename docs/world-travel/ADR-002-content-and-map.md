# ADR-002: Deterministic packs and a local world map

Status: implemented within the user's authorized World Travel scope, pending product review.

Decision: Public country-pack content is separate from server evaluation rules. Use a local low-resolution Natural Earth map, searchable ISO region names, availability labels, original illustrations and generic scene/hotspot renderers. Keep licensed/reviewed audio as a future content capability, with no fabricated audio, generated free-form dialogue or speaking scores in this release.

Rationale: The first pack needs reliable mobile interactions and reproducible content validation. A full game engine, live geographic API or unrestricted AI dialogue introduces cost and runtime dependencies without a demonstrated requirement. A country selector must not imply gameplay availability.

Limits: Map boundaries are generalized at 1:110m scale; small islands may lack outlines but remain searchable. Practice routes, NPCs and venue/menu are fictional. Artwork is stylized, not a real-world navigation surface. English/Vietnamese editorial calibration still requires independent educator review before a wider learning release.
