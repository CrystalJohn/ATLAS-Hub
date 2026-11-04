# AUTH-04 E2E test report

Date: 2026-10-23. **Real Google OAuth E2E: NOT RUN.** No isolated Supabase staging project or two authorized Google test accounts were available (user confirmation during AUTH-02); the existing Vercel production alias is SSO-protected. Synthetic sessions below are never counted as provider verification.

| Flow | Environment and observed result | Status |
| --- | --- | --- |
| First-time profile, returning profile, two accounts | Native Next HTTP → Supabase SDK → local PostgREST/PostgreSQL with signed Auth fixture: one profile after concurrent initialization, returning profile preserved, B isolated from A. | PASS, fixture only |
| Reward, reload, logout/login, resume | Same local HTTP/database fixture: Tokyo reward/stamp once, exact checkpoint after reload and fresh fixture login, invalid cookie rejected. See `../../output/auth02/http-evidence.json`. | PASS, fixture only |
| Mobile and desktop sign-in/error UI | Brave at 390×844 and 1440×1000: language toggle, CTA/keyboard Enter, unavailable-provider recovery, no horizontal overflow or page errors. [Mobile](../../output/auth04/screenshots/mobile.png), [desktop](../../output/auth04/screenshots/desktop.png). | PASS, fixture only |
| Google consent, PKCE callback, refresh, provider cancellation | Requires staging OAuth and authorized accounts. Google enabled in current settings, but no consent/session exchange was performed. | BLOCKED |
| Same-document delayed A→B account race | No browser harness for a mounted-document identity replacement; current supported sign-out/sign-in causes full navigation. | NOT RUN |
| Production browser smoke | No approval, test accounts, or access through Vercel SSO. | BLOCKED |

To complete the provider gate: create an isolated staging Supabase project and two dedicated Google accounts; apply reviewed migrations; configure exact callback URLs and `ATLAS_AUTH_ALLOWED_ORIGINS`; then execute first-login, returning-login, Tokyo save/reload, logout/login, delayed A→B switch, error/cancellation, expiration and refresh on mobile and desktop. Record redacted account aliases, deployment SHA, API status, and authoritative database snapshots. No fake session may substitute for these observations.
