import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import type { SessionExercise, TodaySession } from "@/lib/dashboard/types";
import { formatKg, formatRpe, formatRpeRange, formatSetsReps } from "@/lib/domain/format";
import { DashboardLink, RowLink } from "./dashboard-link";
import { Icon } from "./icons";
import { Widget, WidgetEmpty } from "./widget";

const statusLabel = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
} as const;

export function TodaySessionWidget({ session }: { session: TodaySession | null }) {
  if (!session) {
    return (
      <Widget id="today-session" title="Today’s session">
        <WidgetEmpty message="No session scheduled today. Rest up, or check what’s coming next." />
      </Widget>
    );
  }

  const cta = session.status === "in_progress" ? "Continue session" : session.status === "completed" ? "View session" : "Start session";

  return (
    <Widget
      id="today-session"
      title="Today’s session"
      description={`${session.blockName} · Week ${session.weekNumber} · Day ${session.dayNumber} — ${session.title}`}
      actions={
        <div className="flex items-center gap-2">
          <Badge tone={session.status === "completed" ? "success" : session.status === "in_progress" ? "accent" : "neutral"}>
            {statusLabel[session.status]}
          </Badge>
          {session.rpeRange && <Badge tone="success">RPE {formatRpeRange(session.rpeRange.min, session.rpeRange.max)}</Badge>}
        </div>
      }
    >
      <p className="-mt-2 text-small text-muted">Focus: {session.focus}</p>

      {session.exercises.length === 0 ? (
        <WidgetEmpty message="This session has no exercises yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] text-left text-small">
            <caption className="sr-only">Prescribed exercises for today’s session</caption>
            <thead>
              <tr className="border-b border-border text-caption text-subtle">
                <th scope="col" className="py-2 pr-3 font-normal">Exercise</th>
                <th scope="col" className="px-3 py-2 font-normal">Sets × reps</th>
                <th scope="col" className="px-3 py-2 font-normal">RPE</th>
                <th scope="col" className="px-3 py-2 font-normal">Weight</th>
                <th scope="col" className="w-8 py-2 pl-3 font-normal"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody>
              {session.exercises.map((exercise) => (
                <ExerciseRow key={exercise.id} exercise={exercise} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        {session.href === null ? (
          <Button disabled className="w-full sm:w-auto">{cta}</Button>
        ) : (
          <ButtonLink href={session.href} className="w-full sm:w-auto">{cta}</ButtonLink>
        )}
      </div>
    </Widget>
  );
}

function ExerciseRow({ exercise }: { exercise: SessionExercise }) {
  const { prescribed, logged } = exercise;
  return (
    <tr className="border-b border-border last:border-b-0">
      <th scope="row" className="py-3 pr-3 font-normal">
        <span className="flex items-center gap-3">
          <Icon name="bar" className="size-5 shrink-0 text-muted" />
          <span>
            <DashboardLink href={exercise.href} variant="standalone" className="font-semibold">
              {exercise.name}
            </DashboardLink>
            {/* Actual performance sits beside the prescription; it never replaces it (ADR-004). */}
            {logged && (
              <span className="block text-caption text-success">
                Logged: {formatSetsReps(logged.sets, logged.reps)}
                {logged.rpe !== null && ` @ RPE ${formatRpe(logged.rpe)}`}, {formatKg(logged.weightKg)}
              </span>
            )}
          </span>
        </span>
      </th>
      <td className="px-3 py-3">{formatSetsReps(prescribed.sets, prescribed.reps)}</td>
      <td className="px-3 py-3">{formatRpe(prescribed.rpe)}</td>
      <td className="px-3 py-3">{prescribed.weightKg === null ? "—" : formatKg(prescribed.weightKg)}</td>
      <td className="py-3 pl-3 text-muted">
        <RowLink href={exercise.href} aria-label={`Open ${exercise.name}`} className="grid size-6 place-items-center rounded-sm hover:text-foreground">
          <Icon name="chevron" className="size-4" />
        </RowLink>
      </td>
    </tr>
  );
}
