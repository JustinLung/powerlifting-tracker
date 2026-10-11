/**
 * SAMPLE DATA ONLY. Nothing here comes from the database, because the training models
 * and logging do not exist yet (F-04, F-05). `/programs-preview` renders this behind a
 * visible banner. Replace `getProgramsData` with the DAL call and delete this file; the
 * components depend only on `./types`.
 */
import type { ProgramBlock, ProgramExercise, ProgramSession, ProgramsData, SessionStatus } from "./types";

type Spec = [name: string, sets: number, reps: number, rpe: number | null, weightKg: number | null];
type Logged = "all" | "none" | number;

function exercise(id: string, [name, sets, reps, rpe, weightKg]: Spec, logged: boolean, deviates = false): ProgramExercise {
  const performed = Array.from({ length: sets }, (_, n) => ({
    weightKg: deviates && weightKg !== null ? weightKg - 2.5 : weightKg,
    // The deviating example misses a rep on the last set.
    reps: deviates && n === sets - 1 ? reps - 1 : reps,
    rpe: rpe === null ? null : deviates ? rpe + 0.5 : rpe,
  }));
  return {
    id,
    name,
    prescribed: { sets, reps, rpe, weightKg },
    log: logged ? { status: "logged", sets: performed, notes: deviates ? "Depth felt a bit higher than last week." : "" } : null,
  };
}

function session(
  id: string,
  dayIndex: number,
  title: string,
  scheduledDate: string | null,
  status: SessionStatus,
  logged: Logged,
  specs: Spec[],
): ProgramSession {
  return {
    id,
    dayIndex,
    title,
    scheduledDate,
    status,
    href: null,
    exercises: specs.map((spec, i) =>
      exercise(`${id}-e${i + 1}`, spec, logged === "all" || (typeof logged === "number" && i < logged), i === 0 && logged !== "none"),
    ),
  };
}

const day1: Spec[] = [
  ["Back squat", 4, 5, 7, 150],
  ["Paused bench press", 4, 4, 6, 100],
  ["Romanian deadlift", 3, 8, 7, 130],
  ["Lying leg curl", 3, 12, 8, null],
  ["Face pull", 3, 15, 8, null],
  ["Ab wheel rollout", 3, 10, null, null],
];
const day2: Spec[] = [
  ["Bench press", 5, 5, 7, 110],
  ["Incline dumbbell press", 3, 8, 8, 36],
  ["Lat pulldown", 3, 10, 8, 70],
  ["Seated row", 3, 10, 8, 65],
  ["Dumbbell lateral raise", 3, 12, 8, 10],
  ["Tricep pushdown", 3, 12, 8, 35],
];
const day3: Spec[] = [
  ["Deadlift", 3, 5, 7, 190],
  ["Front squat", 3, 8, 7, 100],
  ["Leg press", 3, 10, 8, 200],
  ["Hamstring curl", 3, 12, 8, 50],
  ["Standing calf raise", 4, 15, 8, 60],
  ["Hanging leg raise", 3, 12, 8, null],
];
const day4: Spec[] = [
  ["Overhead press", 4, 5, 7, 65],
  ["Weighted chin-up", 4, 6, 8, 20],
  ["T-bar row", 3, 10, 8, 55],
  ["Dumbbell shoulder press", 3, 10, 8, 24],
  ["Cable row", 3, 12, 8, 60],
  ["Bulgarian split squat with a slow eccentric (a long name that has to wrap)", 3, 10, 8, 24],
];

const postJapan: ProgramBlock = {
  id: "blk-1",
  name: "Post Japan",
  weeks: [
    {
      id: "blk-1-w1",
      weekNumber: 1,
      sessions: [
        session("b1w1d1", 1, "Day 1", "2026-09-14", "completed", "all", day1),
        session("b1w1d2", 2, "Day 2", "2026-09-16", "completed", "all", day2),
        session("b1w1d3", 3, "Day 3", "2026-09-18", "completed", "all", day3),
        session("b1w1d4", 4, "Day 4", "2026-09-20", "completed", "all", day4),
      ],
    },
    {
      id: "blk-1-w2",
      weekNumber: 2,
      sessions: [
        session("b1w2d1", 1, "Day 1", "2026-09-21", "completed", "all", day1),
        session("b1w2d2", 2, "Day 2", "2026-09-23", "completed", "all", day2),
        session("b1w2d3", 3, "Day 3", "2026-09-25", "completed", "all", day3),
        session("b1w2d4", 4, "Day 4", "2026-09-27", "completed", "all", day4),
      ],
    },
    {
      id: "blk-1-w3",
      weekNumber: 3,
      sessions: [
        session("b1w3d1", 1, "Day 1", "2026-09-28", "completed", "all", day1),
        session("b1w3d2", 2, "Day 2", "2026-09-30", "completed", "all", day2),
        // Every exercise is logged but the athlete has not finished the session: must not read as complete.
        session("b1w3d3", 3, "Day 3", "2026-10-02", "in_progress", "all", day3),
        session("b1w3d4", 4, "Day 4", "2026-10-04", "not_started", "none", day4),
      ],
    },
  ],
};

const comeback: ProgramBlock = {
  id: "blk-2",
  name: "Comeback",
  weeks: [1, 2, 3, 4].map((n) => ({
    id: `blk-2-w${n}`,
    weekNumber: n,
    sessions: [
      session(`b2w${n}d1`, 1, "Day 1", null, n === 1 ? "completed" : "not_started", n === 1 ? "all" : "none", day1),
      session(`b2w${n}d2`, 2, "Day 2", null, n === 1 ? "in_progress" : "not_started", n === 1 ? 3 : "none", day2),
      session(`b2w${n}d3`, 3, "Day 3", null, "not_started", "none", day3),
    ],
  })),
};

// Edge case: a week with no sessions, and a session with no exercises.
const regiosPeak: ProgramBlock = {
  id: "blk-3",
  name: "Regio's Peak",
  weeks: [
    { id: "blk-3-w1", weekNumber: 1, sessions: [session("b3w1d1", 1, "Day 1", null, "not_started", "none", []), session("b3w1d2", 2, "Day 2", null, "not_started", "none", day2)] },
    { id: "blk-3-w2", weekNumber: 2, sessions: [] },
  ],
};

// Edge case: a block that has no weeks yet.
const regiosPrep: ProgramBlock = { id: "blk-4", name: "Regio's prep", weeks: [] };

const rehab: ProgramBlock = {
  id: "blk-5",
  name: "REHAB",
  weeks: [1, 2].map((n) => ({
    id: `blk-5-w${n}`,
    weekNumber: n,
    sessions: [session(`b5w${n}d1`, 1, "Day 1", null, "not_started", "none", day4.slice(0, 3))],
  })),
};

const data: ProgramsData = { blocks: [postJapan, comeback, regiosPeak, regiosPrep, rehab] };

export type ProgramsPreviewState = "ready" | "empty" | "forbidden" | "error";

export async function getProgramsData(state: ProgramsPreviewState = "ready"): Promise<ProgramsData> {
  if (state === "error") throw new Error("Sample failure: programs could not be loaded");
  if (state === "empty") return { blocks: [] };
  return data;
}
