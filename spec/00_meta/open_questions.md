# Open questions

Every question has a recommended default. Until a question is answered, specs may assume the default **only if they say so explicitly**. When a question is answered, move the outcome to the [decision log](decision_log.md) and mark the question resolved here.

Format: **Blocking** lists the features that cannot reach `Approved` until the question is answered.

## Infrastructure

### Q-001 Database and hosting

- **Context:** [Fact] No database is installed or configured.
- **Options:** PostgreSQL (managed: Neon, Supabase, or another provider) · SQLite/libSQL (Turso) · a document store.
- **Recommendation:** PostgreSQL. The data is strongly relational (a six-level hierarchy, role-scoped joins), needs transactions and foreign keys, and benefits from numeric types for weights. Use a managed provider with database branching for preview environments.
- **Blocking:** F-00, and everything after it.

### Q-002 ORM / query layer

- **Options:** Drizzle ORM · Prisma · raw SQL with a thin client.
- **Recommendation:** Drizzle. It defines the schema in TypeScript, uses SQL-like queries, generates SQL migrations, has no separate engine binary, and works in serverless environments. Trade-off: it is less "batteries included" than Prisma for relation-heavy queries.
- **Blocking:** F-00.

### Q-003 Multiple coaches per athlete

- **Recommendation:** at most **one** `active` coach per athlete in the MVP. The schema should not prevent several later (the relationship table already supports it).
- **Blocking:** F-02.

### Q-004 Authentication provider

- **Options:**
  - **Better Auth / Auth.js:** self-hosted. User tables live in our database. No per-user cost. We own security updates.
  - **Clerk:** hosted. Fastest to integrate, with a polished UI. Identity lives outside our database, so it must be synced by webhook, and there is a per-user cost.
  - **Supabase Auth:** coupled to choosing Supabase for the database and storage.
- **Recommendation:** a self-hosted library (Better Auth) with email and password plus email verification. It keeps the `User` table in our database for foreign keys and keeps costs at zero. Confirm the library's compatibility with Next.js 16 and Cache Components at decision time.
- **Blocking:** F-01.

### Q-005 Video object storage

- **Options:** Vercel Blob (private stores) · S3-compatible storage (AWS S3, Cloudflare R2) · Supabase Storage · Mux (a video platform with transcoding and adaptive streaming).
- **Recommendation:** S3-compatible private storage (R2 has no egress fees, which matters for repeated video playback), using presigned direct uploads and short-lived presigned GET URLs. Revisit Mux if HEVC playback problems or bandwidth make transcoding necessary ([Q-009](#q-009-video-transcoding)). Vercel Blob is a reasonable alternative if the app is hosted on Vercel and its private-store signed access fits the playback flow.
- **Blocking:** F-06.

### Q-006 Hosting platform

- **Context:** [Fact] Nothing in the repository commits to a host. `.vercel` appears in `.gitignore` only because the template adds it.
- **Recommendation:** Vercel. It provides native Next.js 16 support (Cache Components, Partial Prefetching) and preview deployments.
- **Blocking:** F-00 (environment and deployment setup).

### Q-007 Testing tools

- **Context:** [Fact] No test framework is installed.
- **Recommendation:** Vitest for unit and integration tests (integration tests run against a real Postgres), and Playwright for end-to-end tests. See [testing.md](../02_coding_standards/testing.md).
- **Blocking:** F-00.

## Product

### Q-008 Program ownership and templates

- **Question:** Is a program written for a single athlete, or is it a reusable template assigned to many athletes?
- **Recommendation:** in the MVP, a program belongs to exactly one athlete. Reuse happens by **duplicating** a program or week into another athlete's program. Real templates come later.
- **Blocking:** F-04.

### Q-009 Video transcoding

- **Context:** iPhones record HEVC `.mov` by default. Some browsers (notably some Chromium configurations on Windows and Linux) cannot play HEVC.
- **Recommendation:** no transcoding in the MVP. Accept `video/mp4` and `video/quicktime`, limit the size, show a clear "cannot play in this browser" fallback with a download link, and record the issue. Adopt transcoding (Mux or a worker) if real usage shows playback failures.
- **Blocking:** F-06 (the default is acceptable to start).

### Q-010 Notification channels

- **Recommendation:** in-app unread indicators only for the MVP. Email digests come later.
- **Blocking:** F-10.

### Q-011 Offline logging

- **Context:** gyms often have poor reception.
- **Recommendation:** the MVP saves each set individually with an optimistic UI and retry, and keeps unsent set input in browser storage per session so that a reload does not lose it. Full offline sync is out of scope.
- **Blocking:** F-05.

### Q-012 Weight units

- **Recommendation:** store kilograms (`numeric(6,2)`). Display preference `kg | lb` per profile; the conversion is display-only. MVP may ship kg-only if the preference adds too much scope.
- **Blocking:** F-04 and F-05 (storage is decided; display is not).

### Q-013 Editing prescriptions after logging starts

- **Question:** Can a coach edit a session's prescription after the athlete has started logging it?
- **Recommendation:** No. Once a `SessionLog` exists, that session's prescriptions are locked. The coach can add a feedback comment instead. Future sessions remain editable. See [BR-PRG-006](../03_business_domain/training_programs.md#business-rules).
- **Blocking:** F-04 and F-05.

### Q-014 e1RM formula

- **Recommendation:** an RPE-based table (Tuchscherer-style reps × RPE → %1RM) when RPE is logged, falling back to the Epley formula. Only compute e1RM for sets of 1–10 reps.
- **Blocking:** F-09.

### Q-015 Former coach access

- **Question:** After a relationship ends, can the former coach still see past data?
- **Recommendation:** No. Access requires an `active` relationship. Feedback the coach wrote stays visible to the athlete.
- **Blocking:** F-02.

### Q-016 Video retention and limits

- **Recommendation:** maximum 500 MB and 3 minutes per video. Videos are kept until the athlete deletes them. An athlete may delete their own videos, which also deletes the file. Revisit when storage costs are known.
- **Blocking:** F-06.

### Q-017 Feedback threading and review status

- **Recommendation:** a flat thread per video or per exercise prescription. Both the coach and the athlete may post. A coach posting feedback on a video does **not** automatically mark it reviewed; marking a video reviewed is an explicit action.
- **Blocking:** F-07.

### Q-018 Scheduling model

- **Question:** Are sessions scheduled on calendar dates, or only ordered as "Day N" in a week?
- **Recommendation:** order sessions by `day_index` within a week, with an optional `scheduled_date`. "Missed" is computed only for sessions that have a date. The "current week" is the first week containing an unlogged session.
- **Blocking:** F-04 and F-08.

### Q-019 Role selection and coach verification

- **Recommendation:** users choose their roles during onboarding. Anyone can enable the coach role. There is no verification in the MVP.
- **Blocking:** F-01.
