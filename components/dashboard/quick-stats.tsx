import { recentChange } from "@/lib/dashboard/metrics";
import type { AthleteDashboardData, SeriesPoint } from "@/lib/dashboard/types";
import { formatKg, formatRpe } from "@/lib/domain/format";
import { IconTile, type IconName } from "./icons";
import { TrendDelta } from "./trend-delta";
import { Widget, WidgetEmpty } from "./widget";

type Props = {
  stats: AthleteDashboardData["quickStats"];
  bodyweightHistory: SeriesPoint[];
};

/** Athlete stats. Only rows with real data render (dashboards spec: omit, don't fake). */
export function QuickStats({ stats, bodyweightHistory }: Props) {
  const { latest: bodyweight, change: bwChange } = recentChange(bodyweightHistory);

  const rows: { icon: IconName; label: string; value: string; progress?: number; extra?: React.ReactNode }[] = [];
  if (stats.trainingDays) {
    rows.push({
      icon: "calendar",
      label: "Training days (30d)",
      value: `${stats.trainingDays.done} / ${stats.trainingDays.planned}`,
      progress: stats.trainingDays.planned ? stats.trainingDays.done / stats.trainingDays.planned : 0,
    });
  }
  if (stats.averageRpe !== null) {
    rows.push({ icon: "clock", label: "Average RPE", value: formatRpe(stats.averageRpe), progress: stats.averageRpe / 10 });
  }
  if (bodyweight !== null) {
    rows.push({
      icon: "weight",
      label: "Bodyweight",
      value: formatKg(bodyweight),
      extra: bwChange && <TrendDelta change={bwChange} />,
    });
  }

  return (
    <Widget id="quick-stats" title="Quick stats">
      {rows.length === 0 ? (
        <WidgetEmpty message="Stats appear once you’ve logged a few sessions." />
      ) : (
        <dl className="flex flex-col gap-4">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <IconTile name={row.icon} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2 text-small">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="font-semibold">{row.value}</dd>
                </div>
                {row.progress !== undefined && (
                  <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-hover">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, Math.round(row.progress * 100))}%` }} />
                  </div>
                )}
                {row.extra && <div className="mt-1 text-right">{row.extra}</div>}
              </div>
            </div>
          ))}
        </dl>
      )}
    </Widget>
  );
}
