# T2 state and persistence

## Existing architecture verified

The current checkout still uses Supabase Auth, service-role `supabaseExpeditionStore`, UUID owner-scoped `atlas_expeditions` rows, integer revision CAS, deny-all browser table access and AUTH-02 integrity triggers. Tower adds an optional `Expedition.tower` JSON namespace. Old documents parse/read without a Tower field. Existing travel/mission/profile state paths remain compatible. **No table, migration, database, auth system or reward ledger was added.** All database DDL executed by tests was confined to the existing disposable local stack; its temporary fault trigger is removed in that test.

## Four data boundaries

| Boundary | Contents |
|---|---|
| Authoritative persisted namespace | Version 1; CHALLENGE mode; fixed EN/post-submit-VI support policy; definition version; active run UUID/seed/manifest digest/bank+question revisions, pins and option orders, status/counters; committed receipts; operation recovery index; best; completion; bounded mistakes |
| Server-private content/evaluator | Definition, full bank, source/review metadata, private keys and explanation lookup; constructed only by isolated test injection while publication remains blocked |
| Public DTO | Current question projection, best/completion/eligibility, committed feedback; no internal run serialization or future questions |
| Ephemeral T3 state | Selected choices, review/confirmation panel, locale, pending request identity and navigation; no draft selection is stored by T2 |

The rule version is pinned in every run; start/restart require its acknowledgement. This records an acknowledgement claim, not proof that a person read the rules or original lesson. Source exposure/read-only lesson review is still a release gate. `manifestDigest` binds the full definition and keys, including original source commit and candidate revisions. An evaluator change cannot silently regrade a pinned run. Missing/mismatched content yields recovery; no FAILED transition is synthesized.

The trusted DB snapshot is parsed through `TowerNamespaceSchema`/`RunSchema`: bounded shapes, no persisted selections, five pins, unique operation/run identities, receipt cursor sequence and correct-prefix/status consistency. T1 `present`/transition compatibility then checks the content manifest and choice-order membership. These application checks do not add a PostgreSQL trigger validating Tower semantics; a malicious service-role writer remains outside the player HTTP trust boundary.

## Atomicity and identity

Every new operation reads the whole owned document, checks receipts, validates state/content/cursor, computes one transition, updates Tower summary/mistakes and any isolated test reward, then calls the existing store CAS. A false CAS rereads and revalidates, at most 16 times. No stale copy is committed over concurrent travel changes. Wrong answers only take effect when this entire document commits. No Tower branch writes `travel`, checkpoint, mission attempts, stamps or completion lists.

The outer operation index survives restart. It retains identity, canonical payload fingerprint, kind, created run ID, immutable answer outcome where applicable, and historical awarded amount. This supports creation retries and replay even after a different run starts or content is removed. Active-run scoring receipts remain in the T1 state. The duplicate outcome representation preserves T1 without rewriting its reducer, at a measured document cost; feedback is immutable recovery evidence, not a persisted UI panel. Mistakes contain only run/question/revision/part/chosen ID, objective/source IDs and remediation ID.

Boss submission has two results and one CAS/revision increment. TT completes five floors/six decisions; TF/FT/FF retain four floors and honest per-part feedback. PB is max(previous,cleared). Completion is sticky. Completed runs cannot restart through this T2 contract, consistent with T1; future repeat-practice behavior needs a separate approved lifecycle.

## Capacity and retention

Assignment history retains the last 20 sets; mistakes retain the latest 100. All operation receipts are retained up to 1,000 operations and the **64 KiB total expedition document budget**, whichever is reached first. No pending or historical operation is silently evicted. A new write exceeding the budget returns RECOVERY_CAPACITY without committing. Reads/replays remain possible. Test evidence measured roughly 40 KiB after the multi-run boss scenarios and separately verified a forced overflow refusal; see `postgres-oracles.json` for exact sizes of this execution. Existing migrations do not enforce 64 KiB; this is the Tower application guard inherited from the proposed architecture budget.

This conservative recovery policy is suitable for the local gate but limits a long-lived player lifecycle. A retention/acknowledgement/archival policy and compact receipt representation need approval and sizing before release; normal APIs do not clear a run merely to free capacity. Existing non-Tower routes retain their own behavior and do not gain a new global size restriction.

## Reward boundary

The original `awardFirstClear` implementation was moved unchanged into shared `rewards.ts` and reused by mission/travel and the isolated Tower tests. Normal Tower policy is DISABLED: no ledger row, XP or stamp. Tests inject a server-owned `audience:isolated-test` policy using arbitrary 7 and 9 XP fixture amounts; these are not economy proposals.

Proposed lifetime reward mapping is `missionId=tower:narita-airport-survival`, `contentVersion=1`, policy identity `first-clear-lifetime`. The wrapper checks **any existing ledger entry for this Tower ID**, regardless of contentVersion, before invoking the shared writer. Bank revision and policy amount cannot reset eligibility. No policy version change creates automatic re-earning. Owner decisions are still required on real amount, approved policy changes, grandfathering old clears and retroactive claims; no production switch has been added. Public `firstClearEligible` currently means no prior Tower completion in this namespace, not an active claimable reward.
