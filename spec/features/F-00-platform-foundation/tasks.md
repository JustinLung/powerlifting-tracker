# F-00 Platform foundation: tasks

Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md)

Rules: do the tasks in order. Each task leaves lint, typecheck, and build passing. Tests are written in the same task as the code they cover. Tick a task only after its definition of done is verified, and record the commands that were run and their real output. Do not commit unless the owner asks.

Standard check after every task:

```bash
npm run lint && npx next typegen && npx tsc --noEmit && npm run build
```

(After T-01 this is `npm run lint && npm run typecheck && npm run build`.)

Do not start until the spec status is `Approved` and Unresolved #2 and #3 are answered.

---

### T-01 · Scripts, Node version, env example skeleton

- **Covers:** FR-010 (partly), FR-011, AC-009, AC-010
- **Depends on:** —
- **Description:** add `typecheck` (`next typegen && tsc --noEmit`) to `package.json`. Add `engines.node` (`>=22`) and `.nvmrc` (24). Add `!.env.example` to `.gitignore`. Create `.env.example` listing `DATABASE_URL` and `TEST_DATABASE_URL` as names only. No dependencies.
- **Definition of done:**
  - [ ] `npm run typecheck` passes on a checkout with no `.next` folder
  - [ ] `git ls-files .env.example` lists the file after `git add -n` shows it is not ignored (do not commit)
  - [ ] Every variable line in `.env.example` ends with `=` and nothing after it
  - [ ] lint, typecheck, and build pass
- **Status:** ☐ todo
- **Notes / verification output:**

---

### T-02 · Local Postgres with Docker Compose

- **Covers:** FR-005, FR-010 (`db:up`, `db:down`), AC-001 (first half)
- **Depends on:** T-01
- **Description:** add `compose.yaml` (service `postgres:17`, a named volume, a health check, port bound to `127.0.0.1` only) and `docker/postgres-init.sql` that creates `powerlifting_test` next to the default `powerlifting_dev`. Add the `db:up` and `db:down` scripts. The credentials are local-only throwaway values in the compose file.
- **Definition of done:**
  - [ ] `npm run db:up` starts a healthy container with both databases (`psql -l` lists them)
  - [ ] `npm run db:down` stops it and keeps the volume
  - [ ] The port is not reachable from another machine (bound to loopback)
  - [ ] lint, typecheck, and build pass
- **Status:** ☐ todo
- **Notes / verification output:**

---

### T-03 · Env validation, DB client, Drizzle config

- **Covers:** FR-001, FR-002, AC-003, AC-004 (partly)
- **Depends on:** T-02
- **Description:** install `drizzle-orm`, `pg`, `@types/pg`, `drizzle-kit`, `zod`, `server-only` (plan §10). First check Vercel's current guidance for `pg` pools on Fluid compute and record the outcome in plan §9 (add a package only if required and recorded). Create `lib/server/env.ts` (Zod, throws `ENV_INVALID`, never prints values), `lib/server/db/client.ts` (lazy pool, `server-only`), `lib/server/db/schema/index.ts` (empty), and `drizzle.config.ts` (loads `.env.local` with `process.loadEnvFile`). The unit test for env is written here.
- **Definition of done:**
  - [ ] `lib/server/env.test.ts` passes (missing, malformed, secret not echoed)
  - [ ] `npm run build` passes with **no** `.env.local` present
  - [ ] `grep -rn "use cache" lib/server` finds nothing
  - [ ] lint, typecheck, and build pass
- **Status:** ☐ todo
- **Notes / verification output:**

---

### T-04 · Baseline migration and `db:migrate`

- **Covers:** FR-003, FR-004, FR-010 (`db:generate`, `db:migrate`), AC-002 (script part), AC-001
- **Depends on:** T-03
- **Description:** add `scripts/migrate.ts` using Drizzle's `migrate()` and the `db:generate` and `db:migrate` scripts. Generate the baseline with `drizzle-kit generate --custom --name=baseline`. If the migrator rejects a comment-only file, use `SELECT 1;` and record that in plan §3.
- **Definition of done:**
  - [ ] `npm run db:migrate` succeeds on `powerlifting_dev`, and a second run succeeds and applies nothing
  - [ ] The migration folder is committed to the working tree (not committed to git until the owner asks)
  - [ ] The script prints no connection string
  - [ ] lint, typecheck, and build pass
- **Status:** ☐ todo
- **Notes / verification output:**

---

### T-05 · Vitest and the unit project

- **Covers:** FR-006 (unit), FR-010 (`test`, `test:unit`), AC-005
- **Depends on:** T-03
- **Description:** install `vitest`. Create `vitest.config.ts` with two projects (`unit`: `**/*.test.ts` excluding integration, no setup file needing a DB; `integration`: added in T-06). Add the `@/` alias and the `server-only` stub. Add one real unit test for existing pure code, `lib/domain/format.ts`.
- **Definition of done:**
  - [ ] `npm run test:unit` passes with Docker stopped
  - [ ] Importing a `server-only` module in a unit test works through the stub
  - [ ] lint, typecheck, and build pass
- **Status:** ☐ todo
- **Notes / verification output:**

---

### T-06 · Integration harness and safety guard

- **Covers:** FR-006 (integration), FR-007, FR-008, FR-012, AC-002, AC-004, AC-006, AC-007
- **Depends on:** T-04, T-05
- **Description:** add the `integration` project (`*.int.test.ts`, forks pool, one worker). Global setup: read `TEST_DATABASE_URL`, run the safety check (name ends in `_test`, host is local or `CI=true`), run migrations once. Add `resetDatabase()`. Add `lib/server/dal/system.ts` (`pingDatabase`) and `lib/server/action-result.ts`. Write the integration tests listed in the acceptance criteria. The unreachable-database case in AC-004 is a unit-style test with a bad port.
- **Definition of done:**
  - [ ] `npm run test:int` passes with the test database up, and fails fast with `TEST_DB_UNREACHABLE` when it is down
  - [ ] Pointing `TEST_DATABASE_URL` at `powerlifting_dev` aborts with `TEST_DB_UNSAFE` and nothing is truncated (verified by hand, output recorded)
  - [ ] `pingDatabase` result and logs contain no connection string
  - [ ] `npm test` runs both projects
  - [ ] lint, typecheck, and build pass
- **Status:** ☐ todo
- **Notes / verification output:**

---

### T-07 · Lint rule that keeps the DB out of UI code

- **Covers:** FR-013, AC-011, AC-012
- **Depends on:** T-06
- **Description:** add the `no-restricted-imports` rule to `eslint.config.mjs`. It covers `@/lib/server/db/**`, relative paths into it, `drizzle-orm`, and `pg`. It is switched off for `lib/server/db/**`, `lib/server/dal/**`, `lib/server/auth/**`, `drizzle.config.ts`, `scripts/**`, and `tests/**`. Add `tests/lint/db-import-rule.test.ts` using ESLint's `lintText`. Then do the AC-012 build check by hand and remove the throwaway file.
- **Definition of done:**
  - [ ] The lint test passes: UI imports are flagged, DAL imports are allowed
  - [ ] `npm run lint` passes on the whole repo
  - [ ] The throwaway client import failed the build with a `server-only` error (output recorded), and the file is deleted
  - [ ] lint, typecheck, and build pass
- **Status:** ☐ todo
- **Notes / verification output:**

---

### T-08 · Playwright smoke test

- **Covers:** FR-009, FR-010 (`test:e2e`), AC-008
- **Depends on:** T-01
- **Description:** install `@playwright/test`, then the Chromium browser. Create `playwright.config.ts` (web server runs the production build, `reuseExistingServer` off in CI) and `tests/e2e/smoke.spec.ts` for `/sign-in`. Ignore `playwright-report/` and `test-results/` in `.gitignore`.
- **Definition of done:**
  - [ ] `npm run build && npm run test:e2e` passes locally
  - [ ] Generated report folders are git-ignored
  - [ ] lint, typecheck, and build pass
- **Status:** ☐ todo
- **Notes / verification output:**

---

### T-09 · CI workflow

- **Covers:** FR-014, AC-013
- **Depends on:** T-06, T-07, T-08, and a GitHub repository (owner task in OWNER_TODO.md)
- **Description:** add `.github/workflows/ci.yml`. Triggers: pull requests and pushes to `main`. Steps: checkout, Node from `.nvmrc`, `npm ci`, lint, typecheck, unit tests, migrate and run integration tests against a `postgres:17` service container, build, cache and install Chromium, smoke test, upload the Playwright report on failure. No repository secrets. Pin third-party actions to a version.
- **Definition of done:**
  - [ ] The workflow passes on a pull request (link recorded)
  - [ ] The workflow file contains no credential except the throwaway service-container password
  - [ ] lint, typecheck, and build pass locally
- **Status:** ☐ todo
- **Notes / verification output:**

---

### T-10 · Docs, standards, and project memory

- **Covers:** FR-015, AC-001 (walkthrough), AC-009, AC-014, implementation workflow Stage 7
- **Depends on:** T-09
- **Description:** update `README.md` (setup and scripts), `database_and_data_access.md` (DB-006 resolved, DB-020 wording), `testing.md` (installed tools, scripts, file layout), `implementation_workflow.md` (the "not a git repository" note), and `spec/05_project_memory/*`. Walk through the README on a clean clone.
- **Definition of done:**
  - [ ] Spec status set to `Implemented`, and the change log updated
  - [ ] `implementation_status.md`, `current_state.md`, `known_issues.md`, and `next_steps.md` match what was built
  - [ ] Decisions made during implementation are in the decision log
  - [ ] Code review checklist completed
  - [ ] The manual verification log in `acceptance_criteria.md` is filled in
- **Status:** ☐ todo
- **Notes / verification output:**
