import type { ReactNode } from "react";
import type { DashboardRole } from "@/lib/dashboard/types";
import { cn } from "@/lib/cn";
import { Sidebar } from "./sidebar";

/** Sidebar plus scrolling content area. Becomes the `(app)` layout once F-01 provides a session. */
export function AppShell({
  role,
  flush = false,
  children,
}: {
  role: DashboardRole;
  /** Drops the content padding for views that bring their own full-height panels. */
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <Sidebar role={role} />
      <main className={cn("min-w-0 flex-1", !flush && "px-4 py-6 lg:px-8")}>{children}</main>
    </div>
  );
}
