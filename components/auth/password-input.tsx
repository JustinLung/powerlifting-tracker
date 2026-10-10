"use client";

import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/cn";

/** Password `Input` with a show/hide toggle. Takes the same props as `Input`. */
export function PasswordInput({ className, ...props }: Omit<ComponentProps<typeof Input>, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-20", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex min-w-16 items-center justify-center rounded-md px-3 text-small font-semibold text-muted transition-colors duration-(--motion-fast) ease-standard hover:text-foreground"
      >
        {visible ? "Hide" : "Show"}
        <span className="sr-only"> password</span>
      </button>
    </div>
  );
}
