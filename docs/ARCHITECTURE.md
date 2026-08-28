# Architecture

## Frontend

Next.js App Router with **Server Components by default**. Client Components
are opted into explicitly with `"use client"` and are used only for:

- interactive state (e.g. filter chip selection)
- Motion-driven interactions
- browser APIs / event handlers
- browser-side Supabase access

The shell (`src/app/layout.tsx`) provides:

- Warm-ivory background and font token
- A centered mobile container (`max-w-2xl`) with safe-area padding
- A "skip to content" link for keyboard users
- The fixed `ClayNav` bottom navigation

Design tokens live in `src/app/globals.css` as CSS custom properties. Every
color, radius, shadow, and clay depth is a token; components use semantic
Tailwind aliases wired up in `tailwind.config.ts`.

## Server / client boundary

| Concern              | Where it lives                                   |
| -------------------- | ------------------------------------------------ |
| Session refresh      | `src/lib/supabase/middleware.ts` (via `middleware.ts` in Phase 1) |
| RSC data fetching    | `src/lib/supabase/server.ts` (`getAll`/`setAll` cookies) |
| Client interactions  | `src/lib/supabase/client.ts` (browser client)   |
| Trusted mutations    | Route Handlers / Server Actions using the server client |
| Privileged workers   | Server-only code with `SUPABASE_SERVICE_ROLE_KEY` (Phase 4+) |

The publishable (anon) key is safe to expose in the browser because every
table is protected by RLS. The service_role key **never** appears in any
`NEXT_PUBLIC_*` variable and is only introduced in later phases.

## Supabase architecture

- **Auth**: Supabase Auth (email/OAuth) — Phase 1.
- **Database**: Postgres schema in `supabase/migrations/0001_initial_schema.sql`.
- **Storage**: private `resumes` bucket, owner-scoped RLS on `storage.objects`.
- **Edge Functions**: reserved for later phases (ingestion, notifications).

See [`DATABASE.md`](./DATABASE.md) for tables and relationships.

## Future job-source adapter model (Phase 4)

Every source (Greenhouse, Lever, Ashby, Workday, WWR, RSS, …) implements a
common `JobSourceAdapter` contract:

```ts
interface JobSourceAdapter {
  readonly type: SourceType;
  fetch(source: JobSource, since?: Date): Promise<RawJob[]>;
  normalize(raw: RawJob, source: JobSource): NormalizedJob;
}
```

Adapters live in `src/lib/jobs/adapters/{provider}.ts`. Downstream
pipeline code (normalization, deduping, matching, notifications) only ever
sees `NormalizedJob` — it does not care where the job came from.

## Normalized job model

`NormalizedJob` mirrors the `jobs` table shape: title, company, location,
`remote_type`, `employment_type`, experience range, salary range,
`description_text` / `description_html`, timestamps, and a deterministic
`fingerprint` (hash over title + company + location) used to correlate
the same posting appearing on multiple sources.

## Matching pipeline (Phase 6)

Conceptual flow:

```
resume_skills  ─┐
                ├─▶ scorer ─▶ job_matches (0–100, with breakdown JSON)
job_skills    ─┘
```

The scorer is intentionally simple to start with (weighted skill overlap +
experience/location/salary bonuses) and will evolve — the score `breakdown`
column exists so the UI can explain matches without recomputing them.

## Notification architecture (Phase 8)

- `push_subscriptions` stores per-user Web Push endpoints.
- `notification_preferences` scopes what a user wants to be told about.
- A server worker watches `job_matches` for scores above the user's
  threshold and writes rows into `notifications` + delivers Web Push.
- The client renders unread notifications from `notifications` — no
  push-only state.

## What we don't build

- No global state store (React Query/RSC + URL state is enough for now).
- No microservices, message brokers, Docker, Kubernetes, Redis, or
  Elasticsearch. Next.js + Supabase carries the workload comfortably.
- No LLM/embedding calls in Phase 0.
