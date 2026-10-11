"use client";

import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Disclosure } from "@/components/ui/disclosure";
import { Field, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { formatKg, formatRpe } from "@/lib/domain/format";
import { describePrescription, prescribedSets } from "@/lib/programs/metrics";
import type { ExerciseLog, ProgramExercise, SetLog, SetVideo } from "@/lib/programs/types";
import { SetVideoControl, SetVideoPlayer } from "./set-video";

export type ExerciseDialogProps = {
  exercise: ProgramExercise | null;
  open: boolean;
  onClose: () => void;
  sessionTitle: string;
  /** Session page. `null` until the route exists (F-05). */
  sessionHref: string | null;
  /** Only the athlete who owns the program logs (BR-LOG-001). Everyone else gets a read-only view. */
  canLog: boolean;
  lastTime: { exercise: ProgramExercise; label: string } | null;
  onSave: (exerciseId: string, log: ExerciseLog) => void;
};

const fmtSet = ({ weightKg, reps, rpe }: SetLog) =>
  `${weightKg ? `${formatKg(weightKg)} × ${reps}` : `${reps} reps`}${rpe !== null ? ` · RPE ${formatRpe(rpe)}` : ""}`;

/**
 * Exercise details. The athlete logs on the prescribed exercise: the form starts from the
 * prescription, and saving writes a separate log. The coach's prescription is never changed (ADR-004).
 * Mount with a fresh `key` per opening so the draft resets.
 */
export function ExerciseDialog({ exercise, open, onClose, sessionTitle, sessionHref, canLog, lastTime, onSave }: ExerciseDialogProps) {
  const status = exercise?.log?.status;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={exercise?.name ?? ""}
      meta={
        exercise && (
          <>
            <span className="italic">{describePrescription(exercise.prescribed)}</span>
            <Badge tone={status === "logged" ? "success" : status === "skipped" ? "warning" : "neutral"}>
              {status === "logged" ? "Logged" : status === "skipped" ? "Skipped" : "Not logged"}
            </Badge>
            <span>{sessionTitle}</span>
          </>
        )
      }
    >
      {exercise &&
        (canLog ? (
          <LogForm exercise={exercise} lastTime={lastTime} sessionHref={sessionHref} onSave={onSave} onClose={onClose} />
        ) : (
          <ReadOnlyLog exercise={exercise} sessionHref={sessionHref} onClose={onClose} />
        ))}
    </Dialog>
  );
}

type Row = { weight: string; reps: string; rpe: string; video: SetVideo | null };
type FieldKey = "weight" | "reps" | "rpe";

const toRow = (s: SetLog): Row => ({ weight: s.weightKg === null ? "" : String(s.weightKg), reps: String(s.reps), rpe: s.rpe === null ? "" : String(s.rpe), video: s.video ?? null });
// Accepts "6,5" as well as "6.5": users type either.
const num = (value: string) => (value.trim() === "" ? null : Number(value.replace(",", ".")));

type Errors = Partial<Record<`${number}.${FieldKey}`, string>>;

function validate(rows: Row[]): { sets: SetLog[]; errors: Errors } {
  const errors: Errors = {};
  const sets = rows.map((row, i) => {
    const weight = num(row.weight);
    const reps = num(row.reps);
    const rpe = num(row.rpe);
    if (weight !== null && !(weight >= 0 && weight <= 1000)) errors[`${i}.weight`] = `Set ${i + 1}: load must be 0–1000 kg`;
    // Zero reps is a valid result: a missed lift is still logged (BR-LOG-010).
    if (reps === null || !Number.isInteger(reps) || reps < 0 || reps > 100) errors[`${i}.reps`] = `Set ${i + 1}: enter the reps as a whole number`;
    if (rpe !== null && !(rpe >= 1 && rpe <= 10)) errors[`${i}.rpe`] = `Set ${i + 1}: RPE must be between 1 and 10`;
    return { weightKg: weight, reps: reps ?? 0, rpe, video: row.video };
  });
  return { sets, errors };
}

function LogForm({ exercise, lastTime, sessionHref, onSave, onClose }: Pick<ExerciseDialogProps, "exercise" | "lastTime" | "sessionHref" | "onSave" | "onClose"> & { exercise: ProgramExercise }) {
  const notesId = useId();
  const existing = exercise.log?.status === "logged" ? exercise.log : null;
  const [rows, setRows] = useState<Row[]>(() => (existing?.sets ?? prescribedSets(exercise.prescribed)).map(toRow));
  const [notes, setNotes] = useState(exercise.log?.notes ?? "");
  const [showErrors, setShowErrors] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [playingSet, setPlayingSet] = useState<number | null>(null);

  const { sets, errors } = validate(rows);
  const messages = Object.values(errors);

  const update = <K extends keyof Row>(i: number, key: K, value: Row[K]) => setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: value } : row)));

  function save() {
    if (messages.length > 0 || rows.length === 0) return setShowErrors(true);
    onSave(exercise.id, { status: "logged", sets, notes: notes.trim() });
    onClose();
  }

  function skip() {
    onSave(exercise.id, { status: "skipped", sets: [], notes: notes.trim() });
    onClose();
  }

  return (
    <>
      {lastTime?.exercise.log && (
        <Disclosure title="Last time" meta={lastTime.label}>
          <ul className="divide-y divide-border text-small tabular-nums text-muted">
            {lastTime.exercise.log.sets.map((set, i) => (
              <li key={i} className="flex min-h-9 items-center gap-4">
                <span className="w-4">{i + 1}</span>
                <span className="flex-1">{fmtSet(set)}</span>
              </li>
            ))}
          </ul>
        </Disclosure>
      )}

      <div role="group" aria-label="Sets" className="space-y-2">
        <div className="grid grid-cols-[1.25rem_2.75rem_1fr_1fr_1fr] gap-2 text-center text-small font-semibold text-muted">
          <span />
          <span className="sr-only">Video</span>
          <span aria-hidden="true" />
          <span>Load (kg)</span>
          <span>Reps</span>
          <span>RPE</span>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="space-y-2">
            <div className="grid grid-cols-[1.25rem_2.75rem_1fr_1fr_1fr] items-center gap-2">
              <span className="text-small text-muted tabular-nums">{i + 1}</span>
              <SetVideoControl
                setNumber={i + 1}
                video={row.video}
                onChange={(video) => {
                  update(i, "video", video);
                  setPlayingSet(video ? i : null);
                }}
                onError={setVideoError}
                playing={playingSet === i}
                onTogglePlay={() => setPlayingSet((cur) => (cur === i ? null : i))}
              />
              {(["weight", "reps", "rpe"] as const).map((key) => {
                const label = { weight: "load", reps: "reps", rpe: "RPE" }[key];
                return (
                  <Input
                    key={key}
                    inputMode="decimal"
                    aria-label={`Set ${i + 1} ${label}`}
                    aria-invalid={showErrors && errors[`${i}.${key}`] ? true : undefined}
                    value={row[key]}
                    onChange={(e) => update(i, key, e.target.value)}
                    className="px-2 text-center tabular-nums"
                  />
                );
              })}
            </div>
            {row.video && playingSet === i && <SetVideoPlayer video={row.video} />}
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setRows((r) => [...r, { ...(r.at(-1) ?? { weight: "", reps: "", rpe: "" }), video: null }])}>
            + Add set
          </Button>
          <Button variant="ghost" size="sm" disabled={rows.length <= 1} onClick={() => setRows((r) => r.slice(0, -1))}>
            Remove last set
          </Button>
        </div>
        {videoError && (
          <p role="alert" className="text-small text-danger">
            {videoError}
          </p>
        )}
        {showErrors && messages.length > 0 && (
          <p role="alert" className="text-small text-danger">
            {messages[0]}
          </p>
        )}
      </div>

      <Field label="Notes" htmlFor={notesId}>
        <Textarea id={notesId} placeholder="How did it feel?" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>

      <div className="flex flex-col gap-2 pt-1">
        <Button size="lg" onClick={save}>
          Save exercise
        </Button>
        <Button variant="danger" size="lg" onClick={skip}>
          Skip exercise
        </Button>
        {sessionHref !== null && (
          <ButtonLink href={sessionHref} variant="secondary" size="lg">
            Open session
          </ButtonLink>
        )}
      </div>
    </>
  );
}

function ReadOnlyLog({ exercise, sessionHref, onClose }: { exercise: ProgramExercise; sessionHref: string | null; onClose: () => void }) {
  const { log } = exercise;
  const target = prescribedSets(exercise.prescribed);
  const rowCount = Math.max(target.length, log?.sets.length ?? 0);

  return (
    <>
      <table className="w-full text-small tabular-nums">
        <caption className="sr-only">Prescribed and logged sets for {exercise.name}</caption>
        <thead>
          <tr className="text-left text-caption text-muted">
            <th scope="col" className="pb-2 font-semibold">Set</th>
            <th scope="col" className="pb-2 font-semibold">Prescribed</th>
            <th scope="col" className="pb-2 font-semibold">Logged</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border border-t border-border">
          {Array.from({ length: rowCount }, (_, i) => {
            const set = log?.sets[i];
            const differs = set !== undefined && (target[i] === undefined || fmtSet(set) !== fmtSet(target[i]));
            return (
              <tr key={i}>
                <th scope="row" className="py-2 pr-3 text-left font-normal text-muted">{i + 1}</th>
                <td className="py-2 pr-3">{target[i] ? fmtSet(target[i]) : "—"}</td>
                <td className={cn("py-2", differs && "font-semibold text-warning")}>
                  {set ? fmtSet(set) : <span className="text-muted">—</span>}
                  {differs && <span className="sr-only"> (differs from prescription)</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {log?.sets.some((set) => set.video) && (
        <div className="space-y-3">
          <p className="text-small font-semibold">Videos</p>
          {log.sets.map((set, i) =>
            set.video ? (
              <div key={i}>
                <p className="mb-1 text-caption text-muted">Set {i + 1}</p>
                <SetVideoPlayer video={set.video} />
              </div>
            ) : null,
          )}
        </div>
      )}
      {log?.notes && (
        <div>
          <p className="text-small font-semibold">Athlete notes</p>
          <p className="mt-1 text-small text-muted">{log.notes}</p>
        </div>
      )}
      <p className="text-caption text-subtle">
        {log ? "Logged values are what the athlete did. They never change the prescription." : "Nothing logged yet. Only the athlete logs their own training."}
      </p>
      <div className="flex flex-col gap-2">
        {sessionHref !== null && (
          <ButtonLink href={sessionHref} size="lg">
            Open session
          </ButtonLink>
        )}
        <Button variant="secondary" size="lg" onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  );
}
