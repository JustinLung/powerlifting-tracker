import { formatKg, formatRpe, formatSetsReps } from "@/lib/domain/format";
import type { ExerciseLog, ProgramBlock, ProgramExercise, ProgramSession, ProgramWeek, SetLog } from "./types";

export type Progress = { done: number; total: number };

export function weekProgress(week: ProgramWeek): Progress {
  return {
    done: week.sessions.filter((s) => s.status === "completed").length,
    total: week.sessions.length,
  };
}

export function blockProgress(block: ProgramBlock): Progress {
  return block.weeks.reduce<Progress>(
    (sum, week) => {
      const p = weekProgress(week);
      return { done: sum.done + p.done, total: sum.total + p.total };
    },
    { done: 0, total: 0 },
  );
}

/** Exercises with logged performance. Says nothing about whether the session is complete. */
export function loggedExerciseCount(session: ProgramSession): Progress {
  return {
    done: session.exercises.filter((e) => e.log?.status === "logged").length,
    total: session.exercises.length,
  };
}

/**
 * BR-PRG-009 (proposed): the current week is the earliest week with a session that is not
 * completed. When everything is completed, fall back to the last week. Null for an empty block.
 */
export function currentWeek(block: ProgramBlock): ProgramWeek | null {
  return block.weeks.find(weekHasOpenSession) ?? block.weeks.at(-1) ?? null;
}

const weekHasOpenSession = (week: ProgramWeek) => week.sessions.some((s) => s.status !== "completed");

export const hasOpenSession = (block: ProgramBlock) => block.weeks.some(weekHasOpenSession);

export type DatedSession = {
  session: ProgramSession;
  blockId: string;
  blockName: string;
  weekId: string;
  weekNumber: number;
};

/** Sessions that have a date, oldest first. Undated sessions are left out, never given invented dates. */
export function datedSessions(blocks: ProgramBlock[]): DatedSession[] {
  return blocks
    .flatMap((block) =>
      block.weeks.flatMap((week) =>
        week.sessions.flatMap((session) =>
          session.scheduledDate === null
            ? []
            : [{ session, blockId: block.id, blockName: block.name, weekId: week.id, weekNumber: week.weekNumber }],
        ),
      ),
    )
    .sort((a, b) => a.session.scheduledDate!.localeCompare(b.session.scheduledDate!));
}

export function undatedSessionCount(blocks: ProgramBlock[]): number {
  return blocks.reduce(
    (sum, b) => sum + b.weeks.reduce((s, w) => s + w.sessions.filter((x) => x.scheduledDate === null).length, 0),
    0,
  );
}

type Prescription = ProgramExercise["prescribed"];

/** "4 × 5 · RPE 7 · 150 kg". Parts that are not set (RPE, weight) are left out. */
export function describePrescription({ sets, reps, rpe, weightKg }: Prescription): string {
  return [formatSetsReps(sets, reps), rpe !== null && `RPE ${formatRpe(rpe)}`, weightKg ? formatKg(weightKg) : false].filter(Boolean).join(" · ");
}

const sameSet = (a: SetLog, b: SetLog) => a.weightKg === b.weightKg && a.reps === b.reps && a.rpe === b.rpe;

/** The prescription as a list of per-set targets, used to prefill the log form. */
export function prescribedSets(p: Prescription): SetLog[] {
  return Array.from({ length: p.sets }, () => ({ weightKg: p.weightKg, reps: p.reps, rpe: p.rpe }));
}

/** One-line description of what was logged, and whether it differs from the prescription. */
export function summarizeLog(log: ExerciseLog, prescribed: Prescription): { text: string; deviates: boolean } {
  const target = prescribedSets(prescribed);
  const deviates = log.sets.length !== target.length || log.sets.some((set, i) => !sameSet(set, target[i]));
  const [first] = log.sets;
  const uniform = first !== undefined && log.sets.every((set) => sameSet(set, first));
  const text = uniform
    ? describePrescription({ sets: log.sets.length, reps: first.reps, rpe: first.rpe, weightKg: first.weightKg })
    : `${log.sets.length} ${log.sets.length === 1 ? "set" : "sets"}, varied`;
  return { text, deviates };
}

/**
 * The most recent earlier, logged occurrence of an exercise with the same name, searching blocks
 * and weeks in order. Sample data has no exercise identity beyond the name.
 */
export function lastTime(blocks: ProgramBlock[], exerciseId: string): { exercise: ProgramExercise; label: string } | null {
  // One pass in program order, remembering the latest logged occurrence per name until the target shows up.
  const latestByName = new Map<string, { exercise: ProgramExercise; label: string }>();
  for (const block of blocks) {
    for (const week of block.weeks) {
      for (const session of week.sessions) {
        for (const exercise of session.exercises) {
          if (exercise.id === exerciseId) return latestByName.get(exercise.name) ?? null;
          if (exercise.log?.status === "logged") {
            latestByName.set(exercise.name, { exercise, label: `${block.name} · Week ${week.weekNumber}` });
          }
        }
      }
    }
  }
  return null;
}

/** Saves a log. The first log in a session starts it (BR-LOG-003); logging never completes it. */
export function saveExerciseLog(blocks: ProgramBlock[], exerciseId: string, log: ExerciseLog): ProgramBlock[] {
  const hasExercise = (session: ProgramSession) => session.exercises.some((e) => e.id === exerciseId);
  // Untouched blocks and weeks keep their identity, so memoised consumers do not re-run for them.
  return blocks.map((block) =>
    !block.weeks.some((w) => w.sessions.some(hasExercise))
      ? block
      : {
          ...block,
          weeks: block.weeks.map((week) =>
            !week.sessions.some(hasExercise)
              ? week
              : {
                  ...week,
                  sessions: week.sessions.map((session) =>
                    hasExercise(session)
                      ? {
                          ...session,
                          status: session.status === "not_started" ? ("in_progress" as const) : session.status,
                          exercises: session.exercises.map((e) => (e.id === exerciseId ? { ...e, log } : e)),
                        }
                      : session,
                  ),
                },
          ),
        },
  );
}
