# Handoff: GitHub Copilot Training repo

Last updated: Thu Oct 22, 2026 (Day 2 of 30). Read this first, then `README.md`.

## What this is

One Next.js 16 app (React 19, TypeScript, Tailwind 4) and one git repo for the whole GitHub Copilot Training Program for Developers and QA. 30 one-hour sessions, Wed Oct 21 to Tue Dec 1, 2026 (30 weekdays, no holidays in the window). Three levels: Basic (Days 1-10), Intermediate (11-20), Advanced (21-30).

The site is the facilitator's showcase for each day: objective, concept, lab, assignment, quiz, answer keys. The labs are small standalone Node files participants edit with Copilot. Separately there is an optional app track where participants build one Next.js app ("Order Desk") across Days 2-10.

Location: `D:\UBTI_IP\Copilot_Training`. Local git only, no remote yet. Commits use a local `training` identity (no global git identity is set).

## Status

| Area | State |
|---|---|
| Level 1 Basic, Days 1-10 | Built and committed (showcase page, lab files, LAB.md, quiz where the day has one) |
| Days 11-30 | Not built. `/days/N` shows a placeholder. Titles and dates are in `src/days/registry.ts` |
| Day 1 | Delivered Wed Oct 21 |
| Quiz results on the server | Done: SQLite, server-side grading, `/facilitator/results` |
| Optional app track (Days 2-10) | Done: `/track` page, seed files, prerequisites, `check-prereqs.mjs` |
| `npm test` | Passes: 10 pass, 5 todo (todo = lab stubs participants fill in) |
| `npm run test:seeded` | 2 failures, on purpose (Day 4 Dev bug and QA failing test) |
| `npx next build` | Passes (last run after the app-track prerequisites commit) |
| `npm run lint` | Not run |

## How to run

```
npm install
copy .env.example .env.local     # then set FACILITATOR_KEY
npm run dev                      # http://localhost:3000
npm test
```

Needs Node 22.13+ (built and tested on 24.14; Node 22 not tried). A dev server may already be running on port 3000 from earlier work; `EADDRINUSE` means that. `.env.local` already exists on this machine with the facilitator key (not in git).

## Layout

| Path | Purpose |
|---|---|
| `src/days/registry.ts` | The 30 days (level, title, date; dates computed from Oct 21) |
| `src/days/showcases.tsx` | Maps day number to its showcase component |
| `src/days/day-NN/` | One day: `DayNN.tsx`, lab code, tests, `LAB.md`, seeds |
| `src/days/assessments.ts` | Quiz questions and answers for Days 1, 3-9 |
| `src/components/` | `Section`, `CodeBlock`, `Callout`, `ChecklistTracker`, `Quiz`, `DecisionLog`, `FacilitatorOnly` |
| `src/lib/` | `grade.ts` (shared grading), `db.ts` (SQLite), `facilitator.ts`, `readDayFile.ts` |
| `src/app/days/[day]/page.tsx` | Day route (static params 1-30, wrapped in Suspense) |
| `src/app/api/results/route.ts` | POST quiz answers (server re-grades), GET results (needs key) |
| `src/app/facilitator/results/` | Results page |
| `src/app/track/page.tsx`, `src/track/tasks.ts` | Optional app track page and task data |
| `app-track/` | Track README, `check-prereqs.mjs`, `seed/` (fake data and paste-in bug files) |
| `docs/BASIC-PLAN.md` | The plan Days 1-10 were built from |

## Decisions and conventions

- **Day folder pattern:** `src/days/day-NN/` plus a `DayNN.tsx` registered in `showcases.tsx`. Lab files are plain JS (CommonJS) so `node --test` runs them with no build step.
- **Stubs and seeds:** unfinished lab functions have `{ todo: ... }` tests so `npm test` stays green. Intentional failures live in `*.seeded.js`, run only by `npm run test:seeded`.
- **Facilitator mode:** `?facilitator=1` on any page shows keys and demo scripts. Convenience only; the keys are in the page payload, so do not deploy publicly.
- **Quiz results:** stored in `data/results.db` (git-ignored). The server grades the submitted answers itself. Participants type their own name (no login). `FACILITATOR_KEY` in `.env.local` protects the results API.
- **Next.js 16 specifics:** Cache Components are on, so `params` must be read inside a Suspense boundary (see the day page). Read `node_modules/next/dist/docs/` before framework-level changes (`AGENTS.md`).
- **Fake credentials only** in anything seeded (`FAKE-...`).
- Git prints LF/CRLF warnings on Windows. They are harmless.

## Source material (outside this repo)

`C:\Users\lakshman.s\UB Technology Innovations, Inc\Innovation Center - Documents\IC - Training\Github Copilot\`

- `4_LAB_WORKBOOKS/` (Basic, Intermediate, Advanced) and `2_FACILITATOR_GUIDES/`: the content each day follows. Intermediate and Advanced are the sources for Days 11-30.
- `7_DAY_WISE_MATERIALS/`, `1_MASTER_PROGRAM/`, `GitHub-Copilot-Training-Plan-Detailed.md`: schedule and program docs. All dates were moved to the Oct 21 start.
- `Training Material/` (30 decks on the UBTI template), `Assessment Questionnaire By Level/` (with and without answers), `Assignment - Questionnaire By Level/`, `Participant- Assignments/`, `GitHub-Copilot-Training-Plan-Schedule.xlsx`.
- The Python and Node scripts that generated those decks and documents were deleted with a temp folder. Any change to them has to be made directly in the files.
- Holiday list: `C:\Users\lakshman.s\Downloads\UI_Holiday List 2026.pdf`.

## Known gaps and risks

1. **Quiz answers for Days 1 and 3-8 were reconstructed** from memory of the questionnaires, not copied. Check them against `Assessment Questionnaire By Level/` (Days 2 and 10 use a checklist and a rubric, not a quiz).
2. **Nothing has been clicked through in a browser.** Pages were checked with `curl` (200 and content) and the results API end to end. Quiz submit, facilitator mode, checklists and the decision log are untested in a browser.
3. **No attendance tracking.** The results page covers only the 70% score side of the level gate.
4. **Names are unauthenticated**, so anyone can submit under any name. Matters for the Day 9 hard gate.
5. **Hosting:** SQLite needs a writable disk (not serverless). `data/results.db` has no backup.
6. `/days/99` returns 200 with the not-found content instead of a 404.
7. **App track:** seed files were not run inside a real Order Desk app. The Day 4 order route gives a TypeScript error on `next build` (works in dev). `check-prereqs.mjs` was only run on this machine. Vitest needs Node 22.12+.
8. A leftover dev server from earlier sessions may still hold port 3000 and could serve stale code.

## Suggested next steps

1. Day 3 and Day 4 are next in the build order for the sessions; check each day's page the day before.
2. Verify the reconstructed quizzes (gap 1).
3. Click through one full day in a browser, including a quiz submit and `/facilitator/results`.
4. Build Intermediate (Days 11-20) from `Lab_Workbook_Intermediate.md`, same pattern: showcase, lab files, `LAB.md`, quiz data, seeded failures. Write a `docs/INTERMEDIATE-PLAN.md` first, as was done for Basic.
5. Decide where the site is hosted and whether to add a remote repo, a backup for the database, and participant sign-in.

## Starting a new conversation

Open Claude Code in `D:\UBTI_IP\Copilot_Training` and say:

> Read HANDOFF.md and README.md. Today is Day N of the training. Check that `/days/N` is ready for tomorrow's session, then continue with <next step>.
