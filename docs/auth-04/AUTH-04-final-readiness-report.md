# AUTH-04 final readiness report

Date: 2026-10-23. **Decision: BLOCKED. Staging release gate: NO-GO. Evidence classification: PROVISIONAL.** Local security and persistence behavior is strong, including real PostgreSQL concurrency and account isolation. The required staging Google OAuth, refresh/account-switch browser paths, Vercel configuration and production deployment/smoke evidence are unavailable. A read-only linked migration list confirmed the AUTH-02 guard is still pending remotely. AUTH-04 is not complete and production deployment should not be approved yet.

| Area | Result |
| --- | --- |
| Security checks | Local API/DB authorization PASS; exact OAuth Host guard fixed and locally tested; hosted allowlist/cookies/PKCE unverified. |
| Real Google OAuth E2E | BLOCKED: no isolated staging project and two authorized Google test accounts. |
| Session recovery | PASS with signed local fixture; real GoTrue refresh/revocation NOT RUN. |
| Account isolation | PASS through local API, RLS and PostgreSQL; real-provider A→B delayed browser switch NOT RUN. |
| Progress/checkpoint persistence | PASS on local PostgreSQL and native Next HTTP fixture. |
| Reward idempotency/concurrency | PASS on disposable PostgreSQL: 32-request Forest and Tokyo races, commit-failure rollback, lost-response retry. |
| Production deployment/smoke | NOT PERFORMED; Vercel details 403 and alias SSO 302. |

Findings: **HIGH** release blocker—hosted origin allowlist/redirect and deployment configuration unverified after local host guard fix; **HIGH** release blocker—real Google OAuth/session lifecycle not verified; **HIGH** release blocker—AUTH-02 guard migration confirmed pending remotely; **MEDIUM** same-document account-state race untested; **LOW** sign-in pending UX and seven existing image warnings. No local test found a cross-account API/DB leak or duplicate reward. Neither local PASS nor the hosted zero-row probe proves production readiness.

Changed in AUTH-04: `lib/atlas/origin.ts`, three `app/auth/*/route.ts` handlers, `.env.example`, README/local setup guidance, targeted auth/HTTP/PostgreSQL tests, regenerated local PostgreSQL evidence and seven reports under `docs/auth-04/`. AUTH-03's three uncommitted reports were preserved. No SQL migration was created or applied remotely. No commit, push, Vercel change, live OAuth setting change, or deployment was made.

Next gate: acquire isolated staging and two Google test accounts; gain Vercel team read access; verify current migration list and a backup; configure exact OAuth origins and Supabase redirects; run the real-provider/mobile/desktop oracle and compare API to database; then review a concrete deployment for separate approval. See the [oracle matrix](AUTH-04-test-oracle-matrix.md), [security assessment](AUTH-04-security-assessment.md), [database report](AUTH-04-database-integrity-report.md), [E2E report](AUTH-04-e2e-test-report.md), [deployment readiness](AUTH-04-deployment-readiness.md) and [production verification](AUTH-04-production-verification.md).
