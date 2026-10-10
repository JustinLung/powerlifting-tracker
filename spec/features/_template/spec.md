# F-NN Feature name: specification

| Field | Value |
| --- | --- |
| Status | Draft / In review / Approved / In progress / Implemented / Superseded |
| Track | Full / Lightweight |
| Owner | |
| Last updated | YYYY-MM-DD |
| Related | [plan](plan.md) · [tasks](tasks.md) · [acceptance criteria](acceptance_criteria.md) |

## 1. Problem statement

Who has what problem today, and why it matters. Do not describe a solution here.

## 2. User stories

- **US-001.** As a *coach*, I want … so that …
- **US-002.** As an *athlete*, I want … so that …

## 3. Goals and non-goals

**Goals**

- …

**Non-goals** (explicitly out of scope for this feature)

- …

## 4. Scope

In scope: …
Out of scope / deferred to: …

## 5. Functional requirements

| ID | Requirement | Story |
| --- | --- | --- |
| FR-001 | The system shall … | US-001 |

## 6. Business rules

Feature-specific rules. Reference global rules (for example `BR-LOG-003`) instead of copying them.

| ID | Rule | Source |
| --- | --- | --- |
| BR-001 | … | new / refines BR-XXX-NNN |

Global rules that apply: …

## 7. Data requirements

Entities and fields read or written. Note new fields, constraints, and indexes. Link to [data_model.md](../../01_architecture/data_model.md).

## 8. Permissions and security

| Action | Athlete (self) | Active coach | Other |
| --- | --- | --- | --- |
| … | | | |

Security and privacy considerations (input validation, file handling, data exposure): …

## 9. User interface states

| Screen / component | Loading | Empty | Error | Success | Locked / other |
| --- | --- | --- | --- | --- | --- |
| … | | | | | |

## 10. Error and edge cases

| Case | Expected behavior | Error code |
| --- | --- | --- |
| … | | `DOMAIN_CODE` |

## 11. Acceptance criteria

Summarized here. Full Given/When/Then scenarios are in [acceptance_criteria.md](acceptance_criteria.md).

| ID | Criterion | Traces to |
| --- | --- | --- |
| AC-001 | … | FR-001, BR-001 |

## 12. Dependencies

- Features: …
- Decisions / open questions: …
- External services: …

## 13. Unresolved questions

| # | Question | Proposed default | Blocking? |
| --- | --- | --- | --- |
| 1 | … | … | yes/no |

## 14. References

- Domain: [03_business_domain/…](../../03_business_domain/)
- Architecture: [01_architecture/…](../../01_architecture/)
- Standards: [02_coding_standards/…](../../02_coding_standards/)

## 15. Review notes

Findings from Stage 2 (reviewer, date, and outcome).

## 16. Change log

| Date | Change | Reason |
| --- | --- | --- |
