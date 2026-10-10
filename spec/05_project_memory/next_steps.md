# Next steps

Ordered list of the next actions. Keep it short and current.

1. **Owner decisions (blocking).** Answer or accept defaults for [Q-001](../00_meta/open_questions.md#q-001-database-and-hosting) (database), [Q-002](../00_meta/open_questions.md#q-002-orm--query-layer) (ORM), [Q-004](../00_meta/open_questions.md#q-004-authentication-provider) (auth), [Q-006](../00_meta/open_questions.md#q-006-hosting-platform) (hosting), and [Q-007](../00_meta/open_questions.md#q-007-testing-tools) (testing). Record the outcomes in the [decision log](../00_meta/decision_log.md).
2. **Spec F-00: Platform foundation** (full track): git init, DB connection plus migrations, the `server-only` and `zod` dependencies, Vitest and Playwright setup, the `typecheck`/`test` scripts, `.env.example`, a DAL skeleton with the DB import restriction, and a CI workflow if hosting is decided.
3. **Spec F-01: Authentication and roles** (full track), including onboarding role selection ([Q-019](../00_meta/open_questions.md#q-019-role-selection-and-coach-verification)) and the `(app)` shell layout using the Cache Components session pattern.
4. Implement F-00, then F-01, following [implementation_workflow.md](../04_workflows/implementation_workflow.md).
5. Spec F-02 and F-03 (they can be specified in parallel). Then specify F-04 after answering Q-008, Q-013, and Q-018.

Do not start implementing anything until the corresponding spec is `Approved`.
