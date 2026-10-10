"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { DashboardRole } from "@/lib/dashboard/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Icon } from "./icons";
import { navItems } from "./nav-config";

const itemBase =
  "flex h-11 items-center gap-3 rounded-md px-3 text-small font-semibold whitespace-nowrap transition-colors duration-(--motion-fast) ease-standard";

function Logo() {
  return (
    <span className="flex items-center gap-3">
      <span aria-hidden="true" className="grid size-8 place-items-center rounded-md bg-primary text-small font-semibold text-on-primary">
        PL
      </span>
      <span className="text-subtitle font-semibold">PowerLift</span>
    </span>
  );
}

/** Fixed rail from `lg`. Below it, a top bar with a toggle that opens the same nav as an off-canvas drawer. */
export function Sidebar({ role }: { role: DashboardRole }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const items = navItems.filter((item) => item.roles.includes(role));

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-4 py-2 lg:hidden">
        <Logo />
        <Button
          ref={toggleRef}
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="primary-sidebar"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" />
        </Button>
      </div>

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-(--motion-base) ease-standard lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* `invisible` while closed keeps the off-screen drawer out of the tab order and the accessibility tree. */}
      <aside
        id="primary-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-(--motion-base) ease-standard",
          open ? "visible translate-x-0" : "invisible -translate-x-full",
          "lg:visible lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-60 lg:shrink-0 lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 lg:px-6 lg:py-6">
          <Logo />
          <Button
            ref={closeRef}
            variant="ghost"
            size="icon"
            aria-label="Close navigation"
            onClick={() => {
              setOpen(false);
              toggleRef.current?.focus();
            }}
            className="text-muted hover:text-foreground lg:hidden"
          >
            <Icon name="close" />
          </Button>
        </div>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = item.href !== null && pathname === item.href;
              return (
                <li key={item.label}>
                  {item.href === null ? (
                    <span aria-disabled="true" className={cn(itemBase, "cursor-not-allowed text-muted opacity-50")}>
                      <Icon name={item.icon} />
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(itemBase, active ? "bg-surface-hover text-foreground" : "text-muted hover:bg-surface-hover hover:text-foreground")}
                    >
                      <Icon name={item.icon} />
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="px-6 py-6 text-small text-subtle">
          Better data.
          <br />
          Better lifts.
        </p>
      </aside>
    </>
  );
}
