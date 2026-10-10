# Dashboards and progress

[Requirement] Dashboards show **only real, computed data**. Do not ship placeholder statistics. A widget whose backing data does not exist yet is omitted, not faked.

All dashboard queries go through `lib/server/dal/dashboard.ts`, are scoped by the authorization model, and query bounded windows ([api_and_data_access.md](../01_architecture/api_and_data_access.md#pagination)).

## Coach dashboard

| Widget | Definition | MVP | Depends on |
| --- | --- | --- | --- |
| Athlete roster | Active athletes: name, current program/block/week, last session date | ✅ | F-02, F-04 |
| Pending invitations | Invites with status `pending` | ✅ | F-02 |
| Recently submitted sessions | `SessionLog.status = completed` in the last 14 days, newest first, with deviation count | ✅ | F-05 |
| Videos awaiting review | `ready` + `awaiting_review` videos, oldest first (FIFO) | ✅ | F-06, F-07 |
| Recent feedback activity | The latest comments in threads the coach participates in, with an unread marker | ✅ (basic) | F-07, F-10 |
| Compliance | % of sessions logged versus due in the current week | Later | F-05, Q-018 |
| Athlete progress | e1RM trend per primary lift | Later | F-09 |
| Flags (missed sessions, RPE overshoot) | Rule-based alerts | Later | F-05, F-09 |

## Athlete dashboard

| Widget | Definition | MVP | Depends on |
| --- | --- | --- | --- |
| Current program and block | Active program, block name and goal | ✅ | F-04 |
| Current week | Per BR-PRG-009 | ✅ | F-04 |
| Next session | The first session in the current week without a log (dated sessions ordered by date) | ✅ | F-04, F-05 |
| Sessions awaiting completion | Sessions that are `in_progress`, plus missed dated sessions | ✅ | F-05 |
| Recent completed workouts | The last 5 completed session logs | ✅ | F-05 |
| Videos awaiting feedback | Own videos with `awaiting_review` | ✅ | F-06, F-07 |
| New feedback | Threads with unread comments | ✅ | F-07, F-10 |
| Progress | e1RM trend and best sets per primary lift | Later | F-09 |

Dual-role users see both dashboards on one page (coach panel first), as described in [application_architecture.md](../01_architecture/application_architecture.md#folder-structure).

## Progress and history (F-09)

| ID | Rule | Status |
| --- | --- | --- |
| BR-DSH-001 | e1RM is computed from completed performed sets with 1–10 reps, using the formula decided in [Q-014](../00_meta/open_questions.md#q-014-e1rm-formula). | [Proposed] |
| BR-DSH-002 | A primary lift's trend uses only exercises whose `lift_category` matches and that have no parent (competition variants). Variations have their own history. | [Proposed] |
| BR-DSH-003 | Progress metrics are computed at read time. Cached or materialized results are introduced only after measuring a performance problem. | [Proposed] |
| BR-DSH-004 | Training history lists session logs newest first, showing prescribed and performed values side by side. | [Proposed] |
| BR-DSH-005 | Recording an `AthleteMax` from a performed set (for example "set as new tested max") is an explicit action and is never automatic. | [Proposed] |

## Empty states

Every widget has an empty state with a next action. For example:

- Coach with no athletes → "Invite your first athlete".
- Athlete with no program, coached → "Your coach hasn't published a program yet".
- Athlete with no program, self-coached → "Create a program".
