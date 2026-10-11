import { Icon } from "@/components/dashboard/icons";
import { cn } from "@/lib/cn";
import type { Progress } from "@/lib/programs/metrics";
import type { SessionStatus } from "@/lib/programs/types";

const MAX_DOTS = 8;

const statusLabel: Record<SessionStatus, string> = {
  completed: "Session completed",
  in_progress: "Session in progress",
  not_started: "Session not started",
};

/**
 * Two separate signals: dots count exercises with logged performance, the ring shows the
 * session's own status. Logging every exercise does not complete the session.
 */
export function CompletionIndicator({ exercises, status }: { exercises: Progress; status: SessionStatus }) {
  const showDots = exercises.total > 0 && exercises.total <= MAX_DOTS;
  return (
    <span className="flex items-center gap-2">
      {exercises.total > 0 &&
        (showDots ? (
          <span aria-hidden="true" className="flex gap-1">
            {Array.from({ length: exercises.total }, (_, i) => (
              <span key={i} className={cn("size-2 rounded-full", i < exercises.done ? "bg-success" : "bg-border-strong")} />
            ))}
          </span>
        ) : (
          <span aria-hidden="true" className="text-caption text-muted">
            {exercises.done}/{exercises.total}
          </span>
        ))}
      <span
        aria-hidden="true"
        className={cn(
          "grid size-6 place-items-center rounded-full border",
          status === "completed" && "border-success bg-success-subtle text-success",
          status === "in_progress" && "border-warning text-warning",
          status === "not_started" && "border-border-strong text-transparent",
        )}
      >
        {status === "completed" ? <Icon name="check" className="size-3.5" /> : status === "in_progress" ? <span className="size-1.5 rounded-full bg-warning" /> : null}
      </span>
      <span className="sr-only">
        {exercises.total > 0 && `${exercises.done} of ${exercises.total} exercises logged. `}
        {statusLabel[status]}.
      </span>
    </span>
  );
}
