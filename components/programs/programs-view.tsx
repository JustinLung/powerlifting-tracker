"use client";

import { useEffect, useState } from "react";
import { currentWeek, hasOpenSession, lastTime, saveExerciseLog, weekProgress, type DatedSession } from "@/lib/programs/metrics";
import type { ExerciseLog, ProgramBlock, ProgramsViewMode } from "@/lib/programs/types";
import { EmptyState } from "./empty-state";
import { ProgramPanel } from "./program-panel";
import { TrainingDayCard } from "./training-day-card";
import { WeekHeader } from "./week-header";

/**
 * Selection state for the Programs view. `initialBlocks` must be non-empty; the page handles the empty case.
 * Logs are kept in client state only: the preview has no backend, so a reload resets them.
 */
export function ProgramsView({ initialBlocks, canLog }: { initialBlocks: ProgramBlock[]; canLog: boolean }) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [blockId, setBlockId] = useState(() => (initialBlocks.find(hasOpenSession) ?? initialBlocks[0]).id);
  const [mode, setMode] = useState<ProgramsViewMode>("blocks");
  // Per block, the week the user navigated to. Absent means "the current week" (BR-PRG-009).
  const [weekChoice, setWeekChoice] = useState<Record<string, string>>({});
  const [focusSessionId, setFocusSessionId] = useState<string | null>(null);

  const block = blocks.find((b) => b.id === blockId) ?? blocks[0];
  const current = currentWeek(block);
  const week = block.weeks.find((w) => w.id === weekChoice[block.id]) ?? current;
  const weekIndex = week ? block.weeks.indexOf(week) : -1;

  useEffect(() => {
    if (focusSessionId) document.getElementById(`session-${focusSessionId}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusSessionId]);

  function saveLog(exerciseId: string, log: ExerciseLog) {
    setBlocks((prev) => saveExerciseLog(prev, exerciseId, log));
  }

  function goToWeek(index: number) {
    setFocusSessionId(null);
    setWeekChoice((prev) => ({ ...prev, [block.id]: block.weeks[index].id }));
  }

  function selectBlock(id: string) {
    setFocusSessionId(null);
    setBlockId(id);
  }

  function selectSession(target: DatedSession) {
    setBlockId(target.blockId);
    setWeekChoice((prev) => ({ ...prev, [target.blockId]: target.weekId }));
    setFocusSessionId(target.session.id);
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <ProgramPanel
        blocks={blocks}
        selectedBlock={block}
        focusSessionId={focusSessionId}
        mode={mode}
        onModeChange={setMode}
        onSelectBlock={selectBlock}
        onSelectSession={selectSession}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 lg:p-6">
        {week === null ? (
          <EmptyState title="No weeks in this block yet">Weeks appear here once they are added to {block.name}.</EmptyState>
        ) : (
          <>
            <WeekHeader
              weekNumber={week.weekNumber}
              position={weekIndex + 1}
              weekCount={block.weeks.length}
              progress={weekProgress(week)}
              isCurrent={week === current}
              onPrevious={() => goToWeek(weekIndex - 1)}
              onNext={() => goToWeek(weekIndex + 1)}
            />
            {week.sessions.length === 0 ? (
              <EmptyState title="No training days in this week">Add sessions to Week {week.weekNumber} to see them here.</EmptyState>
            ) : (
              // Auto-fill wraps to the next row instead of squeezing cards below a readable width.
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] gap-4">
                {week.sessions.map((session) => (
                  <TrainingDayCard
                    key={session.id}
                    session={session}
                    highlighted={session.id === focusSessionId}
                    canLog={canLog}
                    onSave={saveLog}
                    lastTimeFor={(exerciseId) => lastTime(blocks, exerciseId)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
