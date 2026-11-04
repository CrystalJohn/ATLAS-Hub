# ATLAS AUTH-03 minimal execution plan

Prepared from the audit on 2026-10-22. This plan contains only current gaps and missing verification. It does not authorize implementation; no AUTH-03 code changes were made.

## Priority overview

There are **no confirmed P0 blockers** in the local implementation. Three P1 work items remain before AUTH-03 can be called complete: verify the deployed OAuth/refresh path, close or explicitly accept the Host-derived redirect-origin risk, and prove account state cannot survive a same-document identity change. The missing sign-in pending state and UI interaction coverage are P2.

## AUTH03-01 — Verify hosted Supabase Auth recovery and Google OAuth

- **Priority:** P1 — blocked by staging access.
- **Problem:** Local fixtures prove the Supabase SDK boundary and cookie handling, but they do not exercise GoTrue refresh, provider consent, PKCE state/nonce, actual revocation, or deployed cookie attributes.
- **Reuse:** `app/auth/google/route.ts`, `app/auth/callback/route.ts`, `lib/supabase/server.ts`, existing `/api/session` and profile/checkpoint contracts, and `scripts/test-auth02-http.mts`.
- **Proposed work:** On an isolated staging Supabase project with two authorized Google test accounts, verify first login, reload/reopen, near-expiry refresh, callback cancellation/failure, logout, account switch, profile, and resume. Record redacted request outcomes and authoritative state. Do not create a new session manager.
- **Files likely affected:** Primarily a new or extended verification report/test; auth source changes only if staging exposes a defect in the existing route or cookie configuration.
- **Dependency:** Staging project, correct callback allowlist, and dedicated Google test accounts. The user previously confirmed these are not currently available.
- **Risk:** Medium; real OAuth configuration and cookies vary by deployed hostname. Use test accounts and non-production data.
- **Acceptance criteria:** Google consent reaches the fixed callback; the verified UUID resolves to one existing profile; near-expiry session refresh updates cookies; invalid/revoked session returns to a useful sign-in path; logout clears the browser session; account B sees only B; saved progress and checkpoint remain unchanged across A's logout/login.
- **Required tests:** Manual browser E2E against staging, API/database snapshot oracle, and existing `test:auth02:http` regression.
- **Effort:** 0.5–1 day after staging/test accounts are ready.

## AUTH03-02 — Constrain authentication redirect origins

- **Priority:** P1 — security/configuration review.
- **Problem:** OAuth callback paths are fixed and no `returnTo` query is used, but `requestOrigin()` derives its origin from the request `Host` without an application allowlist. Correct behavior currently depends on Vercel routing and the Supabase redirect URL allowlist.
- **Reuse:** `lib/atlas/origin.ts`, Google and callback route handlers, existing same-origin tests, and the Supabase URL Configuration.
- **Proposed modification:** First confirm which production and preview hostnames are intentionally supported. If the edge platform does not guarantee that only those hosts reach the app, validate `Host` against an explicit configured allowlist or canonical deployment origin before generating an OAuth URL or redirect.
- **Files likely affected:** `lib/atlas/origin.ts`, `app/auth/google/route.ts`, `app/auth/callback/route.ts`, `scripts/test-auth-http.mts`, deployment/setup documentation.
- **Dependency:** Approved list of production and preview hostnames; staging confirmation of Supabase allowed redirect URLs.
- **Risk:** Low to medium; overly strict allowlist can break valid preview deployments. Do not use a broad `*.vercel.app` allowance without a specific need.
- **Acceptance criteria:** Supported hostnames generate only their allowed callback URI; arbitrary Host values receive a safe error; callback always returns to the intended application origin; tests cover production-like and preview hostnames, malformed Host, and open-redirect payloads.
- **Required tests:** Unit tests for origin resolution plus local HTTP tests for both accepted and rejected hosts; staging OAuth smoke after configuration review.
- **Effort:** 2–4 hours after the supported host list is confirmed.

## AUTH03-03 — Invalidate account-scoped UI state on identity change

- **Priority:** P1 — privacy/correctness verification, then minimal fix if needed.
- **Problem:** `useAccountProfile` generation guards protect requests, and the current account switch uses a full document navigation. However, profile state is keyed only by enabled/retry, and `SavedVocabularyProvider` retains its in-memory words when disabled. A same-document identity change is not a supported UI path today, but the state stores do not independently prove safe behavior if that changes.
- **Reuse:** `useAccountProfile`, `SavedVocabularyProvider`, API 401 event, and server-derived profile UUID.
- **Proposed modification:** Test logout/session invalidation while profile and vocabulary requests are pending, then sign in as B. If any prior state can render, key the providers/state by the verified player ID or clear them on the auth-required/identity transition. Do not persist credentials or infer identity from email.
- **Files likely affected:** `app/components/Game.tsx`, `app/components/useAccountProfile.ts`, `app/components/SavedVocabulary.tsx`, possibly `app/components/chapter-types.ts`, and a focused UI test.
- **Dependency:** A signed local fixture capable of switching identities while the React document remains mounted; no real Google OAuth is required for the race test.
- **Risk:** Low; incorrect reset timing could discard unsaved UI-only form input, but must never touch server progress.
- **Acceptance criteria:** After A→signed-out→B, no A profile, name, preferences, saved words, or pending response is visible or applied; B's server data renders; A's persisted progress is unchanged.
- **Required tests:** Deferred-response race for profile and vocabulary requests, plus the existing two-account HTTP and PostgreSQL isolation tests.
- **Effort:** 0.5–1 day including a focused test harness.

## AUTH03-04 — Add an explicit sign-in pending state

- **Priority:** P2 — UX polish.
- **Problem:** The Google entry is a plain anchor with no pending state or duplicate activation guard.
- **Reuse:** Existing `AuthGate` styling, route `/auth/google`, localized `Bilingual` copy, and generic `/auth/error` recovery page.
- **Proposed modification:** Add a small pending state around sign-in navigation, prevent repeat activation while it is pending, and retain a reachable retry path if navigation fails.
- **Files likely affected:** `app/components/AuthGate.tsx`, `app/auth.css`, and the optional browser test in `scripts/test-auth-http.mts`.
- **Dependency:** None.
- **Risk:** Low; browser back and provider errors must restore an enabled CTA.
- **Acceptance criteria:** Click or Enter starts one navigation; a visible pending label/state appears; repeated activation does not start extra requests; returning from an error restores the CTA.
- **Required tests:** Browser test with a delayed loopback provider at desktop and mobile widths; keyboard activation and error recovery.
- **Effort:** 2–4 hours.

## AUTH03-05 — Cover account menu and recovery interactions in browser QA

- **Priority:** P2 — verification.
- **Problem:** Profile and Settings APIs, dialogs, and save logic exist, but this audit did not run a browser interaction test for menu open/close, dialog focus, profile/settings save, avatar fallback, or back/forward behavior.
- **Reuse:** `AccountMenu`, `useAccountProfile`, `scripts/profile-preview.mts`, and existing AUTH-02 fixture browser flow.
- **Proposed modification:** Extend the isolated fixture browser scenario to cover the authenticated account menu at mobile and desktop sizes. Keep synthetic fixture login clearly separated from Google OAuth evidence.
- **Files likely affected:** `scripts/test-auth02-http.mts` or a dedicated fixture browser test and the test evidence report.
- **Dependency:** Playwright Chromium availability; no hosted credentials needed for menu testing.
- **Risk:** Low; fixture results must not be presented as hosted authentication results.
- **Acceptance criteria:** Menu opens/closes by pointer and keyboard, Profile and Settings dialogs save/reload values, focus returns to the trigger, broken avatar falls back safely, no horizontal overflow, logout returns to AuthGate, browser back/forward does not show stale account data.
- **Required tests:** Isolated browser fixture and the existing HTTP/PG isolation suites.
- **Effort:** 0.5 day.

## Smallest safe sequence

1. Obtain isolated staging and test accounts; complete AUTH03-01 without production data.
2. Confirm supported Vercel hostnames and Supabase redirect allowlist; close AUTH03-02 if the platform already enforces the host boundary, otherwise make the narrow allowlist change and test it.
3. Run the same-document account-switch race. Implement only the minimal state invalidation needed for AUTH03-03.
4. Add the P2 CTA loading behavior and fixture browser coverage for account/recovery UI.
5. Re-run lint, TypeScript, AUTH HTTP, PostgreSQL ownership/checkpoint tests, production build, and staging OAuth verification. Update the readiness matrix with PASS/FAIL/NOT RUN evidence.

The feature can be classified **ESTABLISHED** only after the hosted Google/GoTrue flow and remaining P1 checks pass. Until then, keep the outcome **PROVISIONAL**. No production migration, merge, or deployment is part of this plan.
