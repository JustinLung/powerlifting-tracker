# Powerlifting Tracker

A training platform for powerlifting coaches and athletes. Coaches prescribe structured programs, athletes log what they actually performed, and both sides use exercise videos and written feedback to review technique.

> **Current state:** the repository is an unmodified `create-next-app` scaffold. No product features exist yet. See [spec/05_project_memory/current_state.md](spec/05_project_memory/current_state.md).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npx next typegen && npx tsc --noEmit   # type check (route types must be generated first)
npm run build
```

Requires Node.js 20+ (verified locally with Node 24).

## Specification and documentation

This project uses spec-driven development. All product, architecture, and workflow documentation lives in [spec/](spec/README.md), which is the source of truth for intended behavior.
