import { useId } from "react";
import type { SeriesPoint } from "@/lib/dashboard/types";

const W = 100;
const H = 40;
const PAD = 2;

/**
 * Axis-less trend line for compact cards. Decorative: the value and delta are rendered as text beside it.
 * Plain SVG rather than a chart library: it has no axes, tooltip or interaction to justify one.
 */
export function Sparkline({ data }: { data: SeriesPoint[] }) {
  const gradient = useId();
  const values = data.map((p) => p.value);
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const points = values.map((v, i) => [
    (i / Math.max(1, values.length - 1)) * W,
    PAD + (1 - (v - min) / range) * (H - 2 * PAD),
  ]);
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-14 w-full">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--success)" stopOpacity={0.3} />
          <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${line} ${W},${H}`} fill={`url(#${gradient})`} />
      <polyline
        points={line}
        fill="none"
        stroke="var(--success)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
