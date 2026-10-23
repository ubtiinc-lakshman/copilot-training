# Copilot instructions (example for a team repo)

## App code
- Return errors as `Result<T>` (`{ ok: true, value }` or `{ ok: false, error }`). Do not throw for expected failures.
- Do not use `console.log` in production code. Use the injected `logger`.
- API response fields are camelCase.
- Money is an integer in a field ending in `Cents`.

## Test code
- Use Jest with `describe` / `it`.
- Every `it` title starts with "should".
- Every function that returns a `Result` has one test for `ok: true` and one for `ok: false`.

## Never
- Add a new dependency without asking.
- Put a real credential, token or customer email in code or tests. Use `FAKE-` placeholders.
