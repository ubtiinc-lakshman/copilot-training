# GitHub Copilot Training (Next.js)

One Next.js app and one git repo for the whole GitHub Copilot Training Program (Developers & QA).
30 sessions, Oct 21 to Dec 1, 2026. Each day has its own folder.

## Prerequisites

| Need | Version | Check |
|---|---|---|
| Node.js | 22.13 or newer. 24 LTS recommended (built and tested on 24.14). Next.js 16 needs 20.9+, the results database uses Node's built-in `node:sqlite` (22.13+), and `npm test` uses Node's test-file globs | `node -v` |
| npm | 10 or newer (comes with Node) | `npm -v` |
| Git | 2.30 or newer | `git --version` |
| Free port | 3000 (change with `npm run dev -- -p 3001`) | |
| Disk | about 1 GB for `node_modules` and the build | |
| npm registry access | Behind a proxy: `npm config set proxy <url>` and `npm config set https-proxy <url>` | `npm ping` |

Works on Windows, macOS and Linux. On Windows, clone into a plain folder (not OneDrive/SharePoint: sync breaks `node_modules`). No database server, Docker or other tools are needed.

## First-time setup

```
git clone <repo-url> copilot-training
cd copilot-training
npm install
copy .env.example .env.local      # macOS/Linux: cp .env.example .env.local
```

Fill in `.env.local` (see the comments in `.env.example`): Auth.js secret, the Microsoft Entra app registration, `FACILITATOR_EMAILS`, and a Neon `DATABASE_URL`. The file is git-ignored, so every clone needs its own.

## Run

```
npm run dev     # http://localhost:3000
npm test        # Node test runner over src/days/**/*.test.js (todo tests are lab stubs)
npm run test:seeded   # intentionally failing Day 4 tests (Dev bug + QA failing test)
npm run build && npm start    # production build
```

The quiz results database (`data/results.db`) is created automatically on the first saved result. It needs a writable disk.

Troubleshooting: `EADDRINUSE` means port 3000 is taken (stop the other server or use `-p`). Node prints an "SQLite is an experimental feature" warning: that is expected. Page changes not showing: stop the server, delete `.next`, start again.

## Layout

| Path | Purpose |
|---|---|
| `src/days/registry.ts` | The 30 days: level, title, date |
| `src/days/showcases.tsx` | Maps a day number to its showcase component |
| `src/days/day-NN/` | Everything for one day: lab code, tests, showcase page, LAB.md |
| `src/app/page.tsx` | Home: all days grouped by level |
| `src/app/days/[day]/page.tsx` | One route per day (`/days/1` ... `/days/30`) |

## Facilitator mode

Add `?facilitator=1` to any day URL (e.g. `/days/9?facilitator=1`) to show answer keys, demo scripts and the Day 10 rubric. Convenience only, not security: do not deploy publicly with the keys in the payload.

## Status

Level 1 (Basic), Days 1-10: ready. See `docs/BASIC-PLAN.md`. Days 11-30: planned.

## Login, results and attendance

Everyone signs in with their Microsoft work account (Auth.js, single Entra tenant). Quiz results and day attendance are stored in Neon Postgres, keyed by email. The server re-grades quiz answers itself.

- Attendance: opening `/days/N` while signed in records that day (first visit counts).
- Facilitator page: `/facilitator/results`, only for emails in `FACILITATOR_EMAILS`. Best score per participant per day, average vs the 70% gate, Day 9 hard gate, attendance, all attempts, CSV export.
- Tables are created automatically on first use.

## Deploy to Vercel

1. Entra admin center: App registrations, New registration, single tenant. Redirect URI (Web): `https://<your-site>/api/auth/callback/microsoft-entra-id` (and `http://localhost:3000/api/auth/callback/microsoft-entra-id` for local). Create a client secret.
2. Vercel: import the repo, then Storage, add Neon (sets `DATABASE_URL`).
3. Project env vars: `AUTH_SECRET` (`npx auth secret`), `AUTH_MICROSOFT_ENTRA_ID_ID`, `AUTH_MICROSOFT_ENTRA_ID_SECRET`, `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID`, `FACILITATOR_EMAILS`.
4. Deploy. Note: `?facilitator=1` still reveals answer keys to any signed-in participant (convenience only).

## Adding a day

1. Create `src/days/day-NN/` with the day's code, tests (`*.test.js`) and a `DayNN.tsx` showcase.
2. Register it in `src/days/showcases.tsx`.
3. Commit on the day's work: `git commit -m "Day NN: <topic>"`.

## Ground rules (Day 1)

- Never paste secrets, credentials, customer PII or proprietary algorithms into a prompt.
- Every suggestion is read and judged by a human before it is kept.

Next.js 16 note: see `AGENTS.md` and `node_modules/next/dist/docs/` before changing framework-level code.
