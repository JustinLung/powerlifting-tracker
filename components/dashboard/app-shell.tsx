import type { ReactNode } from "react";
import type { DashboardRole } from "@/lib/dashboard/types";
import { Sidebar } from "./sidebar";

/** Sidebar plus scrolling content area. Becomes the `(app)` layout once F-01 provides a session. */
export function AppShell({ role, children }: { role: DashboardRole; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <Sidebar role={role} />
      <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}
