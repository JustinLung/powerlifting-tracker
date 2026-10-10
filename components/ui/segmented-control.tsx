"use client";

import { cn } from "@/lib/cn";

type Option<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  /** Accessible name for the group, e.g. "Time range". */
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/**
 * Compact single-choice switch (time range, metric). Buttons with `aria-pressed`
 * rather than tabs: it filters one view, it does not swap panels. Controlled.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex gap-0.5 rounded-md bg-surface-raised p-0.5", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-7 rounded-sm px-3 text-caption font-semibold transition-colors duration-(--motion-fast) ease-standard",
              active ? "bg-surface-hover text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
