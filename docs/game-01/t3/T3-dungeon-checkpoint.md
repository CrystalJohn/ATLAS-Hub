# GAME-01 T3 local checkpoint update

2026-10-28. This supplements the earlier T3 documents, which describe the original review fixture at the time of testing.

The Memory Tower UI now has a travel-journal layout and a compact/expandable tower progress component. Floor states derive from the current run; personal best is separate. The existing DRAFT candidate bank remains unapproved, rewards remain disabled, and no production publication is authorized.

`npm run dev` enables a loopback-only DRAFT Tower runtime for local review. Its Tower state is volatile and isolated from Supabase; it resets when the development server restarts. Other application features retain their existing Supabase behavior. Production builds do not enable the local DRAFT runtime. The older T3 statements that the normal Next route never imports the fixture and only the preview launcher supplies it are historical and superseded for local development.

Latest local checks: `npx tsc --noEmit` passed; `npm run lint` passed with nine warnings (seven existing image warnings and two unused helpers in ignored local scratch scripts); `npm run build` passed. Local browser fixture checked start, five floors, boss, failure/restart, personal-best separation, reload, keyboard, mobile overflow and reduced motion. `node scripts/test-tower.mts` passed 26/27 tests: the older source-import guard rejects type-only Tower imports in the T3 UI and does not account for the local-only DRAFT runtime. This guard requires an updated, independently reviewed replacement before claiming a full T1 regression pass. No educator review, production verification, reward approval or release signoff is implied.

Vercel Preview was observed to share the production Supabase project; pushing Git branches has triggered Preview deployments. Do not assume a Git push is deployment-free or data-isolated.
