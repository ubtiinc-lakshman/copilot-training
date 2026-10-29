# Handoff: GitHub Copilot Training repo

Last updated: Fri Oct 30, 2026. **Read "Current state (Oct 30)" at the very bottom first (it supersedes the Oct 29 section).** The program is now: eight common GitHub Copilot days for everyone (main program, starts Mon Nov 2), with the weekly app program turned into self-paced levels. Most sections above describe the older 30-day format (now the self-learning library) or the Oct 26-27 weekly program; the bottom sections supersede them where they differ.

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
powershell -File scripts\local-env.ps1   # .env.local from the Vercel Preview config (see "Current state (Oct 30)")
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

> Read HANDOFF.md and README.md. Today is <date>, session N of the weekly program. Check that `/sessions/sNN` and the week's pain points are ready, then continue with <next step>.

Sessions run Tue/Wed/Thu (in person) with Friday and Monday calls; see `src/program/calendar.ts` for dates and `docs/APP-BUILD-PLAN.md` for the plan.

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
| `roster` table, `data/roster.json`, `scripts/seed-roster.mjs`, `src/app/api/roster/route.ts` | The 36 participants (from "Training List - with GitHub IDs.xlsx"). `data/roster.json` is git-ignored. The facilitator progress page lists ONLY roster members (facilitators and testers are left out; work of removed people stays in the DB). Facilitators add, update and remove people in the "Participants" section of `/facilitator/progress`. Pain-point assignment IS restricted to the roster (/api/painpoint returns 403 otherwise; facilitators who want to test must add themselves) |

Also added after the first version of this section:

| Path | Purpose |
|---|---|
| `src/app/page.tsx` | Home = program dashboard: today card, progress ring (labs and calls done), five app cards with pain point, submission status, sessions (titles link to session pages), "Go deeper" library links |
| `src/app/library/page.tsx` | The 30 lessons (self-learning). All 30 are unlocked: `isLessonOpen()` in `src/lib/schedule.ts` always returns true. Weekly events still use date-gated `isOpen` |
| `src/app/sessions/[id]/page.tsx`, `src/program/sessions.ts`, `src/program/content/week1-5.ts` | Session pages for s01-s15: objective, before you come, teach, demo, lab, quiz, share, homework, facilitator notes (shown only to acting facilitators). Content is data; add or edit text there |
| Quiz numbering | Session quizzes are quiz day 100 + session number (101 = s01 ... 115 = s15), stored in the same `quizzes` table and graded by `/api/results`. They open on the session date (`quizOpen` in `schedule.ts`). Answers live only in the git-ignored `data/quizzes.json` and Neon |
| `calendar.ts` `libraryFor(id)` | Maps each session to library days for "Go deeper" links |
| Library lab tracking (added by another session) | `LabTaskStatus` on each lesson saves `lab-<day>` completions; Results page shows them |
| UI | Brand tokens and `@utility` classes in `src/app/globals.css` (`card`, `btn-primary`, `btn-ghost`, `input`, `chip-*`, `link`). Use these, not raw zinc/blue classes. All pages (home, My week, library, day pages, sessions, track, facilitator Progress and Results, lab widgets) were moved to this theme on Oct 26 |
| Header | `src/components/UserMenu.tsx` (server) + `HeaderClient.tsx` (client: `NavLinks` highlights the current page, `AccountMenu` avatar dropdown that closes on outside click, Esc and navigation). Menu holds profile, My week, "View as participant" (facilitators) and Sign out. Progress and Results links are facilitator-only |
| Profile | `/profile` (`src/app/profile/page.tsx`, `src/lib/profile.ts`): avatar, role, team and GitHub from the roster, stat tiles, certification progress bars (80% sessions, 4 of 5 apps, 70% quiz average), "My apps" list. Sessions done = labs and calls marked complete, not real attendance |

Status: built, type-checked, linted on the new files, SQL tested (`npm run test:site`, `npm test`), `next build` passes. NOT browser-checked after sign-in (the Entra values are not available locally), NOT seeded in production, not pushed. Local `.env.local` now has the pulled Neon values plus a throwaway `AUTH_SECRET`; real sign-in locally still needs the Entra vars, which Vercel will not hand out (marked Secret).

Gotchas learned:
- Anything calling `auth()` in a server component needs `await connection()` first (Cache Components), or prerender fails with the `crypto.getRandomValues()` error. Done in `UserMenu` and the day, progress and results pages.
- Bash heredocs with apostrophes fail here; use the Write tool or a script file. Read a file with the Read tool before Write/Edit (a Bash `cat` does not count).
- Tailwind 4: custom component classes must be `@utility`, not `@layer components`, if they are used inside `@apply`.
- Never `git add -A` or `git add src`. Uncommitted edits that are not Claude's: `.gitignore`, `src/days/day-03/*`, `src/days/day-04/*`, `instructions.md`, `skills-lock.json`. Leftover local diff in `src/app/login/page.tsx` is harmless (revert it); Also untracked/unrelated: `Notes.txt`. `DecisionLog.tsx` was restyled and committed.
- Known lint error, not ours: `setState` in effect in `ChecklistTracker`.

Open / next, in order:
1. Sign in on the live site and click through `/`, `/today`, `/sessions/s01`, the quiz, the pain point button, `/facilitator/progress` (check the 36 people, add/remove one and undo). A facilitator test click uses one pain point (week 1 has 8 spare, other weeks about 7).
2. Pain-point bank is done for weeks 1-5 (217: 44, 44, 43, 43, 43). Weeks 2-5 were written Oct 26 and not reviewed by anyone; skim them before Nov 2. Source is `data/painpoints.json` (git-ignored); validate with `node scripts/seed-painpoints.mjs --check`, load with the seed script.
3. Done: the 36 roster people are invited to the Entra tenant (confirm that each one can sign in; only invited or member accounts can).
4. Decide the finale (Tue Dec 1): it has an event but no session page.
5. Admin answers still needed: GitHub Copilot credits (four questions in `docs/APP-BUILD-PLAN.md`), Vercel and Supabase accounts and licensing, email provider (s10), AI provider and key (s13), whether MCP and Copilot code review are enabled (s08, s12), data-residency or security approval, Cloudflare as fallback, network check from the conference room.
6. The product steps in the session content (Supabase, Vercel, MCP settings) were written from general knowledge and not tested on the real accounts; test the exact steps the day before each session.
7. Reroll policy for pain points (default: no reroll). Certification rule: at least 80% attendance, at least 4 of 5 apps deployed and passing, quiz average at least 70%.

## Team tracks syllabus (Oct 27) - PARKED (Oct 29: only the common days are going ahead; see "Current state")

Flossy asked for training specific to each team's day-to-day work. Her plan, `Downloads\GitHub_Copilot_Common_and_Department_Wise_Training_Plan_Updated.docx`, is Day 0 + 5 common days + 2 hands-on/gate days + 3 workshop days and 2 hands-on days per team + 1-week project + 1 demo day, for five teams: Application Development, QA, Power BI, Fabric/Data, AI. The gap analysis is `Downloads\Copilot Training Plan vs Prompt Engineering Program Gap Summary.pdf` (the Prompt Engineering program covers about 30-40% of the common content; nothing Copilot-specific).

What was made (nothing committed, nothing pushed):
- `Downloads\GitHub Copilot Training - Updated Syllabus for Director.docx`: the Director-facing syllabus (A4). One delegated track per team, in the portal session format (objective, lab, done-when). NOT rendered or visually checked (no LibreOffice or pdftoppm on this machine); open it in Word first. It was built by a throwaway script in the session scratchpad, so edit the docx directly or ask for a rebuild from `tracks.ts`.
- `src/program/tracks.ts` (untracked): the same content as typed data. `COMMON` (Days 0-7) and `TRACKS` (5 tracks, each with 5 sessions `dev-1`..`dev-5`, `qa-`, `powerbi-`, `fabric-`, `ai-`, modules, capstone, project, reuse, build, `delegate`). Not imported anywhere, `tsc --noEmit` passes. Existing calendar, pages and tables are untouched.

Proposed schedule (illustrative, in chat only, NOT yet in the docx or calendar.ts). Holidays checked against the Chennai 2026 list: Dec 25 (Fri), Jan 15 Pongal (Thu), Dec 31 floating; Jan 26 is a Monday.
- Common Day 0-3 Dec 8-10, Days 4-6 Dec 15-17, Day 7 gate Tue Dec 22, break Dec 25 - Jan 4.
- Wave 1 (Dev, QA, AI): track days 1-3 Jan 5-7, days 4-5 Jan 12-14, project Jan 19-23, demo Tue Jan 27.
- Wave 2 (Power BI, Fabric; content built last): days 1-3 Jan 20-22, days 4-5 Jan 27-28, project Feb 1-5, demo Tue Feb 9.
- Weekly-program graduates could do Day 0 plus the Day 7 gate instead of Days 1-6.

THE OPEN DECISION (confirm with Flossy, then the Director): replace the curriculum, or add to it?
- **A. Replace**: tracks become the curriculum; the current weekly app program becomes the Application Development track, unchanged. Recommended, introduced at the Dec 1 finale rather than mid-flight (week 1 is already running with 36 invited people). Needs the longer schedule above, or an early start for non-developer teams from Nov 3 with separate facilitators.
- **B. Keep app building as main** and add a track session on the same Tue/Wed/Thu days. Fits Oct 27 - Dec 1 (15 session days cover Day 0-7 + 5 track days), but doubles daily load and is a poor fit for Power BI and Fabric people.
- Deciding fact: which teams are on the 36-person roster? If only dev, QA and AI, B is realistic. If any Power BI or Fabric, A is better. Check `data/roster.json` team field (git-ignored) or the roster table.

After the decision:
1. Rewrite docx sections 2 (what stays), 3 (structure) and add a "Proposed schedule" section to match the chosen option; fill in the delegate per team (all "TBC").
2. Portal: add an optional `track` field to events in `src/program/calendar.ts`, put the dated track events there, show each participant only their team's events (team comes from the roster), add `/tracks/[id]` pages, track-session completion in `completions` (ids already `dev-1` style), gate as quiz day 200. Do not change the existing 16 sessions.
3. Draft lab text in `tracks.ts` is a first pass from Flossy's module lists; each team's delegate should review their track.

Still open from before and needed by the Director: Copilot credits and licences, MCP and Copilot code review enabled, Fabric environment and sample data (Fabric track), Power BI access and datasets, pass marks (proposed 70% gate, 80% attendance), session length per day, which teams and how many people each.

The earlier "Open / next" list (browser click-through of the live site, skim weeks 2-5 pain points before Nov 2, confirm sign-ins) still applies and was not done in this session.

## Current state (Oct 29)

**Everything below is pushed to `main` (last commit `bc3a7d8`) and live at https://copilot-training-two.vercel.app.** Day 0 is Mon Nov 2.

### Decisions
- The eight common GitHub Copilot days (Day 0-7, all teams together, FULL days) are the main program. The Director approved the syllabus; the doc went to Flossy on Oct 29 and is waiting for feedback. Team tracks (Dev, QA, Power BI, Fabric, AI) are PARKED: `src/program/tracks.ts` is an unused draft, nothing on the site uses it.
- Common day dates (draft until leadership finishes planning): Day 0-4 Mon Nov 2 - Fri Nov 6; Mon Nov 9 is a holiday (Diwali, confirmed); Day 5 Tue Nov 10, Day 6 Wed Nov 11, Day 7 (gate) Thu Nov 12.
- The weekly app program is self-paced with levels: week N opens when the week N-1 app is submitted. Pass rule proposals (not confirmed by the Director): gate 7 of 10 and at least 1 on the security task; attendance 80%.

### What exists (code)
- `src/program/common.ts`: the 8 days, dates and full page content (objective, teach, demo, lab, done-when, share, homework, facilitator block). Pages `/common` and `/common/c0` ... `/common/c7`. Completion is stored in `completions` as `c0`..`c7` through `/api/activity` (date-gated for participants, facilitators bypass). Day 6 is the BrightDesk support-backlog brief with 20 invented tickets and SLA rules. Day 7 page only lists the five gate tasks in general terms.
- Home page leads with Common days; the weekly app section is titled "Self-paced". Nav: Home, Common days, My week, Library (+ Progress, Results for facilitators).
- Levels: `levelOf` / `loadLevel` in `src/lib/program.ts` (levelOf lives there because the node tests load that file without the `@/` alias). `/api/painpoint`, `/api/submission`, `/api/activity` check the level; `/today`, home and `/profile` show levels; `calendar.ts` dates are now only labels. Session quizzes are always open (`quizOpen` in `schedule.ts`).
- Commit screenshots: session labs s01-s15 can only be marked done after a PNG/JPG/WebP (max 3 MB) screenshot of a git commit, made on a branch named `lab-sNN`, not main. `POST/GET /api/proof`, table `lab_proofs` (base64 text). The tick on a session lab in the facilitator Progress table links to the screenshot. Calls, common days and library lab tasks need no screenshot.
- Tests: `npm run test:site` (13 pass, includes levels and proofs), `npm test` passes, `next build` passes. Known lint error not ours: `ChecklistTracker` setState in effect.

### Documents (outside the repo, in `C:\Users\lakshman.s\Downloads\`)
- `GitHub Copilot Training - Common Sessions Plan for Director v2.docx`: the doc sent to Flossy (common days only, Nov 9 holiday noted). The older files `... Program Plan for Director.docx` and `... Updated Syllabus for Director.docx` still contain the track details; do not send them.
- `GitHub Copilot Training - Day 7 Gate - A Participant Handout.docx` and `... - B Facilitator Scoring Guide.docx`: five tasks x 2 points on the BrightDesk tickets. B has the answers and must stay out of the repo and the site. The docs were built with python-docx scripts that lived in the session scratchpad and are gone; edit the docx directly or rebuild.

### Verified and not verified
- Verified live (Oct 29): `/common` list and `/common/c0` render, the completion button saves, shows Completed after a reload, Undo works, Day 5 shows Tue Nov 10. The proof flow by API: 400 without a screenshot, upload 200, complete 200, view 200, wrong file type 400, undo 200.
- NOT verified visually: `/today` and `/sessions/sNN` with the new level text and the screenshot upload box (the Chrome screenshot timed out), `/common/c6` and `/common/c7`, the date lock for non-facilitators ("View as participant"), the facilitator Progress page with screenshot links.
- Leftover test data in production: a 20x20 test image for lakshman.s on s01 in `lab_proofs`.

### Gotchas learned
- In production, the one-line form `await (await db())` followed by a template literal throws a TypeError that the page's try/catch swallowed, so completed labs never showed after a reload. Use `const sql = await db();` and then call `sql` with the template on its own line. Fixed on the common, session and library pages; use the same form in new code.
- Bash heredocs with apostrophes fail on this machine ("unexpected EOF"); a failed call can still have run its earlier lines. Write script files with the Write tool.
- Word keeps a lock on an open docx: saving over it fails with a permission error, so save under a new name.
- The auto-mode classifier blocks reading the production database from a script. Check production behaviour through the signed-in site or API instead.
- `/api/progress` only returns roster members, so a facilitator who is not on the roster will not see their own rows there.

### Open / next, in order
1. Before Mon Nov 2: open `/common`, `/common/c0`, `/today` and `/sessions/s03` in a browser; check the screenshot box renders. Check everyone can sign in and has Copilot (Day 0 starts with this).
2. Wait for Flossy and the Director on the doc: dates, pass mark and attendance rule, which teams and how many people attend.
3. Admin answers still needed (Days 4 and 5 depend on them): Copilot licences and credits, whether Agent Mode, MCP and Copilot code review are enabled, public-code matching and content exclusion settings.
4. Review the drafts: Day 6 brief (`c6`) and the Day 7 gate. Check the capability names in Task 3 against the VS Code version participants use. Write the retake set only if someone fails.
5. Progress and Results pages do not show common days yet, and gate scores live on the paper score sheet. Add them if the Director wants tracking on the site.
6. Weekly program leftovers: skim the week 2-5 pain points (written Oct 26, unreviewed); confirm all 36 invited people can sign in; the finale (was Tue Dec 1) has no session page and is no longer scheduled.
7. If tracks come back: wire `tracks.ts` into pages and add the delegates; the open Fabric and Power BI environment questions apply.
8. Uncommitted work that is not ours, leave it: `src/days/day-03/*`, `src/days/day-04/*`, `src/days/day-06/*`, `.gitignore`, `Notes.txt`, `instructions.md`, `skills-lock.json`. Never `git add -A` or `git add src`; add specific paths.

## Current state (Oct 30)

The site is now the **IC Training Center**: a catalog of self-paced courses (content, labs, tasks, quizzes, assessment). GitHub Copilot is the first course. Prompt Engineering is a "Coming soon" placeholder; its material (Word, PowerPoint, PDF files) has not been given to us yet. Where this section differs from older ones, this section wins.

### Structure

| Path | What it is |
|---|---|
| `src/courses.ts` | The course list (id, title, blurb, status, parts). Add a course here and a page under `src/app/courses/<id>/` |
| `/` (`src/app/page.tsx`) | Course catalog |
| `/courses/copilot` | Copilot overview (the old home dashboard). Sub-pages: `common`, `common/[id]`, `today`, `library`, `days/[day]`, `sessions/[id]`, `track`, `progress`, `results` |
| `src/app/courses/copilot/layout.tsx` | Course sub-nav. Progress and Results appear only for facilitators |
| `/courses/prompt-engineering` | Placeholder page |
| `/profile` | Platform-wide: identity header, then one card per course (Copilot: common days, library labs, Copilot quiz average, lessons opened; others: coming soon) |
| `/courses/copilot/me` | Copilot-only "My progress": weekly apps, sessions done, certification meters (80% sessions, 4 of 5 apps, 70% quiz average), My apps list |
| `/login`, `/api/*` | Platform-wide, not course-specific. API routes did not move |
| `next.config.ts` `redirects()` | Old URLs (`/common`, `/days/5`, `/sessions/s02`, `/today`, `/library`, `/track`, `/facilitator/progress`, `/facilitator/results`) redirect to the new ones (temporary, 307) |
| Top bar (`UserMenu.tsx`) | Courses, GitHub Copilot, Prompt Engineering, account menu (My profile, View as participant for facilitators, Sign out; "My week" is only in the Copilot sub-nav) |

Facilitator Progress and Results are Copilot-only (they use the 30 lessons and the weekly program). A second course gets its own inside its folder.

### Features added Oct 29-30 (not yet on production)
- Library lab tasks (`lab-N`) now need a screenshot of the git commit, like session labs (branch name `lab-N`). `/api/proof` and `/api/activity` accept `lab-N`; the server rejects completion without a screenshot. Labs completed earlier stay done and have no screenshot.
- Quizzes: `/api/results/mine?day=N` returns the person's attempts and latest answers. The quiz shows "Your attempts", restores the last answers with correct/not-correct marks and locks them until "Start a new attempt".
- Results page: "Completed per day" row on Lab tasks; ticks link to the commit screenshot; Attendance shows roster members only (rows for every roster member, "Participants present" row, "Days" column). `/api/results` now also returns the roster.

### Branches, environments, pipeline
- **Flow:** feature branch -> review locally -> PR to `stage` -> Preview deployment -> PR `stage` -> `main` -> Production. Do not push straight to `stage` or `main`.
- **Branch protection:** `main` needs a PR and the `check` CI job; no force-push; admins can bypass. `stage` has no protection.
- **CI:** `.github/workflows/ci.yml` runs on push and PR to `stage` and `main`: `npm ci`, `npm test`, `npm run test:site`, `npm run build` (dummy auth env). `next build` is the type check; plain `tsc` fails on a fresh checkout because `LayoutProps` is generated. Lint is not run (the repo is not lint-clean). `.github` is matched by a local, uncommitted `.gitignore` line, so changes to the workflow need `git add -f`.
- **Deployments:** Vercel's own Git integration deploys: `stage` and PRs -> Preview (stable URL https://copilot-training-git-stage-ic-innovation.vercel.app), `main` -> Production. They show as the "Vercel" status on the commit, not in GitHub Actions. Env changes only apply to a new deployment: use `npx vercel redeploy <deployment-url>` (never `vercel deploy --prod`, it uploads the working tree). `npx vercel env ls` shows the creation date, not the edit date, so check the sign-in redirect instead (see below).
- **Entra app registration (changed Oct 29):** client ID `61a5a3fc-...`, tenant `008502d6-...`. The values live in Vercel (Production and Preview) as `AUTH_MICROSOFT_ENTRA_ID_ID/_TENANT_ID/_SECRET`. Redirect URIs needed: the production callback, the stage callback (`/api/auth/callback/microsoft-entra-id` on the stage URL) and localhost:3000. `scripts/set-entra.ps1 [-Environment preview]` replaces the three values; edits made in the dashboard work too. To verify which registration an environment uses, POST to `/api/auth/signin/microsoft-entra-id` (with the csrf token) and read the `client_id` in the Location header.
- **Database:** Preview uses its own Neon branch. `src/lib/db.ts` reads `PREVIEW_DATABASE_URL` when `VERCEL_ENV=preview` and never falls back to the production `DATABASE_URL`. Production uses `DATABASE_URL`. The preview branch was created from production data on Oct 30 and is not kept in sync.
- **Local review uses the Preview configuration:** `scripts/local-env.ps1` runs `vercel env pull --environment preview` into `.env.local` (old file saved as `.env.local.bak`), drops Vercel system variables, keeps `VERCEL_ENV=preview`, and re-fills the six Secret values Vercel never returns (the three Entra values, `AUTH_SECRET`, `FACILITATOR_EMAILS`, `PREVIEW_DATABASE_URL`) from the old file or a hidden prompt. So `npm run dev` writes to the Preview database, not production. Run it after cloning or when Preview variables change. `.env.local` stays git-ignored.

### State at the end of Oct 30
- On `stage` (pushed): everything above, last commit `e738e66`. `main` and Production are unchanged since the Oct 29 redeploy (new Entra registration, same code as `bc7f012`).
- Verified: `next build`, `npm test` (40 pass), `npm run test:site` (13 pass), CI green on `stage`, stage sign-in redirects with the new client ID, redirects checked on a production build.
- NOT verified in a browser: the catalog, the course sub-nav, library lab screenshot upload, quiz attempts and restored answers, the Results changes, Progress/Results as facilitator and as participant, and that stage writes go to the Preview database (submit something on stage and confirm it is absent on production).
- Local review: `scripts/local-env.ps1` was run, `npm run dev` works and sign-in works locally (confirmed Oct 30). `loadProfile` counts only quizzes numbered below 200 (the Copilot course); give each new course its own quiz-number range.

### Open / next
1. Review locally (`scripts\local-env.ps1`, `npm run dev`), then open a PR to `stage`; after checking the stage site, PR `stage` -> `main` to release.
2. Get the Prompt Engineering material (documents/slides) and decide its module layout; convert to portal pages with labs, quizzes and an assessment. Progress/Results are not course-generic yet.
3. Login page still says "Build a real app every week", which only fits the Copilot course.
4. Everything in the Oct 29 "Open / next" list still applies (Flossy and the Director's feedback, licences and credits, Day 6 brief and Day 7 gate review).
5. Uncommitted work that is not ours, leave it: `src/days/day-03/*`, `src/days/day-04/*`, `src/days/day-06/*`, new Go/Rust files in `src/days/day-08/`, `.gitignore`, `Notes.txt`, `instructions.md`, `skills-lock.json`. Never `git add -A` or `git add src`; add specific paths.

### Gotchas learned (Oct 30)
- Stale type errors after moving routes: delete `.next/dev` and `.next/types`, then rebuild. A running dev server also blocks moving folders (Windows lock); stop it first.
- `usePathname()` in a client component needs a `<Suspense>` boundary, including inside a Suspense fallback.
- Vercel logs on the hobby plan keep about 30 minutes; ask for a fresh attempt before reading them. `vercel logs` flags changed (`--level` and `--no-follow` were removed).
- The auto-mode classifier blocks commands that read or print credentials (for example reading `.env.local`, or echoing keys). Run those yourself with `!` in the prompt.
- Do not paste secrets or connection strings into chat; use the hidden prompts in the scripts.
