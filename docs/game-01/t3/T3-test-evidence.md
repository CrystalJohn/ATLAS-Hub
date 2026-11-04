# T3 test evidence

2026-10-28. **LOCAL-T3-PASS for the local functional slice; accessibility is PROVISIONAL and RELEASE-NO-GO.** Test results below do not validate hosted OAuth, independently reviewed content, production readiness or learner usability.

## Commands executed

| Command | Result |
|---|---|
| `node scripts/test-tower.mts` | PASS 27 T1 tests |
| `node scripts/test-tower-postgres.mts` | PASS 25 T2 PostgreSQL/HTTP oracles |
| `node scripts/test-auth02-postgres.mts` | PASS 19 existing AUTH-02 PostgreSQL/PostgREST scenarios |
| `node scripts/test-travel.mts` | PASS legacy World Travel regression |
| `node scripts/test-atlas.mts` | PASS legacy mission regression |
| `node scripts/test-profile.mts` and `node scripts/test-supabase.mts` | PASS profile/auth fixtures |
| `node scripts/test-tower-browser.mts` | PASS 7 browser groups using real local Next UI, disposable PostgreSQL/PostgREST and signed synthetic Auth |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false` | PASS |
| `node node_modules/eslint/bin/eslint.js . --ignore-pattern dist --ignore-pattern .next` | PASS, zero errors and seven pre-existing image warnings |
| `node scripts/run-framework.mjs build --webpack` | PASS optimized local production build and evidence gate |

Logs and screenshots are under `output/game-01/t3/`. Earlier T2 and AUTH-02 generated evidence was backed up before rerunning their suites and restored byte-for-byte. Git remains on the T1/T2 checkpoint; T3 changes are uncommitted. No migration, push, deployment or hosted player write occurred.

## Browser observations

Subsequent owner-requested UX revision: a separate isolated local account was used to verify the corrected hub card geometry, acknowledgement checkbox and enabled start without opening the lesson, highlighted answer selection without grading, explicit confirmation, and 390px horizontal fit. This follow-up does not establish source exposure or educator approval.

The final browser run verifies Japan hub discovery, visible DRAFT/rule copy, source review, disabled confirmation before selection, double activation causing one committed advancement, correct feedback, a wrong-answer failure and read-only lesson return without changing the adventure checkpoint. A deliberately truncated response after a database commit is recovered with the same operation after full reload and a Bob→Alice account switch; the committed run revision does not advance twice. A later reload retains the same run ID, next question and choice order.

Both boss selections are required before one confirmation; all-correct reaches server-reported COMPLETED and best 5. On a second account the boss with correct p1/wrong p2 fails at four floors while showing both part results honestly. Two accounts retain separate runs. Tests exercised EN and VI interface copy, a focused radio, reduced-motion media preference, 320px no-horizontal-overflow and 48px choice height.

200% CSS magnification at a 640px viewport was used as an additional *simulation*: the Tower and page did not overflow after a Tower-scoped account-header wrapping adjustment. CSS magnification does not alter media query breakpoints in the same way as native browser zoom. A stricter exploratory 320px viewport plus CSS 200% produced overflow in the surrounding existing travel controls; this represents an effective width below 320 CSS pixels and remains a limitation rather than a native zoom claim. Native browser zoom and screen-reader testing are **NOT RUN**. Headless Chrome did not apply browser zoom when sent the standard keyboard shortcut.

Selected static color pairs were calculated: Tower body `#4f3d65` on `#fffdf9` 9.45:1; choice text `#443452` on white 11.30:1; floor label `#746382` on `#f7f3fa` 4.98:1; primary white on `#7953bf` 5.52:1. These checks do not establish contrast for every state or WCAG conformance. A full keyboard-only walk, all assistive technologies, formal accessibility audit and learner usability study are **NOT RUN**.

## Evidence captures

- [Desktop correct feedback](../../../output/game-01/t3/screenshots/desktop-correct.png)
- [Desktop failed feedback](../../../output/game-01/t3/screenshots/desktop-failed.png)
- [Desktop two-decision boss](../../../output/game-01/t3/screenshots/desktop-boss.png)
- [Desktop victory](../../../output/game-01/t3/screenshots/desktop-victory.png)
- [Mobile Vietnamese active challenge](../../../output/game-01/t3/screenshots/mobile-active-vi.png)
- [Simulated 200% magnification](../../../output/game-01/t3/screenshots/mobile-zoom-200.png)

Full-page captures include the existing sticky navigation at its captured scroll position. Screenshots are local test artifacts and show DRAFT fixture material only.

## Security and limitations

The T2 suite proves that an authenticated normal dispatcher with no injected review runtime returns UNPUBLISHED and refuses a new run. The UI gates the card on the authoritative availability response. The production browser bundle scan found no fixture adapter, editorial-bank schema or bank-ID markers; this is a targeted check, not a comprehensive security audit. The local review launcher injects the bank only inside its loopback server, uses verified synthetic users, and closes its disposable database. The actual production route does not import the fixture adapter or enable a test runtime.

If session storage is disabled, the original pending identity cannot be retained across a full reload; the authoritative state can still be read, but the same-operation recovery guarantee across that reload is unverified. Cross-account tests cover a full reload and return, not every possible mid-flight cross-tab timing. The production T2 API does not implement completed-run replay; the UI states that honestly. UX localization and translations remain review candidates, and the real hosted auth/origin/deployment gates remain open.
