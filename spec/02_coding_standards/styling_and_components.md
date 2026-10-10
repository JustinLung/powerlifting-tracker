# Styling and components

## Established in the repository [Fact]

- Tailwind CSS v4, loaded through `@import "tailwindcss"` in `app/globals.css`. It is compiled by the `@tailwindcss/turbopack` loader configured in `next.config.ts` (no `postcss.config`, no `tailwind.config`).
- Design tokens are CSS variables in `:root`, exposed to Tailwind with `@theme inline` (`--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`).
- The app is **dark-only** ([ADR-013](../00_meta/decision_log.md)). `:root` sets `color-scheme: dark`; there is no light theme and no `prefers-color-scheme` branching.
- Semantic tokens (surfaces, text, lines, primary, accent, status, motion) are defined in `:root` and mapped through `@theme inline`. Type scale (`text-display` to `text-caption`), radius (`sm` 6, `md` 12, `lg` 16), and shadows are in `@theme`.
- The rendered reference is the **`/styleguide`** route. It reads token values from `globals.css`, so it cannot drift from them.
- Primitives exist in `components/ui/`: `Button`/`ButtonLink`, `TextLink`, `Badge`, `Card`, `Alert`, `Input`/`Textarea`/`Select`/`Field`, `Checkbox`, `Switch`, `Dialog` (native `<dialog>`: bottom sheet on phones, centered from `sm`; client component), `Disclosure` (native `<details>`). Class merging uses `lib/cn.ts`.
- Fonts: Geist Sans and Geist Mono through CSS variables on `<html>`.
- No component library is installed.

## Rules [Proposed]

- **ST-001.** Use Tailwind utility classes in JSX. Do not add CSS Modules or CSS-in-JS. `globals.css` holds only tokens and base styles.
- **ST-002.** Define semantic color tokens in `globals.css` (`--color-surface`, `--color-muted`, `--color-accent`, `--color-danger`, `--color-success`) and use them through Tailwind (`bg-surface`). Avoid hard-coded hex values and ad-hoc palette colors in components. The existing scaffold page is exempt until it is replaced.
- **ST-003.** The app is dark-only. Do not add `dark:` variants or a theme toggle. A future light theme would redefine the tokens only.
- **ST-004.** Design mobile-first. The athlete logging flow is designed for a 360–430 px viewport first. The coach program editor is designed for desktop first but must remain usable on a tablet.
- **ST-005.** Touch targets are at least 44×44 px in athlete flows.
- **ST-006.** Accessibility: every input has a label, icon buttons have `aria-label`, focus styles stay visible, and color is never the only signal (for example, deviation badges also use text or icons).

## Component library

Decided in ADR-013: hand-built primitives in `components/ui/`, no component-library dependency. `Dialog` uses the native `<dialog>` element, which supplies the focus trap, Escape handling, inert background, and focus restore. Still missing, to be added when a feature needs them (and to `/styleguide` in the same change): dropdown menu, tabs, toast, tooltip. Popover-style components are where shadcn/Radix would earn its dependency; revisit then.

Rule: new UI composes these primitives and the tokens. If something is missing, add it to `components/ui/` and to `/styleguide` in the same change.

## Component organization

- `components/ui/`: generic, domain-free primitives.
- `components/<domain>/`: domain components (`program-editor/`, `set-logger/`, `video/`, `feedback/`, `dashboard/`).
- Number formatting for weights, RPE, and percentages goes through shared helpers in `lib/domain/format.ts`, so that units and decimal places are consistent everywhere.
