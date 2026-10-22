# Red Pulse — Austral Motors dealer network dashboard

A small full stack exercise for Dex 360: an automaker (the fictional **Austral Motors**) monitors the health of its dealership network.

- Login screen
- Protected dashboard with KPI cards and a dealership table
- Logout

Work is tracked in GitHub Issues: one parent issue, one sub-issue per deliverable, and one pull request per sub-issue.

## Workspace

```text
apps/web            Next.js 16 (App Router) — UI, login, dashboard
apps/api            Express 5 + TypeScript — auth, session, network data
packages/contracts  Zod schemas shared by web and api
```

## Run locally

Requires Node 22 and pnpm 10.

```bash
pnpm install   # also builds packages/contracts
pnpm dev       # api on :4000, web on :3000
```

Quality gates (the same ones CI runs on every pull request):

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```
