# Product scope

This file defines what the MVP includes and excludes. Detailed rules are in [03_business_domain/](../03_business_domain/). Delivery order is in [features/README.md](../features/README.md).

## MVP: in scope

| Area | In scope | Feature |
| --- | --- | --- |
| Accounts | Email-based sign-up, sign-in, sign-out. Athlete and/or coach role. | F-01 |
| Relationships | Coach invites an athlete. The athlete accepts. The coach sees a roster. The relationship can be ended. | F-02 |
| Exercises | System library (squat, bench press, deadlift, common variations and accessories). Custom exercises created by a coach or self-coached athlete. | F-03 |
| Programs | Program → Block → Week → Training session → Exercise prescription → Prescribed sets. Create, edit, reorder, duplicate a week. | F-04 |
| Logging | Set-level logging of weight, reps, and RPE. Skipped sets, extra sets, substitutions, notes, and session completion. | F-05 |
| Video | Upload of a video tied to a session and exercise (optionally to specific sets). Private storage, signed playback. | F-06 |
| Feedback | Coach feedback on an exercise or video, threaded athlete replies, and a reviewed status. | F-07 |
| Dashboards | Coach: roster, recent sessions, videos awaiting review. Athlete: current program/week, next session, new feedback. | F-08 |
| History | Session history per athlete, plus a per-lift history of top sets and estimated 1RM. | F-09 |
| Indicators | In-app unread feedback and outstanding review counts. | F-10 |

## Explicitly excluded from the MVP

These are excluded to keep the MVP small. Revisit them through the [decision log](decision_log.md).

- Payments, subscriptions, and coach billing.
- Email, push, or SMS notifications (in-app indicators only: [Q-010](open_questions.md#q-010-notification-channels)).
- Real-time chat or messaging outside exercise and video feedback.
- Video transcoding, trimming, slow motion, drawing on video, and bar-path analysis.
- Native mobile apps (the web app must work well on mobile browsers).
- Offline-first logging with background sync (the MVP tolerates brief connectivity loss only: [Q-011](open_questions.md#q-011-offline-logging)).
- Program marketplace, public templates, or sharing between coaches.
- Multiple coaches per athlete or coaching teams/organizations ([Q-003](open_questions.md#q-003-multiple-coaches-per-athlete)).
- Automatic program generation, autoregulation suggestions, or AI features.
- Meet/competition management, attempt selection, and wearable integrations.
- Import from spreadsheets or other apps.

## Business rules index

Business rules are defined in the domain documents with stable IDs:

| Prefix | Document |
| --- | --- |
| `BR-USR-*` | [users_and_relationships.md](../03_business_domain/users_and_relationships.md) |
| `BR-PRG-*` | [training_programs.md](../03_business_domain/training_programs.md) |
| `BR-EXP-*` | [exercises_and_prescriptions.md](../03_business_domain/exercises_and_prescriptions.md) |
| `BR-LOG-*` | [training_execution.md](../03_business_domain/training_execution.md) |
| `BR-VID-*` | [video_review_and_feedback.md](../03_business_domain/video_review_and_feedback.md) |
| `BR-DSH-*` | [dashboards_and_progress.md](../03_business_domain/dashboards_and_progress.md) |

## Permissions summary

The authoritative matrix is in [authentication_and_authorization.md](../01_architecture/authentication_and_authorization.md#permission-matrix). In short:

- An **athlete** reads their own programs, writes their own logs, videos, and replies, and cannot edit prescriptions written by a coach.
- A **coach** reads and writes programs and feedback only for athletes with an **active** relationship, and reads those athletes' logs and videos.
- A **self-coached athlete** authors their own programs.
- No user can see another user's data without one of the relationships above.
