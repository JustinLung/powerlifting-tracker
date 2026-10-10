/**
 * Dashboard view models. These are what the widgets render, not database rows.
 * When F-08 lands, `lib/server/dal/dashboard.ts` returns these shapes and the
 * mock module is deleted.
 */

export type DashboardRole = "athlete" | "coach";
export type Lift = "squat" | "bench" | "deadlift";

export type SeriesPoint = { date: string; value: number };

export type LiftMetric = {
  lift: Lift;
  label: string;
  /** Daily-comparable weekly e1RM history in kg, oldest first. Empty when nothing is logged. */
  e1rmHistory: SeriesPoint[];
  volumeHistory: SeriesPoint[];
};

export type SessionExercise = {
  id: string;
  name: string;
  /** Coach prescription. Never overwritten by athlete logging (ADR-004). */
  prescribed: { sets: number; reps: number; rpe: number | null; weightKg: number | null };
  /** What the athlete actually did, if anything has been logged. */
  logged: { sets: number; reps: number; rpe: number | null; weightKg: number } | null;
  href: string | null;
};

export type TodaySession = {
  title: string;
  blockName: string;
  weekNumber: number;
  dayNumber: number;
  focus: string;
  rpeRange: { min: number; max: number } | null;
  status: "not_started" | "in_progress" | "completed";
  exercises: SessionExercise[];
  href: string | null;
};

export type UpcomingSession = {
  id: string;
  date: string;
  title: string;
  weekNumber: number;
  dayNumber: number;
  /** Coach view: whose session it is. */
  athleteName?: string;
  href: string | null;
};

export type VideoItem = {
  id: string;
  exercise: string;
  uploadedAt: string;
  durationSeconds: number | null;
  status: "awaiting_review" | "new_feedback" | "reviewed";
  athleteName?: string;
  href: string | null;
};

export type ActivityKind =
  | "video_uploaded"
  | "feedback_given"
  | "program_updated"
  | "session_completed"
  | "results_logged";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  at: string;
};

export type AthleteDashboardData = {
  role: "athlete";
  user: { name: string; roleLabel: string };
  lifts: LiftMetric[];
  bodyweightHistory: SeriesPoint[];
  todaySession: TodaySession | null;
  upcoming: UpcomingSession[];
  videos: VideoItem[];
  activity: ActivityItem[];
  quickStats: {
    trainingDays: { done: number; planned: number } | null;
    averageRpe: number | null;
  };
};

export type AttentionReason = "missed_session" | "rpe_overshoot" | "awaiting_review" | "no_program";

export type AthleteAttention = {
  id: string;
  name: string;
  program: string | null;
  lastSessionAt: string | null;
  reason: AttentionReason;
  href: string | null;
};

export type CoachDashboardData = {
  role: "coach";
  user: { name: string; roleLabel: string };
  counts: {
    activeAthletes: number;
    videosAwaitingReview: number;
    feedbackAwaiting: number;
    sessionsCompleted7d: number;
  };
  attention: AthleteAttention[];
  upcoming: UpcomingSession[];
  videos: VideoItem[];
  activity: ActivityItem[];
};

export type DashboardData = AthleteDashboardData | CoachDashboardData;
