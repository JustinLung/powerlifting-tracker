"use client"

import { useId, useState } from "react"
import { Icon } from "@/components/dashboard/icons"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { cn } from "@/lib/cn"
import { formatShortDate, formatWeekday } from "@/lib/domain/format"
import {
  blockProgress,
  datedSessions,
  undatedSessionCount,
  type DatedSession,
} from "@/lib/programs/metrics"
import type {
  ProgramBlock,
  ProgramsViewMode,
  SessionStatus,
} from "@/lib/programs/types"
import { EmptyState } from "./empty-state"

const modes: { value: ProgramsViewMode; label: string }[] = [
  { value: "blocks", label: "Blocks" },
  { value: "by_date", label: "By date" },
]

const weeksLabel = (n: number) =>
  n === 0 ? "No weeks yet" : `${n} ${n === 1 ? "week" : "weeks"}`

const statusText: Record<SessionStatus, string> = {
  completed: "Completed",
  in_progress: "In progress",
  not_started: "Not started",
}

type ProgramPanelProps = {
  blocks: ProgramBlock[]
  selectedBlock: ProgramBlock
  focusSessionId: string | null
  mode: ProgramsViewMode
  onModeChange: (mode: ProgramsViewMode) => void
  onSelectBlock: (blockId: string) => void
  onSelectSession: (target: DatedSession) => void
}

const itemBase =
  "block w-full rounded-md px-3 py-2 text-left transition-colors duration-(--motion-fast) ease-standard"

export function ProgramPanel({
  blocks,
  selectedBlock,
  focusSessionId,
  mode,
  onModeChange,
  onSelectBlock,
  onSelectSession,
}: ProgramPanelProps) {
  const [open, setOpen] = useState(true)
  const bodyId = useId()

  return (
    <aside
      aria-label="Program navigation"
      className="flex flex-col border-b border-border bg-surface lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0"
    >
      <div className="p-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 w-full items-center gap-3 rounded-md border border-border bg-surface-raised px-3 text-left hover:bg-surface-hover"
        >
          <Icon name="program" className="size-4 shrink-0 text-muted" />
          <span className="min-w-0 flex-1 truncate text-small font-semibold">
            {selectedBlock.name}{" "}
            <span className="font-normal text-muted">
              ({weeksLabel(selectedBlock.weeks.length)})
            </span>
          </span>
          <Icon
            name="chevron"
            className={cn(
              "size-4 shrink-0 text-muted transition-transform duration-(--motion-base) ease-standard",
              open ? "-rotate-90" : "rotate-90",
            )}
          />
        </button>
      </div>

      <div id={bodyId} hidden={!open} className="flex min-h-0 flex-1 flex-col">
        <div className="px-3 pb-3">
          <SegmentedControl
            label="Program view"
            options={modes}
            value={mode}
            onChange={onModeChange}
            className="flex w-full [&>button]:flex-1"
          />
        </div>
        {/* Capped on small screens so a long list never pushes the schedule off-screen. */}
        <div className="max-h-72 min-h-0 flex-1 overflow-y-auto px-3 pb-3 lg:max-h-none">
          {mode === "blocks" ? (
            <BlockList
              blocks={blocks}
              selectedId={selectedBlock.id}
              onSelect={onSelectBlock}
            />
          ) : (
            <DateList
              blocks={blocks}
              focusSessionId={focusSessionId}
              onSelect={onSelectSession}
            />
          )}
        </div>
      </div>
      {/* Keeps the footer at the bottom even while the body is collapsed. */}
      {!open && <div className="flex-1" />}

      <div className="hidden border-t border-border p-3 lg:block">
        {/* No block overview route exists yet: disabled rather than a dead link. */}
        <span
          aria-disabled="true"
          className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-md px-3 text-small font-semibold text-muted opacity-50"
        >
          <Icon name="bar" className="size-4" />
          Block overview
        </span>
      </div>
    </aside>
  )
}

function BlockList({
  blocks,
  selectedId,
  onSelect,
}: {
  blocks: ProgramBlock[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <ul className="flex flex-col gap-1">
      {blocks.map((block) => {
        const selected = block.id === selectedId
        const { done, total } = blockProgress(block)
        return (
          <li key={block.id}>
            <button
              type="button"
              aria-current={selected ? "true" : undefined}
              onClick={() => onSelect(block.id)}
              className={cn(
                itemBase,
                selected ? "bg-accent-subtle" : "hover:bg-surface-hover",
              )}
            >
              <span
                className={cn(
                  "block text-small font-semibold",
                  selected && "text-accent",
                )}
              >
                {block.name}
              </span>
              <span className="block text-caption text-muted">
                {weeksLabel(block.weeks.length)}
                {total > 0 && ` · ${done}/${total} sessions`}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function DateList({
  blocks,
  focusSessionId,
  onSelect,
}: {
  blocks: ProgramBlock[]
  focusSessionId: string | null
  onSelect: (t: DatedSession) => void
}) {
  const dated = datedSessions(blocks)
  const undated = undatedSessionCount(blocks)

  if (dated.length === 0) {
    return (
      <EmptyState compact title="No scheduled sessions">
        None of the sessions have a date yet. Switch to Blocks to browse by
        week.
      </EmptyState>
    )
  }
  return (
    <>
      <ul className="flex flex-col gap-1">
        {dated.map((item) => {
          const selected = item.session.id === focusSessionId
          return (
            <li key={item.session.id}>
              <button
                type="button"
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelect(item)}
                className={cn(
                  itemBase,
                  selected ? "bg-accent-subtle" : "hover:bg-surface-hover",
                )}
              >
                <span
                  className={cn(
                    "block text-small font-semibold",
                    selected && "text-accent",
                  )}
                >
                  {formatWeekday(item.session.scheduledDate!)}{" "}
                  {formatShortDate(item.session.scheduledDate!)} ·{" "}
                  {item.session.title}
                </span>
                <span className="block text-caption text-muted">
                  {item.blockName} · Week {item.weekNumber} ·{" "}
                  {statusText[item.session.status]}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {undated > 0 && (
        <p className="mt-3 px-3 text-caption text-subtle">
          {undated} undated {undated === 1 ? "session is" : "sessions are"} not
          listed here.
        </p>
      )}
    </>
  )
}
