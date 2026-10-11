import { Icon } from "@/components/dashboard/icons";
import { describePrescription, summarizeLog } from "@/lib/programs/metrics";
import type { ProgramExercise } from "@/lib/programs/types";

export function ExerciseRow({ exercise, onOpen }: { exercise: ProgramExercise; onOpen: () => void }) {
  const { prescribed, log } = exercise;
  const videoCount = log?.sets.filter((set) => set.video).length ?? 0;
  const summary = log?.status === "logged" ? summarizeLog(log, prescribed) : null;

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onOpen}
      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-(--motion-fast) ease-standard hover:bg-surface-raised"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-small font-semibold wrap-break-word">{exercise.name}</span>
        <span className="block text-caption text-muted">{describePrescription(prescribed)}</span>
        {/* The athlete's log is shown beside the prescription, never over it (ADR-004). */}
        {videoCount > 0 && (
          <span className="mt-0.5 flex items-center gap-1 text-caption text-muted">
            <Icon name="videos" className="size-3.5" />
            {videoCount} {videoCount === 1 ? "video" : "videos"}
          </span>
        )}
        {summary?.deviates && <span className="block text-caption text-warning">Logged {summary.text}</span>}
      </span>
      {log?.status === "logged" && (
        <span className="mt-0.5 text-success">
          <Icon name="check" className="size-4" />
          <span className="sr-only">Logged</span>
        </span>
      )}
      {log?.status === "skipped" && <span className="mt-0.5 text-caption text-warning">Skipped</span>}
      {log === null && <span className="sr-only">Not logged</span>}
      <Icon name="chevron" className="mt-0.5 size-4 shrink-0 text-muted" />
    </button>
  );
}
