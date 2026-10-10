# Code review checklist

Use this checklist for self-review before marking a feature `Implemented`, and when reviewing someone else's change. Each item links to the rule it checks.

## Spec alignment

- [ ] Every change traces to an FR, BR, or task in an approved spec. Nothing outside the spec's scope was added.
- [ ] Every AC is verified, and the verification method is recorded.
- [ ] Spec, project memory, and decision log are updated (implementation workflow, Stage 7).

## Authorization and security

- [ ] Every new DAL function authenticates and authorizes before touching data ([AUTH-001–006](../01_architecture/authentication_and_authorization.md#rules)).
- [ ] No acting-user ID or role is taken from client input (SEC-003).
- [ ] Inaccessible resources return 404 (SEC-004).
- [ ] Server Action inputs are validated with Zod (SEC-002).
- [ ] No secrets, signed URLs, or personal data in logs or client bundles (SEC-005, SEC-010).
- [ ] Authorization tests cover the owner, the active coach, a former coach, and an unrelated user (TST-002).

## Domain integrity

- [ ] No code path writes prescription tables from athlete logging (ADR-004).
- [ ] Locked sessions cannot be edited (BR-PRG-006).
- [ ] Weights are stored in kg with `numeric`. Conversion happens only on display (TS-005, DB-005).
- [ ] Multi-row writes are wrapped in a transaction (DB-023).
- [ ] History-bearing rows are not hard-deleted (BR-PRG-007, DB-004).

## Next.js / React

- [ ] Session and DAL reads are inside `<Suspense>` with a skeleton (NX-004).
- [ ] `"use client"` is only on leaves that need it. Props are serializable (NX-001/002).
- [ ] There is no `"use cache"` on private data without an accepted decision (NX-005).
- [ ] All UI states are implemented: loading, empty, error, success, and locked.
- [ ] Forms show pending state and field errors, and destructive actions confirm (NX-020–024).

## Quality

- [ ] Lint, typecheck, tests, and build were run, and their results were reported truthfully.
- [ ] No N+1 queries. Lists are bounded or paginated.
- [ ] Accessibility: labels, focus, 44 px touch targets in athlete flows (ST-005/006).
- [ ] No unused code, debug logging, or commented-out blocks.
- [ ] Any new dependency has a recorded justification.
