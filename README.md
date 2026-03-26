# PeoplesNetwork

Cozy community platform where developers find teammates for short coding sprints, pet projects, and hands-on practice.

## Build With Us
We are building this for ourselves as developers.

If you want a better place to find coding teammates and ship small projects together, join us and help shape it.

We welcome:
- frontend contributors
- backend contributors
- UI/UX improvements
- product feedback from real builders

## Why this project
- Build with others instead of coding alone
- Keep scope small: 2-4 week sprints
- Match by stack, timezone, and weekly availability

## Tech Stack
- Next.js (App Router)
- TypeScript
- PostgreSQL
- MUI (Material UI)
- Docker Compose (local DB)

## Features
- Landing page with clear onboarding flow
- Practice projects feed and project details
- Join request flow for project participation
- Host board with request moderation (`pending/approved/rejected`)
- Match flow connected to approved requests
- Fallback demo mode when DB is offline

## Local Setup
```bash
npm install
copy .env.example .env
docker compose up -d
npm run db:init
npm run dev
```

Open: `http://localhost:3000`

## Main Routes
- `/` Landing
- `/projects` Practice projects
- `/projects/:id` Project details + join request
- `/matches` My team picks
- `/dashboard` Host board

## API Overview
- `GET /api/public/stats`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects/:id/join`
- `GET /api/me/matches?email=...`
- `POST /api/waitlist`
- `GET /api/host/join-requests?status=pending&q=anna`
- `POST /api/host/join-requests/:id/approve`
- `POST /api/host/join-requests/:id/reject`

## Database
- Schema: [db/schema.sql](db/schema.sql)
- Seed data: [db/seed.sql](db/seed.sql)
- Init script: [scripts/init-db.mjs](scripts/init-db.mjs)

## Status
MVP in active development.

## Contributing
1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: your change"`
4. Push branch and open a PR

If you are not sure where to start, open an issue with:
- your stack
- what you want to build
- how many hours/week you can contribute

## Good First Tasks
- Convert remaining pages to MUI for consistent design
- Add notifications/toasts for key actions
- Improve project filtering and sorting
- Add profile page and onboarding polish
- Add tests for join request flow
