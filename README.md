# PeoplesNetwork

Cozy community platform where developers find teammates for short coding sprints, pet projects, and hands-on practice.

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

