# T2 Tower API contract

2026-10-28. Backend only; all paths use the existing `/api/[...path]` → `handleVercelAtlas` dispatcher. Responses have `Cache-Control: no-store, private` and `nosniff`. Verified Supabase `getUser()` UUID owns the expedition; selectors, OAI headers and body ownership never choose a player. POST uses the existing same-origin guard. No new framework or identity system.

## Availability boundary

The real Next route supplies **no Tower content runtime**. `GET /api/tower` reports `available:false, contentStatus:UNPUBLISHED`; new mutation operations return 503 CONTENT_UNAVAILABLE. There is no environment flag or client option to enable DRAFT content. Only isolated test harnesses inject `towerTestRuntime` as a server dependency. They construct it from the unchanged C0 bank. No DRAFT question has been published to players.

## Operations

| Method/path | Strict input | Result |
|---|---|---|
| GET `/api/tower` | No query/body | Availability, run projection, best, completion, eligibility and last committed outcome |
| GET `/api/tower/run` | No query/body | Same authoritative projection; resumes without reroll/write |
| POST `/api/tower/start` | `operationId`, `towerId`, `acknowledgedRuleVersion` | New server UUID/seed, five pinned records, revision 0 |
| POST `/api/tower/restart` | Start fields + `previousRunId`, `expectedRunRevision` | FAILED only; fresh identity, Floor 1 and changed candidate per floor |
| POST `/api/tower/submit` | `operationId`, `runId`, `expectedRunRevision`, `questionId`, `questionRevision`, `confirmed:true`, `answers:[{partId,choiceId}]` | One evaluated, atomically committed result; boss requires both parts |

Tower ID is `tower:narita-airport-survival`; acknowledged rule version is `c0-atomic-boss-v1`. IDs are bounded to 100 safe characters. POST body limit follows the existing 16,000-character convention. Unknown fields/extra part fields/XP/correctness/player/seed claims are rejected. There is no selection API: selection/review is ephemeral T3 state. On confirmation the handler creates the ungraded T1 draft and submits those exact choices in memory, committing only the result.

Example ordinary submission (the option shown is illustrative, not a published key):

```json
{"operationId":"answer-17","runId":"server-generated-uuid","expectedRunRevision":0,"questionId":"g01-c0-air-001","questionRevision":1,"confirmed":true,"answers":[{"partId":"p1","choiceId":"c2"}]}
```

Successful new commits return 201; reads and replays return 200:

```text
{ tower: { available, contentStatus, towerId, bestClearedFloors, completed,
           firstClearEligible, rewardPolicy:"DISABLED", run, lastOutcome? },
  expeditionRevision, replayed?, operation? }
```

`run` is the T1 allowlisted presentation, containing only the current English stimulus/choices. It does not expose seed, pins for future floors, keys, reviewer metadata, digest or internal state. `lastOutcome` contains only already-committed part feedback, including chosen/accepted text, correct/wrong explanations, source aliases and logical remediation target. It supports recovery after reload without a new answer. The explicit operation replay returns its historical receipt alongside current run state; the client must not rewind current state to the receipt's older cursor. `operation.awardedXp` is historical on replay, never a new award; do not sum replay values. The normal route never awards XP.

## Errors and retry

| HTTP/code | Meaning / action |
|---|---|
| 400 INVALID_REQUEST / INVALID_CHOICE / INCOMPLETE_SELECTION | Fix payload, no gameplay outcome |
| 401 SIGN_IN_REQUIRED | Restore verified same-owner session |
| 403 | Same-origin guard rejected request |
| 404 RUN_NOT_FOUND / NOT_FOUND | Unknown or foreign run; no cross-owner disclosure |
| 409 STALE_REVISION / WRONG_QUESTION / INVALID_STATE | Recover authoritative run; do not regrade or skip a floor |
| 409 OPERATION_CONFLICT | Identity was used with a different semantic payload |
| 409 CONTENT_MISMATCH | Pinned evaluator unavailable/mismatched; restore exact manifest |
| 409 CAS_RETRY_EXHAUSTED | 16 conflicting CAS attempts; retry same operation |
| 413 INVALID_REQUEST | Body too large |
| 503 CONTENT_UNAVAILABLE | No approved runtime, no new result |
| 503 INVALID_TOWER_STATE | Stored snapshot failed validation; requires recovery |
| 503 STORAGE_UNAVAILABLE | Database/read/write failed; outcome may need reconciliation |
| 503 RECOVERY_CAPACITY | Would exceed 64 KiB document or operation limit; no commit/receipt eviction |

Tower errors carry `isLanguageMistake:false`; when a prior database snapshot is available, the error may include its projection. It never includes an uncommitted computed transition. Outer auth/service errors retain existing repository response conventions. A legitimate wrong answer returns a successful committed FAILED receipt, not an HTTP validation error.

Same-operation lookup is owner-scoped and precedes content/state/stale checks. Fingerprints include operation kind and semantic fields, with sorted part-choice IDs; expected run revision is excluded. Start/restart replay never allocates a second persisted run. Historical answer replay after restart or evaluator removal is supported. Unknown/lost HTTP outcomes must retain the original operation identity and choices until recovered. No timeout causes synthetic FAILED state.
