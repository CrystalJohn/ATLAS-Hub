# ADR-001: Extend the expedition transaction for travel

Status: implemented within the user's authorized World Travel scope, pending product review.

AUTH-02 update (2026-10-21): the atomic document/revision decision is retained using **Supabase PostgreSQL only**. The D1 runtime described in the historical context below is retired from active routes. See [ADR-003](../auth-02/ADR-003-player-ownership.md) for ownership, database guards and resume contracts.

Context: The existing server commits progression, ledger and learning evidence together through a D1 conditional revision update. Travel introduces ordered interactions and collectible stamps, while existing forest progress must survive unchanged.

Decision: Keep the same document and optimistic concurrency loop. Add a versioned optional travel member. Extend the mission-engine package with a typed deterministic interaction evaluator. Share one first-clear ledger helper between forest and travel. The client supplies an action and expected step, never a completion flag, XP, stamp or proficiency score.

Alternatives: A separate travel database/reward engine would create cross-store consistency and duplicate-reward risk without current scale evidence. Adding travel IDs to the forest prerequisite rules would couple independent expeditions and ecology mastery. Both are rejected for this slice.

Consequences: No schema migration or player reset. Step and route cursor persist across reloads; stale requests cannot skip steps. All existing transaction contention limits still apply. As content/history grows, document-size and contention measurements should trigger a normalized storage review; this pilot does not claim infinite scalability.

Evidence: inspected service/domain/mission-engine source and the actual D1 concurrency integration tests. Acceptance requires travel replay/concurrency/isolation tests and the existing forest regressions.
