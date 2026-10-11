import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({
  title,
  children,
  compact = false,
}: {
  title: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-center",
        compact
          ? "px-4 py-6"
          : "rounded-lg border border-dashed border-border-strong px-6 py-12",
      )}
    >
      <p className="text-small font-semibold">{title}</p>
      {children && (
        <p className="mx-auto mt-1 max-w-sm text-small text-muted">
          {children}
        </p>
      )}
    </div>
  );
}
