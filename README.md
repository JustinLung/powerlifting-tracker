# Powerlifting Tracker

A training platform for powerlifting coaches and athletes. Coaches prescribe structured programs, athletes log what they actually performed, and both sides use exercise videos and written feedback to review technique.

> **Current state:** early scaffold. The app has no database, authentication, or saved user data yet. UI pages exist for a sample-data dashboard preview, a sample-data programs preview and a styleguide. See [spec/05_project_memory/current_state.md](spec/05_project_memory/current_state.md) for the full inventory and [spec/05_project_memory/next_steps.md](spec/05_project_memory/next_steps.md) for what comes next.

## Stack

- Next.js 16.4 (App Router, `cacheComponents` enabled)
- React 19.3 and TypeScript (strict)
- Tailwind CSS v4
- Recharts for charts

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Template landing page from `create-next-app` |
| `/programs-preview` | Program blocks, weeks and training day cards built from sample data. `?state=empty`, `forbidden` or `error` shows those states. Returns 404 in production |
| `/dashboard-preview` | Athlete and coach dashboards built from sample data. Add `?role=coach` for the coach view. Returns 404 in production |
| `/styleguide` | Rendered reference for design tokens and UI components |

## Getting started

Requires Node.js 20.9 or later (the `engines` field in `package.json`). Developed on Node 24.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npx next typegen && npx tsc --noEmit` | Type check. Route types must be generated first, so plain `tsc` fails on a fresh checkout |

## Specification and documentation

This project uses spec-driven development. All product, architecture, and workflow documentation lives in [spec/](spec/README.md), which is the source of truth for intended behavior. Feature status is tracked in [spec/05_project_memory/implementation_status.md](spec/05_project_memory/implementation_status.md). Architecture decisions are in the [decision log](spec/00_meta/decision_log.md). Many infrastructure choices, including database, auth, and hosting, are still proposed rather than accepted.
