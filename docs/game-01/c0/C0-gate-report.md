# ATLAS GAME-01 C0 gate report

**2026-10-26 · C0 authoring complete for review · DRAFT · stopped at C0.** No educator signoff, production content publication or Tower implementation is claimed.

| Gate | Decision now | Meaning |
|---|---|---|
| C0 review package | READY FOR REVIEW | Source mapping, candidates, editorial risks, rules, contracts and oracles are concrete. Readiness is documentation completeness, not content approval. |
| LOCAL-T1-GO | **NO — C0 acceptance pending** | Earlier architecture readiness is not acceptance of this revised content/rule proposal. After explicit owner C0 acceptance and T1 authorization, a fixture-only pure engine slice can use visibly DRAFT candidates with rewards disabled; it cannot publish them to players. Independent educator review can proceed separately. No T1 work begins in this assignment. |
| RELEASE-GO | **NO** | Independent editorial approvals, lesson-return integration, approved retry pools, runtime proofs, economy decision and applicable AUTH-04 live gates remain open. Local engine permission would not clear these. |

## Decision card

**PROVISIONAL DECISION:** narrow the Airport Survival bank to 12 candidate records / 14 decisions and replace the package's discrete grammar floor with interpretation of the already-taught Mika instruction. Keep five floors total with a two-part Floor 5 boss. This is a review proposal to EXTEND the audited native-module design; it does not revisit the overall engine architecture. Confidence is high in the pinned **source inventory**, provisional in pedagogic suitability and equivalence. [Source register and capacity](C0-learning-objectives-and-provenance.md#bank-capacity), [package disposition](C0-editorial-quality-matrix.md#package-disposition).

**Why:** the actual airport lesson supplies four word entries, one fixed sign layout and one directions exchange, whereas the older 25-record pilot adds unlearned signs, exchanges and discrete grammar tests. Candidates retain exact taught successful-answer facts and state their related families. [P01–P08](C0-learning-objectives-and-provenance.md#taught-source-register), [all 25 package item dispositions](C0-editorial-quality-matrix.md#package-disposition).

**Strongest alternative:** teach and review new airport passages first, then retain a 20–30-item bank with genuinely broader contexts. Its advantage is more retry variety and better coverage; its cost is new curriculum and validation. It is not selected for this existing-source-only C0 draft. Merely publishing the package's 25 fixtures would misstate taught provenance. Revisit expansion when newly approved source encounters/IDs exist. [Scope/capacity](C0-learning-objectives-and-provenance.md#scope-and-interpretation).

**Key counterevidence:** the original phrase examples do expose useful chunks and may support a future cloze lesson; thus HOLD is not a linguistic rejection of those items. Current B1 request wording offers a longer form, but current band defaults and shared VI do not establish graded equivalence. A tiny bank can rehearse exact content while still being insufficient for robust fresh-context retries. [Quality matrix](C0-editorial-quality-matrix.md#current-content-quality).

**Decisive uncertainty / next review:** independently check whether every distractor has only one defensible answer, the VI preserves the same task, and paired retry forms are acceptably comparable for the intended learners. A defensible alternative or misunderstood goal quarantines that revision. If independent review leaves fewer than two usable variants in any F2–F5 bucket, block that published definition and author teaching material before expanding. These are proposed decision gates, not validated statistical thresholds. [Review protocol](C0-editorial-quality-matrix.md#editorial-signoff-and-test-oracles), [variant contract](C0-content-contract.md#frozen-runs-and-retry-variants).

## Deliverables

Authoritative destination: `D:\ATLAS-Hub\docs\game-01\c0\`. An identical review copy is supplied in this chat's outputs folder; references to repository source files resolve from the authoritative destination.

| File | Review focus |
|---|---|
| [C0-learning-objectives-and-provenance.md](C0-learning-objectives-and-provenance.md) | Exact local source/IDs/quotations, source/export hashes, complete objective/item mapping, CEFR boundaries and evidence ledger |
| [C0-question-bank-candidates.md](C0-question-bank-candidates.md) | All 12 candidates and 14 keyed parts, EN/VI, every option rationale, source and remediation |
| [C0-question-bank-candidates.json](C0-question-bank-candidates.json) | Structured docs-only editorial payload; not imported by the application |
| [C0-editorial-quality-matrix.md](C0-editorial-quality-matrix.md) | Source risks, per-item worksheet, all 25 original package dispositions, required real review |
| [C0-game-rules-and-ux-copy.md](C0-game-rules-and-ux-copy.md) | Pre-run strict rule, selection/confirmation, exact correction/lesson return, recovery, Practice boundary and reward holds |
| [C0-content-contract.md](C0-content-contract.md) | Versioned provenance/review, lesson deep-link targets, sampling, idempotency, errors, isolation and concrete future test oracles |
| This report | Decision, performed checks, blockers and stop condition |

## Approvals and blockers

No approval below has been obtained by this authoring session. Review-role placeholders must not be filled with the assistant's identity as though an independent human signed.

| ID | Owner / requirement | Blocks |
|---|---|---|
| A01 | Product owner reviews the C0 proposals: 5 total floors with F5 boss, 12-record narrow bank, changed F3/F4 roles, support/exposure policy and deferred Practice. Strict failure, explicit confirmation and no permanent loss are already user-set requirements | LOCAL-T1-GO activation and subsequent scope |
| A02 | Explicit subsequent instruction to perform local T1 implementation; not inferred from this research task | Any code work |
| E01 | Independent bilingual English educator validates original teaching basis, intended audience/demand, every EN/VI field and unique key; signed item revisions/hashes | Player-facing content publication / RELEASE-GO |
| E02 | Second independent adversarial reviewer attempts to defend every distractor, including each boss part | Publication / RELEASE-GO |
| E03 | Target learners validate instructions/failure comprehension, answer flow, correction/lesson return and candidate variant difficulty; no CEFR/mastery claim without separate evidence | Final editorial/UX release acceptance |
| C01 | Approve support policy and original-source exposure review; longer B1 forms cannot be assumed seen from A2 completion | Published eligibility/blueprint |
| C02 | At least two approved meaningful variants per floor bucket, source pinning, no refresh reroll, repeat disclosure | Published retry promise |
| U01 | Implement/test read-only exact lesson-return resolver. Existing checkpoint/hub navigation is not a fragment deep link | RELEASE-GO; future T3 work |
| R01 | Owner approves **first-clear amount and policy**, stable reward identity, eligibility/grandfathering and disabled-before-approval behavior. Earlier +40 remains unapproved | Any real Tower reward write; RELEASE-GO decision on final economy |
| R02 | User-set rule: no Tower passport stamp. Keeping stamps disabled needs no further approval; adding one requires separate explicit approval | Any new stamp authoring/award only; no blocker for leaving it disabled |
| T01 | Future local engine/API/persistence/UI oracles actually run and pass, including wrong-versus-error distinction, lost response, all boss outcomes, exactly-once reward and travel/checkpoint isolation | RELEASE-GO |
| H01 | Refresh inherited AUTH-04 real-Google OAuth, allowed-origin and deployment verification gaps before release. Reported migration application is not repeated here | RELEASE-GO |

H01 is inherited from dated [AUTH-04.1 release record](../../auth-04/AUTH-04.1-migration-release-2026-10-24.md) and [owner decision](../../auth-04/AUTH-04.1-blocker-resolution.md#owner-decision--2026-10-24), not a fresh hosted audit. Do not reopen the waived separate-staging requirement automatically; do not treat the shared Preview database as isolated. No hosted action was performed. [Evidence limitations S6](C0-learning-objectives-and-provenance.md#s6).

## Checks performed

Document checks **PASS**: 388 assertions, including 123 local link targets, pinned source/export hashes and exact source selectors, 12 unique item IDs / 14 parts, 4/2/2/2/2 pool counts, one authored key per part, EN/VI rendering for all fields, null independent/owner approvals, and disposition coverage of all 25 original package IDs. This covers **authoring integrity**, not semantic answer uniqueness, educator validation, calibrated CEFR or a running Tower. Proposed C01–C08 and I01–I12 oracles are in the [contract](C0-content-contract.md#content-oracles).

No application build, runtime test, browser flow, real PostgreSQL/concurrency test or hosted check was run for C0. Those cannot pass for an unimplemented Tower. **Preservation PASS:** all 350 pre-existing tracked/source/audit/export/package/planning file hashes are unchanged; HEAD remains `e1d07867e799e36bec6c550dca9e4f1dcf258dfe`, tracked Git diff is empty, prior untracked work is retained. Seven new files exist only under `docs/game-01/c0`; repository/output review copies match. No code, migration, production config, commit, push or deployment occurred.

Manual authoring audit completed: inspected current `japan.ts`, travel keys/evaluator/UI/checkpoint/reward helper; compared airport export against native authored content; read the five architecture documents and seven Markdown package entries; reviewed all candidate options/rationales and EN/VI for obvious goal/direction mismatches. Source register, per-item worksheet and package disposition preserve the actual evidence scope. This self-review is neither independent bilingual review nor a learner study.

## Research coverage and stopping rationale

Risk: medium editorial/interaction design; decisive certification/mastery claims prohibited without independent evidence. Material dimensions inspected: taught content/feature fit, bilingual fidelity, CEFR claim boundaries, retry variety, lesson remediation, versioning, state/error/reward integrity and existing architecture compatibility. Operations/hosted auth are inherited blockers; no benchmark, migration, new dependency, rendering engine, deployment or broader licensing choice is made. No external text/assets are copied into product content beyond short reference excerpts; reference access is not publication authorization.

Bounded method: current local source is primary; exports and older package are derivative evidence, not independent corroboration. Contrary search specifically looked for taught ticket counters, flipped layouts, repair/gratitude exchanges and explicit grammar teaching inside `jp-arrival`; none appears in the inspected airport object. Other Tokyo scenes were inspected to prevent accidental scope borrowing. Broader Nature content was not used to justify airport questions. The prior chat's attachment content was recovered through its listed files, then matched by SHA256 to local exports.

External check: Firecrawl skill/CLI was available but its request failed with `ENOTFOUND api.firecrawl.dev`; fallback browsing read the official Council of Europe 2020 descriptor PDF and British Council request/offer page. No login/config changes were attempted. Generic learning-efficacy claims in the package bibliography were not adopted. Official descriptor alignment does not substitute for item calibration. [S5](C0-learning-objectives-and-provenance.md#s5).

Stop because the authorized C0 research/design/authoring deliverables are complete and the remaining decisive evidence requires actual independent reviewers, user decisions and separately authorized implementation/testing. Additional generic browsing cannot establish that review. **No code, migrations, production config, commit, push or deployment. C0 review gate remains open.**
