import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox, Field, Input, Select, Switch, Textarea } from "@/components/ui/field";
import { TextLink } from "@/components/ui/text-link";
import { DialogDemo } from "./dialog-demo";
import { SegmentedControlDemo } from "./segmented-control-demo";
import { readTokens } from "./tokens";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false },
};

const nav = [
  ["Foundations", [["colors", "Colors"], ["typography", "Typography"], ["spacing", "Spacing"], ["radius", "Radius"], ["elevation", "Elevation"], ["motion", "Motion"]]],
  ["Components", [["buttons", "Buttons"], ["links", "Links"], ["badges", "Badges"], ["forms", "Form controls"], ["cards", "Cards"], ["alerts", "Alerts"], ["dialog", "Dialog"], ["segmented", "Segmented control"]]],
  ["Patterns", [["example", "Example: prescribed set"]]],
] as const;

const colorGroups: { title: string; note?: string; tokens: [token: string, use: string][] }[] = [
  {
    title: "Surfaces",
    note: "Elevation is expressed by lightness, not shadow.",
    tokens: [
      ["background", "Page background"],
      ["surface", "Cards, inputs"],
      ["surface-raised", "Nested or floating content"],
      ["surface-hover", "Hover on ghost and secondary"],
    ],
  },
  {
    title: "Text",
    tokens: [
      ["foreground", "Primary text"],
      ["muted", "Secondary text"],
      ["subtle", "Placeholders, captions"],
    ],
  },
  {
    title: "Lines",
    tokens: [
      ["border", "Dividers, card outlines"],
      ["border-strong", "Emphasized outlines"],
      ["border-input", "Form control borders (3:1)"],
    ],
  },
  {
    title: "Brand",
    note: "Primary is the source palette inverted for dark mode. Accent is used sparingly.",
    tokens: [
      ["primary", "Primary button"],
      ["on-primary", "Text on primary"],
      ["accent", "Links, info"],
      ["on-accent", "Text on accent"],
    ],
  },
  {
    title: "Status",
    tokens: [
      ["success", "Completed, as prescribed"],
      ["warning", "Deviation, needs attention"],
      ["danger", "Errors, destructive"],
      ["on-danger", "Text on danger"],
    ],
  },
];

const textStyles = [
  ["text-display font-normal", "Display", "32 / 1.25 · 400", "Squat day"],
  ["text-title font-semibold", "Title", "24 / 1.33 · 600", "Week 4, Session 2"],
  ["text-subtitle font-semibold", "Subtitle", "18 / 1.44 · 600", "Competition squat"],
  ["text-body", "Body", "16 / 1.5 · 400", "Pause at the bottom for one second, then drive."],
  ["text-small", "Small", "14 / 1.43 · 400", "Last logged 3 days ago"],
  ["text-caption", "Caption", "12 / 1.33 · 400", "RPE 8 · 4 sets"],
] as const;

const spacing = [4, 8, 12, 16, 24, 32, 48];
const radii = [
  ["rounded-sm", "sm", "6px", "Chips, small controls"],
  ["rounded-md", "md", "12px", "Buttons, inputs"],
  ["rounded-lg", "lg", "16px", "Cards, panels"],
  ["rounded-full", "pill", "9999px", "Badges"],
] as const;

export default async function StyleguidePage() {
  const tokens = await readTokens();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:flex lg:gap-12 lg:py-12">
      <nav aria-label="Styleguide" className="mb-10 lg:sticky lg:top-12 lg:mb-0 lg:h-fit lg:w-52 lg:shrink-0">
        <p className="text-small font-semibold">Design system</p>
        <p className="mb-4 text-caption text-muted">Dark mode · warm minimalism</p>
        <div className="flex flex-col gap-4">
          {nav.map(([group, items]) => (
            <div key={group}>
              <p className="mb-1 text-caption font-semibold tracking-wide text-subtle uppercase">{group}</p>
              <ul className="flex flex-wrap gap-x-4 lg:flex-col">
                {items.map(([id, label]) => (
                  <li key={id}>
                    <TextLink href={`#${id}`} variant="muted" className="inline-block py-1 text-small">
                      {label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <main className="min-w-0 flex-1 space-y-16">
        <header>
          <h1 className="text-display">Styleguide</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Tokens and components for the powerlifting tracker. Adapted from the Perplexity design
            spec: warm neutrals, restrained color, flat surfaces. The source defines light mode only,
            so the dark palette here is derived, not measured.
          </p>
        </header>

        {/* ───────────── Foundations ───────────── */}
        <Section id="colors" title="Colors" description="Use semantic tokens through Tailwind (bg-surface, text-muted). Never hard-code hex values.">
          <div className="space-y-8">
            {colorGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-subtitle font-semibold">{group.title}</h3>
                {group.note && <p className="mb-3 text-small text-muted">{group.note}</p>}
                <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {group.tokens.map(([name, use]) => (
                    <li key={name} className="overflow-hidden rounded-md border border-border bg-surface">
                      <div className="h-14 border-b border-border" style={{ background: `var(--${name})` }} />
                      <div className="p-3">
                        <p className="font-mono text-small">{name}</p>
                        <p className="font-mono text-caption text-muted">{tokens[name]}</p>
                        <p className="mt-1 text-caption text-muted">{use}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="text-subtitle font-semibold">Tints</h3>
              <p className="mb-3 text-small text-muted">Translucent fills for badges and alerts, paired with the matching solid color for text.</p>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {(["accent", "success", "warning", "danger"] as const).map((t) => (
                  <li key={t} className="rounded-md border border-border p-3" style={{ background: `var(--${t}-subtle)` }}>
                    <p className="font-mono text-small" style={{ color: `var(--${t})` }}>{t}-subtle</p>
                    <p className="font-mono text-caption text-muted">{tokens[`${t}-subtle`]}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="typography" title="Typography" description="Geist Sans stands in for the proprietary pplxSans. Two weights only: 400 and 600. Use tabular-nums for weights, reps, and RPE.">
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {textStyles.map(([cls, name, spec, sample]) => (
              <div key={name} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-6">
                <div className="sm:w-40 sm:shrink-0">
                  <p className="text-small font-semibold">{name}</p>
                  <p className="font-mono text-caption text-muted">{spec}</p>
                </div>
                <p className={cls}>{sample}</p>
              </div>
            ))}
            <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-6">
              <div className="sm:w-40 sm:shrink-0">
                <p className="text-small font-semibold">Numeric</p>
                <p className="font-mono text-caption text-muted">tabular-nums</p>
              </div>
              <p className="text-title font-semibold tabular-nums">142.5 kg × 3 @ 8.5</p>
            </div>
          </div>
          <p className="mt-3 text-small text-muted">
            The source uses 24px for every style and separates levels by weight alone. That suits a
            search page, not dense set tables, so this scale adds smaller steps and keeps the
            source&apos;s 24px / 600 as Title.
          </p>
        </Section>

        <Section id="spacing" title="Spacing" description="4px base unit. The source scale stops at 16; 24 to 48 are added for page layout.">
          <ul className="space-y-2">
            {spacing.map((px) => (
              <li key={px} className="flex items-center gap-4">
                <span className="w-24 font-mono text-small text-muted">
                  {px}px · {px / 4}
                </span>
                <span className="h-4 rounded-sm bg-accent" style={{ width: px }} />
              </li>
            ))}
          </ul>
        </Section>

        <Section id="radius" title="Radius">
          <ul className="grid gap-4 sm:grid-cols-4">
            {radii.map(([cls, name, px, use]) => (
              <li key={name}>
                <div className={`h-20 border border-border-strong bg-surface-raised ${cls}`} />
                <p className="mt-2 font-mono text-small">{cls}</p>
                <p className="text-caption text-muted">{px} · {use}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="elevation" title="Elevation" description="Shadows are almost invisible on dark backgrounds, so depth comes from surface lightness plus a hairline border.">
          <ul className="grid gap-4 sm:grid-cols-3">
            <li className="rounded-lg border border-border bg-background p-4"><p className="font-mono text-small">background</p><p className="text-caption text-muted">Level 0</p></li>
            <li className="rounded-lg border border-border bg-surface p-4 shadow-card"><p className="font-mono text-small">surface + shadow-card</p><p className="text-caption text-muted">Level 1</p></li>
            <li className="rounded-lg border border-border bg-surface-raised p-4 shadow-elevated"><p className="font-mono text-small">surface-raised + shadow-elevated</p><p className="text-caption text-muted">Level 2: menus, dialogs</p></li>
          </ul>
        </Section>

        <Section id="motion" title="Motion" description="Fast for feedback, base for transitions, slow only for deliberate moments. All collapse to 0 under prefers-reduced-motion.">
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              ["--motion-fast", "Hover, focus, press"],
              ["--motion-base", "Toggles, panels"],
              ["--motion-slow", "Onboarding, rare emphasis"],
            ].map(([name, use]) => (
              <li key={name} className="rounded-lg border border-border bg-surface p-4">
                <p className="font-mono text-small">{name.slice(2)}</p>
                <p className="font-mono text-caption text-muted">{tokens[name.slice(2)]}</p>
                <p className="mt-1 text-caption text-muted">{use}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-small text-muted">easing: cubic-bezier(0.4, 0, 0.2, 1) → ease-standard</p>
        </Section>

        {/* ───────────── Components ───────────── */}
        <Section id="buttons" title="Buttons" description="Use Button for actions and ButtonLink for navigation. md and lg meet the 44px touch target; sm is for dense desktop UI only.">
          <Specimen label="Variants">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </Specimen>
          <Specimen label="Sizes">
            <Button size="sm">Small · 32</Button>
            <Button size="md">Medium · 44</Button>
            <Button size="lg">Large · 48</Button>
            <Button size="icon" variant="secondary" aria-label="Add set">
              <PlusIcon />
            </Button>
          </Specimen>
          <Specimen label="States">
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>Disabled</Button>
            <Button loading>Saving</Button>
            <ButtonLink href="#buttons" variant="secondary">As a link</ButtonLink>
          </Specimen>
        </Section>

        <Section id="links" title="Links">
          <Specimen label="Inline, standalone, muted" column>
            <p className="max-w-xl">
              Your coach left feedback on <TextLink href="#links">Tuesday&apos;s squat session</TextLink>.
              Reply there or <TextLink href="#links">view the full history</TextLink>.
            </p>
            <div className="flex flex-wrap gap-6">
              <TextLink href="#links" variant="standalone" className="font-semibold">Standalone link</TextLink>
              <TextLink href="#links" variant="muted">Muted link</TextLink>
            </div>
          </Specimen>
        </Section>

        <Section id="badges" title="Badges" description="Always carry a text label. Color supports the meaning but never carries it alone.">
          <Specimen label="Tones">
            <Badge>Draft</Badge>
            <Badge tone="accent">Awaiting review</Badge>
            <Badge tone="success">As prescribed</Badge>
            <Badge tone="warning">Above prescription</Badge>
            <Badge tone="danger">Skipped</Badge>
          </Specimen>
        </Section>

        <Section id="forms" title="Form controls" description="Every control has a visible label. Hints and errors are linked with aria-describedby.">
          <div className="grid gap-6 rounded-lg border border-border bg-surface p-4 sm:p-6 md:grid-cols-2">
            <Field label="Exercise" htmlFor="sg-exercise" hint="Search the library or add your own.">
              <Input id="sg-exercise" placeholder="Competition squat" aria-describedby="sg-exercise-description" />
            </Field>
            <Field label="Weight (kg)" htmlFor="sg-weight" error="Enter a weight between 0 and 600.">
              <Input id="sg-weight" inputMode="decimal" defaultValue="-5" aria-invalid="true" aria-describedby="sg-weight-description" className="tabular-nums" />
            </Field>
            <Field label="Lift" htmlFor="sg-lift">
              <Select id="sg-lift" defaultValue="squat">
                <option value="squat">Squat</option>
                <option value="bench">Bench press</option>
                <option value="deadlift">Deadlift</option>
              </Select>
            </Field>
            <Field label="Disabled" htmlFor="sg-disabled">
              <Input id="sg-disabled" disabled defaultValue="Locked after logging" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Notes" htmlFor="sg-notes">
                <Textarea id="sg-notes" placeholder="How did it feel?" />
              </Field>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <Checkbox label="Log as prescribed" defaultChecked />
              <Checkbox label="Add a video note" />
              <Switch label="Notify me about feedback" defaultChecked />
            </div>
          </div>
        </Section>

        <Section id="cards" title="Cards">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardTitle>Week 4 · Session 2</CardTitle>
              <CardDescription>Squat, bench, accessories</CardDescription>
              <div className="mt-4 flex gap-2">
                <Badge tone="accent">Today</Badge>
                <Badge>5 exercises</Badge>
              </div>
            </Card>
            <Card tone="raised">
              <CardTitle>Raised card</CardTitle>
              <CardDescription>One step up. Use inside a card or over the page.</CardDescription>
              <div className="mt-4"><Button size="sm" variant="secondary">Open</Button></div>
            </Card>
          </div>
        </Section>

        <Section id="alerts" title="Alerts">
          <div className="space-y-3">
            <Alert tone="info" title="Heads up">Your coach changed next week&apos;s program.</Alert>
            <Alert tone="success">Session saved.</Alert>
            <Alert tone="warning" title="Above prescription">Set 3 was 5 kg over the prescribed weight.</Alert>
            <Alert tone="danger">Upload failed. Check your connection and try again.</Alert>
          </div>
        </Section>

        <Section id="dialog" title="Dialog" description="A bottom sheet on phones, a centered modal from sm up. Native <dialog>: focus is trapped, Escape and backdrop click close it, and focus returns to the trigger. Disclosure is the expandable 'Last time' section.">
          <DialogDemo />
        </Section>

        <Section id="segmented" title="Segmented control" description="A compact single-choice filter (time range, metric). Buttons with aria-pressed, not tabs: it changes one view rather than swapping panels.">
          <SegmentedControlDemo />
        </Section>

        {/* ───────────── Patterns ───────────── */}
        <Section id="example" title="Example: prescribed set" description="Built only from the primitives above. Shows how the tokens compose in a real screen; not a production component.">
          <Card className="max-w-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Competition squat</CardTitle>
                <CardDescription>Pause 1s · 4 sets</CardDescription>
              </div>
              <Badge tone="warning">Above prescription</Badge>
            </div>
            <ul className="mt-4 divide-y divide-border tabular-nums">
              {[
                ["1", "140 kg × 3", "RPE 7", "success"],
                ["2", "145 kg × 3", "RPE 8", "success"],
                ["3", "150 kg × 3", "RPE 9", "warning"],
              ].map(([n, load, rpe, tone]) => (
                <li key={n} className="flex min-h-11 items-center gap-3">
                  <span className="w-5 text-small text-muted">{n}</span>
                  <span className="flex-1 font-semibold">{load}</span>
                  <Badge tone={tone as "success" | "warning"}>{rpe}</Badge>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1">Log set 4</Button>
              <Button variant="secondary" size="icon" aria-label="Attach video"><PlusIcon /></Button>
            </div>
          </Card>
        </Section>

        <Alert tone="info" title="Usage rule">
          New UI uses these tokens and primitives. If something is missing, add it to
          components/ui and to this page in the same change.
        </Alert>
      </main>
    </div>
  );
}

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-title font-semibold">{title}</h2>
      {description && <p className="mt-1 mb-6 max-w-2xl text-muted">{description}</p>}
      {!description && <div className="mb-6" />}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Specimen({ label, children, column }: { label: string; children: ReactNode; column?: boolean }) {
  return (
    <div>
      <p className="mb-2 text-caption font-semibold tracking-wide text-subtle uppercase">{label}</p>
      <div className={`rounded-lg border border-border bg-surface p-4 sm:p-6 ${column ? "space-y-4" : "flex flex-wrap items-center gap-3"}`}>
        {children}
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}
