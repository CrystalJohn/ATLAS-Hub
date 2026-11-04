# GAME-01 — Existing ATLAS Architecture

Audit of the current working tree (`codex/auth-02-player-ownership` @ `e1d0786`, 2026-10-26). Every claim cites repository evidence. This document is the factual baseline for the Memory Tower integration design.

## 1. Runtime reality

ATLAS is a **native Next.js 16.3.4 / React 19.2.6 application backed by Supabase Auth (Google OAuth) and Supabase PostgreSQL** (`README.md:7,130-144`; `package.json:38,41,28-29`).

Retired machinery, **not** on the active path:

- Cloudflare Workers / Vite (`vite.config.ts`, `wrangler` dev-dependency, `@cloudflare/vite-plugin`) — historical; see `docs/legacy/ATLAS-SITES.md`.
- Drizzle (`drizzle.config.ts` targets sqlite; `db/schema.ts` requires `cloudflare:workers` D1 binding) — vestigial.
- `app/chatgpt-auth.ts` — dead ChatGPT-app header auth; `lib/atlas/vercel-handler.ts:26` explicitly forbids OAI headers as identity.
- `app/components/EnglishLearning.tsx`, `MissionGuide.tsx`, `mission-guidance.ts` — orphaned components (superseded by `ChapterEnglish`; only test scripts import them).

Package manager pnpm; Node ≥22.13 (`package.json:6,83`). Scripts (`package.json:8-22`): `dev` / `dev:supabase` (next dev on :3000), `build`, `test:profile`, `test:auth`, `test:auth02`, `test:auth02:http`, etc.

## 2. Module map

| Layer | Location | Role |
|---|---|---|
| Pages | `app/page.tsx` (renders `<Game/>`), `app/layout.tsx` (language provider) | Single-page app shell |
| Auth routes | `app/auth/google/route.ts`, `app/auth/callback/route.ts`, `app/auth/logout/route.ts`, `app/auth/error/page.tsx` | OAuth redirect, code exchange, sign-out |
| UI components | `app/components/*.tsx`, `app/components/travel/*.tsx` | All presentation; bilingual via `Bilingual.tsx` |
| API boundary | `app/api/[...path]/route.ts` (single catch-all) | Delegates to `handleVercelAtlas` |
| Server handlers | `lib/atlas/vercel-handler.ts`, `lib/atlas/service.ts`, `lib/atlas/profile-handler.ts`, `lib/atlas/player.ts`, `lib/atlas/checkpoint.ts`, `lib/atlas/travel-rules.ts` | Identity gate + all game orchestration |
| Storage | `lib/atlas/supabase-storage.ts` (via `lib/atlas/storage.ts` interface), `lib/supabase/{server,admin,config}.ts` | Service-role CAS persistence; anon-key session verification |
| Domain engines | `packages/mission-engine/src/{index,travel}.ts`, `packages/english-engine/src/{index,chapter}.ts`, `packages/domain/src/index.ts` | Pure evaluators + unlock/XP math (server-only imports) |
| Content | `content/missions/index.ts`, `content/travel/{japan,catalog,types,world-map,region-codes}`, `content/english/*`, `content/learning/*`, `content/evidence/*`, `content/localization/vi.ts`, `content/interests.ts` | Versioned, deterministic, deterministic content packs |
| Database | `supabase/migrations/20261020090000_atlas_expeditions.sql`, `20261020110000_atlas_profiles.sql`, `20261020130000_atlas_profile_interests.sql`, `20261021090000_auth02_expedition_integrity.sql` (+ matching rollback) | Two tables + integrity guard |
| Tests | `scripts/test-*.mts`, fixture stack `scripts/auth02/local-stack.mts` | In-process handler tests; real PostgreSQL/PostgREST integrity tests |
| Docs / ADRs | `docs/auth-02/ADR-003-player-ownership.md`, `docs/world-travel/ADR-001-authoritative-travel.md`, `docs/world-travel/ADR-002-content-and-map.md`, `docs/auth-04/*` | Architectural decisions and readiness gates |

## 3. The central architectural pattern: one atomic expedition document with CAS

Everything a player owns lives in **one JSON document** (`Expedition` type, `lib/atlas/service.ts:16-18`):

```
{ progress: {xp, completed[], evidence[], englishEvidence[]},
  attempts: Attempt[], ledger: Ledger[], submissions: unknown[],
  savedVocabulary?, travel?: PlayerTravelProgress, checkpoint? }
```

- Persisted in `atlas_expeditions.document` (text/JSON) with a `revision bigint` (`20261020090000_atlas_expeditions.sql:4-9`).
- Every mutating request runs a **read → mutate → `compareAndSwap(revision, document)` loop, 16 attempts → 409** (`lib/atlas/service.ts:54-167`, `supabase-storage.ts` CAS by `.eq('player_id').eq('revision')`).
- The client's `state` is a **mirror only** — `Game.tsx:91` applies server responses wholesale (`setState(outcome.state)`). Client-owned state is limited to ephemeral view/draft state (`Game.tsx:31-41`) and localStorage UI preferences (`useLocalPreference.ts`, `Bilingual.tsx:8-13`).
- Answer keys and XP values are never shipped: `publicMission` strips `evaluation` (`content/missions/index.ts:35-36`); travel keys live in server-only `lib/atlas/travel-rules.ts:3-8`.

### Database integrity (defense in depth)

`20261021090000_auth02_expedition_integrity.sql` adds:

- `atlas_valid_expedition(text)` CHECK — document must have valid `progress.xp`, `ledger[]` with unique ids and unique `(missionId, contentVersion)` pairs (L5-43).
- `atlas_guard_expedition_update()` trigger — insert at revision 0; update must be `revision+1`; **XP delta must equal ledger delta**; `ledger`, `progress.completed`, `travel.stamps` are append-only; travel `completedAt` cannot be reset (L45-97).
- RLS enabled, all grants revoked from `public/anon/authenticated`; `service_role` only (`20261020090000_atlas_expeditions.sql:13-15`).

There are **no XP/reward/checkpoint tables** — the ledger inside the document is the reward ledger, guarded by the trigger.

## 4. Identity, ownership and the API surface

- Identity: `auth.users.id` **is** `player_id` (ADR-003, `docs/auth-02/ADR-003-player-ownership.md:9-18`). `handleVercelAtlas` gates every request: `auth.getUser()` → not anonymous → UUID match; rejects player-selector query params (`vercel-handler.ts:27-31`); POST requires same-origin (`vercel-handler.ts:17`); 16 KB body cap (L47).
- `POST /api/session` → `ensurePlayer` upserts `atlas_profiles` with `ignoreDuplicates` (`lib/atlas/player.ts:5-8`).
- Full route table (dispatch in `lib/atlas/service.ts:38-174`): `session`, `state`, `resume`, `attempts` (+`observe`/`submit`/`english-item`/`english`), `travel` (+`start`/`action`), `checkpoint`, `vocabulary`, `profile`, `health`.

## 5. Game flows (verified execution paths)

### Nature Realm missions (`Game.tsx`, phases `brief|explore|english|subject|debrief`)

1. Start: `POST /api/attempts {missionId}` — server checks `isUnlocked` (sequential: `silent-forest → disappearing-lake → restore-ecosystem → observation-station`, `packages/domain/src/index.ts:17-22`), creates `ACTIVE` attempt, saves checkpoint (`service.ts:111-117`).
2. Observe clues: `attempts/{id}/observe` (L122-125).
3. Submit: `attempts/{id}/submit` → `evaluate()` (`packages/mission-engine/src/index.ts:10-27`) → on correct: `COMPLETED`, first-clear XP via `awardFirstClear` (L22-25), `d.checkpoint=null` (L136).
4. **Wrong answers give feedback and allow retry — there is no failure model.**
5. English items: `attempts/{id}/english-item` → `evaluateEnglishItem` (`packages/english-engine/src/chapter.ts:6-29`), dedup-keyed `englishEvidence` (no XP, L138-149).

### World Travel (`app/components/travel/*`)

1. `WorldTravel.tsx` modes `map|journey|hub|encounter|passport`; entry `POST travel/start {countryId}` — only `PLAYABLE` packs (Japan; VN preview; others coming-soon — `content/travel/catalog.ts:6`, `japan.ts:20-32`).
2. Each step: `POST travel/action {encounterId, stepId, expectedRevision, band, support, action}` → `evaluateTravel` (`packages/mission-engine/src/travel.ts:19-55`). Client (`TravelEncounterView.tsx`) is a pure renderer.
3. Completion → XP via the same `awardFirstClear` with `missionId='travel:{encounterId}'`, passport stamps appended, checkpoint updated or cleared (`service.ts:78-102`).
4. `TravelStep` (types.ts:16) and `TravelAction` (types.ts:23) are **closed unions** — new mechanics require editing these types and the evaluator.

### Checkpoints & resume

- Pointer stored **inside** the document: `d.checkpoint = {schemaVersion, savedRevision, updatedAt, contentVersion, target}`; targets are a discriminated union `travel|nature` (`lib/atlas/checkpoint.ts:10-22`). Pointers never carry XP or completion (`checkpoint.ts:24`).
- `resumeFor` (L58-86) reconstructs cursors from authoritative progress; content-version mismatch → `CONTENT_CHANGED` recovery. `POST /api/checkpoint` requires `expectedRevision` → 409 `STALE_REVISION` (`service.ts:65-67`).
- **One global checkpoint pointer per player** — completing any adventure nulls it (`service.ts:99,136`).

### Localization

`content/localization/vi.ts` — flat EN→VI dictionary + `translateVietnamese` (L379-397), consumed via `Bilingual.tsx` `useInterfaceLanguage().t(en, vi?)`. Presentation-only; never touches evaluation.

## 6. Tests

- **Real-infrastructure:** `scripts/test-auth02-postgres.mts` — embedded PostgreSQL 17 + PostgREST fixture (`scripts/auth02/local-stack.mts`), 19 scenarios: 24-concurrent session creation, 32-way concurrent first-clear awards exactly once, cross-account attack rejection, RLS verification, deferred-trigger atomicity, rollback safety. `test-auth02-http.mts` / `test-auth-http.mts` — real `next start` with fixture auth. **Note: fixture auth is synthetic JWT, not Google OAuth** (explicit limitation, `local-stack.mts:1-2`).
- **In-process handler tests:** `test-profile.mts`, `test-supabase.mts` (origin/session fixtures).
- **Pure/SSR:** `test-guidance.mts`, `test-interests.mts`, `test-evidence.mts`, `test-chapter-ui.mts`.
- **Legacy D1 regression (manual only):** `test-atlas/travel/chapter/vocabulary.mts`.
- **Build-time publication gate:** `scripts/validate-evidence.mts` — validates learning content provenance/coverage as part of `pnpm build`.

## 7. UI/information architecture (for Phase E)

- Main nav is a 4-item bar: **Journey / World map / My journal / How to play** (`Game.tsx:100`). No global "games" or "activities" concept exists.
- World map view hosts a realm selector — **World Travel | Nature Realm** (`Game.tsx:113`); World Travel renders its own internal hub/map/encounter/passport navigation inside `WorldTravel.tsx`.
- Design language: shadcn/Radix tokens, lucide icons, Tailwind 4, Nunito font, mobile-first (`components.json`, `public/fonts/nunito`, `hooks/use-mobile.ts`).
- Existing reusable UI primitives: `Bilingual`/`UiText` (bilingual copy), `choice-grid` radio fieldsets with lettered options (`Game.tsx:124`), feedback cards with retry affordances (`Game.tsx:128`), `TrailBadge`, pill/overline micro-copy, `play-button`/`quiet-button` CTA hierarchy, `AdventureRecovery` error/retry card.

## 8. Current branch context

- Branch `codex/auth-02-player-ownership`, HEAD `e1d0786` "feat: redesign adventure welcome screen from reference". Working tree clean (untracked: GAME-01 review zip, playwright output dirs).
- The GAME-01 package pinned `d03faab` (AUTH-02) and `ce79e59` (main) — both are ancestors of HEAD, so the package's observations are consistent with, but two commits behind, this tree (the welcome-screen redesign and the AUTH-04 verification commit are newer).
- Release status: see `GAME-01-implementation-readiness.md` — production is BLOCKED pending AUTH-04 items; local development is fully supported.
