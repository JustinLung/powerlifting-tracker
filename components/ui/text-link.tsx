import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type TextLinkProps = ComponentProps<typeof Link> & {
  /** `inline` is underlined and lives in running text. `standalone` is for nav-style links. */
  variant?: "inline" | "standalone" | "muted";
};

const variants = {
  inline:
    "text-accent underline decoration-accent/40 underline-offset-4 hover:text-accent-hover hover:decoration-accent-hover",
  standalone: "text-foreground hover:text-accent",
  muted: "text-muted hover:text-foreground",
};

export function TextLink({ variant = "inline", className, ...props }: TextLinkProps) {
  return (
    <Link
      className={cn(
        "rounded-sm transition-colors duration-(--motion-fast) ease-standard",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
