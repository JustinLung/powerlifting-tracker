import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap " +
  "transition-colors duration-(--motion-fast) ease-standard " +
  "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary:
    "border border-border-strong bg-surface-raised text-foreground hover:bg-surface-hover",
  ghost: "text-foreground hover:bg-surface-hover",
  danger: "bg-danger text-on-danger hover:bg-danger-hover",
};

// md and lg meet the 44px touch-target minimum (ST-005). sm is for dense desktop UI only.
const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-small",
  md: "h-11 px-4 text-body",
  lg: "h-12 px-6 text-body",
  icon: "size-11",
};

type StyleOptions = { variant?: ButtonVariant; size?: ButtonSize; className?: string };

/** Class string for anything that should look like a button (links, triggers). */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: StyleOptions = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> &
  StyleOptions & { loading?: boolean };

export function Button({
  variant,
  size,
  className,
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleOptions;

/** A navigation link styled as a button. Use for navigation, `Button` for actions. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 animate-spin motion-reduce:animate-none"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
