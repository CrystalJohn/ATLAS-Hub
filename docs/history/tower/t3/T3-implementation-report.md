# GAME-01 T3 local implementation

2026-10-28. Baseline: `codex/game-01-t1-t2-checkpoint` at `1f126f10b7084157fd832680bfb2c0f429894577`; initial tracked index and diff were empty. T3 is local review only; the C0 bank remains DRAFT and release remains NO-GO.

## Implementation and reuse

| File | Change |
|---|---|
| `app/components/travel/TowerReview.tsx` | Tower side card and entry, question, feedback, failed, victory, review and recovery states; calls existing T2 API only |
| `app/components/travel/WorldTravel.tsx` | Mount Tower in Japan hub only when the server reports it available; internal Tower mode uses existing World Travel navigation |
| `app/components/Game.tsx` | Pass verified profile identity and key World Travel by account to clear state on identity change |
| `app/tower.css`, `app/layout.tsx` | Scoped mobile-first styling and import, reusing ATLAS travel button/color conventions |
| `scripts/preview-tower.mts` | Explicit disposable loopback local review launcher. Uses existing local PostgreSQL/PostgREST/Auth fixture and real Next UI, injecting the draft evaluator into the server dispatcher only inside this process |
| `scripts/test-tower-browser.mts` | Browser-level local review checks; see test evidence for actual outcomes |

The normal Next route and T2 backend remain unchanged and have no draft runtime. There is no client authorization flag or bank/key import in browser components. A direct normal Tower request reports unpublished; the card is not displayed when `available` is false. The test launcher binds loopback, overrides database/auth environment with the disposable stack, verifies synthetic signed sessions and supplies T2's existing server-owned test dependency. It is not a hosted staging environment and performs no real Google OAuth.

Tower uses the existing `tower`, `tower/start`, `tower/restart`, and `tower/submit` T2 operations and public projection. It does not create endpoints, modify World Travel gameplay, award Tower XP or stamps, or write checkpoint state for lesson review. The original `jp-arrival` source supplies the read-only vocabulary, signs and dialogue review; failure feedback selects the corresponding remediation section. Missing original content has a truthful fallback. Interface locale and optional post-submit Vietnamese explanation remain separate.

Owner UX revision: the player can acknowledge the rules via a checkbox and start without opening the lesson first; lesson review is optional. The highlighted radio choices replace the redundant repeated-selection panel while explicit answer confirmation remains. The prior C0 prerequisite of mandatory source review is therefore superseded for this local review flow; any publication decision must revisit exposure evidence and educator approval.

Both boss answers are selected before a single confirmation. Confirmation freezes an owner-scoped operation in session storage and invokes the server. No scoring is performed on selection. The response and current authoritative status are recovered separately, and old receipts do not replace newer state. An uncertain network response retains the same operation for retry; a definite invalid/stale response requires a fresh server read. The local session storage fallback cannot retain an operation across reload if the browser disallows storage; that case has not been proven equivalent to durable pending-operation recovery.

Completed-run replay remains unavailable because T2 has no authorized completed-run restart. The view explicitly says so. The review is a local engineering exercise, not evidence of bilingual educator approval, English mastery or user-tested usability.

See [flow](T3-ux-state-and-flow.md), [test evidence](T3-test-evidence.md) and [T4 prerequisites](T3-T4-prerequisites.md).
