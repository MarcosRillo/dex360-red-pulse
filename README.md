# Red Pulse — Austral Motors dealer network dashboard

A small full stack exercise for Dex 360. **Austral Motors**, a fictional automaker, monitors the health of its dealership network: how many leads come in, how fast each dealership answers them, and how many turn into test drives and sales.

**Live:** https://dex360-red-pulse.vercel.app
**Demo account:** `gerencia@australmotors.test` / `redpulse-demo`

- Login screen
- Protected dashboard with KPI cards and a ranked dealership table
- Logout

## Architecture

```text
browser ──► apps/web  (Next.js 16, Vercel)
              │  rewrites /api/* → API_URL  (one origin, first-party cookie)
              ▼
            apps/api  (Express 5 + TypeScript, one Vercel Function)
              │  routes → services → repositories
              ▼
            in-memory seed data

packages/contracts — Zod schemas shared by web and api
```

| Concern | Decision | Why |
| --- | --- | --- |
| Boundary | A separate Node API owns auth, the session, and the data; the web app never reads data directly | A clear back/front split that could scale to other clients (mobile, partners) |
| One origin | Next rewrites `/api/*` to the API | No CORS and no third-party cookies; the session cookie stays first-party |
| Session | HS256 JWT (`jose`) in an `httpOnly`, `SameSite=Lax`, `Secure` cookie, 8 h | Stateless, so it fits serverless; nothing is stored server-side |
| Route guard | `proxy.ts` only checks that the cookie **exists**; the API validates it on every request | Fast redirects at the edge without duplicating the security decision |
| Passwords | `scrypt` from `node:crypto` + `timingSafeEqual`; unknown emails are checked against a decoy hash | No extra dependency, and the response time does not reveal which users exist |
| Contracts | Zod schemas in `packages/contracts`, used to validate on both sides | Front and back cannot drift apart silently |
| Data | `DealerRepository` interface with an in-memory seed | The exercise needs no external services; Postgres would be one new adapter |
| Metrics | Network first-response time is **weighted by leads**; thresholds live in one file | A small, fast dealer cannot hide a big, slow one |

### KPI thresholds

| KPI | En rango | Atención | Crítico |
| --- | --- | --- | --- |
| 1ª respuesta | ≤ 60 min | ≤ 180 min | > 180 min |
| Conversión (sales / leads) | ≥ 10 % | ≥ 6 % | < 6 % |
| Leads, test drives (vs previous period) | ≥ 0 % | ≥ −10 % | < −10 % |

## Workspace

```text
apps/web            Next.js 16 (App Router, cacheComponents) — login, dashboard
apps/api            Express 5 + TypeScript — auth, session, network data
packages/contracts  Zod schemas shared by web and api
```

## Run locally

Requires Node 22 and pnpm 10.

```bash
pnpm install   # also builds packages/contracts
pnpm dev       # api on :4000, web on :3000
```

Open http://localhost:3000 and sign in with the demo account. Locally the API uses a development secret; in production `SESSION_SECRET` is required (32+ characters).

Quality gates (the same ones CI runs on every pull request):

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm --filter @red-pulse/web test:e2e
```

## How the work was organized

- Parent issue #1 with one sub-issue per deliverable (#2–#7), and one branch and one pull request per sub-issue
- `main` is protected: changes go in only through a pull request that passes `Quality Checks` (lint, typecheck, unit tests, build, e2e); squash merge only
- Tests were written first for each behavior, and failed before the implementation made them pass
- AI-assisted: I used Claude Code to design and implement it, deciding the product, architecture, process, and trade-offs and reviewing every pull request

## Deploy

Two Vercel projects from this repository:

| Project | Root | Env |
| --- | --- | --- |
| `dex360-red-pulse-api` | `apps/api` | `SESSION_SECRET` (sensitive) |
| `dex360-red-pulse` | `apps/web` | `API_URL=https://dex360-red-pulse-api.vercel.app` |

## Left out on purpose

- A real database, registration, password reset, and roles
- Filters, date ranges, and charts on the dashboard

Known follow-ups, tracked as issues:

- [#15](https://github.com/MarcosRillo/dex360-red-pulse/issues/15): login rate limiting and revocable sessions. This is the first thing to do before real users. It needs a shared store, which the exercise avoided on purpose.
- [#14](https://github.com/MarcosRillo/dex360-red-pulse/issues/14): make CI independent of apt mirror speed. One run's Playwright system-dependency install took 10 minutes, against 32 seconds in another run at the same time.
