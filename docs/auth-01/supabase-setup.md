# ATLAS Google authentication and Supabase persistence

Status: implementation prepared for review; provider configuration and live database migration are still required.
Updated: 2026-10-20. Target: existing Vercel `atlas-hub` and existing Supabase project `jyzeararymcahczbovei`.

## What changed

- Vercel uses Supabase Auth and a Supabase expedition store instead of the unconditional 503 guard.
- Sites keeps its D1 store and trusted Sites identity. Shared mission evaluation, unlocks, XP, stamps, English evidence and the first-clear ledger remain in the existing service.
- The Supabase Auth UUID owns one expedition document. Auth users are validated using `auth.getUser()` on the server. User IDs from bodies, emails and OAI identity headers are ignored by the Vercel handler.
- All browser mutations require a same-origin Origin header. Signed-in API responses and auth redirects are uncached.
- PKCE OAuth exchange and refresh run in route handlers using HttpOnly, SameSite=Lax cookies (Secure in production). The app has no browser Supabase client and reads no user session in a Server Component; a proxy is therefore not required for this flow. API route handlers can write refreshed cookies.
- First login performs INSERT ON CONFLICT DO NOTHING. Saves use one conditional UPDATE on player_id + revision. A conflict re-evaluates the existing mission rules against the latest document, preserving the atomic reward ledger.

## Configuration

Required environment names (values never belong in Git or chat):

| Variable | Use |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Auth client and public project access |
| SUPABASE_SECRET_KEY | Server-only expedition storage; Sensitive/Secret in Vercel |

Set separate Preview and Production values as appropriate. Preview must not point to a production database when testing destructive changes. This implementation creates no demo users or automatic data migrations.

The previous secret was pasted into chat. Revoke it, create a replacement in Supabase Settings → API Keys, and enter the replacement directly into Vercel. Do not send it in a message.

## 1. Apply the schema

Open the existing project's Supabase SQL Editor. Review and run:

[`20261020090000_atlas_expeditions.sql`](../../supabase/migrations/20261020090000_atlas_expeditions.sql)

It creates `public.atlas_expeditions`, with an Auth user foreign key and RLS. The browser's anon/authenticated roles have no access. Only the server's service_role has SELECT/INSERT/UPDATE. Do not add a browser update policy for this table: clients must not write XP or stamps.

No Sites data is imported, erased, or merged. Do not copy a legacy document into a Google account based on email. Legacy migration remains a separate operation requiring proof of both accounts and a verified complete export. Existing Sites progress remains on Sites. Google profiles currently start a new expedition; the login UI states this explicitly.

## 2. Enable Google

1. In Google Cloud Console, configure the OAuth consent screen and a Web application OAuth client. If the app is in testing mode, add the intended testers.
2. Register this exact Google authorized redirect URI:

   `https://jyzeararymcahczbovei.supabase.co/auth/v1/callback`

3. In Supabase Authentication → Sign In / Providers → Google, enable Google and enter the Google client ID and client secret. These Google credentials belong in Supabase, not Vercel or chat.
4. In Supabase Authentication → URL Configuration, set the production Site URL and allow the application callback URLs:

   - Production Site URL: `https://atlas-hub-phuctptse183992-1459s-projects.vercel.app`
   - Production callback: `https://atlas-hub-phuctptse183992-1459s-projects.vercel.app/auth/callback`
   - Stable branch callback: `https://atlas-hub-git-fix-vercel-37c3ea-phuctptse183992-1459s-projects.vercel.app/auth/callback`

   Test using the registered branch alias; a unique deployment hostname needs its own allowed callback URL. Do not add an unrestricted `*.vercel.app` wildcard.

## Verification

Live checks before integration (2026-10-20): `/auth/v1/settings` returned HTTP 200 with Google disabled. A zero-row Data API probe for `atlas_expeditions` returned HTTP 404 / PGRST205, indicating the table is missing from the exposed schema.

Expected behavior after setup:

| Check | Expected |
| --- | --- |
| GET /api/health | 200, `{ok:true,persistence:"supabase"}` |
| POST /api/session, same origin, no session | 401; no player document created |
| Browser sign-in | Google consent → /auth/callback → ATLAS |
| First /api/session after verified login | 200; new account starts at 0 XP |
| Reload after completing an encounter | Same XP, progress and stamps |
| Replay or concurrent first-clear requests | At most one first-clear reward |
| Login with another Google account | Separate expedition |
| POST /auth/logout | Clears this browser's session; progress remains saved |
| Expired/invalid session | Sign-in CTA; writes rejected |
| Spoof OAI identity header on Vercel | 401 without a verified Supabase session |
| Direct browser table mutation | Rejected by grants/RLS |
| Missing table or unavailable database | 503 with recovery messaging; never a fresh fake save |

Run `node scripts/test-supabase.mts` for mocked PostgREST + verified-principal integration fixtures. The external Google login and actual Postgres permissions are not covered by these fixtures. Existing D1 engine tests remain applicable to the shared service.

## Sources

- [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Google provider setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [API key privileges](https://supabase.com/docs/guides/getting-started/api-keys)

## Deployment and rollback

Test the feature branch preview after its environment is configured. Publish the same reviewed commit to Production only after schema, Google configuration and browser login/persistence checks pass. Deployment rollback does not roll back database data. The schema is additive and is left in place on code rollback; never delete the table to roll back code.
