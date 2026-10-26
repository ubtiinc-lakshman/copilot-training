# Training strategy change: build a real app every week

Decided Mon Oct 26, 2026. Starts Tue Oct 27. End date stays Tue Dec 1.
Status: draft for review. Items marked **Decide** need an owner's answer before the first build block.

## 1. The model

| Day | Mode | What happens |
|---|---|---|
| Tue, Wed, Thu | In person (conference room) | Teach 15 min, demo, lab applied to your own app, 5-min quiz |
| Fri | Online live call | Build day: facilitator builds the week's demo use case live, everyone builds their own, help on request |
| Mon | Online live call | Submission day: each person has their app deployed on Vercel and submits the URL, then explains the challenges they faced and how they solved them |

- 36 participants, all treated the same (no Dev/QA split). QA builds with Copilot too.
- One new, unique pain point per person per week. No two people share a pain point and nobody repeats one.
- One stack for everyone (section 4).
- Labs are based on what that session teaches. The quiz after each session stays.

## 2. Calendar (Oct 27 to Dec 1)

No weekday holiday falls in the window (Deepavali is Sunday Nov 8; Oct 19-20 and Dec 25/31 are outside).

| Week | Tue / Wed / Thu (in person) | Fri build | Mon submission |
|---|---|---|---|
| 1 | Oct 27, 28, 29 | Oct 30 | **Nov 2** (app 1) |
| 2 | Nov 3, 4, 5 | Nov 6 | **Nov 9** (app 2) |
| 3 | Nov 10, 11, 12 | Nov 13 | **Nov 16** (app 3) |
| 4 | Nov 17, 18, 19 | Nov 20 | **Nov 23** (app 4) |
| 5 | Nov 24, 25, 26 | Nov 27 | **Nov 30** (app 5) |
| Finale | Tue Dec 1 | | |

16 in-person sessions, 5 build cycles, 5 apps per person: **180 unique pain points** (build about 220 so there is a buffer for rejects and late claims).

## 3. The arithmetic problem (Decide)

Days 5-30 are 26 sessions of content. There are 16 in-person slots. The three capstones (Days 10, 20, 30) are replaced by the weekly app submissions, which leaves 23 topics for 15 teaching slots plus a finale. The program also needs one new topic (the stack kickoff).

Proposal: merge related topics, do not drop any silently. Four topics are absorbed into other sessions or become homework (marked *).

| Session | Date | Topic (original day) | Lab applied to your app |
|---|---|---|---|
| 1 | Tue Oct 27 | Prompt writing (5) | Write the prompt that describes your pain point and app |
| 2 | Wed Oct 28 | Ethics, licensing, security basics (9): secrets, env vars, no real data | Set up env vars safely; the 10-question test |
| 3 | Thu Oct 29 | **New: stack kickoff** (+ languages and stacks, 8*) | Idea to GitHub repo to a Vercel URL with a Supabase table |
| | Fri Oct 30 | Build call 1 | |
| 4 | Tue Nov 3 | Docs, comments, commit/PR text (6 + 7) | README and PR description for app 1 |
| 5 | Wed Nov 4 | Chat for debugging and triage (12) | Debug a real failure in your app |
| 6 | Thu Nov 5 | Test generation (13) | Tests for your app's core flow |
| 7 | Tue Nov 10 | Multi-file / workspace context (14) | A change that touches several files |
| 8 | Wed Nov 11 | Refactoring (15) | Refactor your messiest file with tests as a safety net |
| 9 | Thu Nov 12 | PR and code review workflows (16) | Open a PR, respond to review comments |
| 10 | Tue Nov 17 | APIs and integrations (18) | Add an API route or third-party integration |
| 11 | Wed Nov 18 | Agent mode + chained prompts (21 + 11) | Supervise an agent through one feature |
| 12 | Thu Nov 19 | Custom instructions + playbooks (22 + 27, shared codebases 19*) | Write `.github/copilot-instructions.md` for your app |
| 13 | Tue Nov 24 | Architecture, test strategy, data and test data (23 + 26) | Review your data model and generate test data |
| 14 | Wed Nov 25 | Security review of AI-generated code (24) | Run the checklist against your app |
| 15 | Thu Nov 26 | Performance (25) (+ IDE customization, 17*, as homework) | Measure and fix one slow path |
| 16 | Tue Dec 1 | Finale: governance and adoption (28), train the trainer (29), demos | Showcase, certification |

The Copilot content stays; most labs move onto the participant's own app. Existing slides, labs and quizzes remain the source material, so none of it is thrown away.

## 4. The one stack (Decide)

Recommended: **Next.js (App Router, TypeScript) + Tailwind + Supabase (Postgres, Auth, Storage) + Vercel + GitHub + Copilot.**

- Supabase gives database, login and file storage in one dashboard, which keeps the setup short for beginners. Neon is database only, so it would add a separate login library.
- Neon stays where it is: the training site already uses it. It is not part of the participant stack.
- Optional in week 5: Vercel AI SDK for an AI feature, if you want participants to try one.

To check before Thursday (not verified yet):
- **Accounts:** personal accounts or a company organisation? Vercel's free tier is meant for personal, non-commercial use, so company work may need a paid team plan. Supabase and Neon free tiers cap the number of projects per account.
- **Approval:** security sign-off for these SaaS tools, and a rule that only fake data goes in.
- **Network:** from the conference-room Wi-Fi and the VPN, can people reach github.com, vercel.com, supabase.com and npmjs.org?
- **Deployment protection:** Vercel can put preview links behind a login. Production URLs must open for the facilitator without one.

## 5. Weekly rhythm in detail

- **Tue/Wed/Thu (60 min):** teach 15, demo 10, lab 25 on your own app, quiz 5, share one challenge 5. (Decide if the 60-minute split should differ.)
- **Fri live call:** facilitator builds the week's demo use case from scratch on screen. Everyone builds their own app in parallel. Helpers answer in the channel.
- **Weekend:** finish and deploy.
- **Mon live call:** each person submits the Vercel URL in the training site's submission form first. On the call: a few full demos (rotating), a quick check of the rest. Everyone answers "what challenge did you hit, how did you solve it".

### Weekly app scope (so people can finish)

| Week | Build | Skills it exercises |
|---|---|---|
| 1 | Single page, list and add/edit/delete, saved in Supabase, no login | Deploy, env vars, basic CRUD |
| 2 | Add login, each user sees their own data | Auth, per-user data |
| 3 | Add file upload or an image, validation | Storage, validation, tests |
| 4 | Add an email, webhook or scheduled job | Integrations, API routes |
| 5 | Polish: dashboard or AI feature, security-reviewed | Charts or AI, hardening |

Each week's pain point is new, so the scope above is per app, not a continuation of the same app.

### Weekly submission and assessment

Submit: Vercel URL, one-line description of the pain point, the biggest challenge, how it was solved, and how Copilot was used.

| Check | Result |
|---|---|
| URL opens and the core flow works | Required |
| Data is saved (database) | Required |
| No secrets in the repo, no real personal data | Required |
| Solves the stated pain point | Scored |
| Explains the challenge and fix | Scored |
| Evidence of Copilot use (prompts, PR, instructions file) | Scored |

**Decide:** the old 70% quiz average and Day 9 / Day 10 gates. Proposal for certification: at least 80% attendance, at least 4 of 5 apps deployed and passing, quiz average 70% or more. Attendance is already recorded on the training site.

## 6. Pain points: unique for 36 people, 5 weeks

- Build a bank of about 220, tagged by week difficulty, category and a "core entity" (for example complaint, leave request, receipt). Uniqueness means a different problem, not a renamed one: no two bank entries share the same actor and core entity.
- **Claim model (recommended):** participants pick from the bank on the training site. The database refuses a pain point someone else already holds, and refuses a repeat by the same person. Pain point for the next week opens on the Thursday before.
- Participants may propose their own. It must not duplicate a bank entry and must be approved by a facilitator.
- Rules for every pain point: solvable in two days, fake data only, no real company or customer information.

Categories (about 12 per group):

| Common-person | Inside the organisation |
|---|---|
| Household budget, bills and reminders | Leave and work-from-home requests |
| Medicine and health reminders | Meeting-room and desk booking |
| Society / apartment complaints | New-joiner onboarding checklist |
| Local service finder (plumber, electrician) | IT help-desk requests |
| Carpool and commute | Asset and laptop tracking |
| Student study planner | Expense claims with receipts |
| Senior-citizen help requests | Training and event feedback |
| Freelancer invoices | Internal knowledge base / FAQ |
| Event and function planning | Visitor registration |
| Second-hand item swap | Cafeteria feedback |
| Grocery and ration lists | Shift swaps and timesheets |
| Neighbourhood notice board | Test-case, bug and release trackers (suits QA) |

## 7. Demo use cases (the facilitator builds one live each Friday)

| Week | Demo app | Type |
|---|---|---|
| 1 | Society maintenance complaint log (list, add, status) | Common-person |
| 2 | Leave and work-from-home tracker with login | Organisation |
| 3 | Expense claim with receipt upload | Organisation |
| 4 | Clinic or service appointment booking with a confirmation email and a daily reminder | Common-person |
| 5 | Team dashboard that imports a CSV, shows charts, and (optional) summarises it with AI | Organisation |

Each demo needs: a written build script, the repo, a deployed copy, and a 10-minute recording as backup.

## 8. Support model

36 builders on a live call need more than one facilitator.
- A help channel (Teams) watched during Fri and Mon calls.
- 3-4 helpers (senior developers or people who finish early), each covering about 9 people.
- Breakout rooms on Mondays for the demos.

## 9. What has to be ready, in order

| By | Needed |
|---|---|
| Tue Oct 27 | Announcement of the new mode. Session 1 as planned. Network check (section 4). Account/approval decision started |
| Wed Oct 28 | Everyone has GitHub, Vercel and Supabase accounts. Pain-point bank (at least week 1: 36+ simple items) and the claim form |
| Thu Oct 29 | Everyone has claimed week 1's pain point. Stack kickoff session ready. Week 1 demo build script |
| Fri Oct 30 | First build call (small scope: no login) |
| Mon Nov 2 | First submissions. Submission form live |

Honest risk: only Days 1-4 have been taught, and nobody has used Next.js, Vercel or Supabase yet. Week 1 is deliberately tiny (one list, no login). If the accounts or network are not ready by Wednesday, move the first build call to Fri Nov 6 and treat week 1 as setup, and the calendar still ends Dec 1.

## 10. Changes to what exists

- **Training site:** add a pain-point board (claim, uniqueness enforced in Neon), a weekly submission form (URL, challenge, solution), a facilitator view of submissions, attendance on the new calendar, and the new session list. The login (Microsoft account) and Neon database are already there.
- **Dates:** the old 30 day numbers no longer map to dates. Do not re-date the 150 documents again. Add one session map (this document) and update only the labs that change.
- **Decks, assessments and lab sheets:** keep as source; create new lab sheets only where the lab moves onto the participant's own app.

## 11. Open decisions

1. Confirm the stack (section 4) and settle accounts, licensing and security approval.
2. Approve the 26-to-16 merge (section 3), including the four absorbed topics.
3. Length of the Friday and Monday calls (suggest 90 minutes each).
4. Certification rule replacing the level gates (section 5).
5. Self-claim from the bank (recommended) or assigned pain points.
6. Who the helpers are.
