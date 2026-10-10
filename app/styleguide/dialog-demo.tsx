"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription } from "@/components/ui/dialog";
import { Disclosure } from "@/components/ui/disclosure";
import { Field, Input, Textarea } from "@/components/ui/field";

type SetRow = { load: string; reps: string; rpe: string };

const lastTime: SetRow[] = [
  { load: "125", reps: "8", rpe: "6" },
  { load: "120", reps: "8", rpe: "5.5" },
  { load: "120", reps: "8", rpe: "6" },
];

/** Interactive examples of Dialog. The logging sheet is composed only from design-system parts. */
export function DialogDemo() {
  const [logging, setLogging] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sets, setSets] = useState<SetRow[]>(lastTime);

  const update = (i: number, key: keyof SetRow, value: string) =>
    setSets((rows) => rows.map((row, j) => (j === i ? { ...row, [key]: value } : row)));

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4 sm:p-6">
      <Button onClick={() => setLogging(true)}>Open log sheet</Button>
      <Button variant="secondary" onClick={() => setConfirming(true)}>Open confirmation</Button>

      <Dialog
        open={logging}
        onClose={() => setLogging(false)}
        title="Lowbar Squat"
        meta={
          <>
            <span className="italic">3×8 @ 6.5 RPE</span>
            <Badge tone="success">E1RM 186.6 kg</Badge>
            <span className="tabular-nums">~127.5</span>
          </>
        }
        footer={
          <>
            <Button size="lg" onClick={() => setLogging(false)}>Save exercise</Button>
            <Button variant="danger" size="lg" onClick={() => setLogging(false)}>Skip exercise</Button>
          </>
        }
      >
        <Disclosure title="Last time" meta="Post Japan · Week 2">
          <ul className="divide-y divide-border text-small tabular-nums text-muted">
            {lastTime.map((s, i) => (
              <li key={i} className="flex min-h-9 items-center gap-4">
                <span className="w-4">{i + 1}</span>
                <span className="flex-1">{s.load} kg × {s.reps}</span>
                <span>RPE {s.rpe}</span>
              </li>
            ))}
          </ul>
        </Disclosure>

        <div role="group" aria-label="Sets" className="space-y-2">
          <div className="grid grid-cols-[1.25rem_1fr_1fr_1fr] gap-2 text-center text-small font-semibold text-muted">
            <span />
            <span>Load (kg)</span>
            <span>Reps</span>
            <span>RPE</span>
          </div>
          {sets.map((set, i) => (
            <div key={i} className="grid grid-cols-[1.25rem_1fr_1fr_1fr] items-center gap-2">
              <span className="text-small text-muted tabular-nums">{i + 1}</span>
              {(["load", "reps", "rpe"] as const).map((key) => (
                <Input
                  key={key}
                  inputMode="decimal"
                  aria-label={`Set ${i + 1} ${key}`}
                  value={set[key]}
                  onChange={(e) => update(i, key, e.target.value)}
                  className="px-2 text-center tabular-nums"
                />
              ))}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSets((rows) => [...rows, { ...rows[rows.length - 1] }])}
          >
            + Add set
          </Button>
        </div>

        <Field label="Notes" htmlFor="sg-dialog-notes">
          <Textarea id="sg-dialog-notes" placeholder="How did it feel?" defaultValue="Depth felt a bit higher than last week." />
        </Field>
      </Dialog>

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Discard this session?"
        footer={
          <>
            <Button variant="danger" onClick={() => setConfirming(false)}>Discard session</Button>
            <Button variant="secondary" onClick={() => setConfirming(false)}>Keep logging</Button>
          </>
        }
      >
        <DialogDescription>
          Sets you logged in this session will be lost. This can&apos;t be undone.
        </DialogDescription>
      </Dialog>
    </div>
  );
}
