# F-00 Platform foundation: acceptance criteria

Spec: [spec.md](spec.md)

Verification is an automated test or `manual` with steps and a reason (TST-001). F-00 reads no athlete data, so the standard authorization scenarios do not apply. See spec §8.

## Traceability matrix

| AC | Traces to | Verification | Result |
| --- | --- | --- | --- |
| AC-001 | FR-004, FR-005, FR-015 | manual: fresh-checkout walkthrough (reason: the setup steps cross Docker and the shell) | ☐ |
| AC-002 | FR-003, FR-004 | `tests/integration/migrations.int.test.ts › "applies the baseline and is repeatable"` | ☐ |
| AC-003 | FR-002, BR-001 | `lib/server/env.test.ts › "names the variable and never echoes its value"` | ☐ |
| AC-004 | FR-001, FR-012 | `lib/server/dal/system.int.test.ts › "reports ok against the test database"` | ☐ |
| AC-005 | FR-006 | `npm run test:unit` with the database stopped | ☐ |
| AC-006 | FR-006, FR-007 | `tests/integration/reset.int.test.ts › "empties tables between tests"` | ☐ |
| AC-007 | FR-008, BR-002 | `tests/setup/safety.test.ts › "rejects a database not named *_test"` | ☐ |
| AC-008 | FR-009 | `tests/e2e/smoke.spec.ts › "sign-in page renders"` | ☐ |
| AC-009 | FR-010 | manual: clean clone, `npm ci`, run each script (reason: needs a fresh checkout) | ☐ |
| AC-010 | FR-011, BR-001 | manual: `git ls-files .env.example` and a review that every line is `NAME=` with an empty value | ☐ |
| AC-011 | FR-013, BR-003 | `tests/lint/db-import-rule.test.ts › "flags UI imports, allows DAL imports"` | ☐ |
| AC-012 | FR-001, FR-012 | manual: add a throwaway client component importing `lib/server/db/client`, run `npm run build`, expect failure, then remove it (reason: a failing build is not a normal test) | ☐ |
| AC-013 | FR-014 | the CI run on the F-00 pull request | ☐ |
| AC-014 | FR-015 | manual: re-read README and standards against what was built | ☐ |

## Scenarios

### AC-001 · Fresh checkout reaches a working database

**Traces to:** FR-004, FR-005, FR-015

```gherkin
Given a clone with Node 22+ and Docker running
  And .env.local created from .env.example with local values
When the developer runs "npm ci", "npm run db:up", and "npm run db:migrate"
Then Postgres is running with databases "powerlifting_dev" and "powerlifting_test"
  And the migration history table exists in "powerlifting_dev"
```

### AC-002 · Migrations apply and repeat

**Traces to:** FR-003, FR-004

```gherkin
Given an empty test database
When migrations are applied
  And migrations are applied a second time
Then both runs succeed
  And the history table lists the baseline exactly once
```

### AC-003 · Environment errors do not leak secrets

**Traces to:** FR-002, BR-001

```gherkin
Given DATABASE_URL is set to "not-a-url-secret123"
When the environment is read
Then an ENV_INVALID error names "DATABASE_URL"
  And the error message does not contain "secret123"
```

### AC-004 · Connectivity check

**Traces to:** FR-001, FR-012

```gherkin
Given the test database is running
When pingDatabase() is called
Then it returns { ok: true }

Given the database is unreachable
When pingDatabase() is called
Then it returns { ok: false } and does not throw
  And the result contains no connection string
```

### AC-005 · Unit tests need no database

**Traces to:** FR-006

```gherkin
Given Docker is stopped
When "npm run test:unit" runs
Then all unit tests pass
```

### AC-006 · Tables are emptied between tests

**Traces to:** FR-006, FR-007

```gherkin
Given a test inserts a row into a scratch table created for the test
When resetDatabase() runs
Then the table has zero rows
  And the migration history table is untouched
```

### AC-007 · Unsafe database is rejected

**Traces to:** FR-008, BR-002

```gherkin
Given TEST_DATABASE_URL points at a database named "powerlifting_dev"
When the integration setup starts
Then it aborts with TEST_DB_UNSAFE before running any query

Given TEST_DATABASE_URL points at a database on a non-local host that is not CI
When the integration setup starts
Then it aborts with TEST_DB_UNSAFE
```

### AC-008 · Browser smoke test

**Traces to:** FR-009

```gherkin
Given the app is built and running
When Playwright opens "/sign-in"
Then the page shows the sign-in heading and the email and password fields
```

### AC-009 · Scripts exist and typecheck works on a fresh checkout

**Traces to:** FR-010

```gherkin
Given a clean clone with no .next folder and no .env.local
When the developer runs "npm run lint", "npm run typecheck", "npm run test:unit", and "npm run build"
Then each exits with code 0
```

### AC-010 · `.env.example` is tracked and value-free

**Traces to:** FR-011, BR-001

```gherkin
Given the repository
When "git ls-files .env.example" runs
Then the file is listed
  And every variable line in it has no value after "="
```

### AC-011 · UI code cannot import the database layer

**Traces to:** FR-013, BR-003

```gherkin
Given a file "components/x.tsx" that imports "@/lib/server/db/client"
When ESLint lints it
Then it reports a no-restricted-imports error

Given a file "app/page.tsx" that imports "drizzle-orm" or "pg"
When ESLint lints it
Then it reports a no-restricted-imports error

Given a file "lib/server/dal/system.ts" that imports "@/lib/server/db/client"
When ESLint lints it
Then it reports no error
```

### AC-012 · Server modules cannot reach the client bundle

**Traces to:** FR-001, FR-012

```gherkin
Given a client component that imports a module under lib/server
When "npm run build" runs
Then the build fails with a server-only error
```

### AC-013 · CI

**Traces to:** FR-014

```gherkin
Given a pull request
When the workflow runs
Then lint, typecheck, unit and integration tests, build, and the smoke test all run
  And the workflow uses no secret values
```

### AC-014 · Docs match

**Traces to:** FR-015

```gherkin
Given the finished implementation
When the README setup steps and the standards documents are read
Then every command and rule in them matches what exists
  And DB-006 and DB-020 state the decisions made here
```

## Manual verification log

| AC | Date | Device / browser | Steps | Outcome |
| --- | --- | --- | --- | --- |
