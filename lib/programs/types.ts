/**
 * Program view models. These are what the Programs view renders, not database rows.
 * When F-04/F-05 land, a DAL function returns these shapes and `./mock-data.ts` is deleted.
 */
import type { SessionExercise } from "@/lib/dashboard/types";

/**
 * A video the athlete attached to a set (BR-VID-003). In the preview `url` is a local object URL;
 * with F-06 it becomes a video id and playback uses a short-lived signed URL.
 */
export type SetVideo = { name: string; sizeBytes: number; url: string };

/** One performed set. Null means "not entered" (no load for a bodyweight exercise, RPE not recorded). */
export type SetLog = { weightKg: number | null; reps: number; rpe: number | null; video?: SetVideo | null };

/** What the athlete did. Separate from the prescription, which logging never changes (ADR-004). */
export type ExerciseLog = {
  status: "logged" | "skipped";
  sets: SetLog[];
  notes: string;
};

export type ProgramExercise = Omit<SessionExercise, "logged" | "href"> & {
  /** Null until the athlete logs or skips the exercise. */
  log: ExerciseLog | null;
};

export type SessionStatus = "not_started" | "in_progress" | "completed";

export type ProgramSession = {
  id: string;
  /** Position within the week: "Day 1" is `dayIndex` 1. */
  dayIndex: number;
  title: string;
  /** ISO date. Optional (BR-PRG-004, Q-018): undated sessions are never "missed". */
  scheduledDate: string | null;
  /**
   * Session completion is its own state (a `SessionLog`), never inferred from
   * the exercises: every exercise can be logged while the session is still open.
   */
  status: SessionStatus;
  exercises: ProgramExercise[];
  href: string | null;
};

export type ProgramWeek = {
  id: string;
  weekNumber: number;
  sessions: ProgramSession[];
};

export type ProgramBlock = {
  id: string;
  name: string;
  weeks: ProgramWeek[];
};

export type ProgramsData = {
  blocks: ProgramBlock[];
};

export type ProgramsViewMode = "blocks" | "by_date";
