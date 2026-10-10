# Implementation status

One row per backlog feature ([features/README.md](../features/README.md)). Update the row when a feature's status changes. Only mark a feature `Implemented` when its ACs are verified.

| ID | Feature | Spec status | Implementation | Notes |
| --- | --- | --- | --- | --- |
| F-00 | Platform foundation | Not started | Not started | Blocked on Q-001, Q-002, Q-006, Q-007 |
| F-01 | Authentication and roles | Not started | Not started | Blocked on Q-004, Q-019 |
| F-02 | Coach-athlete relationships and roster | Not started | Not started | |
| F-03 | Exercise library | Not started | Not started | |
| F-04 | Program management | Not started | Not started | |
| F-05 | Training execution and set logging | Not started | Not started | |
| F-06 | Secure video uploads | Not started | Not started | |
| F-07 | Video review and feedback | Not started | Not started | |
| F-08 | Athlete and coach dashboards | Not started | UI preview only | Layout and widgets exist on sample data (ADR-015). No spec, DAL, auth or real data. Not `Implemented` |
| F-09 | Training history and progress | Not started | Not started | |
| F-10 | Notifications and review indicators | Not started | Not started | |

## Non-feature work completed

| Date | Work |
| --- | --- |
| 2026-10-09 | Created the `spec/` documentation system and `CLAUDE.md`. Replaced the template `README.md`. No application code changed. |
| 2026-10-10 | Dark-only design system: tokens in `globals.css`, primitives in `components/ui/`, `/styleguide` route, ADR-013. Fixed KI-003 (body font). Not a backlog feature. Verified by `next build`, `tsc`, `eslint`, and a manual visual check; no automated tests exist yet. |
| 2026-10-10 | Added `Dialog` and `Disclosure` primitives and a styleguide demo (log-exercise sheet, confirmation). Checked by hand at phone and desktop widths: open, Escape, add set, disclosure, focus return, scroll lock. No automated tests. |
| 2026-10-10 | Home dashboard UI preview (athlete and coach views) on sample data at `/dashboard-preview`, plus `SegmentedControl`, Recharts (ADR-014). Verified by `next build`, `tsc`, `eslint`, and a manual check at desktop and phone widths. No automated tests. |
