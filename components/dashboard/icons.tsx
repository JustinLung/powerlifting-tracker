import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const calendar = "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4";

const paths = {
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  program: calendar,
  athletes: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3 2.7-5 6-5s6 2 6 5M16 5.5a3 3 0 010 5.5M18 15c2 .6 3 2.3 3 5",
  videos: "M12 21a9 9 0 100-18 9 9 0 000 18zM10 8.5v7l6-3.5z",
  feedback: "M4 5h16v11H9l-5 4z",
  analytics: "M5 20V10M12 20V4M19 20v-7",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-1-3-2 .5-1.5-1.5.5-2-3-1-1 2h-2l-1-2-3 1 .5 2L6 8.500 4 8l-1 3 2 1v1l-2 1 1 3 2-.5L7.500 18l-.5 2 3 1 1-2h2l1 2 3-1-.5-2 1.500-1.500 2 .5 1-3-2-1z",
  calendar,
  chevron: "M9 6l6 6-6 6",
  play: "M8 5v14l11-7z",
  check: "M5 12l5 5 9-10",
  bar: "M4 12h3M17 12h3M7 8v8M17 8v8M7 12h10",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  weight: "M6 9h12l2 11H4zM9 9a3 3 0 116 0",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
} as const;

export type IconName = keyof typeof paths;

/** Stroke icon that inherits `currentColor`. Decorative: pair with visible text or an aria-label on the parent. */
export function Icon({ name, className, ...props }: { name: IconName } & ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "size-5"}
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}

/** Icon on a raised square tile, as used beside metric and list rows. */
export function IconTile({ name, size = "sm" }: { name: IconName; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-md bg-surface-raised text-muted",
        size === "sm" ? "size-9" : "size-10",
      )}
    >
      <Icon name={name} className={size === "sm" ? "size-4" : undefined} />
    </span>
  );
}
