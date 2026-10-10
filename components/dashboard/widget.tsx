import type { ReactNode } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DashboardLink } from "./dashboard-link";

type WidgetProps = {
  id: string;
  title: string;
  description?: string;
  /** Header slot on the right, e.g. a badge or a range selector. */
  actions?: ReactNode;
  /** "View all" style link. Pass `null` href while the page does not exist. */
  viewAll?: { href: string | null; label?: string };
  children: ReactNode;
};

/** Shared card frame for every dashboard widget: titled region, optional "view all" and actions. */
export function Widget({ id, title, description, actions, viewAll, children }: WidgetProps) {
  const headingId = `${id}-heading`;
  return (
    <Card role="region" aria-labelledby={headingId} className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle id={headingId}>{title}</CardTitle>
          {description && <CardDescription className="mt-0.5">{description}</CardDescription>}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {actions}
          {viewAll && (
            <DashboardLink href={viewAll.href} variant="muted" className="text-small">
              {viewAll.label ?? "View all"}
            </DashboardLink>
          )}
        </div>
      </header>
      {children}
    </Card>
  );
}

/** Empty state with a reason and, when there is one, a next step. Required for every widget (dashboards spec). */
export function WidgetEmpty({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border-strong p-6 text-center text-small text-muted">
      <p>{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/** Divided list of `RowLink` rows inside a widget. */
export function WidgetList({ children }: { children: ReactNode }) {
  return <ul className="-my-2 divide-y divide-border">{children}</ul>;
}
