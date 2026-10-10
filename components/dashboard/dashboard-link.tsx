import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { Icon } from "./icons";

type Props = Omit<ComponentProps<typeof TextLink>, "href"> & {
  /** `null` while the destination route does not exist yet. Renders as disabled text, never a dead link. */
  href: string | null;
};

export function DashboardLink({ href, className, children, ...props }: Props) {
  if (href === null) {
    return (
      <span aria-disabled="true" className={cn("cursor-not-allowed opacity-50", className)}>
        {children}
      </span>
    );
  }
  return (
    <TextLink href={href} className={className} {...props}>
      {children}
    </TextLink>
  );
}

/** Whole-row link that falls back to a plain row when the destination is missing. */
export function RowLink({ href, className, children, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string | null }) {
  if (href === null) {
    return (
      <div aria-disabled="true" className={className}>
        {children}
      </div>
    );
  }
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}

/** Widget list row: a `RowLink` with the shared row styling and a trailing chevron. */
export function ListRow({ href, children }: { href: string | null; children: ReactNode }) {
  return (
    <RowLink
      href={href}
      className="flex items-center gap-3 rounded-md py-3 hover:bg-surface-raised aria-disabled:hover:bg-transparent"
    >
      {children}
      <Icon name="chevron" className="size-4 shrink-0 text-muted" />
    </RowLink>
  );
}
