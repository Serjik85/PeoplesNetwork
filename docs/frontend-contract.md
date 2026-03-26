# Frontend contract for cozy practice MVP

## 1) Pages
- `/` Landing + counters + join form
- `/projects` Active practice projects
- `/projects/:id` Project details + open team slots
- `/dashboard` Host board (manual team matching)
- `/matches` Personal team picks

## 2) Public counters
GET `/api/public/stats`

```json
{
  "active_project_requests": 12,
  "builders_in_pipeline": 23,
  "intros_last_14_days": 17
}
```

UI meaning:
- `active_project_requests` => active practice projects
- `builders_in_pipeline` => builders in community pipeline
- `intros_last_14_days` => team intros in last 14 days

## 3) Join form submit
POST `/api/waitlist`

```json
{
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "role": "builder",
  "stack": ["react", "nextjs", "typescript"],
  "weekly_hours": 12,
  "timezone": "Europe/Copenhagen"
}
```

Role intent mapping:
- `builder` => wants to join teams
- `project_owner` => wants to host practice projects
- `both` => can host and join

## 4) Project feed cards
GET `/api/projects?stage=mvp&limit=20`

Card fields:
- `id`
- `title`
- `one_liner`
- `stage`
- `domain`
- `weekly_hours_expected`
- `collaboration`
- `timezone_preference`
- `top_skills[]`

## 5) Project details
GET `/api/projects/:id`

```json
{
  "id": "...",
  "title": "PairBoard",
  "one_liner": "Practice project for building a shared kanban board",
  "description": "A 3-week learning sprint for collaborative coding.",
  "stage": "mvp",
  "domain": "DevTools",
  "target_market": "Learning sprint participants",
  "weekly_hours_expected": 10,
  "collaboration": "core_team",
  "timezone_preference": "Europe/*",
  "roles": [
    {
      "id": "...",
      "title": "Frontend Practice Buddy",
      "description": "Pair-program and own UI screens in Next.js.",
      "min_experience": "middle",
      "weekly_hours_min": 6,
      "required_skills": [
        { "slug": "react", "required_level": 3, "weight": 5 },
        { "slug": "nextjs", "required_level": 3, "weight": 4 }
      ]
    }
  ]
}
```

## 6) Team picks list
GET `/api/me/matches`

```json
[
  {
    "match_id": "...",
    "project": {
      "id": "...",
      "title": "PairBoard",
      "one_liner": "Practice project for building a shared kanban board"
    },
    "role": {
      "id": "...",
      "title": "Frontend Practice Buddy"
    },
    "score_total": 82.5,
    "score_breakdown": {
      "skill": 34,
      "goal": 20,
      "availability": 11,
      "timezone": 9,
      "commitment": 8.5
    },
    "status": "suggested",
    "curator_note": "Strong fit for a 3-week sprint."
  }
]
```

## 7) Team actions
POST `/api/matches/:id/accept` (join this team)
POST `/api/matches/:id/reject` (skip)

## 8) Join request from project page
POST `/api/projects/:id/join`

```json
{
  "email": "dev@example.com",
  "full_name": "Nina Dev",
  "role_id": "uuid-or-null",
  "motivation": "I want to practice async collaboration and ship a demo in this sprint.",
  "hours_per_week": 8
}
```

## 9) Host board queue
GET `/api/curator/queue`

```json
{
  "new_profiles": 9,
  "open_project_roles": 14,
  "pending_intros": 7,
  "suggestions": [
    {
      "user_id": "...",
      "project_role_id": "...",
      "score_total": 78.2,
      "reason": ["React fit", "Timezone overlap", "Part-time commitment"]
    }
  ]
}
```

## 10) Host join request review
GET `/api/host/join-requests`
GET `/api/host/join-requests?status=pending&q=nina`
POST `/api/host/join-requests/:id/approve`
POST `/api/host/join-requests/:id/reject`

Approve side effect:
- sets join request status to `approved`
- creates or updates a `match` with status `accepted` for applicant + project role

## 11) State machine
- Match: `suggested -> accepted/rejected -> intro_sent -> meeting_done`
- Intro: `pending -> sent -> replied -> closed`
