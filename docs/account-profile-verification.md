# ATLAS account profiles — local review (2026-10-20)

## Current integration status

After user authorization to apply migrations from terminal and push code, Supabase CLI 2.121.0 was linked to the ATLAS-Hub project matching `.env.local`. Reviewed dry-run, applied all three repository migrations with `db push --linked --skip-vault --yes`, then verified local/remote history matches at 20261020090000, 20261020110000 and 20261020130000. Prior tables had been created manually and had no CLI migration history. The SQL creates missing tables, restores the intended service-role access and adds profile interests; it does not update expedition rows or XP.

Read-only live SDK queries for profile columns including `interests`, and expedition identity/revision, both returned HTTP 200. Local profile API, interests recommendation and chapter SSR checks passed again. These checks confirm schema availability; real browser Google OAuth/profile-save/avatars remain unverified. Earlier sections below record the preceding local-only phase and its then-unapplied migration boundary.

## Checkout and scope

Started with a clean `main` at `cfa5139`. The existing Supabase work is on `origin/fix/vercel-preview-build`, so switched to its local tracking branch at `0e784da` before implementation. No commits, pushes, deployments, live database mutations or production account changes were made.

## Behavior

- Navbar displays Google/provider avatar when available; initials cover missing or failed images. The player name is truncated visually with a full accessible Account label.
- Account menu contains Profile, Settings and Sign out. Menu/dialog keyboard navigation and focus behavior use the existing Radix dependency. Sign out uses the existing same-origin POST route.
- A verified Google account with no saved player name sees onboarding before gameplay. Names accept Vietnamese, reject empty/control/hidden characters, and are limited to 40 characters. Profile edits can change the name later.
- Vietnamese support and reading targets A1/A2/B1/B2 persist to the account and apply to existing Journey, journal and World Travel controls. Preference controls wait for a save before accepting another change. Failed saves retain the previous applied preferences and allow retry.
- Profiles use the separate `atlas_profiles` table keyed by the server-verified Supabase `auth.users.id`. Client-supplied IDs and extra fields are rejected. Legacy Sites/D1 gameplay stays on its original storage adapter.

## Local verification

- `node scripts/test-profile.mts`: real SDK request semantics against an in-memory PostgREST fixture; verified identity, two accounts, Unicode/invalid names, strict preferences, identity injection rejection, expiry, avatar filtering and missing schema. Profile requests never access the expedition table.
- `node scripts/test-profile-http.mts` with `node scripts/profile-preview.mts` running: real Next HTTP routes and Supabase cookie/session verification against a local provider fixture; persistence, account isolation, cross-origin/unauthenticated rejection, failed save and recovery. Expedition documents and revisions remain byte-for-byte unchanged across profile updates.
- Existing `test-supabase.mts`, `test-auth-http.mts`, `test-atlas.mts`, `test-travel.mts`, `test-chapter.mts`, `test-vocabulary.mts` and `test-chapter-ui.mts` pass. Includes full Forest 210 XP, World Travel rewards, concurrent first-clear/replay protection, English evidence and saved vocabulary. The chapter SSR harness was updated to load the real account components.
- Native Next production build and TypeScript pass. Targeted account-module lint has no errors; one advisory remains for the small external provider avatar using a native img (needed for provider URLs without introducing a remote image proxy).
- Browser checks used the in-app browser's Playwright controls on actual Next pages: first-login naming, whitespace rejection, Vietnamese name/rename, initials, Account items, Settings on/off + target changes, reload, keyboard menu/Escape/focus, keyboard Sign out, two accounts, failed save/retry, long name, desktop and 390px/320px widths. A narrow-screen HUD clipping issue was corrected during review.
- Screenshot: [Account menu](../output/playwright/account-desktop.jpg).

## Review locally

`pnpm preview:profile` starts Next on `http://127.0.0.1:3211` and a loopback-only provider fixture on port 43219. Open `http://127.0.0.1:43219/login/alice` or `/login/bob`. All fixture data is in memory and disappears on restart. This script is never imported by app routes and does not contact a real Supabase project. Native production build: `$env:VERCEL='1'; pnpm build` in PowerShell.

## Integration boundary

2026-10-20 live troubleshooting: environment values were saved in `.env.example`, which Next does not load. Values were preserved in ignored `.env.local`; the tracked template was restored. Read-only checks confirm Google enabled and expedition storage available, while `atlas_profiles` is missing (`PGRST205`). The existing user-run server at port 3000 now returns health 200 and a valid Google→Supabase redirect. Migration remains unapplied. Startup/profile 503 UI now renders one localized recovery card with in-place retry and no false saved-status claim. Browser fixtures verified failure→retry→onboarding, and production build/API/HTTP/SSR regressions passed. See [recovery screenshot](../output/playwright/recovery-503-vi.jpg).

Follow-up UI review: private-review banner and private-pilot footer removed. A persistent EN/VI navbar button selects a single interface language independently of Vietnamese learning support. Account/auth forms, journey and travel labels follow the interface selection; English lesson content retains optional Vietnamese assistance. Browser checks covered EN→VI→EN, reload persistence, translated account Settings and 320px layout. Final native production build, SSR language/learning regression, profile API/HTTP and auth HTTP checks passed. `pnpm dev:supabase` was also started and served HTTP 200 at localhost:3000 without the private banner. See [the Windows local guide](LOCAL-DEVELOPMENT.md) and [the updated VI screenshot](../output/playwright/interface-vi.jpg).

The new migration `supabase/migrations/20261020110000_atlas_profiles.sql` is prepared, **not applied**. It enables RLS, denies browser database roles access and grants only the application service role the required access, matching the existing expedition adapter. No profile operations modify the expedition schema or document.

Live Google OAuth, real avatar loading and Supabase/PostgreSQL persistence/RLS remain unverified in this checkout. Local HTTP and SDK fixtures do not establish that the live Google provider, tables or secrets are configured. The application reports a recoverable profile error when its table is unavailable. Review and apply configuration/migrations only in a separately authorized integration step.

## Exploration interests and compact onboarding

- Added optional, multiple-choice Nature/environment, Travel/places, Food/cuisine and Culture/everyday life interests. Onboarding and Profile edit these; Settings retains reading target and Vietnamese learning support. Profile remains owned by the server-verified user UUID.
- Journey suggestions use existing content only: an unlocked Forest mission or the current Japan route. A food/culture topic at a later stop is explained as a later part of that route. Suggestions do not unlock content, award XP or change progression rules.
- Added `20261020130000_atlas_profile_interests.sql` for the separate profile table. **Prepared only; not applied remotely.** Reads tolerate old rows/schema without the column. Saving interests before migration fails with `PROFILE_SCHEMA_UPDATE_REQUIRED` rather than silently discarding choices or partially saving the name.
- Profile SDK/API, local Next HTTP and interest recommendation tests pass: valid/invalid/duplicate/empty interests, save/reload, account isolation, older schema, ordering, sequential travel gates and unchanged expedition documents/revisions. Chapter SSR regression passes. Targeted lint has no errors, with the existing native-avatar image advisory. Legacy Sites preference restoration now runs with the asynchronous session response rather than synchronously in an effect.
- Browser fixture checks passed for whitespace-name rejection, multi-select/deselect, optional skip, save/reload, Profile editing, Settings save without losing interests, Nature mission CTA and travel map CTA. No real Google or Supabase account was modified.
- Onboarding fits without page scrolling at tested 1366×768, 1280×720, 1024×720, 390×844 and 320×740 viewports. EN and VI were checked; VI checked at every listed width. No global overflow hiding is used; content stays accessible if the viewport is shorter or text enlarged.
- Review image: [compact onboarding in Vietnamese](../output/playwright/onboarding-interests-vi.jpg). README/local setup now include the additive interests migration.
