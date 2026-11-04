# ADR-003 — Supabase player ownership and canonical resume

Date: 2026-10-21. Status: implemented and verified locally; hosted OAuth/production verification pending.

## Context

AUTH-01 already verifies Supabase users and stores each expedition by Auth UUID. The existing server evaluates gameplay and writes the entire progression/reward document with an optimistic revision predicate. Profiles, first-clear rules, Tokyo encounters, stamps and level calculation already exist. Replacing these with parallel player/reward/checkpoint tables would duplicate ownership and create new synchronization boundaries.

## Decision

- Supabase PostgreSQL is the sole active database on all hosts. Native Next routes always use verified Supabase identity. Historic D1 code/data remain offline/test-only; no account merge or data import is attempted.
- Reuse `auth.users.id` as `atlas_profiles.player_id` and `atlas_expeditions.player_id`. Existing primary keys and foreign keys enforce one row per Auth user. No email matching or extra internal player table.
- On first verified session or profile load, initialize the profile with `INSERT ... ON CONFLICT DO NOTHING` through the existing SDK. Never send default profile fields that could replace a returning user's name/settings. Initialize expedition the same way as before.
- Keep one atomic expedition document. All XP, first-clear completion, stamps and reward ledger mutations are committed by the existing single `UPDATE ... WHERE player_id = verified_id AND revision = expected_revision`. PostgreSQL rechecks this predicate under contention; losers reload and re-evaluate, up to the existing retry bound. No unconditional read-then-write reward award is introduced.
- Add PostgreSQL checks for unique ledger content/version and IDs, immutable historic entries, XP delta equal to new ledger amounts, immutable owner, incrementing revision, retained completions/stamps and zero-reward genesis. SQL functions are invoker functions with fixed search paths and service-role-only execution. No client RPC may award XP.
- Store a versioned checkpoint pointer inside the same document. Derive the current step/observations from canonical owned progress. Do not accept a client step, XP amount or completion flag. New activity records its server commit revision; this orders unfinished adventures without relying on worker clocks. Legacy documents get a validated, deterministic best-effort fallback and retain all data.
- Expose `GET /api/resume` and revision-checked `POST /api/checkpoint`. Restarts require `expectedRevision`. Delayed duplicates cannot replace a newer checkpoint. Unknown/deleted/locked references are rejected or ignored safely; changed content versions do not auto-resume.
- Retain RLS with no anon/authenticated table access. The server's service-role bypass is explicitly protected by `auth.getUser()`, UUID derivation, player-scoped queries, strict bodies and same-origin mutations. RLS alone is not the service-role authorization boundary.

## Alternatives rejected

Separate normalized ledgers/checkpoint tables would require migration/backfill and cross-table transaction machinery without a demonstrated need in the pilot. Browser storage as resume authority leaks preferences across accounts and cannot restore a new session/device reliably. Trusting client completion/XP or merely reading a revision without an atomic conditional update would not prevent duplicate rewards.

## Consequences

Existing UUIDs, mission IDs, reward definitions, levels, passport stamps and document history remain compatible. `revision`, `resume`, `reward` and optional per-activity metadata are additive API/document fields. A duplicate already-completed Forest submit may return 200 instead of 201; clients must use HTTP success plus the explicit reward status. Old travel restart clients must reload and send `expectedRevision` or receive 409.

No companion/economy/inventory implementation exists to integrate. No new Japan content or World Travel navigation redesign is included. One Resume button and canonical encounter initialization are the minimal verification wiring for UX-01.

Document size, ledger-validation cost and contention still grow with player history. Existing bounded retries may return 409 under heavy contention. This milestone proves tested concurrency correctness, not production capacity. Hosted Supabase Auth/Google and an authorized staging account remain verification gates.

Evidence: [implementation report](AUTH-02-implementation-report.md), [test evidence](AUTH-02-test-evidence.md), [production readiness](AUTH-02-production-readiness.md).
