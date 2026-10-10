# Implementation workflow

Covers stages 5–7: **Implement → Verify → Update**. Prerequisite: the feature's spec is `Approved` and `tasks.md` exists (full track), or a lightweight spec exists ([specification_workflow.md](specification_workflow.md)).

## Before starting

1. Read the feature's `spec.md`, `plan.md`, and `tasks.md`.
2. Read [05_project_memory/current_state.md](../05_project_memory/current_state.md) and [known_issues.md](../05_project_memory/known_issues.md).
3. Make sure you are on a feature branch. [Fact] The project is currently **not a git repository**. Initializing git is task 1 of F-00.
4. Set the spec status to `In progress`.

## Stage 5: Implement

- Work through the tasks **in order**, one at a time. Mark each task done in `tasks.md` only after its definition of done is verified.
- Follow [02_coding_standards/](../02_coding_standards/). Match the surrounding code.
- Write tests in the same task as the code they cover. Do not defer them to a final "add tests" task.
- Do not implement anything that is not in the spec. If you notice a useful improvement, add it to the spec's unresolved questions or to the backlog instead.
- **Conflicts and gaps.** If the code reveals that the spec is wrong, ambiguous, or incomplete:
  1. Stop work on the affected tasks.
  2. Record the issue in the spec under *Unresolved questions* (and in [known_issues.md](../05_project_memory/known_issues.md) if it is a broader issue).
  3. Propose a resolution to the project owner, update the spec once it is agreed, then continue.
  Unaffected tasks may continue.
- New dependency: state the reason in `plan.md` (or the decision log for architecture-level choices) before installing it.

## Stage 6: Verify

Run the checks described in [testing_workflow.md](testing_workflow.md). Report the actual results. Do not claim a check passed unless you ran it.

Minimum for any change:

```bash
npm run lint
npx next typegen && npx tsc --noEmit    # or `npm run typecheck` once added
npm run build
```

Plus the relevant tests once they exist (`npm test`, `npm run test:e2e`).

Then walk through [acceptance_criteria.md](../features/_template/acceptance_criteria.md) for the feature and record how each AC was verified.

## Stage 7: Update

In the same change set:

- Set the spec status to `Implemented` and add a change log entry for any deviations agreed during implementation.
- Update [implementation_status.md](../05_project_memory/implementation_status.md) (the feature row).
- Update [current_state.md](../05_project_memory/current_state.md) if the architecture or capabilities changed.
- Update [known_issues.md](../05_project_memory/known_issues.md) and [next_steps.md](../05_project_memory/next_steps.md).
- Promote any decisions made to the [decision log](../00_meta/decision_log.md), and resolve the related open questions.
- Self-review against the [code review checklist](code_review_checklist.md).
