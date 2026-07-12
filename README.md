# Do It Now

A full-stack productivity app for tracking daily tasks and habits, with
streak tracking (including a one-day "grace period"), goals, trend
analytics, and nudges — built with production-grade auth and security
practices.

- **Frontend**: React + Vite SPA (React Router, Recharts for charts).
- **Backend**: Express + MongoDB REST API. Cookie-based JWT auth with
  refresh token rotation; each user only ever sees their own data.

## Quick start (both together)

You need MongoDB running somewhere (local install, Docker, or Atlas).

**1. Backend**

```bash
cd Backend
cp .env.example .env      # edit MONGO_URI / JWT_SECRET if needed
npm install
npm start
```

Runs on `http://localhost:5000`.

**2. Frontend**

```bash
cd Frontend
cp .env.example .env      # defaults to http://localhost:5000/api/v1, fine for local dev
npm install
npm run dev
```

Open the printed local URL, register an account, and go.

## What's in each tier

### Tier 1 — production security & operations

- **httpOnly cookies, not localStorage**, for both the access token (15 min)
  and refresh token (30 days) — immune to token theft via XSS.
- **Refresh token rotation with revocation.** Every `/auth/refresh` call
  issues a new refresh token and invalidates the old one (the hash is
  checked against what's stored on the user). Logout clears the stored
  hash server-side, so a stolen cookie stops working immediately, not just
  when it expires.
- **CORS allowlist** (`FRONTEND_ORIGIN`) instead of accepting all origins.
- **Boot-time config validation** — `Backend/config/index.js` refuses to
  start in `NODE_ENV=production` if `JWT_SECRET` is missing/default,
  `MONGO_URI` is unset, or `FRONTEND_ORIGIN` is unset.
- **Pagination + search** on `GET /habits` and `GET /tasks`
  (`?page=&limit=&search=`).
- **Per-user rate limiting** on all write routes (`Backend/middleware/rateLimiters.js`) —
  keyed by user ID, not just IP, so one account can't be starved by
  someone else on the same network.
- **Structured logging** via Winston — pretty console output in dev, JSON +
  rotating files (`Backend/logs/`) in production.
- **Hand-rolled NoSQL-injection sanitizer** (`Backend/middleware/sanitizeMiddleware.js`) —
  strips `$`-prefixed keys from body/params/query. Written by hand instead
  of using `express-mongo-sanitize`, which mutates `req.query` directly and
  breaks under Express 5's read-only query object.

### Tier 2 — product depth

- **Habit goals**: set a target (e.g. "4x per week"), see a live progress
  bar (`Habits.jsx` + `utils/goalUtils.js`).
- **Weekly-success badge**: 🏆 shown once a habit hits its weekly target
  (`utils/weeklySuccessUtils.js`).
- **Smart nudges** on the Home page: flags habits about to lose a long
  streak, inactive habits, and an overall declining trend
  (`utils/nudgeUtils.js`).
- **Trend chart** on Analytics: a 14-day line chart of habit/task
  completions plus an improving/declining/stable indicator
  (`utils/trendUtils.js` + Recharts).
- **Task priority (low/medium/high) and due dates**, with overdue
  highlighting.
- **Search** on both Habits and Tasks pages, backed by the API's `?search=`.

### Tier 3 — engineering signals

- **Backend tests** (Jest + Supertest + `mongodb-memory-server`): auth
  flow including refresh/revocation, habit streak/grace-period logic,
  task CRUD, search, pagination.
- **Frontend unit/component tests** (Vitest + React Testing Library):
  streak/grace-period logic, risk calculation, `TaskCard`, and a
  regression test for the double-submit bug this project used to have.
  Run with `npm test` in `Frontend/`.
- **E2E tests** (Playwright): register → add habit → complete it → see
  streak; add task → complete it; logout → protected routes redirect.
  See "Running the E2E tests" below — these need a browser binary that
  couldn't be installed in the sandbox this was built in, so they're
  written and configured but not yet run end-to-end; they should work as-is
  in a normal dev machine or CI.
- **Database indexes** on the common `{ userId, createdAt }` query shape
  for both Habit and Task collections.

### Tier 4 — deployment

- **`Backend/Dockerfile`** and **`Frontend/Dockerfile`** (multi-stage,
  served via nginx with SPA fallback routing).
- **`docker_compose.yml`** at the repo root runs backend + frontend +
  MongoDB together.
- **`Backend/render.yaml`** — one-click-ish deploy config for
  [Render](https://render.com).
- **`Frontend/vercel.json`** — SPA rewrite rule for
  [Vercel](https://vercel.com).
- **CI deploy job** (`.github/workflows/ci.yml`) — after tests pass on
  `main`, it POSTs to Render/Vercel deploy hooks *if* you've added them as
  repo secrets; otherwise it just logs that they're not configured and
  skips (nothing breaks if you haven't set this up).

## Deploying for real — exact steps

I can't create cloud accounts on your behalf, so this part needs you, but
every config file is ready to go:

1. **Database**: create a free cluster at
   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), get its
   connection string.
2. **Backend on Render**: New → Web Service → connect this repo → Render
   will detect `Backend/render.yaml`. Set `MONGO_URI` to your Atlas string
   and `FRONTEND_ORIGIN` to your (soon-to-exist) Vercel URL in the Render
   dashboard's environment variables.
3. **Frontend on Vercel**: New Project → import this repo → set root
   directory to `Frontend` → add environment variable
   `VITE_API_URL=https://<your-render-service>.onrender.com/api/v1`
   → deploy.
4. **Go back to Render** and update `FRONTEND_ORIGIN` to your real Vercel
   URL (needed for CORS + cookies to work), then redeploy the backend.
5. **Optional — auto-deploy from CI**: in Render, create a Deploy Hook
   (Settings → Deploy Hook) and add it as a GitHub repo secret named
   `RENDER_DEPLOY_HOOK`. In Vercel, create a Deploy Hook (Project Settings
   → Git → Deploy Hooks) and add it as `VERCEL_DEPLOY_HOOK`. Now every
   merge to `main` that passes tests triggers both deploys automatically.
6. **Optional — uptime monitoring**: point a free
   [UptimeRobot](https://uptimerobot.com) monitor at
   `https://<your-render-service>.onrender.com/health`.

## Running the tests

```bash
# Backend (uses an in-memory MongoDB, no real DB needed)
cd Backend
npm test

# Frontend unit/component tests
cd Frontend
npm test

# Frontend E2E (needs a browser binary + both servers running)
cd Frontend
npx playwright install        # one-time, downloads browser binaries
npm run test:e2e
```

## API reference

| Endpoint | Auth | Description |
|---|---|---|
| `POST /api/v1/auth/register` | – | Create an account, sets auth cookies |
| `POST /api/v1/auth/login` | – | Log in, sets auth cookies |
| `POST /api/v1/auth/refresh` | cookie | Rotate to a new access+refresh token pair |
| `POST /api/v1/auth/logout` | – | Revoke the refresh token, clear cookies |
| `GET /api/v1/auth/me` | ✔ | Current user (used on app load to check session) |
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

## Data model

**Habit**: name, frequency (daily/weekly), effort, priority, goal
(target + period), streak, graceUsed, lastCompleted, createdAt.

**Task**: title, description, status (pending/done), priority
(low/medium/high), dueDate.

## What's genuinely still missing for a large-scale production app

Being direct about the remaining gap rather than overselling this:

- No password reset / email verification flow.
- No horizontal-scale-safe cache (the in-memory cache in
  `Backend/utils/cache.js` would need to become Redis if you ran more than
  one backend instance).
- No staging environment or blue/green deploys — pushing to `main` deploys
  straight to production.
- No automated DB backup/restore strategy beyond whatever Atlas provides
  by default.
- Frontend test coverage is solid for the trickiest logic (streaks, the
  double-submit bug) but doesn't cover every page/component.

These are the honest remaining items between "strong portfolio project
with real production practices" and "I'd bet a company on this."
