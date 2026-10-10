import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div"> & {
  /** `raised` sits one step above the surface, for nested or floating content. */
  tone?: "surface" | "raised";
};

export function Card({ tone = "surface", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4 shadow-card",
        tone === "surface" ? "bg-surface" : "bg-surface-raised",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("text-subtitle font-semibold", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-small text-muted", className)} {...props} />;
}
