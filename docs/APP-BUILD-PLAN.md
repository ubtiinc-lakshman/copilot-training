# Training strategy change: build a real app every week

Decided Mon Oct 26, 2026 (announced to participants the same day). Starts Tue Oct 27. End date stays Tue Dec 1.
Version 2: updated with the owner's answers. Items marked **Open** still need an answer or a check.

## 1. The model

| Day | Mode | What happens |
|---|---|---|
| Tue, Wed, Thu | In person (conference room), 60 min | Teach the skills, tools and connectors needed to build the app, then a lab |
| Fri | Online live call, 90 min | Build day: facilitator builds the week's demo app live, everyone builds their own, help on request |
| Mon | Online live call, 90 min | Submission day: deployed URL submitted, then each person explains the challenges they faced and how they solved them |

- 36 participants, all treated the same. QA builds with Copilot too.
- One new, unique pain point per person per week. No two people share one, nobody repeats one.
- One stack for everyone (section 4).
- The slide decks are no longer the teaching method. Sessions teach only what is needed to build the apps. Everything else is self-learning (section 3).

## 2. Calendar (Oct 27 to Dec 1)

No weekday holiday falls in the window (Deepavali is Sunday Nov 8; Oct 19-20 and Dec 25/31 are outside).

| Week | Tue / Wed / Thu (in person) | Pain point assigned | Fri build | Mon submission |
|---|---|---|---|---|
| 1 | Oct 27, 28, 29 | Thu Oct 29 | Oct 30 | **Nov 2** (app 1) |
| 2 | Nov 3, 4, 5 | Thu Nov 5 | Nov 6 | **Nov 9** (app 2) |
| 3 | Nov 10, 11, 12 | Thu Nov 12 | Nov 13 | **Nov 16** (app 3) |
| 4 | Nov 17, 18, 19 | Thu Nov 19 | Nov 20 | **Nov 23** (app 4) |
| 5 | Nov 24, 25, 26 | Thu Nov 26 | Nov 27 | **Nov 30** (app 5) |
| Finale | Tue Dec 1 | | | |

16 in-person sessions, 5 build cycles, 5 apps per person: **180 unique pain points**. Build a bank of about 220 so there is a buffer.

## 3. What the in-person sessions teach

Principle: teach the skills, tools and connectors needed to build the apps. Everything else (the 30-day Copilot content, decks, quizzes) stays on the training site as a **self-learning library**, not as sessions. The four topics previously proposed for absorption (languages and stacks, chained prompts, IDE customization, shared codebases) are homework.

Session shape (60 min): teach 15, demo 10, lab 25, quiz 5, share one challenge 5.

**Labs:** because a participant's pain point arrives on Thursday, week 1's labs build the shared practice app (Order Desk) step by step: everyone ends Thursday with it deployed. In weeks 2-5, the Tue and Wed labs improve the participant's **previous** app, and Thursday ends with the next pain point and a plan.

| # | Date | Skill / tool / connector | Lab |
|---|---|---|---|
| 1 | Tue Oct 27 | Copilot as a builder: prompt template, inline and Chat, choosing a model, what uses credits. Scaffold a Next.js app | Scaffold Order Desk with Copilot |
| 2 | Wed Oct 28 | GitHub and Vercel: repo, commits, deploy, environment variables, secrets, no real data | Push to GitHub, deploy to Vercel, set an env var safely |
| 3 | Thu Oct 29 | Supabase: tables, saving data, connecting from Next.js. **Pain point assigned today** | Add a Supabase table and a list that saves. Plan your own app |
| | Fri Oct 30 | **Build call 1** (list and add/edit/delete, no login) | |
| 4 | Tue Nov 3 | Supabase Auth: login and per-user data | Add login to app 1 |
| 5 | Wed Nov 4 | Debugging with Copilot: Chat /fix, browser console, Vercel logs | Find and fix a real failure |
| 6 | Thu Nov 5 | Tests with Copilot. **Pain point assigned today** | Tests for app 1's main flow |
| | Fri Nov 6 | **Build call 2** (login, per-user data) | |
| 7 | Tue Nov 10 | Agent mode: supervise it through a feature (uses the most credits) | Add one feature with an agent, review every file |
| 8 | Wed Nov 11 | Connectors (MCP): GitHub, Supabase, Vercel, browser testing. What they are, how to add, safety | Connect one and use it from Copilot |
| 9 | Thu Nov 12 | File storage and validation. **Pain point assigned today** | Upload and validate a file in app 2 |
| | Fri Nov 13 | **Build call 3** (files or images) | |
| 10 | Tue Nov 17 | Integrations: API routes, webhooks, email, scheduled jobs | Send an email or run a scheduled job from app 3 |
| 11 | Wed Nov 18 | Custom instructions (`.github/copilot-instructions.md`) and reusing prompts | Write the file for your app |
| 12 | Thu Nov 19 | PRs, code review and refactoring with Copilot. **Pain point assigned today** | Open a PR on app 3 and respond to comments |
| | Fri Nov 20 | **Build call 4** (email, webhook or job) | |
| 13 | Tue Nov 24 | Security review of your app: secrets, input validation, row-level security | Run the checklist against app 4 |
| 14 | Wed Nov 25 | Performance and polish | Measure and fix one slow page |
| 15 | Thu Nov 26 | Dashboards and (optional) an AI feature. **Pain point assigned today** | Add a chart or a summary to app 4 |
| | Fri Nov 27 | **Build call 5** (polish, dashboard or AI) | |
| 16 | Tue Dec 1 | Finale: showcase, what we learned, next steps | Demos and certification |

Weekly app scope (so people can finish): week 1 single page, saved data, no login. Week 2 login and per-user data. Week 3 files or images. Week 4 email, webhook or scheduled job. Week 5 polish: dashboard or AI feature, security-reviewed. Each week is a new pain point, so this is the scope of each app, not one app growing.

**Open:** confirm this session list. It replaces the old day-by-day mapping.

## 4. The stack

**Decided:** Next.js (App Router, TypeScript) + Tailwind + Supabase (Postgres, Auth, Storage) + Vercel + GitHub + Copilot.
Neon stays only for the training site. Optional in week 5: Vercel AI SDK for an AI feature.

**Fallback (owner's suggestion): Cloudflare** for deployment with its own database. Everyone moves together, never two stacks at once. I haven't tested Next.js on Cloudflare (it needs an adapter), so before relying on it:
- **Open:** deploy Order Desk to Vercel and to Cloudflare once and compare the effort.
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

- Bank of about 220, tagged by week difficulty, category and a core entity (for example complaint, leave request, receipt). Unique means a different problem, not a renamed one.
- On the Thursday, each participant clicks **Give me my pain point** on the training site. The server picks a random unassigned one at the right difficulty and assigns it to that person.
- Rules the site enforces: one assignment per person per week (a second click shows the same one), nobody gets one already given to another person, nobody gets a repeat across weeks.
- Every pain point: solvable in two days, fake data only, no real company or customer information.

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

Submit on or before Monday's call: the Vercel URL, a one-line description of the pain point, the biggest challenge, how it was solved, and how Copilot was used.

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

## 8. Demo use cases (the facilitator builds one live each Friday)

| Week | Demo app | Type |
|---|---|---|
| 1 | Society maintenance complaint log (list, add, status) | Common-person |
| 2 | Leave and work-from-home tracker with login | Organisation |
| 3 | Expense claim with receipt upload | Organisation |
| 4 | Clinic or service appointment booking with a confirmation email and a daily reminder | Common-person |
| 5 | Team dashboard that imports a CSV, shows charts, and (optional) summarises it with AI | Organisation |

Each demo needs a written build script, the repo, a deployed copy and a 10-minute recording as backup.

## 9. Support

Facilitator plus helpers **Glen and Naveen**. For 36 builders that is about 12 per person: split the Friday and Monday calls into three breakout groups, with a Teams channel watched throughout. Consider a third helper if Friday's first call is overloaded.

## 10. What has to be ready, in order

| By | Needed |
|---|---|
| Mon Oct 26 (today) | Announce the plan (draft: `docs/ANNOUNCEMENT-DRAFT.md`). Ask the GitHub admin about credits. Ask IT about network and tool approval |
| Tue Oct 27 | Session 1. Network check. Account and licence decision under way |
| Wed Oct 28 | Everyone has GitHub, Vercel and Supabase accounts (or the Cloudflare switch decided). Cloudflare comparison done |
| Thu Oct 29 | Pain-point bank (at least week 1) and the **Give me my pain point** button live on the site. Week 1 demo build script |
| Fri Oct 30 | Build call 1 (small scope, no login) |
| Mon Nov 2 | Submission form live. First submissions |

Honest risk: only Days 1-4 have been taught, and nobody has used Next.js, Vercel or Supabase yet. If accounts, network or credits are not ready by Wednesday, move the first build call to Fri Nov 6 and treat week 1 as setup. The calendar still ends Dec 1.

## 11. Changes to what exists

- **Training site:** add the pain-point bank and random assignment (enforced in Neon), the weekly submission form, a facilitator view of submissions, and the new session list. The Microsoft login and Neon database are already there.
- **Existing days, decks, assessments:** kept as the self-learning library. Not re-dated again.
- **Order Desk app track:** becomes the practice app for week 1.

## 12. Open items

1. Confirm the 16-session list (section 3).
2. GitHub credits: the four questions in section 5, and the date.
3. Accounts, licensing and security approval; the Cloudflare comparison (section 4).
4. Network access check from the conference room and VPN.
5. Whether participants may reroll a pain point they cannot do (default: no).
