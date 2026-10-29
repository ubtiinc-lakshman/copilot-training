# Handoff: GitHub Copilot Training repo

Last updated: Tue Oct 27, 2026. **NEW (Oct 27): a team-specific track syllabus is drafted and waiting on Flossy and the Director. Read "Team tracks syllabus (Oct 27)" at the very bottom first, then the weekly program section.** Older note: read the "Weekly app program" section at the bottom first: the training changed on Oct 26 to one app per week, and most sections above describe the older 30-day format (now the self-learning library).** Then `README.md`.

**State at the end of Oct 26: everything is pushed (`main` = `origin/main`), production is seeded (217 pain points for weeks 1-5, 36-person roster), the 36 participants are invited to Entra, and every page uses the new theme. Session 1 is Tue Oct 27.** Done today: roster and add/remove on the progress page, pain points for weeks 2-5, pain-point assignment limited to the roster, header with account menu, `/profile`, theme polish. NOT browser-verified after the last deploys: the account menu, `/profile`, the roster add/remove, and the 403 for non-roster users. Next session: start with "Open / next" at the bottom.

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

## Team tracks syllabus (Oct 27) - WAITING ON FLOSSY, then the Director

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

## Common days are the main program (Oct 29)

Decision: the common GitHub Copilot days (0-7) are the main program; the weekly app program is now SELF-PACED (no live sessions; dates are a suggested pace). Team tracks are OUT of scope for now (Oct 29): the Director doc covers common days only; `tracks.ts` stays as unused draft.

- `src/program/common.ts` (new): the 8 days with dates (FULL days, Mon-Fri: Nov 2-6 then Nov 10-12, Nov 9 is a holiday (Diwali, confirmed Oct 29); the other dates stay proposed until leadership finishes planning) and full page content. Pages: `/common`, `/common/c0` ... `/common/c7`; completion stored in `completions` as `c0`..`c7` (accepted by `/api/activity`). Home page leads with Common days; weekly dashboard retitled "Self-paced"; nav has "Common days" before "My week".
- Draft schedule and the Director doc: `Downloads\GitHub Copilot Training - Program Plan for Director.docx` (tracks wave 1 track week Nov 16-20, project Nov 23-27, demo Nov 30; wave 2 Jan 18 - Feb 1; tentative). Not yet reviewed with Flossy. Review was planned for Oct 30.
- NOT done: not pushed or deployed, not browser-checked; Day 7 gate has no quiz or scoring; Progress/Results pages ignore common days; Day 6 brief + data and Day 7 tasks + rubric unwritten; track pages (`tracks.ts` still unwired). The weekly calendar still date-gates labs and the pain-point weeks; if self-paced should mean "always open", change `isOpen` use in `/api/activity` and `/today`.

## Weekly app program: levels and commit screenshots (Oct 29)

- Levels, not dates: week N opens when the week N-1 app is submitted (`levelOf` / `loadLevel` in `src/lib/program.ts`). Pain point, lab completion and submission all check the level (facilitators bypass). My week, home and profile show levels; quizzes are always open. `calendar.ts` dates are now only labels (and still used by the Progress page nowhere).
- Session labs (s01-s15) need a screenshot of the git commit (branch `lab-sNN`, not main) before they can be marked done: `POST /api/proof` (PNG/JPG/WebP, max 3 MB, stored as base64 in `lab_proofs`), `GET /api/proof?id=&email=` (own, or any for facilitators). Progress page: the tick on a session lab links to the screenshot. Calls, common days and library lab tasks do not need a screenshot.
- Verified live by API (400 without proof, upload, complete, view, bad type 400, undo). Not visually checked in a browser (screenshot timed out). Leftover: a 20x20 test image for lakshman.s on s01 in `lab_proofs`.

- Day 6 brief (BrightDesk support backlog, 20 invented tickets, SLA rules, one output per role) is in `src/program/common.ts` (c6). Day 7 gate tasks and scoring guide are a facilitator-only doc kept OUT of the repo: `Downloads\GitHub Copilot Training - Day 7 Gate Tasks and Scoring (Facilitator).docx` (5 tasks x 2 points, pass 7/10, proposed). Both drafts, not reviewed by anyone yet.
