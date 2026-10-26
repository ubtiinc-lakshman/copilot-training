# Training strategy change: build a real app every week

Decided Mon Oct 26, 2026 (announced to participants the same day). Starts Tue Oct 27. End date stays Tue Dec 1.
Version 3: the new pain point is now assigned on **Monday**, so the Tue-Thu labs build the same app that is submitted the next Monday. Items marked **Open** still need an answer or a check.

## 1. The model

One week = one app, from Monday to Monday.

| Day | Mode | What happens |
|---|---|---|
| Mon | Online live call, 90 min | Submit last week's deployed URL and explain the challenge and fix. At the end of the call, click **Give me my pain point** to get this week's problem |
| Tue, Wed, Thu | In person (conference room), 60 min | Teach one skill, tool or connector, then a lab where each person adds it to **their own app for this week** |
| Fri | Online live call, 90 min | Finish, deploy and harden. Help on request. The week's demo app is completed live |

- 36 participants, all treated the same. QA builds with Copilot too.
- One new, unique pain point per person per week. No two people share one, nobody repeats one. A person's labs are always on this week's app, never last week's.
- One stack for everyone (section 4).
- The slide decks are no longer the teaching method. Sessions teach only what is needed to build the apps. Everything else is self-learning (section 3).

## 2. Calendar (Oct 27 to Dec 1)

No weekday holiday falls in the window (Deepavali is Sunday Nov 8; Oct 19-20 and Dec 25/31 are outside).

| App | Pain point assigned | Tue / Wed / Thu labs (in person) | Fri finish and deploy | Submitted |
|---|---|---|---|---|
| 1 | **Tue Oct 27**, start of session 1 (the plan is announced Mon Oct 26) | Oct 27, 28, 29 | Oct 30 | **Mon Nov 2** |
| 2 | Mon Nov 2, end of call | Nov 3, 4, 5 | Nov 6 | **Mon Nov 9** |
| 3 | Mon Nov 9, end of call | Nov 10, 11, 12 | Nov 13 | **Mon Nov 16** |
| 4 | Mon Nov 16, end of call | Nov 17, 18, 19 | Nov 20 | **Mon Nov 23** |
| 5 | Mon Nov 23, end of call | Nov 24, 25, 26 | Nov 27 | **Mon Nov 30** |
| Finale | | Tue Dec 1 | | |

16 in-person sessions, 5 apps per person: **180 unique pain points**. Build a bank of about 220 so there is a buffer. App 1 is assigned in the first session because the announcement is made on the Monday itself. If the site is not ready by then, assign it on Wednesday and the Friday call still finishes it.

## 3. What the in-person sessions teach

Principle: teach the skills, tools and connectors needed to build the apps. Everything else (the 30-day Copilot content, decks, quizzes) stays on the training site as a **self-learning library**, not as sessions. The four topics previously proposed for absorption (languages and stacks, chained prompts, IDE customization, shared codebases) are homework.

Session shape (60 min): teach 15, demo 10, lab 25, quiz 5, share one challenge 5.

**Labs:** every lab adds the day's skill to the participant's own app for that week. By Thursday the app has the week's main feature, Friday finishes and deploys it, Monday it is submitted. The facilitator's demo app for the week is built the same way, a piece per session, so the 10-minute demo in each session shows exactly what the lab asks for.

| # | Date | Skill / tool / connector | Lab, on your own app this week |
|---|---|---|---|
| | Tue Oct 27 | **App 1 pain point assigned at the start** | |
| 1 | Tue Oct 27 | Copilot as a builder: prompt template, inline and Chat, choosing a model, what uses credits. Scaffold a Next.js app | Scaffold your app from your pain point |
| 2 | Wed Oct 28 | GitHub and Vercel: repo, commits, deploy, environment variables, secrets, no real data | Push to GitHub, deploy to Vercel, set an env var safely |
| 3 | Thu Oct 29 | Supabase: tables, saving data, connecting from Next.js | Add a table and a list that saves |
| | Fri Oct 30 | **Call**: finish, deploy, harden app 1 (list and add/edit/delete, no login) | |
| | Mon Nov 2 | **Submit app 1.** Assign app 2 | |
| 4 | Tue Nov 3 | Supabase Auth: login and per-user data | Scaffold app 2 and add login |
| 5 | Wed Nov 4 | Debugging with Copilot: Chat /fix, browser console, Vercel logs | Find and fix a real failure in app 2 |
| 6 | Thu Nov 5 | Tests with Copilot | Tests for app 2's main flow |
| | Fri Nov 6 | **Call**: finish, deploy app 2 | |
| | Mon Nov 9 | **Submit app 2.** Assign app 3 | |
| 7 | Tue Nov 10 | Agent mode: supervise it through a feature (uses the most credits) | Scaffold app 3, add a feature with an agent, review every file |
| 8 | Wed Nov 11 | Connectors (MCP): GitHub, Supabase, Vercel, browser testing. What they are, how to add, safety | Connect one and use it on app 3 |
| 9 | Thu Nov 12 | File storage and validation | Upload and validate a file in app 3 |
| | Fri Nov 13 | **Call**: finish, deploy app 3 | |
| | Mon Nov 16 | **Submit app 3.** Assign app 4 | |
| 10 | Tue Nov 17 | Integrations: API routes, webhooks, email, scheduled jobs | Scaffold app 4, send an email or run a scheduled job |
| 11 | Wed Nov 18 | Custom instructions (`.github/copilot-instructions.md`) and reusing prompts | Write the file for app 4 |
| 12 | Thu Nov 19 | PRs, code review and refactoring with Copilot | Open a PR on app 4 and respond to comments |
| | Fri Nov 20 | **Call**: finish, deploy app 4 | |
| | Mon Nov 23 | **Submit app 4.** Assign app 5 | |
| 13 | Tue Nov 24 | Dashboards and (optional) an AI feature | Scaffold app 5, add a chart or a summary |
| 14 | Wed Nov 25 | Security review of your app: secrets, input validation, row-level security | Run the checklist against app 5 |
| 15 | Thu Nov 26 | Performance and polish | Measure and fix one slow page in app 5 |
| | Fri Nov 27 | **Call**: finish, deploy app 5 | |
| | Mon Nov 30 | **Submit app 5.** No new pain point | |
| 16 | Tue Dec 1 | Finale: showcase, what we learned, next steps | Demos and certification |

Required feature per week (so the labs fit the app): week 1 single page, saved data, no login. Week 2 login and per-user data. Week 3 files or images. Week 4 email, webhook or scheduled job. Week 5 dashboard or AI feature, security-reviewed. The pain-point bank is tagged by the feature a problem naturally needs, so a random pick in week 2 is always a problem where each person has their own data. Each week is a new app, not one app growing.

Note the shift from version 2: because the pain point now arrives on Monday, the Friday call finishes and deploys instead of starting the build, and the first deploy happens on Wednesday of week 1.

**Open:** confirm this session list. It replaces the old day-by-day mapping.

## 4. The stack

**Decided:** Next.js (App Router, TypeScript) + Tailwind + Supabase (Postgres, Auth, Storage) + Vercel + GitHub + Copilot.
Neon stays only for the training site. Optional in week 5: Vercel AI SDK for an AI feature.

**Fallback (owner's suggestion): Cloudflare** for deployment with its own database. Everyone moves together, never two stacks at once. I haven't tested Next.js on Cloudflare (it needs an adapter), so before relying on it:
- **Open:** deploy one small Next.js starter to Vercel and to Cloudflare and compare the effort.
- Switch trigger: if Vercel is not approved, is blocked on the network, or the licence does not allow company work, decide by **Wed Oct 28**.

**Open** checks, not yet verified:
- Accounts: personal or company organisation. Vercel's free tier is meant for personal non-commercial use, so company work may need a paid team plan. Supabase and Cloudflare free tiers also limit projects per account.
- Security approval for these tools, and the rule that only fake data goes in.
- Network: from the conference room and the VPN, can people reach github.com, vercel.com, supabase.com and npmjs.org?
- Deployment protection: a Vercel link behind a login breaks the Monday check. Production URLs must open without one.

## 5. GitHub credits (the big catch)

GitHub credits for the participants are not allocated yet. Copilot's premium models and agent mode use up an allowance, so this affects the plan.

**Open** (ask your GitHub admin, I have not confirmed any of this):
1. Which Copilot plan the 36 seats are on and what allowance each seat gets.
2. Whether an organisation budget can be set, and what happens when a person runs out: blocked, billed, or switched to an included model.
3. Which models are included at no extra use and which consume the allowance.
4. By what date the credits will be in place.

Plan around it:
- Week 1 works with the included model only; the scope is small.
- The heaviest session is agent mode (Nov 10). If credits are not there by then, swap it with a lighter session.
- Teach people in session 1 to choose the model by task and to check their usage.
- Track usage weekly once credits exist.

## 6. Pain points: random assignment

- Bank of about 220, tagged by the feature it needs (week 1 single page, week 2 login, week 3 files, week 4 email or job, week 5 dashboard or AI), a category and a core entity (for example complaint, leave request, receipt). Unique means a different problem, not a renamed one.
- At the end of each Monday call (and at the start of session 1 for app 1), each participant clicks **Give me my pain point** on the training site. The server picks a random unassigned one that needs that week's feature and assigns it to that person. Anyone who misses the call can click it later that day, with less build time.
- Rules the site enforces: one assignment per person per week (a second click shows the same one), nobody gets one already given to another person, nobody gets a repeat across weeks.
- Every pain point: solvable in one week with the labs, fake data only, no real company or customer information.

Categories (about 12 per group):

| Common-person | Inside the organisation |
|---|---|
| Household budget, bills, reminders | Leave and work-from-home requests |
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
| Neighbourhood notice board | Test-case, bug and release trackers |

## 7. Weekly submission and assessment

Submit before Monday's call (on the training site): the Vercel URL, a one-line description of the pain point, the biggest challenge, how it was solved, and how Copilot was used.

| Check | Result |
|---|---|
| URL opens and the core flow works | Required |
| Data is saved (database) | Required |
| No secrets in the repo, no real personal data | Required |
| Solves the stated pain point | Scored |
| Explains the challenge and the fix | Scored |
| Evidence of Copilot use (prompts, PR, instructions file) | Scored |

**Certification (decided):** at least 80% attendance, at least 4 of 5 apps deployed and passing, quiz average 70% or more.

Mondays: 36 URLs on a 90-minute call. Collect them on the site before the call, check them in advance, then use the call for a few full demos (rotating) and each person's challenge-and-fix answer.

## 8. Demo use cases (the facilitator builds one a week, a piece per session)

| Week | Demo app | Type |
|---|---|---|
| 1 | Society maintenance complaint log (list, add, status) | Common-person |
| 2 | Leave and work-from-home tracker with login | Organisation |
| 3 | Expense claim with receipt upload | Organisation |
| 4 | Clinic or service appointment booking with a confirmation email and a daily reminder | Common-person |
| 5 | Team dashboard that imports a CSV, shows charts, and (optional) summarises it with AI | Organisation |

The Tue, Wed and Thu 10-minute demos build this app piece by piece, and the Friday call finishes and deploys it. Each demo needs a written build script, the repo, a deployed copy and a 10-minute recording as backup.

## 9. Support

Facilitator plus helpers **Glen and Naveen**. For 36 builders that is about 12 per person: split the Friday and Monday calls into three breakout groups, with a Teams channel watched throughout. Consider a third helper for the first Wednesday (first deploy) and the first Friday.

## 10. What has to be ready, in order

| By | Needed |
|---|---|
| Mon Oct 26 (today) | Announce the plan (draft: `docs/ANNOUNCEMENT-DRAFT.md`). Ask the GitHub admin about credits. Ask IT about network and tool approval. Build the pain-point bank (week 1 first: 36+ single-page problems) and the **Give me my pain point** button |
| Tue Oct 27 | Pain-point button live **before session 1**. Session 1: assign app 1, scaffold. Network check. Account and licence decision under way |
| Wed Oct 28 | Everyone has GitHub, Vercel and Supabase accounts (or the Cloudflare switch decided). First deploy in session 2 |
| Thu Oct 29 | Session 3 (Supabase). Submission form live on the site |
| Fri Oct 30 | Call: finish and deploy app 1 (list, add/edit/delete, no login) |
| Mon Nov 2 | Submit app 1. Assign app 2 at the end of the call |

Honest risk: only Days 1-4 have been taught, nobody has used Next.js, Vercel or Supabase yet, and the first deploy is already on Wednesday. If accounts, network or credits are not ready by Wednesday, treat week 1 as setup, submit app 1 on Mon Nov 9 instead, and shift the five-app schedule by a week (the fifth app would then land on the Dec 1 finale). The calendar still ends Dec 1.

## 11. Changes to what exists

- **Training site:** add the pain-point bank and random assignment (enforced in Neon), the weekly submission form, a facilitator view of submissions, and the new session list. The Microsoft login and Neon database are already there.
- **Existing days, decks, assessments:** kept as the self-learning library. Not re-dated again.
- **Order Desk app track:** no longer needed as a practice app (labs now use each person's own app). Its seed files can still serve as examples.

## 12. Open items

1. Confirm the 16-session list and the Monday-assignment calendar (sections 2 and 3).
2. GitHub credits: the four questions in section 5, and the date.
3. Accounts, licensing and security approval; the Cloudflare comparison (section 4).
4. Network access check from the conference room and VPN.
5. Whether participants may reroll a pain point they cannot do (default: no).
