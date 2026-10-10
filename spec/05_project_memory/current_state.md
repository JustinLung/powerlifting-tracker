# Current state

_Last updated: 2026-10-10, after the sign-in and sign-up screens. Update this file whenever capabilities or architecture change._

## Summary

The repository is an **unmodified `create-next-app` scaffold** (Next.js 16.4.0, React 19.3.0, TypeScript, Tailwind v4). There is **no product backend**: no database, no auth, no domain models, and no tests. The only product UI is the sample-data dashboard preview (below). Product design, architecture, and workflow are documented in `spec/`, and most architectural choices are still **[Proposed]**.

## What exists [Fact]

| Path | Content |
| --- | --- |
| `app/layout.tsx` | Root layout with Geist fonts. Metadata is still "Create Next App" |
| `app/page.tsx` | Template landing page (Next.js and Vercel links) |
| `app/globals.css` | Dark-only design tokens (colors, type scale, radius, shadows, motion), focus style |
| `app/styleguide/` | `/styleguide` route: rendered token and component reference (reads tokens from `globals.css`) |
| `components/ui/` | `Button`, `ButtonLink`, `TextLink`, `Badge`, `Card`, `Alert`, `Input`/`Textarea`/`Select`/`Field`, `Checkbox`, `Switch`, `Dialog`, `Disclosure` |
| `components/ui/segmented-control.tsx` | Single-choice filter (client). Shown in `/styleguide` |
| `components/dashboard/` | Dashboard widgets, `AppShell`, `Sidebar`, athlete and coach compositions |
| `lib/dashboard/` | View-model `types.ts`, pure `metrics.ts` helpers, and **`mock-data.ts` (sample data only)** |
| `lib/domain/format.ts` | kg, RPE, sets × reps, date and relative-time formatting |
| `app/dashboard-preview/` | Dev-only route (404 in production). `?role=coach` switches the view. Sample data banner. See ADR-015 |
| `app/(auth)/` | `/sign-in` and `/sign-up` screens, **UI only**: client-side validation, no backend. A valid submit shows a "Not connected yet" alert. Role selection is deliberately not in sign-up (Q-019) |
| `components/auth/` | `SignInForm`, `SignUpForm`, `PasswordInput` (show/hide) |
| `lib/auth/validation.ts` | Pure form validation. The 8-character minimum is a placeholder until Q-004 is decided |
| `lib/cn.ts` | Class-name joiner |
| `next.config.ts` | `cacheComponents`, `partialPrefetching`, `experimental.agentFeedback`, Tailwind Turbopack loader rule |
| `eslint.config.mjs` | Next core-web-vitals + TypeScript presets |
| `tsconfig.json` | strict, `@/*` alias to the root |
| `public/` | Template SVGs |
| `spec/` | This documentation |
| `CLAUDE.md` | Entry instructions for Claude Code sessions |

## Key facts a new session needs

- `cacheComponents` is on, so session and DAL reads must sit inside `<Suspense>` ([ADR-002](../00_meta/decision_log.md#adr-002-keep-cache-components-and-partial-prefetching)).
- Run type checks with `npx next typegen && npx tsc --noEmit`. Plain `tsc` fails on a fresh checkout.
- Next.js 16 docs for this exact version are in `node_modules/next/dist/docs/`.
- `next dev` with `agentFeedback` may write a managed block into `AGENTS.md` (it did, once, on 2026-10-10).
- The `/styleguide` token reader uses `"use cache"` because `fs` reads count as uncached data under `cacheComponents`.
- Dashboard actions and nav links point at routes that do not exist yet. They are `href: null` and render disabled; fill them in as each feature ships.
- Dependencies added: `recharts`, `react-is` (ADR-014).

## Accepted vs proposed

Accepted: ADR-001 (stack), ADR-002 (Cache Components), ADR-003 (spec-driven docs), ADR-004 (separate prescription and performance), ADR-013 (dark-only design system), ADR-014 (Recharts), and ADR-015 (sample-data dashboard preview). All other architecture choices (database, ORM, auth, storage, hosting, testing tools) are **proposed only**. See [open_questions.md](../00_meta/open_questions.md).
