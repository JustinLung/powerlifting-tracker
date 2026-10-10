# F-NN Feature name: acceptance criteria

Spec: [spec.md](spec.md)

Each scenario is testable and traces back to requirements. Every FR in the spec appears in at least one scenario's **Traces to** line. Verification is either an automated test reference or `manual` with steps and a reason (TST-001).

## Traceability matrix

| AC | Traces to | Verification | Result |
| --- | --- | --- | --- |
| AC-001 | FR-001, BR-001 | `lib/server/dal/x.test.ts › "…"` | ☐ |
| AC-002 | FR-002, AUTH-002 | `tests/e2e/x.spec.ts › "…"` | ☐ |

## Scenarios

### AC-001 · Short title

**Traces to:** FR-001, BR-001

```gherkin
Given an athlete with an active program
  And the session "Week 1 Day 1" has no log
When the athlete logs set 1 as 150 kg × 5 @ RPE 7
Then a performed set is stored linked to prescribed set 1
  And the prescribed set is unchanged
  And the session log status is "in_progress"
```

### AC-002 · Authorization: unrelated user

**Traces to:** FR-002, AUTH-002

```gherkin
Given a user with no relationship to athlete A
When the user requests athlete A's session by ID
Then a 404 response is returned
  And no athlete data is included in the response
```

## Standard authorization scenarios

Include these for any feature that reads or writes athlete data: the owner athlete, the active coach, a pending or former coach, and an unrelated user.

## Manual verification log

| AC | Date | Device / browser | Steps | Outcome |
| --- | --- | --- | --- | --- |
