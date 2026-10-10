import type { SeriesPoint } from "./types";

export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Points within the last `weeks` weeks, measured back from the newest point. */
export function lastWeeks(series: SeriesPoint[], weeks: number): SeriesPoint[] {
  if (series.length === 0) return [];
  const end = new Date(series[series.length - 1].date).getTime();
  return series.filter((p) => new Date(p.date).getTime() >= end - weeks * WEEK_MS);
}

export type Trend = "up" | "down" | "flat";

export type Comparison = { delta: number; trend: Trend };

/** Latest value minus the oldest value in the window. Null when the window has fewer than two points. */
export function compareOverWindow(window: SeriesPoint[]): Comparison | null {
  if (window.length < 2) return null;
  const delta = window[window.length - 1].value - window[0].value;
  return { delta, trend: delta > 0 ? "up" : delta < 0 ? "down" : "flat" };
}

export function latestValue(series: SeriesPoint[]): number | null {
  return series.length ? series[series.length - 1].value : null;
}

/** Window behind every "latest value + recent change" figure on the dashboards. */
export const RECENT_WEEKS = 4;
export const RECENT_PERIOD_LABEL = `vs. last ${RECENT_WEEKS} weeks`;

export function recentChange(series: SeriesPoint[]): { latest: number | null; change: Comparison | null } {
  return { latest: latestValue(series), change: compareOverWindow(lastWeeks(series, RECENT_WEEKS)) };
}

export function bestPoint(series: SeriesPoint[]): SeriesPoint | null {
  return series.reduce<SeriesPoint | null>((best, p) => (best && best.value >= p.value ? best : p), null);
}

/** Sum of per-lift series, aligned by date. Dates missing from any lift are dropped. */
export function sumSeries(all: SeriesPoint[][]): SeriesPoint[] {
  if (all.length === 0) return [];
  const byDate = all.map((s) => new Map(s.map((p) => [p.date, p.value])));
  return all[0]
    .filter((p) => byDate.every((m) => m.has(p.date)))
    .map((p) => ({ date: p.date, value: byDate.reduce((sum, m) => sum + m.get(p.date)!, 0) }));
}
