// Capstone option B (starter): password strength checker (no UI).
// Requirements (build them with Copilot, then test them):
//  - checkPassword(password) returns { score: 0-4, label, problems: [] }
//  - problems lists every failed rule: shorter than 12 chars, no uppercase, no lowercase, no digit, no symbol, common password
//  - label is one of: "weak", "fair", "good", "strong"
//  - never logs or stores the password
//  - no external dependencies
//
// Dev builds this. QA writes the tests in parallel FROM THE REQUIREMENTS, not from this code.

function checkPassword(password) {}

module.exports = { checkPassword };
