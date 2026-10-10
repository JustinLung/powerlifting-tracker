# Error handling

[Fact] The scaffold has no `error.tsx`, `not-found.tsx`, or `global-error.tsx`. [Proposed] The design below.

## Error categories

| Category | Example | Handling | User sees |
| --- | --- | --- | --- |
| Validation | RPE of 11 | Action returns `{ ok: false, fieldErrors }` | Inline field message |
| Business rule | Editing a locked session | Action returns `{ ok: false, formError }` with a stable code | Form-level message explaining the rule |
| Not found / not authorized | Another athlete's program ID | DAL calls `notFound()` | 404 page (no information leak) |
| Unauthenticated | Expired session | DAL calls `redirect("/sign-in?next=...")` | Sign-in page |
| Conflict | Two tabs log the same prescribed set | Unique constraint → mapped to a business-rule error | "This set was already logged. Refresh to see it." |
| Upload failure | Network drop during PUT | Client catches, marks the video `failed` | Retry button on the video card |
| Unexpected | DB unavailable | Throw, caught by `error.tsx` | Generic message with an error ID and a retry button |

## Rules

- **ERR-001.** Expected failures (validation, business rules, conflicts) are **returned** from Server Actions. Unexpected failures are **thrown**.
- **ERR-002.** Business-rule errors use a typed `DomainError` class with a `code` (for example `SESSION_LOCKED`, `RELATIONSHIP_REQUIRED`, `VIDEO_TOO_LARGE`). Actions map it to `formError`. Codes are listed in each feature spec.
- **ERR-003.** Never send raw database or library error messages to the client.
- **ERR-004.** `try/catch` blocks around code that may call `redirect()` or `notFound()` must rethrow those (use `unstable_rethrow`), or keep the call outside the `try`.
- **ERR-005.** Each `(app)` route segment that loads data gets an `error.tsx` (client component with a reset button). The root has a `global-error.tsx`.
- **ERR-006.** Unexpected errors are logged server-side with an error ID. The log never includes notes, set values, emails, or signed URLs.
- **ERR-007.** Optimistic UI updates (set logging) roll back and show an inline error if the action fails.

## Observability

See [system_overview.md#observability-proposed](system_overview.md#observability-proposed).
