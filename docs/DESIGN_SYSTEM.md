# Design system

MyNextJob uses **emerald claymorphism on warm ivory**. This document is the
source of truth for how the visual language is expressed.

Visual QA lives at [`/design-system`](../src/app/design-system/page.tsx).

## Palette

| Semantic name       | Approximate value | Purpose                            |
| ------------------- | ----------------- | ---------------------------------- |
| `--background`      | `#F6F3EA`         | Warm ivory app background          |
| `--surface`         | `#F3F0E7`         | Standard clay surface              |
| `--surface-raised`  | `#FAF8F2`         | Raised objects (cards, buttons)    |
| `--surface-pressed` | ivory darker      | Inset/pressed surfaces             |
| `--surface-strong`  | `#ECE8DC`         | Stronger container backgrounds     |
| `--primary`         | `#059669`         | Emerald primary                    |
| `--primary-bright`  | `#10B981`         | Hover / highlight emerald          |
| `--primary-deep`    | `#047857`         | Deeper emerald text on ivory       |
| `--primary-dark`    | `#065F46`         | Dark emerald accents               |
| `--primary-soft`    | `#DDF5EA`         | Mint-tinted chip / badge fill      |
| `--primary-faint`   | `#ECF8F2`         | Very soft emerald wash             |
| `--foreground`      | `#202925`         | Charcoal body text                 |
| `--secondary` (fg)  | `#65716B`         | Secondary text                     |
| `--muted-foreground`| `#89938E`         | Muted metadata                     |
| `--border`          | `#DCE2DC`         | Separators                         |
| `--warning`         | soft amber        | Warnings                           |
| `--destructive`     | soft rose         | Errors / rejected                  |

Colors are stored as HSL triplets so Tailwind opacity modifiers work
(`bg-primary/10`). Components must consume the semantic aliases, never
raw hex.

## Claymorphism philosophy

Clay is soft, dense, and tactile — as if every surface were moulded from
a warm, slightly matte material. It differs from glassmorphism in that:

- there is **no** heavy blur behind it,
- shadows are soft and cool, not harsh and black,
- highlights along the top-left suggest a soft light source,
- pressed states feel physically depressed via inset shadows.

Use clay depth to communicate structure — a raised job card *is* an object;
a pressed input *is* a well; a floating bottom nav *floats*.

Where **not** to use heavy clay treatment:

- Long-form reading content (future job description bodies) — readability
  wins. Use a calm, low-shadow container.
- Dense data tables — the shadow noise reduces scanability. Use `flat`.
- Inline text spans and utility labels.

## Tokens

Radius scale, shadow depth, and semantic colors are all custom properties
declared in `src/app/globals.css` and re-exported via `tailwind.config.ts`.

### Radius

| Token             | Size  | Typical use                        |
| ----------------- | ----- | ---------------------------------- |
| `rounded-clay-sm` | 14px  | Small controls, chips              |
| `rounded-clay-md` | 18px  | Buttons, medium chips              |
| `rounded-clay-lg` | 22px  | Standard cards, inputs             |
| `rounded-clay-xl` | 26px  | Hero cards, bottom nav             |
| `rounded-clay-2xl`| 30px  | Bottom sheets, floating containers |

### Shadow / depth

| Token                | Depth level | Notes                                    |
| -------------------- | ----------- | ---------------------------------------- |
| `shadow-clay-soft`   | 0.5 — flat  | Whisper of separation                    |
| `shadow-clay-raised` | 1 — raised  | Default card / button                    |
| `shadow-clay-floating` | 2 — floating | Bottom nav, sheets                    |
| `shadow-clay-pressed`  | inset    | Inputs, pressed buttons, active chips    |

## Typography

Uses `next/font/google` Inter as a Geist-family substitute (single font,
no extra deps). The typography scale is deliberately compact:

| Role         | Size / line-height |
| ------------ | ------------------ |
| Display      | 32 / 38            |
| Page title   | 22 / 28            |
| Section head | 14 uppercase, tracked |
| Job title    | 17 / 24, semibold  |
| Body         | 15 / 22            |
| Metadata     | 14 / 20            |
| Label / caps | 12 uppercase       |
| Micro        | 11                 |

Body text is charcoal, not pure black. Mobile body copy stays ≥ 15px.

## Motion

- Library: `motion/react`.
- Primary properties: `transform`, `scale`, `opacity`, small `y`.
- Buttons/chips: tap spring (~0.94–0.97 scale) with `spring` transition.
- Cards: subtle tap response (~0.99).
- Respect `prefers-reduced-motion` — every clay primitive gates its
  `whileTap` prop on `useReducedMotion()`.

No parallax, no floating idle animations, no page-transition choreography.

## Accessibility

- Semantic HTML (`<main>`, `<nav aria-label>`, `<header>`, `<section aria-label>`).
- WCAG-conscious contrast pairs: emerald primary on ivory, ivory on emerald.
- Focus is always visible — `:focus-visible` has a 2px emerald outline.
- Icon-only controls require `aria-label` (enforced by
  `ClayIconButton`'s TypeScript signature).
- 44 × 44 minimum touch target for buttons, chips, and nav items.
- Skip-to-content link in the layout.

## Components

Reusable primitives in `src/components/clay`:

- `ClaySurface` — the base clay primitive (depth × radius × padding).
- `ClayCard` — card wrapper with sensible defaults.
- `ClayButton` — primary/secondary/ghost/destructive, sm/md/lg.
- `ClayIconButton` — icon-only, requires `aria-label`.
- `ClayChip` — filter/tag pill; `active` toggles pressed emerald.
- `ClayInput` — pressed input well with leading/trailing slots.
- `ClayBadge` — status/match label; `toneForMatchScore()` picks a tone.
- `ClaySkeleton` — shape-preserving loading state.
- `ClayNav` — fixed bottom navigation with safe-area padding.
