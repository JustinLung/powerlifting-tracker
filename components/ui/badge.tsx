import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-hover text-muted",
  accent: "bg-accent-subtle text-accent",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  danger: "bg-danger-subtle text-danger",
};

type BadgeProps = ComponentProps<"span"> & { tone?: BadgeTone };

/** Status pill. Always include a text label: color is never the only signal (ST-006). */
export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-caption font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
