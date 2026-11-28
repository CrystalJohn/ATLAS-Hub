# ATLAS AUTH-03 requirement gap matrix

Audit date: 2026-10-22. Statuses describe the code and tests on `codex/auth-02-player-ownership` at `d03faab`. “Complete — Verified” means the behavior passed the stated local fixture; it does not imply hosted Google/GoTrue verification.

Priority: **P0** prevents safe use; **P1** blocks AUTH-03 completion or warrants security verification; **P2** is a bounded UX or verification improvement.

## A. Session recovery

| ID | Requirement | Status | Evidence and runtime result | Gap / required action / priority |
|---|---|---|---|---|
| A1 | Valid session restored after page reload | COMPLETE — VERIFIED | `Game` posts `/api/session`; `scripts/test-auth02-http.mts` and `output/auth02/browser-evidence.json` verified refresh and the same owned checkpoint with signed fixture cookies. | None for the local server-cookie flow. Hosted verification is separate. |
| A2 | Valid session restored after reopening the application | IMPLEMENTED — UNVERIFIED | `lib/supabase/server.ts` stores HttpOnly cookies; Next boot calls `/api/session` again. | Browser-process restart was not tested with Supabase Auth. Verify in staging / P1. |
| A3 | Expired access token refreshed using supported Supabase behavior | BLOCKED | `supabaseRouteClient()` uses `@supabase/ssr`; every protected route calls `auth.getUser()`. Local fixture verifies signed sessions and rejects expiry. | Only hosted GoTrue can establish real refresh-cookie rotation. Verify a near-expiry session on staging / P1. |
| A4 | Invalid/revoked session handled correctly | COMPLETE — VERIFIED | `scripts/test-auth02-http.mts`: malformed cookie and signed-out fixture token receive 401; old token cannot access state after logout. | Hosted GoTrue revocation timing remains outside this fixture. |
| A5 | No infinite loading or authentication redirect loops | IMPLEMENTED — UNVERIFIED | `Game` ends its connecting state in `finally`; `/auth/error` offers retry and a path back. `scripts/test-auth-http.mts` passed callback/provider-failure redirects. | No browser test exercised repeated failures, timeout, back, and retry together / P2. |
| A6 | Auth state synchronized with frontend navigation | COMPLETE — VERIFIED | `Game` initializes from `/api/session`; API 401 dispatches `atlas:sign-in-required`; auth and logout use full-page route navigation. Local Next HTTP/session tests passed. | No browser auth listener is needed for the current server-cookie flow. |
| A7 | No duplicate or conflicting authentication listeners | COMPLETE — VERIFIED | Search of active `app/` and `lib/` found no `createBrowserClient`, `onAuthStateChange`, or competing provider. `Game` owns one event listener. | None; retain the existing server-owned session model. |
| A8 | Stale requests cannot overwrite another account's UI state | PARTIAL | `useAccountProfile` checks an active flag and generation before applying profile reads/saves. The account-switch browser fixture loaded Bob separately and saw no Alice progress. | No in-flight request race is tested, and profile/vocabulary state is not explicitly reset by player ID in a still-mounted app. Add account-keyed invalidation and a race test if identity can change without document navigation / P1. |

## B. Login UX

| ID | Requirement | Status | Evidence and runtime result | Gap / required action / priority |
|---|---|---|---|---|
| B1 | Clear Continue with Google entry point | IMPLEMENTED — UNVERIFIED | `AuthGate` renders one bilingual “Continue with Google” anchor to `/auth/google`. | The optional browser assertion for visible text, link target, and keyboard activation was not run in this audit / P2. |
| B2 | No confusing Reconnect dead ends | IMPLEMENTED — UNVERIFIED | Sign-in failures lead to a localized retry page with “Try Google again” and “Back to ATLAS”; `scripts/test-auth-http.mts` verified the provider-unavailable page heading. | Browser interaction with retry and return actions was not run / P2. |
| B3 | First-time and returning users share a simple sign-in flow | COMPLETE — VERIFIED | Both use `/auth/google` → `/auth/callback` → `/`; the same session initialization resolves profile/progress. Local session and profile tests passed. | None. |
| B4 | Login loading state is implemented | MISSING | `AuthGate` uses a plain anchor and has no pending state or disabled control. | Add a small client submit/navigation state if navigation can remain pending; test keyboard and repeated activation / P2. |
| B5 | Duplicate login submissions prevented | PARTIAL | Native anchor navigation leaves the page on successful navigation, but no explicit latch or disabled state exists. | Suppress repeated activation while the provider request is pending; test a slow provider response / P2. |
| B6 | OAuth cancellation and failure handled | IMPLEMENTED — UNVERIFIED | Callback checks provider `error`, missing code, and code-exchange errors, then redirects to a generic recovery page. Local route tests cover missing provider and callback parameters. | Real Google cancellation, PKCE, and exchange failure were not run / P1 verification. |
| B7 | Useful recovery actions displayed | IMPLEMENTED — UNVERIFIED | `/auth/error` offers retry and return; signed-in profile recovery offers retry and sign out. HTTP fixture verified the recovery page content. | Browser interaction with recovery actions was not run / P2. |
| B8 | Login screen responsive on mobile and desktop | IMPLEMENTED — UNVERIFIED | Auth styles include responsive rules; optional `ATLAS_BROWSER_QA=1` checks exist in `scripts/test-auth-http.mts`. | Optional browser run was not executed in this audit; verify on 390px and desktop / P2. |
| B9 | Design aligns with ATLAS game identity | IMPLEMENTED — UNVERIFIED | `AuthGate` uses ATLAS compass, adventure copy, bilingual support, and existing game button styling. | No fresh visual/browser review in this audit / P2. |

## C. Navbar and account menu

| ID | Requirement | Status | Evidence and runtime result | Gap / required action / priority |
|---|---|---|---|---|
| C1 | Authenticated navbar displays player identity | IMPLEMENTED — UNVERIFIED | `Game` mounts `AccountMenu` after session/profile load; trigger includes the profile display name. | HTTP tests do not assert the signed-in navbar text in a browser / P2. |
| C2 | Google/profile avatar displayed with safe fallback | IMPLEMENTED — UNVERIFIED | `handlePlayerProfile` accepts only credential-free HTTPS `avatar_url`; `AccountMenu.Avatar` falls back to player initials when absent or image load fails. | No browser test exercised missing, invalid, or broken avatar rendering / P2. |
| C3 | Player display name loaded correctly | IMPLEMENTED — UNVERIFIED | `GET /api/profile` maps `display_name`; `useAccountProfile` feeds it to `AccountMenu`. Profile save/reload passed over real local HTTP. | Navbar rendering after Google login is not directly asserted in browser / P2. |
| C4 | Account menu opens and closes correctly | IMPLEMENTED — UNVERIFIED | Radix `DropdownMenu` and `Dialog` implement menu, Escape/outside close, and focus return. | No direct interaction test was run / P2. |
| C5 | Profile navigation works | IMPLEMENTED — UNVERIFIED | Menu item opens the Profile dialog and uses the existing profile save API. API save/reload/isolation passed. | Browser click path and focus behavior remain untested / P2. |
| C6 | Progress/Journey navigation works where available | COMPLETE — VERIFIED | Journey navigation is in `Game`; Resume uses `state.resume`; World Travel initializes from the canonical checkpoint. Browser fixture resumed Tokyo after reload/login. | None for the current single-page app. |
| C7 | Logout works | COMPLETE — VERIFIED | `/auth/logout` checks same-origin, calls `signOut({scope:'local'})`, clears cookies and redirects. Local Next HTTP and signed-cookie PostgreSQL tests passed. | Hosted sign-out/revocation still needs staging verification. |
| C8 | No nonfunctional settings/profile links | IMPLEMENTED — UNVERIFIED | Profile and Settings open separate dialogs; both forms save through `useAccountProfile`. | Menu-item interaction and visible saved confirmation need browser coverage / P2. |
| C9 | No private data from a previous account remains visible after switching accounts | COMPLETE — VERIFIED | AUTH-02 browser fixture logged out Alice, opened Bob in a new session, and confirmed zero XP/no Alice checkpoint/Resume. | This verifies the current full-page switch path. In-flight same-document switching is tracked under A8/F7. |

## D. Profile initialization

| ID | Requirement | Status | Evidence and runtime result | Gap / required action / priority |
|---|---|---|---|---|
| D1 | First login resolves exactly one player profile | COMPLETE — VERIFIED | `ensurePlayer` upserts only the verified UUID with `ignoreDuplicates`; real PostgreSQL test issued 24 concurrent initializations and counted one row. | None. |
| D2 | Returning login retrieves the existing profile | COMPLETE — VERIFIED | Local PostgreSQL/HTTP tests signed in again and retained the same UUID, name, and learning settings. | Hosted GoTrue login remains blocked separately. |
| D3 | Profile loading state handled | IMPLEMENTED — UNVERIFIED | `useAccountProfile.loading` gates the app; `AccountSetup` renders “Getting your profile ready…”. | No browser assertion covered loading, retry, and delayed profile responses / P2. |
| D4 | Missing display name/avatar handled | IMPLEMENTED — UNVERIFIED | Missing name enters onboarding; missing/failed avatar renders `playerInitials`; API safely filters avatar metadata. | Direct rendered-state checks are absent / P2. |
| D5 | Existing customized profile data preserved | COMPLETE — VERIFIED | Profile creation ignores duplicates; patch upsert changes supplied fields only. Concurrent return/profile HTTP tests preserve the existing values. | None. |
| D6 | Profile loading errors are recoverable | IMPLEMENTED — UNVERIFIED | `AccountSetup` renders `AdventureRecovery` with retry/sign out; API fixture exercised a failed write and later successful read. | Browser retry interaction is not tested / P2. |

## E. Protected routes and navigation

| ID | Requirement | Status | Evidence and runtime result | Gap / required action / priority |
|---|---|---|---|---|
| E1 | Protected operations reject unauthenticated access | COMPLETE — VERIFIED | API route calls `auth.getUser()`; missing/invalid/expired fixture sessions return 401; cross-origin writes return 403. | None locally. |
| E2 | Protected pages provide a clear sign-in path | COMPLETE — VERIFIED | The app has one page, which displays `AuthGate` when the session API returns 401. HTTP fixture verified the page and CTA. | No separate protected page routes exist. |
| E3 | Intended destination preserved through login when appropriate | NOT APPLICABLE | The current application has a single `/` page and all in-app views are React state; there is no deep protected URL destination. | Reassess if deep links/protected routes are introduced. |
| E4 | OAuth return path validated against open redirects | PARTIAL | Callback redirects to fixed `/` or `/auth/error`; no user `returnTo` is consumed. Origin is derived from request `Host` in `requestOrigin()` without an application allowlist. | Verify Vercel routing and Supabase URL allowlist on staging; pin accepted hostnames if arbitrary Host values can reach the app / P1. |
| E5 | Browser back/forward navigation works | IMPLEMENTED — UNVERIFIED | Sign-in and logout use standard document redirects; in-app screens use state rather than URL history. | No browser back/forward session test was run / P2. |
| E6 | Logged-in users are not unnecessarily redirected | COMPLETE — VERIFIED | Root initializes the session and renders the game/profile instead of AuthGate; callback returns to `/`. Local signed-session test loaded the game API. | None locally. |
| E7 | Invalid return paths rejected safely | COMPLETE — VERIFIED | No return-path query is accepted; callback destination is a fixed local path under the derived origin. | Canonical host validation is tracked at E4. |

## F. Logout and account switching

| ID | Requirement | Status | Evidence and runtime result | Gap / required action / priority |
|---|---|---|---|---|
| F1 | Logout terminates the appropriate session | COMPLETE — VERIFIED | Logout uses Supabase `scope:'local'`; local fixture confirms cleared cookie and old signed fixture token rejected. | Real provider revocation semantics need staging check. |
| F2 | Authentication UI updates immediately | COMPLETE — VERIFIED | Logout is a full-page POST/303; local browser fixture returned to the sign-in gate. API 401 also clears visible state and shows AuthGate. | None on the tested navigation paths. |
| F3 | User-scoped caches are cleared or isolated | PARTIAL | Server responses are no-store and React providers are disabled on auth-required state; full-page logout/account switch discards their in-memory values. | `SavedVocabularyProvider` does not explicitly clear words when disabled, and `useAccountProfile` retains its previous result keyed only by enabled/retry. Make identity change invalidate stores and test same-document identity changes / P1. |
| F4 | Supabase progress remains intact | COMPLETE — VERIFIED | Local PostgreSQL snapshot before logout and after fresh login was byte-equivalent; XP, reward, stamp, and resume target remained. | None locally. |
| F5 | Protected operations reject invalidated sessions | COMPLETE — VERIFIED | API with the signed-out fixture cookie returned 401 after logout; no player data was returned. | Hosted revocation timing remains unverified. |
| F6 | Switching Google accounts loads the correct profile | IMPLEMENTED — UNVERIFIED | The app resolves identity from the verified Auth UUID; synthetic fixture browser switched from Alice to Bob and showed Bob's separate zero-XP state with no Alice checkpoint. | Real Google account selection and profile rendering need two authorized staging accounts / P1. |
| F7 | In-flight requests cannot leak data between accounts | PARTIAL | Profile read/save requests use active/generation checks; vocabulary fetch ignores results after effect cleanup. | No global player identity key or race test covers a same-document identity change; account data stores need explicit invalidation / P1. |

## G. Progress and resume integration

| ID | Requirement | Status | Evidence and runtime result | Gap / required action / priority |
|---|---|---|---|---|
| G1 | Authenticated session resolves to the correct player | COMPLETE — VERIFIED | `getUser()` UUID scopes player initialization and all data access; real PostgreSQL/API isolation tests passed. | None. |
| G2 | Existing mission progress loads correctly | COMPLETE — VERIFIED | `/api/session` returns the authoritative projection from the UUID-owned expedition; Forest and Tokyo fixtures passed. | None locally. |
| G3 | Progress survives reload | COMPLETE — VERIFIED | Browser fixture refreshed after Tokyo progress and resumed the saved step with the same XP/stamp. | Hosted user/browser persistence remains to verify. |
| G4 | Progress survives logout/login | COMPLETE — VERIFIED | Local signed fixture logout/new-login preserved the same database snapshot, XP, profile, and checkpoint. | Google/GoTrue login still not tested. |
| G5 | Resume checkpoint can be retrieved | COMPLETE — VERIFIED | `GET /api/resume` and session projection call `resumeFor`; tests cover canonical Tokyo and Forest targets. | None. |
| G6 | Session recovery does not reset progress | COMPLETE — VERIFIED | Real PostgreSQL snapshot equality and invalid-checkpoint recovery tests retain XP/completion/ledger. | None locally. |
| G7 | Resume API is ready for future UX-01 consumption | COMPLETE — VERIFIED | Versioned schema, revision, target, recovered flag and reason are served by `/api/resume`; stale checkpoint writes return 409. | UX-01 may consume this contract without a new persistence layer. |

## H. Security

| ID | Requirement | Status | Evidence and runtime result | Gap / required action / priority |
|---|---|---|---|---|
| H1 | Server-side session/token verification exists | COMPLETE — VERIFIED | The active API route uses Supabase SSR `auth.getUser()`; Next HTTP fixture validates actual SDK calls with signed local cookies. | Hosted GoTrue verification remains blocked. |
| H2 | API authorization uses verified identity | COMPLETE — VERIFIED | `handleVercelAtlas` receives the verified `User`; it rejects arbitrary selector IDs and scopes storage to `user.id`. API injection/isolation tests passed. | None. |
| H3 | Supabase RLS or trusted server authorization is correctly enforced | COMPLETE — VERIFIED | Service-role use is guarded by the trusted boundary; PostgreSQL/PostgREST tests checked grants, RLS, ownership/FKs, and cross-account APIs. | Reconfirm hosted migration/grants before rollout. |
| H4 | No service-role credentials exposed to browser | COMPLETE — VERIFIED | `lib/supabase/admin.ts` imports `server-only`; AUTH-02 client static scan passed with `configuredServerSecretPresent:false`. | Re-run against each production build after future auth changes. |
| H5 | No sensitive tokens logged | COMPLETE — VERIFIED | Active auth routes catch provider errors without logging details; no application token logging was found by source inspection. | Keep auth/provider errors redacted in future diagnostics. |
| H6 | OAuth callback protections are correctly configured | BLOCKED | Supabase SSR PKCE exchange is implemented; callback and failure route work with local HTTP fixtures. | Google enablement, PKCE state/nonce behavior, redirect allowlist, and deployed cookie flags need an authorized staging OAuth run / P1. |
| H7 | User A cannot access User B's data | COMPLETE — VERIFIED | Real PostgreSQL/PostgREST tests reject foreign profile, attempt, reward, selector, and checkpoint access; browser fixture showed Bob's isolated state. | None locally. |
| H8 | No D1 runtime dependency remains in the active architecture | COMPLETE — VERIFIED | `app/api/[...path]/route.ts` delegates to Supabase; D1 helper is isolated in `lib/atlas/legacy-d1.ts` for historical tests. | Keep legacy test adapter out of runtime imports. |

## Classification totals

| Status | Count |
|---|---:|
| COMPLETE — VERIFIED | 33 |
| IMPLEMENTED — UNVERIFIED | 19 |
| PARTIAL | 5 |
| MISSING | 1 |
| BLOCKED | 2 |
| NOT APPLICABLE | 1 |
| **Total criteria reviewed** | **61 (60 applicable + 1 not applicable)** |

See [readiness audit](AUTH-03-readiness-audit.md) for the request-flow explanation and [minimal execution plan](AUTH-03-minimal-execution-plan.md) for the smallest next steps.
