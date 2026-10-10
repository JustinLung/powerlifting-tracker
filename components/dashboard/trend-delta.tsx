import type { Comparison, Trend } from "@/lib/dashboard/metrics";
import { formatKgDelta } from "@/lib/domain/format";
import { cn } from "@/lib/cn";

const styles: Record<Trend, { color: string; arrow: string; label: string }> = {
  up: { color: "text-success", arrow: "▲", label: "Up" },
  down: { color: "text-danger", arrow: "▼", label: "Down" },
  flat: { color: "text-muted", arrow: "–", label: "Unchanged" },
};

/** Change indicator. Arrow glyph, sign and an sr-only word carry the meaning; color is secondary (ST-006). */
export function TrendDelta({ change }: { change: Comparison }) {
  const s = styles[change.trend];
  return (
    <span className={cn("inline-flex items-center gap-1 text-caption font-semibold", s.color)}>
      <span aria-hidden="true">{s.arrow}</span>
      <span className="sr-only">{s.label}: </span>
      {formatKgDelta(change.delta)}
    </span>
  );
}
