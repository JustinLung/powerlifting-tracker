# Glossary

These are the canonical terms. Use them consistently in code, docs, and UI copy. Entity names in `code font` are the proposed data model names ([data_model.md](../01_architecture/data_model.md)).

## People and access

| Term | Definition |
| --- | --- |
| **User** (`User`) | An authenticated account (identity and credentials). It holds no training data itself. |
| **Profile** (`Profile`) | Display information for a user (name, avatar, timezone, preferred units). |
| **Athlete profile** (`AthleteProfile`) | Present when the user has the athlete role. It owns training data. |
| **Coach profile** (`CoachProfile`) | Present when the user has the coach role. |
| **Coaching relationship** (`CoachAthleteRelationship`) | A link between a coach and an athlete, with a status of `pending`, `active`, `declined`, or `ended`. Only `active` grants access. |
| **Roster** | The set of athletes with whom a coach has an `active` relationship. |
| **Self-coached athlete** | An athlete who authors their own programs. |

## Programming (planned training)

| Term | Definition |
| --- | --- |
| **Program** (`Program`) | A training plan for one athlete. It contains ordered blocks. |
| **Block** (`Block`) | A phase of a program with a purpose (for example, hypertrophy, strength, or peaking). It contains ordered weeks. |
| **Week** (`Week`) | A microcycle in a block. It contains ordered training sessions. |
| **Training session** (`TrainingSession`) | A single planned workout ("Day 1", or "Monday" when a date is set). It contains ordered exercise prescriptions. |
| **Exercise** (`Exercise`) | The definition of a movement, for example "Competition Squat" or "Paused Bench Press". Exercises are either system-provided or custom. |
| **Variation** | An exercise derived from a parent exercise (for example, "Pin Squat" from "Squat"). |
| **Primary lift** | Squat, bench press, or deadlift (`lift_category`). |
| **Exercise prescription** (`ExercisePrescription`) | An exercise placed in a training session, with order, instructions, rest, and tempo. |
| **Prescribed set** (`PrescribedSet`) | A single planned set: reps (or a rep range, or AMRAP), and a target RPE, %1RM, and/or weight. |
| **Reference max** (`AthleteMax`) | An athlete's recorded 1RM (tested or estimated) for an exercise on a date. It is used to resolve %1RM prescriptions. |

## Execution (actual training)

| Term | Definition |
| --- | --- |
| **Session log** (`SessionLog`) | The athlete-owned record that a training session was started, completed, or skipped, with notes. |
| **Performed set** (`PerformedSet`) | A set the athlete actually did (or explicitly skipped), with actual weight, reps, and RPE. |
| **Extra set** | A performed set with no matching prescribed set. |
| **Substitution** | A performed set whose exercise differs from the prescribed exercise. |
| **Deviation** | Any difference between the performed and prescribed values. It is derived, not stored. |
| **Missed session** | A planned session with a past scheduled date and no session log. It is derived, not stored. |

## Review

| Term | Definition |
| --- | --- |
| **Video** (`Video`) | Metadata for an uploaded file. The file itself lives in object storage. |
| **Upload status** | `pending`, `uploaded`, `ready`, or `failed`. |
| **Review status** | `awaiting_review` or `reviewed`. |
| **Feedback** (`FeedbackComment`) | A comment on an exercise prescription and/or a video, written by the coach or the athlete. |
| **Unread** | Feedback newer than the reader's last-read marker for that thread. |

## Training terms

| Term | Definition |
| --- | --- |
| **RPE** | Rating of Perceived Exertion, from 1 to 10 in 0.5 steps. 10 means no reps left in reserve. |
| **RIR** | Reps in reserve. RIR is not stored separately; RIR ≈ 10 − RPE. |
| **1RM** | One-repetition maximum. |
| **e1RM** | Estimated 1RM computed from a performed set. The formula is [Open] ([Q-014](open_questions.md#q-014-e1rm-formula)). |
| **%1RM** | A prescription expressed as a percentage of the reference max. |
| **AMRAP** | As many reps as possible. |
| **Top set / back-off set** | The heaviest set of the day, and lighter sets after it. These are labels only, not separate entities. |
| **Tempo** | Eccentric/pause/concentric/pause timing, stored as free text (for example `3-1-X-0`). |
