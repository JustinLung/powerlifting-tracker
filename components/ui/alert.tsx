import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type AlertTone = "info" | "success" | "warning" | "danger";

const tones: Record<AlertTone, { box: string; label: string; icon: string }> = {
  info: { box: "bg-accent-subtle border-accent/30", label: "Info", icon: "i" },
  success: { box: "bg-success-subtle border-success/30", label: "Success", icon: "✓" },
  warning: { box: "bg-warning-subtle border-warning/30", label: "Warning", icon: "!" },
  danger: { box: "bg-danger-subtle border-danger/30", label: "Error", icon: "×" },
};

const iconColor: Record<AlertTone, string> = {
  info: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

type AlertProps = ComponentProps<"div"> & { tone?: AlertTone; title?: string };

export function Alert({ tone = "info", title, className, children, ...props }: AlertProps) {
  const t = tones[tone];
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-md border p-4", t.box, className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-current text-caption font-semibold", iconColor[tone])}
      >
        {t.icon}
      </span>
      <div className="min-w-0 text-small">
        {/* The visible label keeps the tone readable without color. */}
        <p className="font-semibold">{title ?? t.label}</p>
        {children && <div className="mt-1 text-muted">{children}</div>}
      </div>
    </div>
  );
}
