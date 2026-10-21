# Day 3 Lab - Inline Suggestions & Code Completion

**Level 1: Basic | Individual | 20 min | Dev and QA variants**

Goal: practice accept / reject / EDIT judgment and catch at least one subtle mistake Copilot introduces.

## Dev: comment-driven functions (20 min)

Open `utils.js`. For each of the 5 comments: write the comment, read the suggestion, accept, then test it mentally against 2 valid and 2 invalid inputs. Edit at least one suggestion to fix a subtle issue (off-by-one, wrong null check, missing await).

## QA: assertion helpers (20 min)

Open `test-helpers.js`. For each of the 5 comments: accept, then check the assertion actually fails when it should (mutate the expected value mentally). Edit at least one.

## Assignment

One real function or test-helper from your own repo, written with inline suggestions. Keep the diff for peer review.

## Assessment: peer review of kept vs. rewritten

At least one suggestion edited, not blindly accepted. Can explain why each edit was made. Final code is correct and readable.
