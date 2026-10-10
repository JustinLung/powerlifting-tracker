import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-md border border-border-input bg-surface px-3 text-body text-foreground " +
  "placeholder:text-subtle transition-colors duration-(--motion-fast) ease-standard " +
  "hover:border-foreground/60 focus-visible:border-foreground " +
  "disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-danger";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-24 py-2.5", className)} {...props} />;
}

/** Native select with a custom chevron. Keeps OS pickers on mobile. */
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(control, "h-11 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 8 5 5 5-5" />
      </svg>
    </div>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

/**
 * Label + control + hint/error. Give the control id={htmlFor},
 * and aria-describedby={`${htmlFor}-description`} when a hint or error is shown.
 */
export function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-small font-semibold">
        {label}
      </label>
      {children}
      {(error || hint) && (
        <p
          id={`${htmlFor}-description`}
          className={cn("text-small", error ? "text-danger" : "text-muted")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

type ToggleProps = Omit<ComponentProps<"input">, "type"> & { label: string };

const toggleLabel = "inline-flex min-h-11 cursor-pointer items-center gap-3 text-body has-disabled:cursor-not-allowed has-disabled:opacity-40";

export function Checkbox({ label, className, ...props }: ToggleProps) {
  return (
    <label className={cn(toggleLabel, className)}>
      <input
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <span
        aria-hidden="true"
        className={
          "grid size-5 shrink-0 place-items-center rounded-sm border border-border-input bg-surface text-transparent " +
          "transition-colors duration-(--motion-fast) ease-standard " +
          "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-on-primary " +
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground"
        }
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3.5 8.5 3 3 6-7" />
        </svg>
      </span>
      {label}
    </label>
  );
}

export function Switch({ label, className, ...props }: ToggleProps) {
  return (
    <label className={cn(toggleLabel, className)}>
      <input type="checkbox" role="switch" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className={
          "relative h-6 w-11 shrink-0 rounded-full border border-border-input bg-surface-raised " +
          "transition-colors duration-(--motion-base) ease-standard " +
          "after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-muted " +
          "after:transition-transform after:duration-(--motion-base) after:ease-standard " +
          "peer-checked:border-primary peer-checked:bg-primary peer-checked:after:translate-x-5 peer-checked:after:bg-on-primary " +
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground"
        }
      />
      {label}
    </label>
  );
}
