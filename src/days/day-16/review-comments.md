# Seeded reviewer comments (sample.diff)

**Comment 1 (app code, on discount.js):**
> Math.round changes the result for odd totals (999 -> 899 instead of 899.1). Is rounding the intended behavior, and who decided it?

**Comment 2 (test code, on discount.test.js):**
> These asserts run at import time with no test() wrapper, so one failure hides the rest and the report shows nothing per case. Can they be real tests?

For each comment: ask Copilot for a response, then check whether it actually resolves the concern or only sounds responsive.
Bad: "Good catch, fixed!" with no change. Good: names the decision (rounding rule) and the change (wrap in test()), with evidence.
