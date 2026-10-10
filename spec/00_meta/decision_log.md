# Decision log

Lightweight architecture decision records (ADRs). Statuses:

- **Accepted:** binding.
- **Proposed:** recommended but not yet confirmed by the project owner.
- **Superseded:** replaced by a later decision.

To accept a proposal, change its status, add the date, and update any linked open question.

| ID | Decision | Status | Date |
| --- | --- | --- | --- |
| ADR-001 | Keep Next.js App Router, React 19, TypeScript strict, Tailwind v4 | Accepted (existing) | 2026-10-09 |
| ADR-002 | Keep `cacheComponents` and `partialPrefetching` enabled | Accepted (existing) | 2026-10-09 |
| ADR-003 | Markdown spec-driven documentation as the source of truth | Accepted | 2026-10-09 |
| ADR-004 | Prescriptions and performance stored in separate tables | Accepted (requirement) | 2026-10-09 |
| ADR-005 | Training session as its own entity | Proposed | 2026-10-09 |
| ADR-006 | Set-level logging as the default granularity | Proposed | 2026-10-09 |
| ADR-007 | PostgreSQL + Drizzle ORM | Proposed | 2026-10-09 |
| ADR-008 | Server-side Data Access Layer enforces all authorization | Proposed | 2026-10-09 |
| ADR-009 | Server Actions for mutations; Route Handlers only for external callers | Proposed | 2026-10-09 |
| ADR-010 | Videos in private object storage via direct upload + signed URLs | Proposed | 2026-10-09 |
| ADR-011 | Kilograms as the canonical stored unit | Proposed | 2026-10-09 |
| ADR-012 | Self-hosted auth library (Better Auth) | Proposed | 2026-10-09 |
| ADR-013 | Dark-only design system, hand-built primitives in `components/ui/` | Accepted (owner request) | 2026-10-10 |
| ADR-014 | Recharts for charts | Accepted (owner request) | 2026-10-10 |
| ADR-015 | Dashboard built as a sample-data preview ahead of F-08 | Accepted (owner request, deviation) | 2026-10-10 |

---

### ADR-001: Keep the existing frontend stack

**Context:** [Fact] The repository was bootstrapped with Next.js 16.4.0, React 19.3.0, TypeScript 5.9 (`strict: true`), Tailwind CSS 4.3 through the `@tailwindcss/turbopack` loader, and ESLint 9 with `eslint-config-next`.
**Decision:** build on this stack. Do not introduce a second styling system or router.
**Consequences:** standards in [02_coding_standards/](../02_coding_standards/) target these versions.

### ADR-002: Keep Cache Components and Partial Prefetching

**Context:** [Fact] `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`. Almost every page in this app is user-specific.
**Decision:** keep both enabled. Pages render a static shell, and session-dependent content streams in behind `<Suspense>`. A route that cannot follow this pattern yet may export `instant = false` to opt out of instant-navigation validation, with a comment explaining why.
**Consequences:** reading `cookies()` or the session outside a `<Suspense>` boundary is a build error. The authorization helpers must be designed for this ([application_architecture.md](../01_architecture/application_architecture.md#rendering-strategy)).
**Alternative:** disabling Cache Components would simplify auth-heavy pages but goes against the current Next.js direction and the project's existing configuration.

### ADR-003: Spec-driven documentation

**Decision:** the numbered documentation folders and `features/` are the source of truth. Workflows are defined in [04_workflows/](../04_workflows/).

### ADR-004: Separate prescription and performance

**Context:** [Requirement] Logging must not overwrite coach prescriptions.
**Decision:** the coach writes `PrescribedSet` records. The athlete writes `SessionLog` and `PerformedSet` records. A performed set may reference the prescribed set it fulfils. No code path updates a prescription row as a side effect of logging.
**Consequences:** deviations are computed by comparing the two records. Write permissions split cleanly by table.

### ADR-005: Training session as an entity

**Context:** no existing model exists to reconcile. Sessions carry completion status, notes, video context, and an optional date.
**Decision (proposed):** `TrainingSession` is a first-class entity under `Week`. Its execution state lives in a 1:1 athlete-owned `SessionLog`.

### ADR-006: Set-level logging

**Decision (proposed):** the athlete logs each set individually. The UI offers a one-tap "log as prescribed" per set and per exercise.
**Reasoning:** RPE and reps differ from set to set in powerlifting (top sets versus back-offs). e1RM needs per-set data. Videos refer to specific sets. Exercise-level summaries can be derived from set data, but set data cannot be recovered from summaries.
**Trade-off:** it requires more taps. This is mitigated by prefilled values.

### ADR-007: PostgreSQL + Drizzle

See [Q-001](open_questions.md#q-001-database-and-hosting) and [Q-002](open_questions.md#q-002-orm--query-layer).

### ADR-008: Data Access Layer

**Decision (proposed):** all database access lives in server-only modules under `lib/server/`. Every exported function resolves the current user and checks access before querying. Pages, Server Actions, and Route Handlers never query the database directly. This follows the Data Access Layer pattern in the Next.js 16 docs (`node_modules/next/dist/docs/01-app/02-guides/data-security.md`).

### ADR-009: Mutation mechanism

**Decision (proposed):** Server Actions handle all mutations from the app's own UI. Route Handlers (`app/api/**/route.ts`) are used only for external callers, such as storage or auth webhooks and auth library endpoints. There is no separate REST API for the MVP.

### ADR-010: Video storage

See [video_storage_and_delivery.md](../01_architecture/video_storage_and_delivery.md) and [Q-005](open_questions.md#q-005-video-object-storage).

### ADR-011: Kilograms canonical

See [Q-012](open_questions.md#q-012-weight-units).

### ADR-012: Auth library

See [Q-004](open_questions.md#q-004-authentication-provider).

### ADR-013: Dark-only design system with hand-built primitives

**Context:** the owner asked for a dark-mode design system based on the Perplexity `DESIGN.md` (warm minimalism), with reusable components and a `/styleguide` page. The source defines light mode only, uses one 24px size for every text style, and has no status colors.
**Decision:** the app is dark-only (`color-scheme: dark`, no `prefers-color-scheme` branching). Tokens live in `app/globals.css`. Primitives are hand-built in `components/ui/` with no new dependencies (the second option in [styling_and_components.md](../02_coding_standards/styling_and_components.md#component-library)). The dark palette, type scale, accent, and status colors are **derived**, not taken from the source. Geist Sans replaces the proprietary pplxSans.
**Consequences:** ST-003 no longer applies (no light theme to maintain). Adopting shadcn/ui later stays possible, but would replace these primitives. If a light theme is ever wanted, the token layer is the only place that changes.

### ADR-014: Recharts for charts

**Context:** the home dashboard needs a total-e1RM line chart and per-lift sparklines. F-09 listed the chart library as an open dependency.
**Decision:** add `recharts` (3.10.x) and its peer `react-is`. Chart colors reference design tokens through `var(--…)`, so no hex values enter chart code. Charts are client components (`components/dashboard/`).
**Alternatives:** hand-built SVG (no dependency, but axes, tooltips and range handling would be re-implemented). The owner chose the library.
**Consequences:** F-09 can reuse it. Replacing it later only touches `total-chart.tsx`. The decorative sparklines (`sparkline.tsx`) are plain SVG: they have no axes, tooltip or interaction, so a chart library adds runtime cost without benefit.

### ADR-015: Dashboard preview with sample data ahead of F-08

**Context:** the owner asked for the home dashboard layout now. F-08 is `Not started` and depends on F-00 to F-07; no auth, roles, database or training models exist. `dashboards_and_progress.md` forbids placeholder statistics in shipped dashboards.
**Decision:** build the UI shell and widgets against view-model types in `lib/dashboard/types.ts`, fed by one clearly marked mock module (`lib/dashboard/mock-data.ts`), on a route that returns 404 in production (`/dashboard-preview`) and shows a "Sample data" banner. Destinations that do not exist yet are passed as `href: null` and render disabled rather than as dead links.
**Consequences:** this is a deviation from "no implementation before an approved spec". F-08 still needs its spec, plan and authorization-aware DAL (`lib/server/dal/dashboard.ts`). When it lands, replace `getDashboardData`, delete the mock module and the preview route, and move `AppShell` into the `(app)` layout. Role-based navigation visibility (`nav-config.ts`) is an assumption until F-01 defines the permission matrix.
