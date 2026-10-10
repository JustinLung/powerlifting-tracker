# Product vision

## Problem

Powerlifting coaching today is often run through spreadsheets, chat apps, and shared video folders. Prescriptions, actual performance, and technique feedback live in separate places. As a result:

- Coaches cannot easily see what an athlete actually did compared with what was prescribed.
- Video feedback is disconnected from the set and session it refers to.
- Athletes lose track of which feedback is new and which sessions are outstanding.
- Historical data is hard to use for progress tracking because it is unstructured.

## Vision

A single application in which a coach prescribes structured training, the athlete executes and logs it set by set, and both review technique through videos attached to the exact exercise and sets they show.

## Intended users

| User | Description | Primary needs |
| --- | --- | --- |
| **Coach** | Manages a roster of athletes. | Build programs quickly, see compliance and outstanding work at a glance, review videos, and give targeted feedback. |
| **Athlete (coached)** | Trains under a coach. | See today's training, log it quickly in the gym on a phone, upload lift videos, and read feedback. |
| **Athlete (self-coached)** | Trains without a coach. | Write their own program and log it. Video upload is optional. |

[Requirement] A single account may hold both the coach and athlete role (for example, a coach who also trains). See [03_business_domain/users_and_relationships.md](../03_business_domain/users_and_relationships.md).

## Main user journeys

1. **Onboarding:** a user signs up, chooses the athlete and/or coach role, and a coach connects with an athlete.
2. **Programming:** the coach creates a program for an athlete, made of blocks, weeks, sessions, exercises, and prescribed sets.
3. **Execution:** the athlete opens today's session in the gym, logs each set (weight, reps, RPE), marks deviations, and completes the session.
4. **Video review:** the athlete uploads a video for an exercise. The coach watches it, writes feedback, and marks it reviewed. The athlete sees the new feedback.
5. **Oversight:** the coach dashboard shows recently submitted sessions, videos awaiting review, and athlete activity. The athlete dashboard shows what is next and what is new.
6. **Progress:** both roles review training history and progress for the main lifts.

## Product principles

- **Prescription and performance are separate records.** Logging never overwrites what the coach prescribed.
- **Phone-first logging.** Athletes log between sets on a phone. Logging must be fast and tolerant of poor connectivity.
- **Least-privilege access.** A user sees only their own data and the data of athletes they actively coach.
- **Real data only.** Dashboards and progress views are computed from logged data, never placeholder statistics.
- **Kilograms first.** Weights are stored in kilograms ([Open] display in pounds: see [Q-012](open_questions.md#q-012-weight-units)).

## Success indicators (qualitative, MVP)

- A coach can program a full block for an athlete without leaving the app.
- An athlete can log a typical session (5–8 exercises) on a phone in under a minute of total interaction beyond the training itself.
- Every video and every piece of feedback is traceable to a specific session and exercise.
