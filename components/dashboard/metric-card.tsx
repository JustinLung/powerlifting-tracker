import { Card } from "@/components/ui/card";
import { RECENT_PERIOD_LABEL, type Comparison } from "@/lib/dashboard/metrics";
import { IconTile, type IconName } from "./icons";
import { TrendDelta } from "./trend-delta";

type Props = {
  label: string;
  /** Pre-formatted value, or null when there is no data yet. */
  value: string | null;
  caption: string;
  icon: IconName;
  /** Change over the recent window (`RECENT_WEEKS`). */
  change?: Comparison | null;
};

export function MetricCard({ label, value, caption, icon, change }: Props) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <IconTile name={icon} size="md" />
        <div className="min-w-0">
          <p className="text-small text-muted">{label}</p>
          <p className="text-title font-semibold whitespace-nowrap">{value ?? "—"}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <p className="text-caption text-subtle">{value === null ? "No data yet" : caption}</p>
        {change && (
          <p className="text-right">
            <TrendDelta change={change} />
            <span className="ml-1 text-caption text-subtle">{RECENT_PERIOD_LABEL}</span>
          </p>
        )}
      </div>
    </Card>
  );
}
