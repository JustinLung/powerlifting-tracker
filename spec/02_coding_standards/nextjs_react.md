# Next.js and React standards

These standards target Next.js 16.4 and React 19.3 [Fact]. Version-accurate reference docs are in `node_modules/next/dist/docs/`. Check them before relying on remembered APIs. Architecture context is in [application_architecture.md](../01_architecture/application_architecture.md).

## Established in the repository [Fact]

- App Router only (`app/`). No Pages Router.
- `cacheComponents: true` and `partialPrefetching: true`.
- `next/font/google` for fonts and `next/image` for images (from the scaffold).
- The root layout uses the global `LayoutProps<"/">` type.
- `experimental.agentFeedback: true`. When `next dev` detects an AI coding agent, Next.js creates or updates a managed block in `AGENTS.md`. Commit that file rather than deleting the block.

## Server and client components

- **NX-001.** Components are Server Components by default. Add `"use client"` only to leaf components that need state, effects, browser APIs, or event handlers.
- **NX-002.** Client components receive serializable props only (no class instances, functions other than Server Actions, or `Date` objects).
- **NX-003.** `params` and `searchParams` are Promises. `await` them inside a Suspense-wrapped component, not at the top level of a layout.
- **NX-004.** Read the session or call the DAL **inside `<Suspense>`** (required by Cache Components). Every data-dependent region has a skeleton fallback.
- **NX-005.** Do not add `"use cache"` to functions that return athlete-specific data without an accepted decision ([application_architecture.md](../01_architecture/application_architecture.md#rendering-strategy)).
- **NX-006.** Use `proxy.ts` (Next 16), not `middleware.ts`. Use it only for optimistic auth redirects.
- **NX-007.** Use `export const instant = false` only as a documented, temporary opt-out, with a comment linking to the issue.

## Data fetching and mutations

- **NX-010.** Reads happen in Server Components through the DAL. Do not use client-side fetching of app data except for polling upload status.
- **NX-011.** Mutations use Server Actions ([api_and_data_access.md](../01_architecture/api_and_data_access.md#server-actions-appactionsts)). Do not create API routes for your own UI.
- **NX-012.** After a mutation, revalidate the affected route(s). Do not rely on a full page reload.

## Forms and user input

- **NX-020.** Forms use `<form action={serverAction}>` with React 19 `useActionState` to show the result and `useFormStatus` for the pending state on submit buttons.
- **NX-021.** Validate on the client for fast feedback (with the same Zod schema), but the server result is authoritative.
- **NX-022.** Inputs for numeric training data use `inputMode="decimal"` (weight, RPE) or `inputMode="numeric"` (reps) for mobile keyboards.
- **NX-023.** Set logging uses `useOptimistic` so a logged set appears immediately and rolls back on failure (ERR-007).
- **NX-024.** Destructive actions (delete a program, end a relationship, delete a video) require confirmation.

## UI states

Every data view must define and implement all of these states. Feature specs list them under "User interface states":

| State | Requirement |
| --- | --- |
| Loading | A Suspense skeleton that matches the final layout (avoids layout shift) |
| Empty | An explanation plus the primary next action (for example "No program yet. Create one") |
| Error | `error.tsx` boundary with retry. Inline errors for actions |
| Success | A visible confirmation for mutations that change state the user cannot otherwise see |
| Partial / locked | For example, a session that is locked for editing shows why |

## Hooks

- **NX-030.** Custom hooks live next to the component that owns them, or in `components/<domain>/use-*.ts` when shared. Prefix them with `use`.
- **NX-031.** Do not fetch data in `useEffect` (see NX-010). Use `useEffect` only to synchronize with external systems (video element, local storage draft).

## File conventions

- Route-private components can live in a `_components/` folder inside the route segment.
- `actions.ts` is colocated with the route that owns the mutations. Shared actions go in `app/(app)/_actions/`.
- `loading.tsx` is acceptable for whole-route skeletons. Prefer granular `<Suspense>`.
