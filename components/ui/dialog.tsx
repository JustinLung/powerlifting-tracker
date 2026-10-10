"use client";

import { useEffect, useId, useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

type DialogProps = {
  open: boolean;
  /** Called on close button, backdrop click, and Escape. Set `open` to false in response. */
  onClose: () => void;
  title: string;
  /** Secondary line under the title, e.g. prescription and badges. */
  meta?: ReactNode;
  children: ReactNode;
  /** Pinned below the scrolling body, e.g. the primary actions. */
  footer?: ReactNode;
  className?: string;
};

/**
 * Modal dialog. A bottom sheet below the `sm` breakpoint, centered above it.
 * Built on the native <dialog> element: it traps focus, makes the page inert,
 * closes on Escape, and restores focus to the trigger.
 */
export function Dialog({ open, onClose, title, meta, children, footer, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click that lands on the <dialog> itself (not its content) is a backdrop click.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "m-0 mt-auto max-h-[90dvh] w-full max-w-none flex-col overflow-hidden rounded-t-lg border border-border bg-surface-raised p-0 text-foreground shadow-elevated open:flex",
        "sm:m-auto sm:max-w-lg sm:rounded-lg",
        // Enter and exit motion. transition-discrete lets display/overlay animate so close is smooth too.
        "translate-y-full opacity-0 open:translate-y-0 open:opacity-100 starting:open:translate-y-full starting:open:opacity-0",
        "transition-[translate,opacity,display,overlay] transition-discrete duration-(--motion-base) ease-standard",
        "backdrop:bg-black/0 backdrop:transition-[background-color,display,overlay] backdrop:transition-discrete backdrop:duration-(--motion-base) open:backdrop:bg-black/60 starting:open:backdrop:bg-black/0",
        className,
      )}
    >
      <div aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border-strong sm:hidden" />
      <header className="flex items-start gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-subtitle font-semibold">
            {title}
          </h2>
          {meta && <div className="mt-1 flex flex-wrap items-center gap-2 text-small text-muted">{meta}</div>}
        </div>
        <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose} className="-mt-1 -mr-2">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </Button>
      </header>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto border-t border-border px-4 py-4">{children}</div>
      {footer && <footer className="flex flex-col gap-2 border-t border-border px-4 py-4">{footer}</footer>}
    </dialog>
  );
}

export function DialogDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-body text-muted", className)} {...props} />;
}
