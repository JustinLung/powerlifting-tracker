"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { bestPoint, compareOverWindow, lastWeeks, latestValue } from "@/lib/dashboard/metrics";
import type { SeriesPoint } from "@/lib/dashboard/types";
import { formatKg, formatShortDate } from "@/lib/domain/format";
import { TrendDelta } from "./trend-delta";
import { Widget, WidgetEmpty } from "./widget";

const ranges = [
  { value: "4", label: "4W", weeks: 4, phrase: "last 4 weeks", ago: "4 weeks ago" },
  { value: "8", label: "8W", weeks: 8, phrase: "last 8 weeks", ago: "8 weeks ago" },
  { value: "12", label: "12W", weeks: 12, phrase: "last 12 weeks", ago: "12 weeks ago" },
  { value: "52", label: "1Y", weeks: 52, phrase: "last year", ago: "a year ago" },
] as const;

type RangeValue = (typeof ranges)[number]["value"];

export function TotalChart({ history }: { history: SeriesPoint[] }) {
  const [range, setRange] = useState<RangeValue>("12");
  const active = ranges.find((r) => r.value === range) ?? ranges[2];
  const data = lastWeeks(history, active.weeks);
  const latest = latestValue(history);
  const best = bestPoint(data);
  const change = compareOverWindow(data);

  return (
    <Widget
      id="total-chart"
      title="Total (kg)"
      description="Estimated 1RM: squat + bench + deadlift"
      actions={
        <SegmentedControl
          label="Time range"
          options={ranges.map(({ value, label }) => ({ value, label }))}
          value={range}
          onChange={setRange}
        />
      }
    >
      {latest === null || data.length < 2 ? (
        <WidgetEmpty message="Log sets for all three lifts to see your total over time." />
      ) : (
        <>
          <div role="img" aria-label={`Total estimated 1RM over the ${active.phrase}, from ${formatKg(data[0].value)} to ${formatKg(latest)}.`} className="h-48">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 360, height: 192 }}>
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <defs>
                  <linearGradient id="total-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatShortDate}
                  tick={{ fill: "var(--subtle)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  minTickGap={32}
                />
                <YAxis
                  domain={["dataMin - 10", "dataMax + 10"]}
                  tickFormatter={(v: number) => String(Math.round(v))}
                  tick={{ fill: "var(--subtle)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                />
                <Tooltip
                  cursor={{ stroke: "var(--border-strong)" }}
                  contentStyle={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--foreground)",
                    fontSize: 12,
                  }}
                  labelFormatter={(label) => formatShortDate(String(label))}
                  formatter={(value) => [formatKg(Number(value)), "Total"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--success)"
                  strokeWidth={2}
                  fill="url(#total-fill)"
                  dot={{ r: 2.5, fill: "var(--surface)", stroke: "var(--success)", strokeWidth: 1.5 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <dt className="text-small text-muted">Latest total</dt>
              <dd className="text-title font-semibold">{formatKg(latest)}</dd>
              {change && (
                <dd>
                  <TrendDelta change={change} />
                  <span className="ml-1 text-caption text-subtle">vs. {active.ago}</span>
                </dd>
              )}
            </div>
            <div className="border-l border-border pl-4">
              <dt className="text-small text-muted">Best in period</dt>
              <dd className="text-title font-semibold">{best ? formatKg(best.value) : "—"}</dd>
              {best && <dd className="text-caption text-subtle">{formatShortDate(best.date)}</dd>}
            </div>
          </dl>
        </>
      )}
    </Widget>
  );
}
