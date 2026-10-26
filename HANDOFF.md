# Handoff: GitHub Copilot Training repo

Last updated: Fri Oct 23, 2026 (Day 3 of 30). All 30 days are built, committed, pushed and deployed. Read this first, then `README.md`.

## What this is

One Next.js 16 app (React 19, TypeScript, Tailwind 4) and one git repo for the whole GitHub Copilot Training Program for Developers and QA. 30 one-hour sessions, Wed Oct 21 to Tue Dec 1, 2026 (30 weekdays, no holidays in the window). Three levels: Basic (Days 1-10), Intermediate (11-20), Advanced (21-30).

The site is the facilitator's showcase for each day: objective, concept, lab, assignment, quiz, answer keys. The labs are small standalone Node files participants edit with Copilot. Separately there is an optional app track where participants build one Next.js app ("Order Desk") across Days 2-10.

Location: `D:\UBTI_IP\Copilot_Training`. Git remote: `github.com/ubtiinc-lakshman/copilot-training` (PUBLIC). Pushing to `main` auto-deploys to Vercel production. Commits use a local `training` identity (no global git identity is set).

## Status

| Area | State |
|---|---|
| Level 1 Basic, Days 1-10 | Built (showcase page, lab files, LAB.md, quiz where the day has one) |
| Levels 2 and 3, Days 11-30 | Built (see `docs/INTERMEDIATE-ADVANCED-PLAN.md`): pages via `LabDay`, lab files, LAB.md. Quizzes for 11-19 and 21-29 are SEEDED in the DB (questions come from the real Level 2/3 questionnaires). Days 20 and 30 are rubric days (no quiz), like Days 2 and 10. NOT yet browser-checked |
| Day 1 | Delivered Wed Oct 21 |
| Live site | https://copilot-training-two.vercel.app (Vercel project `copilot-training`, team `ic-innovation`) |
| Login | Done: Microsoft Entra, single tenant `ubtitestcustomer.onmicrosoft.com` (app "Copilot Training"); whole site gated by `src/proxy.ts` |
| Storage | Done: Neon Postgres (`results`, `attendance`, `quizzes` tables). Quiz questions and answers live ONLY in the DB |
| Day unlock by date | Done: a day is locked until its date (India time, `TRAINING_TZ`); facilitators bypass; "View as participant" toggle |
| Results page | Done: `/facilitator/results`, facilitators only, auto-refresh, heat map, attendance matrix |
| Optional app track (Days 2-10) | Done: `/track` page, seed files, prerequisites, `check-prereqs.mjs` |
| Git | `main` = `origin/main` at `2d316bf`. Vercel auto-deploys each push; last deployment Ready |
| `npm test` | Passes: 40 pass, 17 todo (todo = lab stubs participants fill in) |
| `npm run test:seeded` | Fails on purpose: Day 4, Day 12 (bugs and triage), Day 15 (flaky). Not for CI |
| `npx next build` | Passes (needs dummy auth env vars locally) |
| `npm run lint` | Lab `.js` files are excluded (plain CommonJS on purpose). Whole repo not clean: a setState-in-effect error in `ChecklistTracker` and some warnings in Day 8/Day 3 |

## How to run

```
npm install
copy .env.example .env.local     # then fill in the auth/db vars (or `npx vercel env pull`)
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
| `src/components/` | `Section`, `CodeBlock`, `Callout`, `ChecklistTracker`, `Quiz`, `DecisionLog`, `FacilitatorOnly`, `LabDay` (data-driven day page used by Days 11-29), `UserMenu`, `CheckIn` |
| `src/auth.ts`, `src/proxy.ts`, `src/app/login/` | Entra sign-in (Auth.js v5) and the site-wide gate |
| `src/lib/` | `grade.ts`, `db.ts` (Neon), `quizzes.ts` (quiz from DB), `schedule.ts` (day unlock), `viewMode.ts` (participant view), `facilitator.ts`, `readDayFile.ts` |
| `scripts/seed-quizzes.mjs` | Loads `data/quizzes.json` (git-ignored, local only) into the `quizzes` table |
| `src/app/days/[day]/page.tsx` | Day route (static params 1-30, wrapped in Suspense) |
| `src/app/api/results/route.ts` | POST quiz answers (server re-grades, returns per-question correct), GET results (facilitators) |
| `src/app/api/quiz/[day]/route.ts` | GET a day's questions without answers (answers only for acting facilitators) |
| `src/app/api/attendance/route.ts` | POST: records a day opened by the signed-in user |
| `src/app/facilitator/results/` | Results page |
| `src/app/track/page.tsx`, `src/track/tasks.ts` | Optional app track page and task data |
| `app-track/` | Track README, `check-prereqs.mjs`, `seed/` (fake data and paste-in bug files) |
| `docs/BASIC-PLAN.md`, `docs/INTERMEDIATE-ADVANCED-PLAN.md` | The plans Days 1-10 and 11-30 were built from |

## Decisions and conventions

- **Day folder pattern:** `src/days/day-NN/` plus a `DayNN.tsx` registered in `showcases.tsx`. Lab files are plain JS (CommonJS) so `node --test` runs them with no build step.
- **Stubs and seeds:** unfinished lab functions have `{ todo: ... }` tests so `npm test` stays green. Intentional failures live in `*.seeded.js`, run only by `npm run test:seeded`.
- **Facilitator mode:** `?facilitator=1` on any page shows keys and demo scripts. Convenience only; the keys are in the page payload, so do not deploy publicly.
- **Login and storage:** Auth.js v5 with Microsoft Entra (single tenant), `src/auth.ts` and `src/proxy.ts` gate the whole site. Sign-in works in production. Quiz results, attendance and quizzes live in Neon Postgres (`src/lib/db.ts`, tables auto-created). Facilitators = `FACILITATOR_EMAILS` (set in Vercel).
- **New day (Levels 2-3 pattern):** lab files in `src/days/day-NN/`, a `DayNN.tsx` that passes a config object to `LabDay` (or a custom page for capstones), register in `showcases.tsx`, add the quiz to `data/quizzes.json` and re-seed.
- **Capstone scoring:** `RubricScorer` and `LevelGate` live in `src/days/day-10/Capstone.tsx` and are reused on Days 20 and 30.
- **Next.js 16 specifics:** Cache Components are on, so `params` must be read inside a Suspense boundary (see the day page). Read `node_modules/next/dist/docs/` before framework-level changes (`AGENTS.md`).
- **Fake credentials only** in anything seeded (`FAKE-...`).
- Git prints LF/CRLF warnings on Windows. They are harmless.

## Vercel and Azure setup

- Vercel env vars (production): `AUTH_SECRET`, `AUTH_MICROSOFT_ENTRA_ID_ID/_SECRET/_TENANT_ID`, `FACILITATOR_EMAILS` (lakshman.s@ubtiinc.com, Flossy.Veronica@ubtiinc.com), `DATABASE_URL` (Neon, set by the integration). Env changes need a redeploy.
- Entra client secret expires 2027-04-30. Redirect URIs: the production callback and localhost:3000.
- Vercel Authentication (SSO protection) is OFF so participants reach our own login; previews are therefore also open (still behind Entra).
- Quiz data: edit `data/quizzes.json` locally (not in git) and run `npx vercel env run -e production -- node scripts/seed-quizzes.mjs` (it works from this machine; it re-uploads every day listed). Back this file up; it is the only copy besides the DB.
- Participants must exist in the Test Customer tenant (members or invited guests).

## Source material (outside this repo)

`C:\Users\lakshman.s\UB Technology Innovations, Inc\Innovation Center - Documents\IC - Training\Github Copilot\`

- `4_LAB_WORKBOOKS/` (Basic, Intermediate, Advanced) and `2_FACILITATOR_GUIDES/`: the content each day follows. Intermediate and Advanced are the sources for Days 11-30.
- `7_DAY_WISE_MATERIALS/`, `1_MASTER_PROGRAM/`, `GitHub-Copilot-Training-Plan-Detailed.md`: schedule and program docs. All dates were moved to the Oct 21 start.
- `Training Material/` (30 decks on the UBTI template), `Assessment Questionnaire By Level/` (with and without answers), `Assignment - Questionnaire By Level/`, `Participant- Assignments/`, `GitHub-Copilot-Training-Plan-Schedule.xlsx`.
- The Python and Node scripts that generated those decks and documents were deleted with a temp folder. Any change to them has to be made directly in the files.
- Holiday list: `C:\Users\lakshman.s\Downloads\UI_Holiday List 2026.pdf`.

## Known gaps and risks

1. **Quiz answers for Days 1 and 3-8 were reconstructed** from memory, not copied. The real ones are in `Assessment Questionnaire By Level/Level 1 - Answers/*.docx`; Days 11-29 were extracted from the Level 2/3 equivalents with a small zipfile + regex script (read `word/document.xml`). Do the same for Level 1, compare with `data/quizzes.json`, then re-seed.
2. **Sign-in works (confirmed by the user). Not yet browser-verified:** quiz load/submit from the DB (Days 1-29), the participant-view toggle, the locked-day message and the home-page "Opens" badges, the new results page, Flossy's facilitator access, and every Day 11-30 page.
3. **Attendance** = opened the day page while signed in (not session presence).
4. **Old quiz answers are in public git history** (assessments.ts, commits before 91b9a9c). Removing them needs a history rewrite and force-push; not done. Treat Days 1-9 quizzes as exposed.
5. **Facilitator-only text** (demo scripts, answer keys inside `FacilitatorOnly` blocks) is still in the public source; `?facilitator=1` reveals it to any signed-in participant. `LAB.md` files not checked for solutions.
5b. Neon has its own backups; `data/quizzes.json` is local only. The Day 12/15/24/25 facilitator notes (bug answers) are also in the public source.
6. `/days/99` returns 200 with the not-found content instead of a 404.
7. **App track:** seed files were not run inside a real Order Desk app. The Day 4 order route gives a TypeScript error on `next build` (works in dev). `check-prereqs.mjs` was only run on this machine. Vitest needs Node 22.12+.
8. A leftover dev server from earlier sessions may still hold port 3000 and could serve stale code.
9. Home-page unlock badges and day locks use India time (`TRAINING_TZ`, default `Asia/Kolkata`). Set `TRAINING_TZ` in Vercel if participants are elsewhere (redeploy after).
10. Day 3 uncommitted edits (see below) may contain filled-in lab solutions; check before committing.

## Working notes for the next session

- Bash heredocs containing apostrophes fail on this machine ("unexpected EOF"). Write files with the Write tool instead.
- Never `git add src` or `git add -A`: it picks up the user's uncommitted Day 3 edits. Add specific paths.
- Pulling production env vars to a file is blocked. `npx vercel env run -e production -- <cmd>` works for one-off scripts.

## Suggested next steps

1. Click through: quiz on an open day (loads, scores, saves), `?facilitator=1`, participant view, a locked day, `/facilitator/results`.
2. Decide on the public repo: make it private (add participants as collaborators so they can copy `app-track/` and labs) or rewrite history to drop the old answer keys; move facilitator-only blocks out of the source if they must stay secret.
3. Verify the reconstructed quizzes (gap 1) against `Assessment Questionnaire By Level/`, then re-seed.
4. Invite participants to the Test Customer tenant; confirm they can sign in.
5. Ideas for participants (the user wants to discuss these next): a my-progress page, saving checklists and the decision log to the DB instead of the browser, CSV/Excel export of attendance, reminders.
6. Click through Days 11-30 in a browser (Day 11 opens Nov 4). Fix anything the pages show wrong; the lab file listings and facilitator notes are the likeliest places.
7. Uncommitted local edits not made by Claude: `src/days/day-03/*` (test-helpers.js, utils.js, utils.test.js), `.gitignore`, `instructions.md`, `skills-lock.json`. `.github/copilot-instructions.md` is the user's own Copilot practice file; leave it. Review the rest before committing.

## Starting a new conversation

Open Claude Code in `D:\UBTI_IP\Copilot_Training` and say:

> Read HANDOFF.md and README.md. Today is Day N of the training. Check that `/days/N` is ready for tomorrow's session, then continue with <next step>.

## Weekly app program (added Oct 26)

The training changed to one app per week (plan: `docs/APP-BUILD-PLAN.md`, announcement draft: `docs/ANNOUNCEMENT-DRAFT.md`). The 30-day content is now the self-learning library. New code:

| Path | Purpose |
|---|---|
| `src/program/calendar.ts` | 16 sessions, 5 Friday calls, 5 Monday submissions, finale, weekly required features |
| `src/lib/schema.ts`, `src/lib/program.ts`, `src/lib/assign.ts` | Tables (`completions`, `painpoints`, `assignments`, `submissions`), all their SQL, random assignment |
| `src/app/today/page.tsx`, `src/components/ProgramActions.tsx` | Participant "My week" page (lab complete button, pain point, submission form, progress) |
| `src/app/facilitator/progress/` | Facilitator tracking page |
| `src/app/api/{activity,painpoint,submission,progress}/route.ts` | The endpoints |
| `data/painpoints.json`, `scripts/seed-painpoints.mjs` | Pain-point bank (git-ignored, week 1 = 44 written) |
| `src/lib/assign.test.mjs` | `npm run test:site`: 10 tests on in-memory Postgres (PGlite) |

Status: built, type-checked, linted, SQL tested. NOT yet browser-checked, NOT yet seeded into production, and not pushed unless the git log says so. To go live: push to `main` (Vercel auto-deploys), run the seed command from the README, then sign in and click through `/today` and `/facilitator/progress`.
Open: weeks 2-5 pain points (about 44 each, tagged by that week's required feature), quizzes for the new sessions (the old day quizzes do not match the new topics), who counts as a participant before they sign in (the progress page only lists people who have used the site).
