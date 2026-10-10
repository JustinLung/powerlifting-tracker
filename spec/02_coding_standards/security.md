# Security and privacy standards

Training logs, bodyweight, injury notes, and videos of athletes are personal data. Treat all of it as private by default. Authorization design is in [authentication_and_authorization.md](../01_architecture/authentication_and_authorization.md).

## Rules

- **SEC-001.** All authorization is enforced server-side in the DAL. UI hiding is cosmetic only.
- **SEC-002.** Server Actions are public endpoints. Validate every argument with Zod, authenticate, and authorize inside each action and DAL call.
- **SEC-003.** Never accept the acting user's ID or role from the client.
- **SEC-004.** Return 404 for resources that exist but are not accessible to the user.
- **SEC-005.** Modules that touch secrets, the DB, or storage credentials import `server-only`. Only `lib/server/**` reads `process.env` for secrets. Client-exposed variables (`NEXT_PUBLIC_*`) must never contain secrets.
- **SEC-006.** `.env*` files are git-ignored [Fact]. Document required variable **names** (never values) in `.env.example` when the first variable is introduced.
- **SEC-007.** Video buckets are private. Playback and upload use short-lived presigned URLs issued after authorization. Signed URLs are never logged or persisted ([video_storage_and_delivery.md](../01_architecture/video_storage_and_delivery.md#authorization)).
- **SEC-008.** Validate uploads by declared content type and size at presign time, and again by HEAD after upload. Do not trust file extensions.
- **SEC-009.** User text (notes, feedback) is rendered as text. Never use `dangerouslySetInnerHTML` with user content. If Markdown is ever supported, sanitize it.
- **SEC-010.** Logs and error reports exclude emails, notes, set data, tokens, and URLs with signatures.
- **SEC-011.** Auth: hash passwords (delegated to the auth library), rate-limit sign-in and password reset, use HTTP-only Secure cookies, and require email verification before relationship and program actions.
- **SEC-012.** Invitations use single-use, expiring, unguessable tokens. Accepting one requires signing in as the account that owns the invited email.
- **SEC-013.** Before adding a dependency, check its maintenance status and record why it is needed (in the plan or the decision log).
- **SEC-014.** Data deletion: deleting a video removes the object from storage, not only the row. An account deletion flow is [Open] and must be specified before production launch with real users.
