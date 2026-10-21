# Day 5 - Seed prompts to rewrite

Use your own vague prompts from Days 1-4, or these:

Dev (feature prompts)
1. make a login form
2. add a cache to the orders page
3. write a function to validate input

QA (test-scenario prompts)
1. write some tests
2. test the password reset
3. check the API works

Rewrite each into Context / Task / Requirements / Additional Info. Requirements needs at least 2 concrete bullets. Name the stack, framework and version.

## Worked example

Vague: `make a login form`

Rewritten:

```
# Context
Next.js 16 App Router app, TypeScript, Tailwind. Public pages are under src/app.
# Task
Build a login form component with email and password fields.
# Requirements
- Email field validates format on blur; password requires 12+ characters
- Show an inline error under the field and disable submit while invalid
- Accessible: labels bound to inputs, errors announced with aria-live
# Additional Info
Client component, no form library, no network call yet (onSubmit receives the values).
```
