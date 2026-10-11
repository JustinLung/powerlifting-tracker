import { Icon } from "@/components/dashboard/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Progress } from "@/lib/programs/metrics";

type WeekHeaderProps = {
  weekNumber: number;
  /** 1-based position among the block's weeks. */
  position: number;
  weekCount: number;
  progress: Progress;
  isCurrent: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function WeekHeader({ weekNumber, position, weekCount, progress, isCurrent, onPrevious, onNext }: WeekHeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <h2 className="text-title font-semibold">Week {weekNumber}</h2>
      {/* No sessions means no meaningful ratio, so no progress badge. */}
      {progress.total > 0 && (
        <Badge tone={progress.done === progress.total ? "success" : "neutral"}>
          {progress.done === progress.total && <Icon name="check" className="size-3.5" />}
          {progress.done}/{progress.total}
          <span className="sr-only"> sessions completed</span>
        </Badge>
      )}
      {isCurrent && <Badge tone="accent">Current week</Badge>}
      <nav aria-label="Week navigation" className="ml-auto flex items-center gap-1">
        <span className="mr-2 text-small text-muted" aria-live="polite">
          {position} of {weekCount}
        </span>
        <Button variant="secondary" size="icon" aria-label="Previous week" disabled={position <= 1} onClick={onPrevious}>
          <Icon name="chevron" className="size-5 rotate-180" />
        </Button>
        <Button variant="secondary" size="icon" aria-label="Next week" disabled={position >= weekCount} onClick={onNext}>
          <Icon name="chevron" className="size-5" />
        </Button>
      </nav>
    </header>
  );
}
