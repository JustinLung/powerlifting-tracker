# Your to-do list

This is the list of things only you can do. I (Claude) can't create accounts, set secrets, or approve decisions for you.

**Golden rule:** never paste passwords, API keys, or secrets into chat, code, or docs. You put them in a private file on your computer (`.env.local`), and that file is never committed to git.

---

## Step 1: Answer my questions in chat (do this first)

I'm waiting on these before I can write anything. Just reply with "yes" or your choice.

### A. Confirm the tech choices

Each one becomes a recorded decision in the project docs. Say yes or no to each:

- [x] **Database:** Postgres, hosted on Neon (set up through Vercel)
- [x] **ORM** (the code that talks to the database): Drizzle
- [x] **Login system:** Better Auth (runs inside our app, email + password, email verification). I tested it with this version of Next.js and it works.
- [x] **Hosting:** Vercel
- [x] **Testing tools:** Vitest (unit/integration tests) and Playwright (browser tests)

### B. Pick an option for these three

1. **Email service.** When someone signs up, the app must send a "verify your email" message. Better Auth can't send email by itself, so we need a service.
   - Options: Resend, Postmark, or AWS SES.
   - If you're unsure, pick **Resend**. It's simple and has a free tier.
   - Or say "later". I'll print emails to the terminal for now, and you pick a service before launch.

   **Answer: Resend**
2. **Test database.** Our tests need a real Postgres database.
   - **Option 1 (recommended):** a local Postgres running in Docker. It's free, fast, and safe.
   - **Option 2:** a separate Neon test database. It's closer to production but needs more setup.
   **Answer: Option 1**
3. **Should the app remember who's logged in between page loads?**
   - **Option 1 (recommended):** no caching. We check the database every time. It's slightly slower but safe. If a coach loses access to an athlete, it takes effect immediately.
   - **Option 2:** cache for up to 5 minutes. Faster, but a removed coach could still see data for up to 5 minutes.
   **Answer: Option 2**

---

## Step 2: Review my spec (after Step 1)

I'll write a spec for the foundation work (F-00). A spec is a plain-English plan.

- [ ] Read it. If something is confusing, ask me. That's a good sign the spec needs fixing.
- [ ] Reply **"Approved"**, or tell me what to change.
- [ ] I won't mark it approved myself, and I won't start coding until you do.

---

## Step 3: Set up accounts (before I start coding F-00)

Do these once. Each takes a few minutes.

- [ ] **GitHub:** create a repository and push this project to it. We need it for automatic checks (CI). Ask me and I'll tell you the commands.
- [ ] **Vercel:** sign up at vercel.com, then in the project folder run:
  ```bash
  npx vercel link
  ```
- [ ] **Neon database:** in the Vercel dashboard, open your project, go to **Storage** (or the **Marketplace**), and add **Neon**. This makes the database and gives Vercel the connection details.
- [ ] **Download the settings to your computer:**
  ```bash
  npx vercel env pull .env.local
  ```
  This creates `.env.local`. It's private and git already ignores it.
- [ ] **Docker Desktop:** install and start it if you chose the local test database.
- [ ] **Node.js:** make sure you have version 22 or newer:
  ```bash
  node --version
  ```

---

## Step 4: Add secrets (before I start coding F-01, the login feature)

Open `.env.local` and add these lines yourself. I'll list the same **names** (never the values) in a file called `.env.example`.

| Name | What it is | How to get it |
| --- | --- | --- |
| `DATABASE_URL` | Address of the database | Already added by `vercel env pull` |
| `BETTER_AUTH_SECRET` | Random secret used to sign logins | Run `openssl rand -base64 32` and paste the result |
| `BETTER_AUTH_URL` | Your app's address | `http://localhost:3000` on your machine |
| Email API key | Lets the app send email | From your email service's dashboard (skip if you said "later") |

Also add `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in the Vercel dashboard under **Settings → Environment Variables**. Use your real website address there instead of localhost.

---

## Throughout the project

- [ ] **Tell me when to commit.** I never commit or push unless you ask.
- [ ] **Review each spec** (F-00, then F-01) and approve it before I code.
- [ ] **Ask when stuck.** If I use a word you don't know, say so and I'll explain it.

---

## Later (you don't need to think about these yet)

- Where to store videos (Q-005)
- How programs and templates work (Q-008, Q-013, Q-018)
- Before launch: verify your sending domain with your email service (it involves DNS settings)
