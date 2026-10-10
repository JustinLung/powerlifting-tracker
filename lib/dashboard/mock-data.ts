/**
 * SAMPLE DATA ONLY. Nothing here comes from the database, because the database,
 * auth and training models do not exist yet (F-00 to F-07). The dashboard preview
 * route renders this behind a visible banner. Replace `getDashboardData` with the
 * DAL call from F-08 and delete this file; the widgets only depend on `./types`.
 */
import type {
  AthleteDashboardData,
  CoachDashboardData,
  DashboardData,
  DashboardRole,
  LiftMetric,
  SeriesPoint,
} from "./types";
import { WEEK_MS } from "./metrics";

const LAST_WEEK = Date.UTC(2026, 9, 5); // 5 Oct 2026
const WEEKS = 52;
const wobble = [0, 1.5, -1, 2, 0.5, -0.5, 1, 2.5, -1.5, 0, 1, -0.5, 2];

function weekly(endValue: number, perWeek: number, noise: number): SeriesPoint[] {
  return Array.from({ length: WEEKS }, (_, i) => {
    const weeksBack = WEEKS - 1 - i;
    const trend = endValue - weeksBack * perWeek;
    const jitter = i === WEEKS - 1 ? 0 : wobble[i % wobble.length] * noise;
    return {
      date: new Date(LAST_WEEK - weeksBack * WEEK_MS).toISOString().slice(0, 10),
      value: Math.round((trend + jitter) * 2) / 2,
    };
  });
}

const lifts: LiftMetric[] = [
  { lift: "squat", label: "Squat", e1rmHistory: weekly(190, 0.6, 1.2), volumeHistory: weekly(5200, 12, 90) },
  { lift: "bench", label: "Bench", e1rmHistory: weekly(140, 0.45, 0.9), volumeHistory: weekly(3800, 9, 70) },
  { lift: "deadlift", label: "Deadlift", e1rmHistory: weekly(222.5, 0.7, 1.4), volumeHistory: weekly(4600, 10, 80) },
];

const athlete: AthleteDashboardData = {
  role: "athlete",
  user: { name: "Sample Athlete", roleLabel: "Athlete" },
  lifts,
  bodyweightHistory: weekly(82.5, -0.02, 0.3),
  todaySession: {
    title: "Upper (Bench Focus)",
    blockName: "Accumulation",
    weekNumber: 2,
    dayNumber: 2,
    focus: "Bench press",
    rpeRange: { min: 5, max: 6 },
    status: "in_progress",
    href: null,
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        prescribed: { sets: 3, reps: 5, rpe: 5.5, weightKg: 90 },
        logged: { sets: 3, reps: 5, rpe: 6, weightKg: 90 },
        href: null,
      },
      { id: "e2", name: "Paused Bench Press", prescribed: { sets: 3, reps: 3, rpe: 6, weightKg: 80 }, logged: null, href: null },
      { id: "e3", name: "Barbell Row", prescribed: { sets: 4, reps: 8, rpe: 6, weightKg: 70 }, logged: null, href: null },
      { id: "e4", name: "Overhead Press", prescribed: { sets: 3, reps: 8, rpe: 6, weightKg: 50 }, logged: null, href: null },
      { id: "e5", name: "Face Pull", prescribed: { sets: 3, reps: 15, rpe: null, weightKg: 35 }, logged: null, href: null },
    ],
  },
  upcoming: [
    { id: "u1", date: "2026-10-07", title: "Upper (Bench Focus)", weekNumber: 2, dayNumber: 3, href: null },
    { id: "u2", date: "2026-10-09", title: "Lower (Squat Focus)", weekNumber: 2, dayNumber: 4, href: null },
    { id: "u3", date: "2026-10-11", title: "Full (Deadlift Focus)", weekNumber: 2, dayNumber: 6, href: null },
  ],
  videos: [
    { id: "v1", exercise: "Bench Press", uploadedAt: "2026-10-06", durationSeconds: 28, status: "new_feedback", href: null },
    { id: "v2", exercise: "Squat", uploadedAt: "2026-10-04", durationSeconds: 32, status: "awaiting_review", href: null },
    { id: "v3", exercise: "Deadlift", uploadedAt: "2026-10-02", durationSeconds: 21, status: "reviewed", href: null },
  ],
  activity: [
    { id: "a1", kind: "video_uploaded", title: "Video uploaded", detail: "Bench Press — 3 × 5", at: "2026-10-06T08:00:00Z" },
    { id: "a2", kind: "feedback_given", title: "Feedback from coach", detail: "Good depth on last set. Keep your head down and stay tight.", at: "2026-10-06T05:00:00Z" },
    { id: "a3", kind: "program_updated", title: "Program updated", detail: "Week 2 · Day 2", at: "2026-10-05T10:00:00Z" },
    { id: "a4", kind: "session_completed", title: "Session completed", detail: "Lower (Squat Focus)", at: "2026-10-04T09:00:00Z" },
  ],
  quickStats: { trainingDays: { done: 8, planned: 12 }, averageRpe: 6.4 },
};

const coach: CoachDashboardData = {
  role: "coach",
  user: { name: "Sample Coach", roleLabel: "Coach" },
  counts: { activeAthletes: 12, videosAwaitingReview: 5, feedbackAwaiting: 3, sessionsCompleted7d: 31 },
  attention: [
    { id: "c1", name: "Athlete A", program: "Accumulation · Week 2", lastSessionAt: "2026-09-29", reason: "missed_session", href: null },
    { id: "c2", name: "Athlete B", program: "Intensification · Week 1", lastSessionAt: "2026-10-05", reason: "rpe_overshoot", href: null },
    { id: "c3", name: "Athlete C", program: "Accumulation · Week 3", lastSessionAt: "2026-10-04", reason: "awaiting_review", href: null },
    { id: "c4", name: "Athlete D", program: null, lastSessionAt: null, reason: "no_program", href: null },
  ],
  upcoming: [
    { id: "u1", date: "2026-10-07", title: "Upper (Bench Focus)", weekNumber: 2, dayNumber: 3, athleteName: "Athlete A", href: null },
    { id: "u2", date: "2026-10-07", title: "Lower (Squat Focus)", weekNumber: 1, dayNumber: 2, athleteName: "Athlete B", href: null },
    { id: "u3", date: "2026-10-09", title: "Full (Deadlift Focus)", weekNumber: 3, dayNumber: 4, athleteName: "Athlete C", href: null },
  ],
  videos: [
    { id: "v1", exercise: "Squat", uploadedAt: "2026-10-04", durationSeconds: 32, status: "awaiting_review", athleteName: "Athlete C", href: null },
    { id: "v2", exercise: "Bench Press", uploadedAt: "2026-10-05", durationSeconds: 28, status: "awaiting_review", athleteName: "Athlete B", href: null },
    { id: "v3", exercise: "Deadlift", uploadedAt: "2026-10-06", durationSeconds: 21, status: "awaiting_review", athleteName: "Athlete A", href: null },
  ],
  activity: [
    { id: "a1", kind: "video_uploaded", title: "Video uploaded", detail: "Athlete A · Deadlift", at: "2026-10-06T08:00:00Z" },
    { id: "a2", kind: "session_completed", title: "Session completed", detail: "Athlete B · Lower (Squat Focus)", at: "2026-10-06T05:00:00Z" },
    { id: "a3", kind: "results_logged", title: "Results logged", detail: "Athlete C · Bench Press 3 × 5", at: "2026-10-05T10:00:00Z" },
  ],
};

/** Stand-in for the F-08 DAL. Keep the signature; swap the body. */
export async function getDashboardData(role: DashboardRole): Promise<DashboardData> {
  return role === "coach" ? coach : athlete;
}
