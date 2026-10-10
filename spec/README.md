# Specification and documentation

These documents are the source of truth for the Powerlifting Tracker's intended behavior. Code that disagrees with an accepted spec is a defect in one or the other and must be resolved explicitly (see [04_workflows/specification_workflow.md](04_workflows/specification_workflow.md)).

| Folder | Purpose |
| --- | --- |
| [00_meta/](00_meta/) | Vision, scope, glossary, open questions, decision log |
| [01_architecture/](01_architecture/) | System design, data model, auth, video storage, data access, errors |
| [02_coding_standards/](02_coding_standards/) | Conventions for TypeScript, Next.js/React, styling, database, tests, security |
| [03_business_domain/](03_business_domain/) | Domain rules: users, programs, execution, exercises, video review, dashboards |
| [04_workflows/](04_workflows/) | How features move from idea to merged code |
| [05_project_memory/](05_project_memory/) | Current state, implementation status, known issues, next steps |
| [features/](features/) | Feature backlog and per-feature spec/plan/tasks/acceptance criteria |

## Where to start

- **New to the project:** read [00_meta/product_vision.md](00_meta/product_vision.md), then [05_project_memory/current_state.md](05_project_memory/current_state.md).
- **Picking up work:** read [05_project_memory/next_steps.md](05_project_memory/next_steps.md), then [features/README.md](features/README.md).
- **Writing a feature spec:** follow [04_workflows/specification_workflow.md](04_workflows/specification_workflow.md) and copy [features/_template/](features/_template/).

## Status markers

- **[Fact]**: verified in the repository.
- **[Requirement]**: a product requirement given by the project owner.
- **[Proposed]**: a recommended design that has not been accepted yet.
- **[Open]**: an unresolved question, tracked in [00_meta/open_questions.md](00_meta/open_questions.md).

Accepted decisions are recorded in [00_meta/decision_log.md](00_meta/decision_log.md).
