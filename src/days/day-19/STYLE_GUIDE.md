# Team style guide (shared repo)

Copilot does not know this file unless you tell it (Day 22 fixes that with custom instructions). Check every suggestion against it.

1. **No `console.log` in app code.** Use the `logger` passed in.
2. **No `var`.** Use `const`, or `let` when reassigned.
3. **Test titles start with "should".** `test("should reject a negative quantity", ...)`.
4. **Function names are verbs in camelCase.** `addItem`, not `item_add` or `ItemAdder`.
5. **Money is integer cents** in a variable ending in `Cents`.

`check-style.js` checks rules 1-3 mechanically. Rules 4-5 need your eyes.
