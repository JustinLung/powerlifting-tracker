# Implementation status

One row per backlog feature ([features/README.md](../features/README.md)). Update the row when a feature's status changes. Only mark a feature `Implemented` when its ACs are verified.

| ID | Feature | Spec status | Implementation | Notes |
| --- | --- | --- | --- | --- |
| F-00 | Platform foundation | Draft (awaiting owner approval) | Not started | Decisions made (ADR-007, 016, 017, 018, 019). Open: DB-006 style and DB-020 wording, see spec §13 |
| F-01 | Authentication and roles | Not started | Not started | Blocked on Q-004, Q-019 |
| F-02 | Coach-athlete relationships and roster | Not started | Not started | |
| F-03 | Exercise library | Not started | Not started | |
| F-04 | Program management | Not started | Read-only view preview only | Programs view exists on sample data at `/programs-preview` (ADR-020). No authoring, spec, DAL, auth or real data. Not `Implemented` |
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
| 2026-10-10 | Programs view preview on sample data at `/programs-preview`: block list and By date panel, week navigation, collapsible day cards, a per-exercise dialog where the athlete logs sets, notes, per-set video attachments (local only, nothing uploaded) and skips (client state only, resets on reload) and the coach gets a read-only view, loading/empty/forbidden/error states (ADR-020). Verified by `tsc`, `eslint`, dev-server renders of each state, headless screenshots at 1672 px and 500 px, and a scripted headless-Chrome pass over block select, week nav, By date navigation, card collapse, and the dialog (prefill, validation, save, reopen, skip, Last time, coach read-only, video type/size rejection, attach, remove, "1 video" row indicator). Coach-side video playback was not exercised. No automated tests. |
