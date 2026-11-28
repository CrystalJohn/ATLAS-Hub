# Study calendar and daily streak

2026-11-04 · Local implementation · no hosted deployment, production data operation or migration.

## Product behavior

The flame is now an independent study-streak button in the account header; the separate Lv. badge still represents XP level. Opening it shows a monthly calendar, current consecutive-day streak, longest streak and total unique study days. Choose a month/year and a date to inspect whether learning was recorded, including 03/10/2026 when that timestamp exists. EN/VI interface, keyboard focus, Escape dismissal, reduced motion and narrow mobile layout are supported.

One valid learning day counts once, regardless of activity count. Consecutive dates extend the streak. If the most recent study date is yesterday, the current streak remains available to continue today; after a missed full day it becomes zero. A new learning day starts a new streak. Longest streak and full date history remain visible. No streak XP, passport stamp, mastery score, punishment, freeze or date-edit feature is introduced.

Calendar days are fixed to Asia/Ho_Chi_Minh (Vietnam, UTC+7), using a server-owned clock. Users cannot submit a date. A future timezone setting requires a separate date-history policy; this version does not infer timezone from the device.

## What records a day

- Newly recorded valid Nature clue.
- Evaluated Nature/English response after prerequisites, including a valid incorrect answer.
- Current-step Travel interaction with a supported action and known choice/object, including a valid incorrect answer.
- Recovery of historical dates from saved learning submissions, English evidence, first-clear ledger timestamps and completed Travel timestamps.

Login/session, reading the calendar, browsing maps, starting an attempt, changing preferences, saving a checkpoint, stale/out-of-order requests, malformed/unknown answers, unavailable storage and network failures do not independently record a day. Completed-action retries do not create extra dates. A failed transaction does not persist a date.

Historical recovery never uses login or attempt-creation timestamps. Old clue-only activity without timestamps cannot be reconstructed. Legacy submission dates are historical participation evidence, not proof of skill/mastery. Newly rejected/incomplete mission submissions carry studyEligible:false so their timestamp cannot create credit through recovery. DRAFT Tower review remains outside the real player study history; its volatile local store and content/economy policy remain separate.

## Storage and API

The existing atlas_expeditions document receives an optional studyHistory namespace:
- version: 1
- timeZone: Asia/Ho_Chi_Minh
- days: sorted, unique YYYY-MM-DD labels

Study history commits atomically with the learning action through existing revision CAS. No new table, schema migration, alternate database or identity system. Existing documents work without this property. Derived state also returns currentStreak, longestStreak, totalDays, studiedToday, lastStudyDay and server today.

GET /api/study uses the existing authenticated catch-all dispatcher and no-store/private response convention. It returns playerId and studyHistory for the verified user only. No player/date selector or write endpoint is provided. The UI checks the owner, ignores superseded responses, reloads after successful actions/focus and rechecks across midnight. Reading history does not mark a day.

## Changed feature files

- packages/domain/src/study.ts — date validation, Vietnam day formatting, deduplication and current/best streak.
- lib/atlas/study.ts — legacy evidence recovery and persisted day recording.
- lib/atlas/service.ts — optional history, GET study, eligible action hooks inside existing CAS transaction, one server timestamp per request.
- app/components/chapter-types.ts — optional state contract and refresh event after successful mutations.
- app/components/StudyCalendar.tsx — owner-scoped badge, accessible dialog/month browser/date detail.
- app/study-calendar.css — responsive ATLAS calendar styling.
- app/components/Game.tsx — mount badge and retain separate level/XP.
- app/layout.tsx — calendar styles.
- scripts/test-study.mts, test-study-postgres.mts, test-study-browser.mts — feature oracles.

Pre-existing Navigation V2, Tower polish, content-authoring and import-guard changes are preserved and not attributed to this feature.

## Verification

- node scripts/test-study.mts — PASS 6 tests: midnight/year/leap/gaps, no login/navigation credit, invalid requests, 32 duplicate saves, wrong-answer participation, CAS retry, rollback, owner separation and historical dates.
- node scripts/test-study-postgres.mts — PASS 7 database oracles on disposable PostgreSQL 17.10/PostgREST. Includes authoritative SQL, 32 simultaneous saves, fresh-store resume, two accounts, lost-response retry and failed save rollback. Evidence: output/study-calendar/postgres-evidence.json.
- node scripts/test-study-browser.mts — real Chrome, synthetic Auth and isolated PostgreSQL; desktop/month/date/VI/Escape/mobile, account separation, immediate badge refresh and mismatched-owner refusal. Evidence: output/study-calendar/browser-results.json and calendar-desktop.png / calendar-mobile.png.
- node scripts/test-auth02-postgres.mts — PASS 19 existing scenarios.
- node scripts/test-supabase.mts and node scripts/test-profile.mts — PASS.
- node scripts/test-travel.mts and node scripts/test-atlas.mts — PASS.
- node scripts/test-tower.mts — PASS 29/29; node scripts/test-navigation-v2.mts — PASS 3/3.
- TypeScript, targeted feature lint and Next production build checked locally.

Browser screenshots contain synthetic dates/accounts, not production learner activity. No live Google OAuth, production account writes, manual screen-reader session or broad device coverage is claimed. No commit/push/deploy performed.
