"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { recentChange } from "@/lib/dashboard/metrics";
import type { LiftMetric, SeriesPoint } from "@/lib/dashboard/types";
import { formatKg } from "@/lib/domain/format";
import { Sparkline } from "./sparkline";
import { TrendDelta } from "./trend-delta";
import { Widget, WidgetEmpty } from "./widget";

type Metric = "e1rm" | "volume" | "bodyweight";

const metrics: { value: Metric; label: string }[] = [
  { value: "e1rm", label: "1RM" },
  { value: "volume", label: "Volume" },
  { value: "bodyweight", label: "Bodyweight" },
];

type Row = { key: string; label: string; series: SeriesPoint[] };

export function AthleteProgress({
  lifts,
  bodyweightHistory,
  analyticsHref,
}: {
  /** Already trimmed to the sparkline window by the caller. */
  lifts: LiftMetric[];
  bodyweightHistory: SeriesPoint[];
  analyticsHref: string | null;
}) {
  const [metric, setMetric] = useState<Metric>("e1rm");

  const rows: Row[] =
    metric === "bodyweight"
      ? [{ key: "bodyweight", label: "Bodyweight", series: bodyweightHistory }]
      : lifts.map((l) => ({
          key: l.lift,
          label: l.label,
          series: metric === "e1rm" ? l.e1rmHistory : l.volumeHistory,
        }));
  const hasData = rows.some((r) => r.series.length > 0);

  return (
    <Widget
      id="athlete-progress"
      title="Athlete progress"
      viewAll={{ href: analyticsHref }}
      actions={<SegmentedControl label="Progress metric" options={metrics} value={metric} onChange={setMetric} />}
    >
      {!hasData ? (
        <WidgetEmpty message="Nothing logged yet for this metric." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-3">
          {rows.map((row) => {
            const { latest, change } = recentChange(row.series);
            return (
              <li key={row.key} className="min-w-0 sm:border-l sm:border-border sm:pl-4 sm:first:border-l-0 sm:first:pl-0">
                <p className="text-small text-muted">{row.label}</p>
                <p className="text-subtitle font-semibold">{latest === null ? "—" : formatKg(latest)}</p>
                {change && <TrendDelta change={change} />}
                {row.series.length > 1 && <Sparkline data={row.series} />}
              </li>
            );
          })}
        </ul>
      )}
    </Widget>
  );
}
