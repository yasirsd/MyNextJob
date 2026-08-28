# Roadmap

Phase 0 is complete when the app has the foundation described in
[`ARCHITECTURE.md`](./ARCHITECTURE.md), [`DATABASE.md`](./DATABASE.md), and
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md). Later phases build features on
top of that foundation without changing it.

## Phase 0 — Foundation *(current)*

Next.js + strict TypeScript + Tailwind + shadcn/ui-style clay primitives +
Motion + Supabase clients + initial migration with RLS + private resume
storage + design tokens + app shell + PWA manifest + testing infrastructure
+ documentation.

## Phase 1 — Authentication

- Sign-in and sign-up screens (email + magic link + OAuth).
- Session-aware layout, protected route groups, `middleware.ts` wired to
  `src/lib/supabase/middleware.ts`.
- Password reset flow.

## Phase 2 — Profile & resume

- Onboarding: name, headline, city, country, years of experience.
- Resume upload to the private `resumes` bucket.
- Basic resume parser (server-side) → `resume_skills`.
- Job preferences form.

## Phase 3 — Job engine (core)

- Canonical `Skill` taxonomy seed.
- Deterministic job fingerprinting + upsert flow.
- Job read APIs (server-only) used by Phase 5 UI.

## Phase 4 — Job sources

- Adapter contract implemented.
- Adapters: Greenhouse, Lever, Ashby, We Work Remotely.
- Scheduler / cron for `next_sync_at`.
- Populates `source_sync_runs` for ops visibility.

## Phase 5 — Discovery UI

- Real home feed with filters, freshness, and skeletons.
- Job detail page with clean reading typography (calmer clay).
- Saved jobs.

## Phase 6 — Matching engine

- Score model (weighted skill overlap + experience/location/salary).
- Score `breakdown` populated so the UI can explain "why this score".
- Per-user match feed.

## Phase 7 — Applications

- Application tracker UI.
- Status transitions write to `application_events`.
- Interview stage board.

## Phase 8 — Notifications

- Web Push registration + `push_subscriptions`.
- Server worker: watches `job_matches`, respects
  `notification_preferences` and quiet hours.
- In-app notification inbox.

## Phase 9 — PWA / offline hardening

- Service worker with careful caching (shell + last feed snapshot).
- Offline empty-state pattern.
- Background sync for saved jobs where supported.

## Phase 10 — Production QA

- Full accessibility audit.
- Performance budgets & Lighthouse gates.
- Load test on ingestion pipeline.
- CSP hardening (deferred from Phase 0 pending Supabase / analytics origins).
