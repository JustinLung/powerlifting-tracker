"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/dashboard/icons";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatWeekday, formatShortDate } from "@/lib/domain/format";
import { loggedExerciseCount } from "@/lib/programs/metrics";
import type { ProgramSession } from "@/lib/programs/types";
import { CompletionIndicator } from "./completion-indicator";
import { EmptyState } from "./empty-state";
import { ExerciseDialog, type ExerciseDialogProps } from "./exercise-dialog";
import { ExerciseRow } from "./exercise-row";

type TrainingDayCardProps = Pick<ExerciseDialogProps, "canLog" | "onSave"> & {
  session: ProgramSession;
  highlighted: boolean;
  lastTimeFor: (exerciseId: string) => ExerciseDialogProps["lastTime"];
};

export function TrainingDayCard({ session, highlighted, canLog, onSave, lastTimeFor }: TrainingDayCardProps) {
  const [expanded, setExpanded] = useState(true);
  // One dialog per card. The selection outlives `open` so the content stays put during the close animation.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // A new key per opening remounts the dialog, which resets the log form's draft.
  const [openCount, setOpenCount] = useState(0);
  const selected = session.exercises.find((e) => e.id === selectedId) ?? null;
  const bodyId = useId();

  return (
    <section
      id={`session-${session.id}`}
      aria-labelledby={`${bodyId}-title`}
      className={cn(
        "scroll-mt-6 self-start overflow-hidden rounded-lg border bg-surface shadow-card",
        highlighted ? "border-accent" : "border-border",
      )}
    >
      <h3 className="flex items-center">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => setExpanded((v) => !v)}
          className="flex min-h-14 flex-1 items-center gap-3 px-4 py-2 text-left hover:bg-surface-raised"
        >
          <Icon
            name="chevron"
            className={cn("size-4 shrink-0 text-muted transition-transform duration-(--motion-base) ease-standard", expanded && "rotate-90")}
          />
          <span className="min-w-0 flex-1">
            <span id={`${bodyId}-title`} className="block text-small font-semibold">
              {session.title}
            </span>
            {session.scheduledDate && (
              <span className="block text-caption text-muted">
                {formatWeekday(session.scheduledDate)} {formatShortDate(session.scheduledDate)}
              </span>
            )}
          </span>
          <CompletionIndicator exercises={loggedExerciseCount(session)} status={session.status} />
        </button>
      </h3>
      <div id={bodyId} hidden={!expanded} className="border-t border-border">
        {session.exercises.length === 0 ? (
          <EmptyState compact title="No exercises prescribed" />
        ) : (
          <ul className="divide-y divide-border">
            {session.exercises.map((exercise) => (
              <li key={exercise.id}>
                <ExerciseRow
                  exercise={exercise}
                  onOpen={() => {
                    setSelectedId(exercise.id);
                    setOpenCount((n) => n + 1);
                    setDialogOpen(true);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
        {session.href !== null && (
          <div className="border-t border-border p-2">
            <ButtonLink href={session.href} variant="ghost" size="sm" className="w-full">
              Open session
            </ButtonLink>
          </div>
        )}
      </div>
      <ExerciseDialog
        key={openCount}
        exercise={selected}
        canLog={canLog}
        lastTime={dialogOpen && selected ? lastTimeFor(selected.id) : null}
        onSave={onSave}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        sessionTitle={session.title}
        sessionHref={session.href}
      />
    </section>
  );
}
