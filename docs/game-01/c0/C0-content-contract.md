# C0 content contract

**DRAFT · proposed acceptance contract, not runtime code, schema migration or implemented endpoints.** Date 2026-10-26; source commit `e1d07867e799e36bec6c550dca9e4f1dcf258dfe`. Architecture remains the native module proposal in [integration design](../GAME-01-proposed-integration-design.md). C0 refines content/rule semantics only. [Gate status](C0-gate-report.md).

## Identity, review and publication

| Field / boundary | Required meaning |
|---|---|
| Tower | Stable `tower:narita-airport-survival`; display says fictional airport. No real Narita navigation claim. |
| Bank | `g01-c0-jp-arrival-candidates`, revision 1; docs-only JSON accompanies human Markdown. `publicationEligible=false`; never auto-load a docs file into gameplay. |
| Item | `g01-c0-air-NNN`, immutable revision; never recycle an ID for a new skill. Candidate keys are editorial until reviewed. |
| Part/choice | Stable `p1`/`p2` and `c1`–`c3`, scoped by item/revision. Exactly one accepted choice per part; display order never controls grading. |
| Sources | Exact commit + native country/destination/location/encounter/version/step/dialogue/word/hotspot selector; P aliases resolve in [provenance](C0-learning-objectives-and-provenance.md#taught-source-register). Record original EN excerpt and stimulus/source hashes on any later publication manifest. |
| Pedagogy | Objective IDs, floor role, family, concept tags, response format, intended-band hypothesis/rationale and assistance flags; recognition is not productive recall. |
| Copy | EN + candidate VI context, stem, choices and every correct/wrong explanation; separate instructional UI copy and learning support. |
| Review | Status DRAFT; real educator identity/qualification/date/revision/hash/decision, independent adversarial review and owner approval required for publication. Null signoffs remain null. |
| Revision changes | Any meaning/key/source/stimulus/translation change creates a revision with fresh required review. Keep earlier published versions addressable for active runs and feedback, or invalidate safely without language failure. |

Do not infer approval from original package titles such as “reviewed pilot fixtures.” That was assistant desk review, not educator review ([S4](C0-learning-objectives-and-provenance.md#s4)). Candidate JSON has no executable behavior and is not an API schema commitment. The runtime projection, if later authorized, excludes answer IDs/rationales, future questions, source excerpts that reveal keys, and reviewer-private notes until feedback is due. Public source access means this is practice, not a secure examination.

## Source learning and eligibility

Existing `jp-arrival` completion is insufficient proof of optional vocabulary reading or comprehension ([S3](C0-learning-objectives-and-provenance.md#s3)). Proposed before first Challenge: offer the original sign, vocabulary notes and Mika exchange in a read-only source-learning review; record **exposure acknowledgement**, never “learned/mastered”. Verify vocabulary and A2/B1 request/reply variants used by the eligible bank were made available. If a learner has only A2 exposure, do not silently serve the longer B1 form as supposedly already-taught: either include it in the source review or exclude its candidates from that run.

Review can use existing authored text without modifying the lesson. Underfilled approved pools block that definition; no runtime AI generation, invented synonym, hidden lower standard or source expansion. Local engine fixtures may use draft candidates, labeled fixtures and disconnected from real rewards. Player publication requires the full editorial gate.

## Remediation targets

Proposed logical deep link:

`{kind: lesson-source, countryId: JP, destinationId: tokyo, locationId: airport, encounterId: jp-arrival, encounterVersion: 1, stepId, focus, sourceCommit, returnTo: {towerId, runId, resultPart}}`

This is a **new resolver requirement**, not an existing browser route or accepted checkpoint payload. No invented working `/lesson/...` URL is claimed. Current checkpoint input accepts only travel encounter ID, and resolves current progress rather than an arbitrary lesson fragment ([checkpoint.ts](../../../lib/atlas/checkpoint.ts):15–47); WorldTravel uses local view state ([S3](C0-learning-objectives-and-provenance.md#s3)). Reusing `POST checkpoint` to rewind an encounter would violate this contract.

| R ID | Exact original content target | Focus visible on arrival |
|---|---|---|
| R-VOC | `JP/tokyo/airport/jp-arrival@1`, generated lesson `travel:jp-arrival`; `focus={kind: vocabulary, word: station|ticket|train|please}` | The failed item's exact word, source definition and example; use part sourceRefs to choose word |
| R-SIGN | Same encounter; step `read-signs`; hotspot `signs` | Original “TRAINS → · BUSES ← · EXIT ↑” description, not a generic airport hub |
| R-ASK | Same encounter; step `ask-staff`; dialogue `airport-help`; response `ask`; band A2 or B1 from served item | Mika's offer and the exact taught request form |
| R-FOLLOW | Same encounter; step `ask-staff`, dialogue reply A2/B1; context step `find-train`, hotspot `station` | Exact reply and matching train-station target; preserve band |

The resolver opens a read-only **view of the original lesson**, not a Tower-authored replacement lesson. It preserves existing completion, stamps, XP, active encounter cursor and global checkpoint. It has Back to tower result/run; a failed run remains failed. On missing/withdrawn version show an unavailable-content explanation and a safe original-encounter/hub fallback, clearly identify the missing exact target, and flag the item for withdrawal. A generic hub fallback does not pass exact-remediation acceptance. This unresolved integration is a RELEASE blocker, not a code change performed in C0.

## Frozen runs and retry variants

On a future start, server owns/pins towerDefinitionVersion, bankRevision, item/revision/part sequence, choice order, source manifest hash, ruleCopyVersion, mode, support policy and approved reward policy (or disabled). UI language may change without regrading/rerolling. Pause/resume restores the same assignment. No timed expiry as a failure mechanic.

F1 samples 001–004; F2 005/006; F3 007/008; F4 009/010; F5 one of 011/012. Only signoff-eligible items may enter a published definition. Immediate new runs exclude the preceding run's assigned record in every bucket when an approved alternative exists, including unserved pinned floors; choose least-recently-used alternatives then random tie-breaks. Also store presentation order. If two variants cannot be maintained in a bucket, do not promise a changed retry: keep public Challenge blocked pending a reviewed pool, rather than silently use choice shuffle as the variant.

005→006 changes arrow naming to goal/label matching. 007→008 changes selecting a request to interpreting a request. 009→010 changes destination following to label/direction binding. 011→012 changes request choice + sign direction into intent recognition + reply binding. These are **candidate functional equivalents**, not calibrated parallel forms. They share the original scene; their answer direction stays right. Flipping arrows to force novelty would lose exact-source provenance. Repeats after limited rotations are legitimate rehearsal, disclosed before starting.

Avoid duplicate exact records/parts inside one run. Cross-floor concepts intentionally overlap (including boss); do not enforce an impossible “all concepts disjoint” rule or count overlap as independent mastery evidence. A new bank version never changes an active run or first-clear identity silently.

## Response semantics

These are required future semantics; endpoint names in earlier architecture docs are proposals. Only a valid, owned, current, fully formed answer containing known choice IDs can be graded. An ordinary item has one choice; boss requires one per part, sent together. Missing/extra/unknown/duplicate part selections are validation errors, never incorrect language answers.

Request identity: owner/session on server; `runId`, unique `operationId`, expected run revision, pinned question token/revision, selected part-choice IDs. Client never supplies correctness, authoritative floor, player selector, XP, completion or evaluator version. Fingerprint binds semantic payload (run/question/choices); object key order is normalized. Transport retry metadata is outside the fingerprint. Changing an answer is a different operation and may succeed only while that question is still unanswered.

| Case | Required response and mutation |
|---|---|
| First valid correct ordinary answer | Commit once, increment cleared floors/cursor once, store immutable receipt and per-part evidence. Show committed feedback; Continue is UI-only. |
| First valid wrong answer | Commit one FAILED transition, preserve cleared count, update best=max(old,cleared), record precise mistake/lesson target. No XP loss or travel mutation. |
| Valid boss | Evaluate both with pinned keys; only TT clears Floor 5. TF/FT/FF fail with four floors cleared. Per-part truth stays separate. One atomic commit for both parts. |
| Same owner + operationId + same fingerprint, even with stale expected revision | **Check receipt before stale-revision checks.** Return original immutable outcome/receipt ID/resulting run revision, `replayed=true`; latest state may be a separate field. Zero new evaluation/evidence/XP. |
| Same operationId, changed semantic payload | 409 OPERATION_CONFLICT; do not grade/transition. Preserve/recover original receipt. |
| Different operationId for already-answered token or stale revision | 409 STALE_RUN/QUESTION_ALREADY_ANSWERED; return/recover authoritative state, not a second grade. A different choice cannot overwrite the winner. |
| Invalid payload/unknown choice/wrong question version | 400 INVALID_ANSWER or 409 CONTENT_MISMATCH as appropriate; no learning outcome, no run consumption. |
| Offline/timeout/API error/auth service error/DB error/rate limit | Recoverable non-language error; no failure penalty. 401 requires same-owner sign-in; 429/503 retry/recover. No synthetic correctness or local terminal state. |
| Successful commit, response lost | Outcome is initially unknown to client. Freeze original choices/operation; lookup receipt or resend the **same operation**. If receipt exists return it; if commit never happened retry once under pinned revision. Do not issue a replacement answer/run to resolve uncertainty. |
| Content withdrawn/unresolvable | Pause/INVALIDATED_CONTENT, no language-failure/PB decrease/XP clawback; explain and offer fresh run after review. No silent regrade. |
| Cross-owner / unknown run | Owner-scoped 404, no disclosure or mutation. Account switch clears prior account UI; late responses cannot render in new account. |

“An API error never consumes a run” means the **error itself** is never a language result. It cannot cancel a valid wrong result already committed before the response was lost. Recovering that receipt is required, not an extra penalty. Unknown outcomes stay pending until reconciled; no automatic abandoned/failed state on reload.

Server writes the run transition, receipt, evidence, best and any approved reward in the same expedition compare-and-swap commit. A CAS collision rereads the latest owned document and receipt, then revalidates; storage failure before commit leaves all unchanged. Store receipts for the active run and a bounded recovery period documented before T2; never evict a pending operation. If a receipt is later pruned, a permanently answered question token still cannot be replayed into another transition. Prove document/receipt bounds fit the existing budget in T2, not by assertion here.

## Rewards and isolation

Reward amount and policy are owner-pending. C0 design/fixture default: `reward=disabled`, **no ledger entry**. Proposed stable reward identity uses tower ID plus an approved reward-policy identity, independent of bank revision/locale. Existing helper `(missionId,contentVersion)` needs an explicit approved mapping; blindly using bankRevision can duplicate awards ([S6](C0-learning-objectives-and-provenance.md#s6)). A future policy version does not automatically authorize re-earning: owner must state grandfathering/eligibility. First eligible full Challenge clear only; no Practice/tutorial/partial/fail/replay award. No stamp unless separately approved.

Tower operations may add tower state and an approved first-clear reward; they never reset or subtract World Travel completion/cursor/stamps, Nature progress, XP or adventure checkpoint. Lesson review navigation is read-only. Runtime proofs are future T2/T3 work; no migration or app/config change is authorized by this document.

## Content oracles

| Oracle | Expected result / review evidence |
|---|---|
| C01 Identity/count | 12 unique item IDs, 14 unique item/part pairs, floor pools 4/2/2/2/2; boss only F5, two parts. |
| C02 Source resolution | Every part sourceRef resolves to P entry and actual native ID/word/path at pinned commit. Source excerpt/JSON equality and SHA verified; no invented original IDs. |
| C03 Unique answer | Exactly one key belongs to each three-choice part; independent reviewer cannot defend another under the full stem/context. Mechanical membership ≠ semantic proof. |
| C04 Complete languages | EN/VI present for every context, stem, option, rationale and required UX state; bilingual educator verifies meaning, politeness and direction without added hints. |
| C05 Repeat quality | Same random seed yields same assignment; refresh no reroll; new run changes eligible record, not only permutation. Exhausted pools block or disclose repetition per policy. |
| C06 Exposure/claim | Longer forms require exposure; assisted responses labeled; no “mastered”, CEFR promotion, listening/speaking credit or lesson completion as comprehension proof. |
| C07 Remediation | Each failed part opens exact original fragment/version; keyboard focus reaches its text; Back returns to same result. Compare progress/checkpoint before/after: unchanged. |
| C08 Publication | DRAFT/null approvals/changed hash/withdrawn source rejected from published bank. An approved alternative must preserve the floor blueprint. |

## Interaction and persistence oracles

**SPECIFIED, NOT EXECUTED in C0.** Run later in a disposable local fixture, then separately authorized live checks. Testing a future Tower cannot be claimed from current travel tests.

| Oracle | Input / expected result |
|---|---|
| I01 Selection | Select/change all choices; no request or evidence before explicit confirmation. Button disabled when incomplete; boss 1/2 cannot submit. |
| I02 Acknowledgement | Before start learner can see/paraphrase strict reset, no-loss, no-timer, support/reward and boss rules. Start records rule version. |
| I03 Truth table | Correct F1 → cleared=1/cursor=F2; wrong F4 after 3 → FAILED/best≥3. Boss TT→CLEARED/best=5; TF/FT/FF→FAILED/best≥4 with correct parts preserved. |
| I04 Duplicate | Send same operation 32 times concurrently: exactly one transition, one receipt, one evidence set. Replay after stale revision still returns original result. |
| I05 Competing answers | Two tabs submit different operations at same cursor: one commits, loser receives conflict and authoritative outcome, no regrade. |
| I06 Lost response | Inject loss after commit then resend original operation: same receipt/outcome, no extra XP. Inject failure before commit: no mutation and retry remains possible. |
| I07 Invalid requests | Unknown ID, malformed boss, spoofed XP/floor, expired auth, 429, 503 and CAS exhaustion: no failure/evidence/consumed run from error. |
| I08 Freeze/resume | Close/reload/UI-locale toggle retains sequence/order/support policy. Pending submission reconciles before new input. Terminal run restores terminal receipt. |
| I09 Isolation | Snapshot travel/Nature/checkpoint and existing ledger entries. Fail/restart/review/clear cannot change them; approved reward adds only its one entry/XP. Disabled reward adds none. |
| I10 First clear | After policy approval: first eligible clear adds approved amount A once; repeats/bank bump/VI patch/concurrent retries add zero. No stamp. Before approval: no claim or reward write. |
| I11 Content/account | Withdraw item → non-failure invalidation; new account cannot read previous run or render late response. |
| I12 Accessible flow | Keyboard and touch at 320px, 200% text: select, review, confirm, read correction, follow lesson link, return and restart; visible focus, readable arrows, no clipped control, no accidental auto-submit. |

A C0 documentation consistency check can pass C01/C02/key-membership/field-completeness only. Editorial C03/C04 and all runtime oracles remain unpassed until actual reviewers/tests produce evidence.
