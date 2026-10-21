# GitHub Copilot Training (Next.js)

One Next.js app and one git repo for the whole GitHub Copilot Training Program (Developers & QA).
30 sessions, Oct 21 to Dec 1, 2026. Each day has its own folder.

## Run

```
npm install
npm run dev     # http://localhost:3000
npm test        # Node test runner over src/days/**/*.test.js (todo tests are lab stubs)
npm run test:seeded   # intentionally failing Day 4 tests (Dev bug + QA failing test)
```

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

## Quiz results (server)

Quiz submissions are stored in SQLite at `data/results.db` (git-ignored, created on first save, uses Node's built-in `node:sqlite`). The server re-grades the answers itself; the browser score is never trusted.

- Participants enter a name on the quiz; results save on **Check answers**.
- Facilitator page: `/facilitator/results` (enter the key). Shows best score per participant per day, the average vs the 70% gate, Day 9 hard gate, all attempts, CSV export.
- Set `FACILITATOR_KEY` in `.env.local` (not committed). Without it the results API refuses to answer.
- Back up `data/results.db`. Needs a host with a writable disk (not serverless).

## Adding a day

1. Create `src/days/day-NN/` with the day's code, tests (`*.test.js`) and a `DayNN.tsx` showcase.
2. Register it in `src/days/showcases.tsx`.
3. Commit on the day's work: `git commit -m "Day NN: <topic>"`.

## Ground rules (Day 1)

- Never paste secrets, credentials, customer PII or proprietary algorithms into a prompt.
- Every suggestion is read and judged by a human before it is kept.

Next.js 16 note: see `AGENTS.md` and `node_modules/next/dist/docs/` before changing framework-level code.
