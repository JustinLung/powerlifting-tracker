import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type DisclosureProps = Omit<ComponentProps<"details">, "title"> & {
  title: ReactNode;
  /** Muted text shown beside the title. */
  meta?: ReactNode;
};

/** Expandable section on the native <details> element: keyboard and screen-reader support for free. */
export function Disclosure({ title, meta, className, children, ...props }: DisclosureProps) {
  return (
    <details className={cn("group", className)} {...props}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-sm marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-warning">{title}</span>
        {meta && <span className="min-w-0 flex-1 truncate text-small text-muted">{meta}</span>}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="ml-auto size-4 shrink-0 text-muted transition-transform duration-(--motion-base) ease-standard group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 8 5 5 5-5" />
        </svg>
      </summary>
      <div className="pt-1">{children}</div>
    </details>
  );
}
