# Conventions the agent must follow (app/)

1. Services return `{ ok: true, value }` or `{ ok: false, error: "code" }`. They do not throw for expected failures.
2. Route handlers are thin: check the user, call the service, map the result to `{ status, body }`.
3. Errors in bodies are `{ error: "snake_case_code" }`.
4. Money is integer cents in fields ending in `Cents`.
5. Tests use `node:test`, titles start with "should", and cover the 401 and 404 paths.
6. No new dependencies.

Agent mode may invent its own conventions if you do not hold it to these. Checking that it did not is part of the exercise.
