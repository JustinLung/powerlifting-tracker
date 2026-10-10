# Instructions for Claude Code sessions

This repository is developed spec-first. All documentation lives in [spec/](spec/README.md). Before changing code:

1. Read [spec/05_project_memory/current_state.md](spec/05_project_memory/current_state.md) and [spec/05_project_memory/next_steps.md](spec/05_project_memory/next_steps.md).
2. Find the feature in [spec/features/README.md](spec/features/README.md). If it has no spec, follow [spec/04_workflows/specification_workflow.md](spec/04_workflows/specification_workflow.md) before you implement anything.
3. Implement only approved tasks, following [spec/04_workflows/implementation_workflow.md](spec/04_workflows/implementation_workflow.md) and the standards in [spec/02_coding_standards/](spec/02_coding_standards/).
4. When you finish, update [spec/05_project_memory/](spec/05_project_memory/) so it reflects what was actually built.

Rules:

- Do not treat **[Proposed]** decisions as accepted. Check [spec/00_meta/decision_log.md](spec/00_meta/decision_log.md).
- Do not add dependencies without recording the reason in the feature plan or the decision log.
- Every server-side read or write of athlete data goes through the authorization rules in [spec/01_architecture/authentication_and_authorization.md](spec/01_architecture/authentication_and_authorization.md).
- This project uses Next.js 16.4 with `cacheComponents` enabled. Version-accurate docs ship in `node_modules/next/dist/docs/`. Prefer them over memory.
- Never copy environment variable values into docs or code.
