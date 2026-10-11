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
| ADR-007 | PostgreSQL on Neon + Drizzle ORM | Accepted (owner confirmed) | 2026-10-10 |
| ADR-008 | Server-side Data Access Layer enforces all authorization | Proposed | 2026-10-09 |
| ADR-009 | Server Actions for mutations; Route Handlers only for external callers | Proposed | 2026-10-09 |
| ADR-010 | Videos in private object storage via direct upload + signed URLs | Proposed | 2026-10-09 |
| ADR-011 | Kilograms as the canonical stored unit | Proposed | 2026-10-09 |
| ADR-012 | Self-hosted auth library (Better Auth) | Accepted (owner confirmed) | 2026-10-10 |
| ADR-013 | Dark-only design system, hand-built primitives in `components/ui/` | Accepted (owner request) | 2026-10-10 |
| ADR-014 | Recharts for charts | Accepted (owner request) | 2026-10-10 |
| ADR-015 | Dashboard built as a sample-data preview ahead of F-08 | Accepted (owner request, deviation) | 2026-10-10 |
| ADR-020 | Programs view built as a sample-data preview ahead of F-04/F-05 | Accepted (owner request, deviation) | 2026-10-10 |
| ADR-016 | Hosting on Vercel | Accepted (owner confirmed) | 2026-10-10 |
| ADR-017 | Vitest (integration on real Postgres in Docker) and Playwright | Accepted (owner confirmed) | 2026-10-10 |
| ADR-018 | Resend for transactional email | Accepted (owner confirmed) | 2026-10-10 |
| ADR-019 | No caching of session or access reads | Accepted (owner confirmed) | 2026-10-10 |

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

### ADR-007: PostgreSQL on Neon + Drizzle

**Context:** the data is strongly relational (a six-level hierarchy, role-scoped joins) and needs transactions, foreign keys, and numeric weights. See [Q-001](open_questions.md#q-001-database-and-hosting) and [Q-002](open_questions.md#q-002-orm--query-layer).
**Decision:** PostgreSQL hosted on Neon, provisioned through the Vercel Marketplace. Drizzle ORM and drizzle-kit for the schema and SQL migrations.
**Consequences:** `drizzle-orm` is compatible with Better Auth's Drizzle adapter (peer range `^0.45.2`). Neon branching can serve preview environments later. Dependencies are justified in the F-00 plan.

### ADR-008: Data Access Layer

**Decision (proposed):** all database access lives in server-only modules under `lib/server/`. Every exported function resolves the current user and checks access before querying. Pages, Server Actions, and Route Handlers never query the database directly. This follows the Data Access Layer pattern in the Next.js 16 docs (`node_modules/next/dist/docs/01-app/02-guides/data-security.md`).

### ADR-009: Mutation mechanism

**Decision (proposed):** Server Actions handle all mutations from the app's own UI. Route Handlers (`app/api/**/route.ts`) are used only for external callers, such as storage or auth webhooks and auth library endpoints. There is no separate REST API for the MVP.

### ADR-010: Video storage

See [video_storage_and_delivery.md](../01_architecture/video_storage_and_delivery.md) and [Q-005](open_questions.md#q-005-video-object-storage).

### ADR-011: Kilograms canonical

See [Q-012](open_questions.md#q-012-weight-units).

### ADR-012: Auth library

**Context:** see [Q-004](open_questions.md#q-004-authentication-provider). Verified on 2026-10-10 with a scratch app on Next.js 16.4.0, `cacheComponents: true`, and Better Auth 1.7.7: the production build passes, a session read inside `<Suspense>` makes the route Partial Prerender, and sign-up, sign-in, and sign-out worked over HTTP. **Not verified:** Server Action cookie setting in a browser, the Drizzle adapter, email verification, and password reset (F-01 must test these).
**Decision:** Better Auth, self-hosted, email and password with email verification. The `nextCookies()` plugin goes last in the plugin list. `proxy.ts` does only an optimistic cookie-presence redirect. The real check is in the DAL.
**Consequences:** `notFound()` inside a Suspense boundary renders the not-found UI with HTTP status 200, because the status is sent before the content resolves. AUTH-002 means "show not-found UI". The user still cannot tell whether the resource exists. We own security updates for the library. Clerk remains the fallback if it proves unfit.

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

### ADR-016: Hosting on Vercel

**Decision:** deploy on Vercel for native Next.js 16 support (Cache Components, Partial Prefetching) and preview deployments. Resolves [Q-006](open_questions.md#q-006-hosting-platform). CI is therefore in scope for F-00.

### ADR-017: Testing tools

**Decision:** Vitest for unit and integration tests. Integration tests run against a real PostgreSQL started locally in Docker (CI uses a Postgres service container). Playwright for end-to-end tests. Resolves [Q-007](open_questions.md#q-007-testing-tools).
**Consequences:** contributors need Docker for the integration tests. Tests never touch the Neon production database.

### ADR-018: Resend for email

**Decision:** Resend sends verification and password-reset email. Resolves the email-provider gap noted for F-01 and F-02. Until a sending domain is verified, development prints emails to the server log. The API key is an environment variable, set by the owner.
**Consequences:** adds the `resend` dependency in F-01 (justified in its plan). Invitation email (F-02) reuses this provider.

### ADR-019: No caching of session or access reads

**Context:** the Next.js guide suggests `use cache: private` for the current-user read, with a default 5-minute stale time. That would let a removed coach keep access for minutes and would break AUTH-003. The owner chose no caching on 2026-10-10.
**Decision:** `getCurrentUser` and every DAL access check run on each request, behind `<Suspense>`. No `use cache`, `use cache: private`, or Better Auth cookie cache for these reads. Data that is cached must be keyed by user id, derived after authorization, and never contain access decisions.
**Consequences:** one small indexed query per request. Revisit only with measurements, and any change needs a new ADR and an update to AUTH-003.

### ADR-020: Programs view preview with sample data ahead of F-04 and F-05

**Context:** the owner asked for the Programs view layout now, explicitly as a mock preview. F-04 and F-05 are `Not started`; no database, auth, authorization or training models exist, and Q-008, Q-013 and Q-018 are open.
**Decision:** same approach as ADR-015. View-model types in `lib/programs/types.ts`, pure helpers in `lib/programs/metrics.ts`, one marked mock module (`lib/programs/mock-data.ts`), and a route that returns 404 in production (`/programs-preview`) with a "Sample data" banner. Destinations that do not exist (session pages, block overview) are `href: null` and render disabled. Two **[Proposed]** rules are implemented as defaults and must be confirmed in the F-04 spec: "current week" per BR-PRG-009, and optional `scheduledDate` per Q-018 (the By date view lists only dated sessions and says how many are not listed). Session completion is its own status; it is never inferred from exercise logging. Per-exercise logging is a client-state mock of F-05: the athlete logs per-set load, reps and RPE plus notes (BR-LOG-001: coaches see a read-only view); the first log moves a session to `in_progress` (BR-LOG-003) and nothing logged ever completes it. Set videos are picked per set (BR-VID-003/004: MP4 or MOV, 500 MB, athlete only), kept as local object URLs, and never leave the browser: no storage, signed URLs, review queue or 3 minute check (Q-016) exist yet. e1RM (Q-014), the edit window (BR-LOG-007) and draft persistence (BR-LOG-009) are not mocked. Exercises carry no category or primary-lift colour coding because no convention exists.
**Consequences:** deviation from "no implementation before an approved spec". F-04 and F-05 still need their specs, plans and an authorization-aware DAL (every read through the rules in `authentication_and_authorization.md`). When they land, replace `getProgramsData`, delete the mock module and the preview route, and move the view into the `(app)` layout. `AppShell` gained a `flush` prop and the "Program" nav item now points at `/programs-preview`; both are temporary.
