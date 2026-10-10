# F-00 Platform foundation: specification

| Field | Value |
| --- | --- |
| Status | Draft |
| Track | Full (new dependencies, a database, and a change to existing standards) |
| Owner | Project owner (approval required; Claude must not set `Approved`) |
| Last updated | 2026-10-10 |
| Related | [plan](plan.md) · [tasks](tasks.md) · [acceptance criteria](acceptance_criteria.md) |

## 1. Problem statement

The repository has no database, no tests, no `typecheck` or `test` scripts, no CI, and no `.env.example`. Every product feature (F-01 onward) needs these. Without them, the first feature would also have to invent the database client, the migration process, the test setup, and the rule that keeps UI code away from the database. Those choices are easier to get right once, in isolation, than inside a feature.

## 2. User stories

F-00 has no end-user value. Its users are the people who build the app.

- **US-001.** As a *developer*, I want one command to start a local database and apply migrations, so that I can run the app on a fresh checkout.
- **US-002.** As a *developer*, I want fast checks (`lint`, `typecheck`, `test`) that behave the same locally and in CI, so that I can trust a green result.
- **US-003.** As a *developer*, I want database access to be possible only from server-only modules, so that a UI component cannot read or leak athlete data.
- **US-004.** As the *project owner*, I want secrets kept out of the repository and tests that cannot touch production data, so that a mistake cannot expose or destroy real data.

## 3. Goals and non-goals

**Goals**

- A server-only database client (Drizzle on PostgreSQL) and a migration workflow.
- Unit, integration (real Postgres), and end-to-end test tooling, each with one passing example.
- `typecheck`, `test`, and database scripts in `package.json`.
- `.env.example` with variable names only, and validated environment access.
- A DAL skeleton and an ESLint rule that stops UI code importing the database.
- A CI workflow that runs the checks on every pull request.

**Non-goals** (out of scope)

- Any domain table, including Better Auth's tables (F-01) and `Profile` tables (F-01).
- Authentication, sessions, or `getCurrentUser` (F-01).
- Seed data for exercises (F-03). The backlog lists "seeding infrastructure" under F-00; this spec defers it (see Unresolved #4).
- Automatic migration of Neon production or preview databases during deploy (see Unresolved #7).
- Email sending (F-01), video storage (F-06), and monitoring.

## 4. Scope

In scope: items under Goals.
Out of scope / deferred to: F-01 (auth tables and session), F-03 (seed data), a later feature (deploy-time migrations).

## 5. Functional requirements

| ID | Requirement | Story |
| --- | --- | --- |
| FR-001 | The system shall provide a database client module under `lib/server/db/` that imports `server-only`, connects to PostgreSQL with Drizzle using `DATABASE_URL`, and reuses one connection pool per server process. | US-001, US-003 |
| FR-002 | The system shall validate required environment variables with a Zod schema in `lib/server/env.ts`. A missing or malformed variable shall fail with an error that names the variable and never prints its value. | US-004 |
| FR-003 | The system shall define the schema in TypeScript under `lib/server/db/schema/`, generate SQL migrations with drizzle-kit, and commit them (DB-001, DB-010). | US-001 |
| FR-004 | `npm run db:migrate` shall apply all pending migrations to the database named by `DATABASE_URL`, and shall be safe to run repeatedly. | US-001 |
| FR-005 | The repository shall include a Docker Compose file that starts PostgreSQL locally with two databases: one for development and one for tests. | US-001, US-004 |
| FR-006 | The repository shall provide Vitest for unit tests (colocated `*.test.ts`) and integration tests (`*.int.test.ts`) that run against the test database. | US-002 |
| FR-007 | The integration test setup shall migrate the test database, and shall provide a helper that empties all tables between tests. | US-002 |
| FR-008 | The integration test setup shall refuse to run, with a clear message, unless the target database name ends in `_test` and the host is local or CI. | US-004 |
| FR-009 | The repository shall provide Playwright with one smoke test that loads `/sign-in` in a real browser. | US-002 |
| FR-010 | `package.json` shall provide the scripts `typecheck`, `test`, `test:unit`, `test:int`, `test:e2e`, `db:generate`, `db:migrate`, and `db:up`/`db:down` (start and stop local Postgres). | US-001, US-002 |
| FR-011 | `.env.example` shall list every environment variable the app reads, with names only (no values), and shall be tracked by git despite the `.env*` ignore rule. | US-004 |
| FR-012 | The repository shall contain a DAL skeleton at `lib/server/dal/`: a module with one function that checks database connectivity and returns no athlete data, plus the shared `ActionResult` type from [api_and_data_access.md](../../01_architecture/api_and_data_access.md). | US-003 |
| FR-013 | ESLint shall report an error when a file outside the allowed directories imports the database client, the schema, `drizzle-orm`, or `pg`. | US-003 |
| FR-014 | A GitHub Actions workflow shall run lint, typecheck, unit and integration tests (against a Postgres service container), build, and the Playwright smoke test on every pull request and on pushes to `main`. | US-002 |
| FR-015 | The README shall document first-time setup (Node version, Docker, `.env.local`, scripts), and the standards documents shall be updated to match the decisions made here. | US-001 |

## 6. Business rules

| ID | Rule | Source |
| --- | --- | --- |
| BR-001 | No secret value appears in the repository, in CI logs, or in error messages. Only variable names do. | new, `security.md` |
| BR-002 | Tests never connect to a database whose name does not end in `_test`. | new |
| BR-003 | UI code (`app/**`, `components/**`) never imports from the database layer. It reaches data through the DAL only. | DB-020, ADR-008 |
| BR-004 | Status columns use `text` with a `CHECK` constraint, not Postgres enums (resolves DB-006). | new, pending approval (Unresolved #2) |

Global rules that apply: DB-001 to DB-005, DB-010, DB-020, DB-025, TST-003, TST-008, TST-009, AUTH-003 (the DAL skeleton must not cache).

## 7. Data requirements

No domain entities. The only database object F-00 creates is the migration history table that drizzle-kit manages, plus a baseline migration that proves the pipeline works (see plan §3). Entities start in F-01. See [data_model.md](../../01_architecture/data_model.md).

## 8. Permissions and security

F-00 reads and writes no athlete data, so the permission matrix does not apply. The DAL skeleton's connectivity check returns only `{ ok: boolean }` and is exempt from authorization for that reason. It is not exposed through any route.

Security considerations:

- `DATABASE_URL` is a secret. It is read only in `lib/server/env.ts`, never logged, and never sent to the client. Files that import it also import `server-only`.
- `.env.local` is already ignored by git (`.env*`). `.env.example` is added by explicit exception.
- CI uses a throwaway Postgres container with a fixed test password that protects nothing. No production or Neon credential is stored in CI.
- The test-database guard (FR-008) protects production and development data from being truncated by a test run.
- New dependencies are limited and justified in plan §10.

## 9. User interface states

No product UI changes. The existing pages must keep rendering: `/sign-in`, `/sign-up`, `/styleguide`, `/dashboard-preview` (development only).

## 10. Error and edge cases

| Case | Expected behavior | Error code |
| --- | --- | --- |
| `DATABASE_URL` missing or not a Postgres URL | Startup of any code that needs the DB throws an error naming `DATABASE_URL`, without its value. | `ENV_INVALID` |
| Database unreachable at runtime | The connectivity check returns `{ ok: false }`. No stack trace or connection string is shown. | `DB_UNAVAILABLE` |
| `db:migrate` run twice | The second run applies nothing and exits with success. | n/a |
| `npm test` run with the test database not started | The integration project fails fast with a message that says to run `npm run db:up`. Unit tests still run with `npm run test:unit`. | `TEST_DB_UNREACHABLE` |
| Test run pointed at a non-`_test` database | The run aborts before any query. | `TEST_DB_UNSAFE` |
| A client component imports a `lib/server` module | The build fails (`server-only`). | n/a |
| Two test files run in parallel against one database | Integration tests run in a single worker, so they cannot interleave. | n/a |
| Fresh checkout, no `.env.local` | `npm run build` and `npm run lint` still pass, because the DB is not touched at build time. | n/a |

## 11. Acceptance criteria

Summarized here. Full scenarios are in [acceptance_criteria.md](acceptance_criteria.md).

| ID | Criterion | Traces to |
| --- | --- | --- |
| AC-001 | A fresh checkout reaches a working local database in documented steps | FR-005, FR-004, FR-015 |
| AC-002 | `db:migrate` applies the baseline and is repeatable | FR-003, FR-004 |
| AC-003 | Environment validation names the bad variable and hides its value | FR-002, BR-001 |
| AC-004 | The DB client connects and the DAL connectivity check reports status | FR-001, FR-012 |
| AC-005 | Unit tests run without a database | FR-006 |
| AC-006 | Integration tests run on the test database and empty tables between tests | FR-006, FR-007 |
| AC-007 | Integration tests refuse an unsafe database | FR-008, BR-002 |
| AC-008 | Playwright smoke test passes | FR-009 |
| AC-009 | The scripts exist and `typecheck` passes on a fresh checkout | FR-010 |
| AC-010 | `.env.example` is tracked and contains no values | FR-011, BR-001 |
| AC-011 | UI code cannot import the database layer, proven by a lint test | FR-013, BR-003 |
| AC-012 | A client component importing a server module fails the build | FR-001, FR-012 |
| AC-013 | CI runs all checks and passes | FR-014 |
| AC-014 | Docs and standards match what was built | FR-015 |

## 12. Dependencies

- Features: none.
- Decisions: [ADR-007](../../00_meta/decision_log.md) (Postgres on Neon and Drizzle), ADR-016 (Vercel), ADR-017 (Vitest, Playwright, Docker Postgres), ADR-019 (no caching of access reads).
- External services: a GitHub repository (CI), Docker (local), a Neon database (deployed environments only; F-00 code does not require it to pass).

## 13. Unresolved questions

| # | Question | Proposed default | Blocking? |
| --- | --- | --- | --- |
| 1 | Which Postgres driver? Neon's HTTP driver cannot run multi-statement transactions (DB-023 needs them), and its WebSocket driver does not work against plain local Postgres. | `pg` (node-postgres) with Neon's **pooled** connection string. The same code runs locally, in CI, and on Vercel. | No, plan default |
| 2 | Status columns: Postgres enum or `text` + `CHECK` (DB-006)? | `text` + `CHECK`. Adding a value is a normal migration, with no `ALTER TYPE` edge cases. | Yes, must confirm |
| 3 | DB-020 says only `lib/server/dal/**` imports the DB client, but Better Auth's configuration (F-01) needs the database too. | Allow `lib/server/db/**`, `lib/server/dal/**`, and `lib/server/auth/**` (plus tests and `drizzle.config.ts`). Update DB-020 to say so. | Yes, must confirm |
| 4 | The backlog lists "seeding infrastructure" in F-00. | Defer to F-03, the first feature with seed data. A seed script with nothing to seed is dead code. | No |
| 5 | The working tree has uncommitted auth UI on `feature/auth`. Where does F-00 go? | You decide when to commit. Suggested: commit the auth UI first, then branch `feature/f-00-foundation`. Claude will not commit unless asked. | No |
| 6 | Run the Playwright smoke test in CI? | Yes, Chromium only, one test. It needs the Playwright browser download in CI (a few hundred MB, cached). | No |
| 7 | How do migrations reach Neon (production and previews)? | Not automated in F-00. The owner runs `npm run db:migrate` against Neon manually. A later feature decides whether to automate it (build step or CI job). | No |
| 8 | Vercel recommends special handling for `pg` pools under Fluid compute so that idle connections are released. | Verify the current recommendation in Vercel docs at implementation (T-03) and record any extra dependency in the plan before installing it. | No |

## 14. References

- Architecture: [api_and_data_access.md](../../01_architecture/api_and_data_access.md), [authentication_and_authorization.md](../../01_architecture/authentication_and_authorization.md)
- Standards: [database_and_data_access.md](../../02_coding_standards/database_and_data_access.md), [testing.md](../../02_coding_standards/testing.md), [security.md](../../02_coding_standards/security.md)
- Workflows: [specification_workflow.md](../../04_workflows/specification_workflow.md), [implementation_workflow.md](../../04_workflows/implementation_workflow.md)

## 15. Review notes

Not reviewed yet. Stage 2 checklist to complete before approval:

- [ ] Every FR has an AC and every AC traces to an FR or BR (draft traceability is in acceptance_criteria.md).
- [ ] No contradiction with accepted ADRs. Known tension: DB-020 wording (Unresolved #3), DB-006 (Unresolved #2).
- [ ] Authorization: no athlete data is touched.
- [ ] Edge cases listed in §10.
- [ ] Security reviewed (§8).

## 16. Change log

| Date | Change | Reason |
| --- | --- | --- |
| 2026-10-10 | Initial draft | Gate 3 of the platform setup |
