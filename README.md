# MyNextJob

> Your next opportunity starts here.

MyNextJob is a mobile-first, installable job-search PWA. It discovers fresh
jobs from company ATS/career systems and public feeds, matches them against
your resume, and notifies you the moment your next opportunity appears.

**Current phase: Phase 0 — Foundation.** No ingestion, matching, resume
parsing, notifications, or auth flows exist yet. See [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Stack

- **Next.js 16** (App Router) + **React 19**
- Strict **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/postcss`, `@theme` in CSS — no `tailwind.config.*`)
- **shadcn/ui** wired up via `components.json` (components added on demand)
- **Motion** (`motion/react`) for tactile interactions
- **Geist Sans / Mono** via the `geist` package
- **Lucide React** icons
- **Supabase** (Postgres, Auth, Storage) via `@supabase/ssr`
- **Zod** at trust boundaries
- **ESLint 9 flat config** — run via `eslint .`, not `next lint`
- **Vitest** (unit) + **Playwright** (E2E)
- **pnpm**

## Prerequisites

- **Node.js 20.9+** (also enforced via `package.json#engines`)
- **pnpm 9+** (`corepack enable && corepack prepare pnpm@latest --activate`)
- A [Supabase](https://supabase.com) project (for later phases; not required
  to run Phase 0 locally)

## Installation

```bash
pnpm install
cp .env.example .env.local  # then fill in your Supabase project values
```

Phase 0 runs even without a real Supabase project connected — auth screens
land in Phase 1.

## Development

```bash
pnpm dev              # Next.js dev server at http://localhost:3000
pnpm lint             # ESLint 9 flat config (eslint .)
pnpm lint:fix         # ESLint --fix
pnpm typecheck        # tsc --noEmit
pnpm test             # Vitest unit tests (single run)
pnpm test:watch       # Vitest in watch mode
pnpm build            # production build
pnpm start            # serve the production build
pnpm test:e2e         # Playwright smoke suite
```

Playwright browsers must be installed once:

```bash
pnpm test:e2e:install
```

## Adding shadcn/ui components

The project is initialized (`components.json`), so:

```bash
pnpm dlx shadcn@latest add dialog select dropdown-menu tooltip popover sheet
```

Components land in `src/components/ui/`. They must consume the semantic
clay tokens (`bg-surface-raised`, `text-primary-deep`, …); never patch a
raw hex into a shadcn component.

## Regenerating PWA icons

`public/icons/icon-source.svg` is the canonical mark. Regenerate every
PNG variant and the favicon:

```bash
node scripts/generate-icons.mjs
```

## Project structure

```text
src/
├── app/                     # App Router routes
│   ├── design-system/       # Internal visual QA
│   ├── globals.css          # Tailwind v4 @theme + clay utilities
│   ├── layout.tsx           # Shell, safe-area, skip-link, Geist fonts
│   ├── manifest.ts          # PWA manifest
│   └── page.tsx             # Phase 0 home preview (sample data)
├── components/
│   ├── clay/                # Reusable clay primitives
│   ├── ui/                  # shadcn/ui lands here (added on demand)
│   ├── home/                # Home-preview client bits
│   └── jobs/                # SampleJobCard (visual-only)
├── features/                # Feature-scoped logic (mostly empty today)
├── lib/
│   ├── supabase/            # Browser / server client + proxy.ts helper
│   └── validation/          # Zod schemas used at trust boundaries
└── ...
supabase/
└── migrations/              # 0001_initial_schema.sql + RLS + storage
scripts/
└── generate-icons.mjs       # PWA icon generator (sharp)
tests/
├── unit/                    # Vitest
└── e2e/                     # Playwright
docs/                        # Architecture, design system, database, roadmap
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how the pieces fit
together and [`docs/DATABASE.md`](docs/DATABASE.md) for the schema.

## Supabase setup

1. Create a new Supabase project.
2. Copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the **publishable (anon) key** into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. **Never** put the service_role key in any `NEXT_PUBLIC_*` variable.
5. Apply the initial migration:

   ```bash
   supabase link --project-ref <your-ref>
   supabase db push
   ```

   Or paste `supabase/migrations/0001_initial_schema.sql` into the SQL
   editor. The migration also creates the private `resumes` storage bucket
   (PDF/DOCX only, 10 MB cap) with owner-only object policies.

## Contributing to Phase 0

- Server Components by default; `"use client"` only when justified.
- All new UI must use semantic tokens, not raw hex.
- Do not implement features from Phases 1+ here. See [`CLAUDE.md`](CLAUDE.md).
