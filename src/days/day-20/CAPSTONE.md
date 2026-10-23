# Day 20 - Intermediate Capstone (Level Gate)

**Paired: 1 Dev + 1 QA (same pairing as Day 10 where possible) | 35 min**

Pick ONE small, real backlog item from your own team. Not a throwaway exercise. Work on a `capstone/<pair-name>` branch.

## Starter ideas if your backlog is empty

- Add a `GET /api/orders?status=` filter with validation
- Add a retry with backoff to an outbound API client
- Add CSV export of a list screen

## Plan

| Who | Minutes | Do |
|---|---|---|
| Dev | 20 | Plan and scaffold with the Day 11 chain, implement the slice (Days 13-18 techniques). Share in-progress code as soon as there is something to test. |
| QA | 20 (parallel) | Generate cases from the REQUIREMENT, convert to automation, run it against the Dev's feature as soon as it is testable. |
| Both | rest | Run the automation live. Expect a failure. Decide together: code bug or test bug. Fix it. |

## Done when

- The automation runs against the real feature, live (not a canned demo)
- At least one real failure was diagnosed and fixed in the session
- The retrospective names a specific place Copilot needed a human override (see `RETRO_TEMPLATE.md`)
