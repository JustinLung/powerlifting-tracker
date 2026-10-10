# Current state

_Last updated: 2026-10-09, during the documentation setup. Update this file whenever capabilities or architecture change._

## Summary

The repository is an **unmodified `create-next-app` scaffold** (Next.js 16.4.0, React 19.3.0, TypeScript, Tailwind v4). There is **no product code**: no database, no auth, no domain models, no routes beyond the template home page, and no tests. Product design, architecture, and workflow are documented in `spec/`, and most architectural choices are still **[Proposed]**.

## What exists [Fact]

| Path | Content |
| --- | --- |
| `app/layout.tsx` | Root layout with Geist fonts. Metadata is still "Create Next App" |
| `app/page.tsx` | Template landing page (Next.js and Vercel links) |
| `app/globals.css` | Dark-only design tokens (colors, type scale, radius, shadows, motion), focus style |
| `app/styleguide/` | `/styleguide` route: rendered token and component reference (reads tokens from `globals.css`) |
| `components/ui/` | `Button`, `ButtonLink`, `TextLink`, `Badge`, `Card`, `Alert`, `Input`/`Textarea`/`Select`/`Field`, `Checkbox`, `Switch`, `Dialog`, `Disclosure` |
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
- The project is not a git repository yet.

## Accepted vs proposed

Accepted: ADR-001 (stack), ADR-002 (Cache Components), ADR-003 (spec-driven docs), ADR-004 (separate prescription and performance), and ADR-013 (dark-only design system). All other architecture choices (database, ORM, auth, storage, hosting, testing tools) are **proposed only**. See [open_questions.md](../00_meta/open_questions.md).
