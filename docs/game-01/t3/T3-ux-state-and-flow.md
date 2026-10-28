# T3 UX states and flow

The Japan hub shows a DRAFT review card only after the owned server response says the feature is available. Its action reflects NOT_STARTED, IN_PROGRESS, FAILED or COMPLETED; no active run is inferred from browser storage. The review launcher, not a production route, supplies the test runtime.

| State | Primary action and user feedback |
|---|---|
| Entry | Tick the acknowledgement and start; original airport lesson review is optional. This is the product owner's later UX direction, superseding the earlier mandatory lesson-review step. One wrong confirmed answer ends the run; retry starts Floor 1. Existing progress is safe, no timer or reward promise. |
| Active | Floor trail, current English prompt and radio choices; the highlighted option indicates the selection without repeating it in a separate panel. Selection does not submit; the explicit confirmation remains. |
| Confirm/pending | Explicit confirmation is disabled until all choices exist; boss requires two. Pending operation and chosen payload are retained per verified account for same-operation reconciliation. |
| Correct | Show committed selected answer and explanation; continue explicitly to the server's current next question. |
| Failed | Show cleared floors and truthful correct/incorrect result for each part; provide corresponding original-source review and restart from Floor 1. |
| Recovery | Connection/service error is not graded. Retain uncertain operation and offer retry; stale/invalid requests require authoritative reload before new actions. |
| Victory | Server-reported completion, personal best, practice recap and return. Replay is honestly unavailable under the current T2 contract. |

Lesson review is a view over the original authored `jp-arrival` content, not a travel action; it does not save or replace the existing checkpoint. Each wrong boss part has its own remedy. Unresolved source targets show a fallback rather than claim success.

The UI uses an explicit radio `fieldset`/`legend`, visible selection, status/alert messages, focusable heading, large action and choice targets, text labels alongside colors and mobile layout. Existing World Travel reduced-motion styles apply. The interface is EN-first; user-selected VI interface and post-submit learning support are independent. Accessibility and responsive observations are listed with their actual scope in the test evidence, not represented as certification.
