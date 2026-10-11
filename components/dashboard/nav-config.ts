import type { DashboardRole } from "@/lib/dashboard/types";
import type { IconName } from "./icons";

export type NavItem = {
  label: string;
  icon: IconName;
  /** `null` until the route exists. Rendered as disabled, never as a link to a 404. */
  href: string | null;
  /** Roles that see the item. Assumption until F-01 defines the permission matrix: only coaches have an athletes list. */
  roles: DashboardRole[];
};

const both: DashboardRole[] = ["athlete", "coach"];

export const navItems: NavItem[] = [
  { label: "Home", icon: "home", href: "/dashboard-preview", roles: both },
  { label: "Program", icon: "program", href: "/programs-preview", roles: both },
  { label: "Athletes", icon: "athletes", href: null, roles: ["coach"] },
  { label: "Videos", icon: "videos", href: null, roles: both },
  { label: "Feedback", icon: "feedback", href: null, roles: both },
  { label: "Analytics", icon: "analytics", href: null, roles: both },
  { label: "Settings", icon: "settings", href: null, roles: both },
];
