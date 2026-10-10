# Known issues

Verified problems and risks in the repository. Each entry is removed when it is resolved, with a note in the PR or feature change log.

| ID | Issue | Type | Impact | Suggested fix |
| --- | --- | --- | --- | --- |
| KI-001 | The directory is not a git repository | Process | No history, branches, or review. Changes cannot be reverted | `git init` + initial commit (F-00 task 1) |
| KI-002 | `tsc --noEmit` fails until `next typegen` runs (`LayoutProps` is not found) | Tooling | Confusing type-check results in CI or a fresh checkout | Add a `typecheck` script: `next typegen && tsc --noEmit` (F-00) |
| KI-004 | Root metadata is `"Create Next App"` | Polish | Wrong browser title | Set the app name in F-01 or when the app shell is built |
| KI-005 | No database, auth, storage, or tests | Missing infrastructure | No feature can be implemented yet | F-00 / F-01 |
| KI-006 | `experimental.agentFeedback` makes `next dev` write a managed block into `AGENTS.md` when an AI agent is detected | Tooling note | Unexpected file changes during development | Commit `AGENTS.md`, or disable the flag if unwanted |
| KI-007 | The `.gitignore` template ignores `next-env.d.ts` | Note | None (it is generated). Listed so it is not mistaken for a missing file | — |

## Risks (not yet problems)

| ID | Risk | Mitigation |
| --- | --- | --- |
| RK-001 | Cache Components plus auth-heavy pages may require careful Suspense placement and could slow early feature work | Follow the patterns in [application_architecture.md](../01_architecture/application_architecture.md#rendering-strategy). Use a documented `instant = false` opt-out where needed |
| RK-002 | HEVC iPhone videos may not play in all browsers | Fallback UI. Revisit transcoding ([Q-009](../00_meta/open_questions.md#q-009-video-transcoding)) |
| RK-003 | Large uploads on poor gym connections | Direct-to-storage upload with retry. Resumable uploads later |
| RK-004 | Auth library compatibility with Next 16 Cache Components is unverified | Verify during the Q-004 decision with a spike |
