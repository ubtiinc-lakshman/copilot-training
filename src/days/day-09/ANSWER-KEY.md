# Day 9 - Seeded outputs: answer key (FACILITATOR ONLY)

| # | Verdict | Findings |
|---|---|---|
| 1 | Clean | Paginate helper validates input and clamps page/size. No red flag. |
| 2 | Security | HIGH: hardcoded JWT signing secret (line 5). HIGH: plaintext password comparison (`user.password === password`). MEDIUM: token has no expiry. MEDIUM: no validation of `username`/`password` types. |
| 3 | Security | HIGH: MD5 for password hashing (weak crypto default; fast and unsalted). MEDIUM: no input validation on email/password. Use bcrypt/scrypt/argon2 with a per-user salt. |
| 4 | Security / data leakage | HIGH: full customer record logged including card number (lines 12, 16 print PII). MEDIUM: customer email in the error message. Use synthetic masked data and never log card numbers. |
| 5 | Licensing | HIGH: GPL-v3 copyright header on generated code, so it looks copied verbatim from a copyleft project. Do not ship; flag the provenance, find the source or rewrite from scratch. |

Checklist used: hardcoded secrets, missing input validation, weak crypto defaults, PII in logs, plus license/provenance.

Never paste into a prompt: secrets, credentials, customer PII, proprietary algorithms.

All credentials in the seeded files are fake training values.
