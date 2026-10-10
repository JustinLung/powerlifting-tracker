# F-NN Feature name: tasks

Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md)

Rules: do the tasks in order. Each task leaves lint, typecheck, and build passing. Tests are written in the same task as the code they cover. Tick a task only after its definition of done is verified. Record the commands that were run.

Suggested order: schema/migration → DAL + authorization tests → Server Actions → UI → E2E → docs update.

---

### T-01 · Title

- **Covers:** FR-001, AC-001
- **Depends on:** —
- **Description:** what to change, and where.
- **Definition of done:**
  - [ ] …behavior observable or tested…
  - [ ] Tests: `path/to/test` pass
  - [ ] `npm run lint`, typecheck, and build pass
- **Status:** ☐ todo / ◐ in progress / ☑ done
- **Notes / verification output:**

---

### T-02 · Title

- **Covers:**
- **Depends on:** T-01
- **Description:**
- **Definition of done:**
  - [ ] …
- **Status:** ☐
- **Notes / verification output:**

---

### T-last · Update documentation and project memory

- **Covers:** implementation workflow, Stage 7
- **Definition of done:**
  - [ ] Spec status set to `Implemented`, and the change log updated
  - [ ] `spec/05_project_memory/*` updated
  - [ ] Decisions promoted to the decision log, and open questions resolved
  - [ ] Code review checklist completed
