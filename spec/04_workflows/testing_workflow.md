# Testing workflow

Standards for writing tests are in [testing.md](../02_coding_standards/testing.md). This document defines **when** to run which checks.

## Currently available [Fact]

| Check | Command | Status on 2026-10-09 |
| --- | --- | --- |
| Lint | `npm run lint` | Passes |
| Type check | `npx next typegen && npx tsc --noEmit` | Passes. Running `tsc --noEmit` alone fails (`Cannot find name 'LayoutProps'`) until route types are generated |
| Build | `npm run build` | Not run during documentation setup |
| Unit / integration / E2E | none | Not installed |

## Target matrix [Proposed, after F-00]

| When | Lint | Typecheck | Unit | Integration (DB) | E2E | Build |
| --- | --- | --- | --- | --- | --- | --- |
| During a task (iterating) | — | editor | affected files (`vitest <path>`) | affected DAL module | — | — |
| Task done | ✅ | ✅ | ✅ all | ✅ affected | — | — |
| Feature done | ✅ | ✅ | ✅ | ✅ all | ✅ affected journeys | ✅ |
| CI on PR | ✅ | ✅ | ✅ | ✅ | ✅ smoke | ✅ |

## Traceability

- Each AC in `acceptance_criteria.md` records its verification: a test path and name, or `manual` with steps and a reason.
- Authorization ACs are always automated (TST-002).

## Manual verification

Manual checks are acceptable for visual layout and for real-device video upload and playback (especially iOS Safari with HEVC). Record the device, browser, and outcome in the feature's `acceptance_criteria.md`.

## Reporting

When reporting the results of a task or feature, list each command that was run and its outcome. Paste the failing output if a check failed. Name any checks that were skipped and the reason.
