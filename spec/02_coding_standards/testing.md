# Testing standards

[Fact] No test framework, test files, or `test` script exist. The only automated checks available today are `npm run lint`, `npx next typegen && npx tsc --noEmit`, and `npm run build`.

[Proposed] Tooling ([Q-007](../00_meta/open_questions.md#q-007-testing-tools)) is installed in F-00:

| Level | Tool | Scope |
| --- | --- | --- |
| Unit | Vitest | Pure domain logic in `lib/domain/` (e1RM, deviation detection, unit conversion, "current week" resolution), Zod schemas |
| Integration | Vitest + real Postgres | DAL functions, including **authorization**, run against a migrated test database |
| End-to-end | Playwright | Critical user journeys in a real browser against a running app |

The workflow (when to run what) is in [testing_workflow.md](../04_workflows/testing_workflow.md).

## Rules

- **TST-001.** Every acceptance criterion (`AC-xxx`) is covered by at least one automated test, or explicitly marked as manually verified (with a reason) in the feature's `acceptance_criteria.md`.
- **TST-002.** Every DAL function that reads or writes athlete data has authorization tests for: the owner athlete, the active coach, a former or pending coach, and an unrelated user.
- **TST-003.** Integration tests hit a real database. Do not mock the ORM. Each test runs in a transaction that is rolled back, or against a freshly truncated schema.
- **TST-004.** Domain functions are pure and tested with table-driven cases, including edge values (RPE 10, 0 reps, AMRAP, null targets).
- **TST-005.** E2E tests cover journeys, not every field: sign up → onboard; coach creates program → athlete logs session → coach sees it; video upload → coach reviews → athlete sees feedback.
- **TST-006.** E2E tests use the storage provider's local emulator, or a test bucket that is cleaned after each run. They never use production storage.
- **TST-007.** Test names describe behavior and reference IDs where useful: `it("rejects logging by the coach (AC-012)")`.
- **TST-008.** Unit tests sit next to the code they test (`e1rm.test.ts` beside `e1rm.ts`). E2E tests live in `tests/e2e/`.
- **TST-009.** Never claim a check passed without running it. Record the actual command output in the PR or task notes.

## Proposed scripts (added in F-00)

```json
"typecheck": "next typegen && tsc --noEmit",
"test": "vitest run",
"test:e2e": "playwright test"
```
