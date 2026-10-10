# TypeScript standards

## Established in the repository [Fact]

- `strict: true`, `noEmit`, `moduleResolution: "bundler"`, `isolatedModules`, `jsx: "react-jsx"`.
- Import alias: `@/*` maps to the repository root (for example `@/lib/domain/e1rm`).
- Style in the generated code: double quotes, semicolons, 2-space indent. There is no Prettier config. Match this style. [Open] whether to add Prettier (recommended in F-00, configured to match this style).
- Next.js generates global route helper types (`LayoutProps<"/">`, `PageProps<"/route">`). These live in `.next/types` and are produced by `next dev`, `next build`, or `next typegen`.
- ESLint `eslint-config-next/typescript` rules apply. `npm run lint` must pass.

## Rules [Proposed]

- **TS-001.** Do not use `any`. Use `unknown` and narrow it. Leave a comment if `any` is unavoidable at a library boundary.
- **TS-002.** Derive types from a single source:
  - DB row types from the Drizzle schema (`typeof table.$inferSelect`).
  - Input types from Zod schemas (`z.infer<typeof schema>`).
  - DTO types are declared explicitly in the DAL module that returns them.
- **TS-003.** Use string literal unions for statuses (`"in_progress" | "completed" | "skipped"`), mirroring DB enums. Do not use TypeScript `enum`.
- **TS-004.** Use discriminated unions for results (`ActionResult`) and polymorphic UI state.
- **TS-005.** Represent weights as `number` in kilograms in all code. Unit conversion happens only in display formatting (`lib/domain/units.ts`). Postgres `numeric` values are converted to `number` at the DAL boundary.
- **TS-006.** Dates: `Date` objects stay on the server. DTOs send ISO strings. "Today" for an athlete is computed in the athlete's `Profile.timezone`.
- **TS-007.** Prefer `type` over `interface` unless declaration merging is needed.
- **TS-008.** Exported functions in `lib/` have explicit return types.
- **TS-009.** Do not use non-null assertions (`!`) on data from the database or user input.

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Files | kebab-case | `set-logger.tsx`, `programs.ts` |
| React components | PascalCase | `SetLogger` |
| Functions, variables | camelCase | `logPerformedSet` |
| DB tables / columns | snake_case | `performed_set.weight_kg` |
| Server Actions | verb + `Action` suffix | `logSetAction` |
| Zod schemas | camelCase + `Schema` | `logSetSchema` |
| DTO types | PascalCase + `DTO` | `SessionLoggingDTO` |
| Domain IDs in docs | prefix + number | `BR-LOG-003`, `FR-001` |
