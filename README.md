# Do It Now

**A full-stack productivity app for tracking daily tasks and habits** - with streak tracking (including a one-day grace period), goal setting, trend analytics, and smart nudges. Built with production-grade auth and security practices, not just CRUD.

🔗 **Live demo:** [doitnow-app.vercel.app](https://doitnow-app.vercel.app/)

![JavaScript](https://img.shields.io/badge/JavaScript-90.1%25-yellow)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Express](https://img.shields.io/badge/Backend-Express%20%2B%20MongoDB-47A248)
![Tests](https://img.shields.io/badge/Tests-Jest%20%7C%20Vitest%20%7C%20Playwright-brightgreen)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Features](#features)
- [API Reference](#api-reference)
- [Data Model](#data-model)
- [Testing](#testing)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## Overview

Do It Now solves a simple problem - most habit trackers either oversimplify (a checkbox and a streak number) or overcomplicate (full project-management suites). This app sits in between: enough structure to set real goals and see trends, without the overhead.

It was also built as an exercise in shipping a **production-honest** side project - real auth security, rate limiting, structured logging, and test coverage across all three layers, rather than a demo that only works on `localhost`.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite (SPA), React Router, Recharts |
| Backend | Express + MongoDB (Mongoose) |
| Auth | Cookie-based JWT with refresh token rotation |
| Testing | Jest + Supertest + mongodb-memory-server (backend), Vitest + React Testing Library (frontend), Playwright (E2E) |
| Deployment | Docker, Render (backend), Vercel (frontend) |

## Quick Start

You'll need MongoDB running somewhere - local install, Docker, or Atlas.

**1. Backend**
```bash
cd Backend
cp .env.example .env      # set MONGO_URI / JWT_SECRET
npm install
npm start
```
Runs on `http://localhost:5000`.

**2. Frontend**
```bash
cd Frontend
cp .env.example .env      # defaults to http://localhost:5000/api/v1
npm install
npm run dev
```
Open the printed local URL, register an account, and go.

**Or, with Docker Compose:**
```bash
docker compose -f docker_compose.yml up
```

## Features

### 🔒 Production Security & Operations
- **httpOnly cookies**, not `localStorage`, for both access token (15 min) and refresh token (30 days) - immune to XSS-based token theft.
- **Refresh token rotation with revocation** - every `/auth/refresh` call issues a new refresh token and invalidates the old one; logout revokes server-side immediately.
- **CORS allowlist** via `FRONTEND_ORIGIN`, not a wildcard.
- **Boot-time config validation** — the server refuses to start in `NODE_ENV=production` if `JWT_SECRET`, `MONGO_URI`, or `FRONTEND_ORIGIN` are missing or default.
- **Per-user rate limiting** on write routes, keyed by user ID (not just IP) — one account can't be starved by another user sharing a network.
- **Structured logging** via Winston — readable console output in dev, JSON + rotating files in production.
- **Hand-rolled NoSQL-injection sanitizer** — strips `$`-prefixed keys from `body`/`params`/`query`. Written by hand instead of using `express-mongo-sanitize`, which mutates `req.query` directly and breaks under Express 5's read-only query object.
- **Pagination + search** on `GET /habits` and `GET /tasks`.

### 📊 Product Depth
- **Habit goals** - set a target (e.g. "4x per week") with a live progress bar.
- **Weekly-success badges** - 🏆 awarded once a habit hits its weekly target.
- **Smart nudges** on the home page - flags habits at risk of losing a long streak, inactive habits, and overall declining trends.
- **14-day trend chart** on the analytics page, with an improving / declining / stable indicator.
- **Task priority** (low / medium / high) and due dates, with overdue highlighting.
- **Search** on both Habits and Tasks pages.

### 🧪 Engineering Signals
- **Backend tests** — auth flow (including refresh/revocation), streak/grace-period logic, task CRUD, search, pagination.
- **Frontend tests** — streak/grace-period logic, risk calculation, `TaskCard`, plus a regression test for a double-submit bug this project used to have.
- **E2E tests (Playwright)** — register → add habit → complete it → see streak; add task → complete it; logout → protected routes redirect.
- **Database indexes** on the `{ userId, createdAt }` query shape for both collections.

### 🚀 Deployment
- Multi-stage Dockerfiles for both backend and frontend (frontend served via nginx with SPA fallback routing).
- `docker_compose.yml` to run backend + frontend + MongoDB together locally.
- `render.yaml` and `vercel.json` for one-click-ish deploys.
- CI deploy job that triggers Render/Vercel deploy hooks after tests pass on `main`.

## API Reference

| Endpoint | Auth | Description |
|---|---|---|
| `POST /api/v1/auth/register` | – | Create an account, sets auth cookies |
| `POST /api/v1/auth/login` | – | Log in, sets auth cookies |
| `POST /api/v1/auth/refresh` | cookie | Rotate to a new access + refresh token pair |
| `POST /api/v1/auth/logout` | – | Revoke the refresh token, clear cookies |
| `GET /api/v1/auth/me` | ✔ | Current user (session check on app load) |
| `GET /api/v1/habits` | ✔ | `?search=&priority=&page=&limit=` |
| `POST /api/v1/habits` | ✔ | Create a habit |
| `PUT /api/v1/habits/:id` | ✔ | Update a habit |
| `DELETE /api/v1/habits/:id` | ✔ | Delete a habit |
| `PATCH /api/v1/habits/:id/complete` | ✔ | Mark done today, update streak |
| `GET /api/v1/tasks` | ✔ | `?search=&status=&priority=&page=&limit=` |
| `POST /api/v1/tasks` | ✔ | Create a task (`title`, `priority`, `dueDate`) |
| `PUT /api/v1/tasks/:id` | ✔ | Update a task |
| `DELETE /api/v1/tasks/:id` | ✔ | Delete a task |
| `GET /health` | – | Health check |
| `GET /metrics` | – | Basic request/error counters |
| `GET /api-docs` | – | Swagger UI |

## Data Model

**Habit** — `name`, `frequency` (daily/weekly), `effort`, `priority`, `goal` (target + period), `streak`, `graceUsed`, `lastCompleted`, `createdAt`.

**Task** — `title`, `description`, `status` (pending/done), `priority` (low/medium/high), `dueDate`.

## Testing

```bash
# Backend — uses an in-memory MongoDB, no real DB needed
cd Backend && npm test

# Frontend unit/component tests
cd Frontend && npm test

# Frontend E2E — needs both servers running
cd Frontend
npx playwright install   # one-time
npm run test:e2e
```

## Deployment

1. **Database** — create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Backend on Render** — New → Web Service → connect this repo (auto-detects `render.yaml`). Set `MONGO_URI` and `FRONTEND_ORIGIN`.
3. **Frontend on Vercel** — New Project → import repo → root directory `Frontend` → set `VITE_API_URL` → deploy.
4. **Update `FRONTEND_ORIGIN`** on Render to the real Vercel URL, then redeploy the backend.
5. **Optional — CI auto-deploy**: add `RENDER_DEPLOY_HOOK` and `VERCEL_DEPLOY_HOOK` as GitHub repo secrets so every tested merge to `main` deploys automatically.
6. **Optional — uptime monitoring**: point [UptimeRobot](https://uptimerobot.com) at `/health`.

## Known Limitations

Being direct about what's left, rather than overselling it:

- No password reset / email verification flow yet.
- The in-memory cache (`Backend/utils/cache.js`) isn't horizontal-scale-safe — would need to move to Redis for multi-instance deployments.
- No staging environment or blue/green deploys — `main` deploys straight to production.
- No automated DB backup/restore strategy beyond what Atlas provides by default.
- Frontend test coverage is strong on the trickiest logic (streaks, the double-submit regression) but doesn't cover every page/component yet.

---

<p align="center">Built by <a href="https://github.com/0kartik">Janardan Kartikeya Agnihotram</a></p>
