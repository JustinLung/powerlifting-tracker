# Exercises and prescriptions

Three concepts must never be conflated:

| Concept | Entity | Question it answers | Written by |
| --- | --- | --- | --- |
| Exercise definition | `Exercise` | *What* movement is this? | System seed, or a coach or self-coached athlete |
| Exercise prescription | `ExercisePrescription` + `PrescribedSet` | What *should* be done in this session? | Program author |
| Performance | `PerformedSet` | What *was* done? | Athlete ([training_execution.md](training_execution.md)) |

## Exercise library

- **System exercises** are seeded and read-only. They include the competition squat, bench press, and deadlift, plus common variations (paused, tempo, pin, box, close-grip, Larsen, deficit, block pulls, sumo/conventional, low/high bar, safety bar) and accessories (rows, presses, lunges, RDLs, and so on). The full seed list is defined in F-03.
- **Custom exercises** are created by a coach (visible to that coach and used in their athletes' programs) or by a self-coached athlete.
- **Variations** are exercises with a `parent_exercise_id`. "Paused Bench Press" → parent "Bench Press". The parent determines `lift_category` for progress grouping ([Open] whether variations count toward primary-lift progress: the default is that they appear in the lift's history but are not used for its e1RM trend).

| ID | Rule | Status |
| --- | --- | --- |
| BR-EXP-001 | Every exercise has a `lift_category` of `squat`, `bench`, `deadlift`, or `other`. | [Proposed] |
| BR-EXP-002 | Custom exercise names are unique per owner (case-insensitive). | [Proposed] |
| BR-EXP-003 | Exercises in use are archived, never deleted. Archived exercises are hidden from pickers but still shown in history. | [Proposed] |
| BR-EXP-004 | A variation's parent must be in the same category and must not itself be a variation (one level only). | [Proposed] |

## Prescriptions

Each `ExercisePrescription` places one exercise in a session with:

- `position` (exercise order),
- `rest_seconds`, `tempo` (free text such as `3-1-X-0`), `instructions` (for example "2 s pause at the chest"),
- `coach_notes`,
- one or more `PrescribedSet` rows.

Each `PrescribedSet` may define:

| Field | Meaning | Example |
| --- | --- | --- |
| `reps_min`/`reps_max` | Fixed reps (equal values) or a range | 5/5, 8/12 |
| `is_amrap` | As many reps as possible (`reps_min` = minimum target) | AMRAP, min 5 |
| `target_rpe` | 1–10 in steps of 0.5 | 8 |
| `percent_1rm` | Percentage of the athlete's reference max | 75 |
| `weight_kg` | An absolute load | 140 |
| `label` | A free label | "top", "back-off", "warm-up" |

| ID | Rule | Status |
| --- | --- | --- |
| BR-EXP-010 | The "number of sets" is the count of `PrescribedSet` rows. The editor offers "add N sets like this". | [Proposed] |
| BR-EXP-011 | Load targets may be combined. When both `percent_1rm` and `target_rpe` are present, the UI shows both ("75% / @RPE 7"). Neither overrides the other. | [Proposed] |
| BR-EXP-012 | A `percent_1rm` target is resolved for display against the athlete's latest `AthleteMax` for that exercise (falling back to the parent exercise's max), rounded to 2.5 kg ([Open] the rounding increment could be per-athlete). If there is no max, the UI shows the percentage with "no max recorded". | [Proposed] |
| BR-EXP-013 | A resolved %1RM weight is **not** stored on the prescription. When the athlete logs a set, the actual weight is recorded on the `PerformedSet`. Updating a max therefore changes targets only for sessions that have not been logged. | [Proposed] |
| BR-EXP-014 | `reps_min ≤ reps_max`. `target_rpe`, when set, is between 1 and 10 in 0.5 steps. | [Proposed] |
| BR-EXP-015 | A prescription without any load target is valid (for example "3×10 lunges, choose weight"). | [Proposed] |

## Example: a session as prescribed

| # | Exercise | Sets | Target |
| --- | --- | --- | --- |
| 1 | Competition Squat | 1 | 3 reps @ RPE 8 ("top") |
| 1 | Competition Squat | 3 | 5 reps @ 75% ("back-off") |
| 2 | Paused Bench Press | 4 | 4 reps @ RPE 7, 2 s pause |
| 3 | Romanian Deadlift | 3 | 8–10 reps, 100 kg |
| 4 | Lat Pulldown | 3 | 10–12 reps, no load target |
