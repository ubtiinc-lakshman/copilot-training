# Security checklist (OWASP-style)

| # | Check | Look for |
|---|---|---|
| 1 | Input validation | Unvalidated email / password / length; type confusion (`==`) |
| 2 | Injection | String-built SQL, shell or HTML |
| 3 | Secrets handling | Hardcoded secrets, secrets in tokens or logs |
| 4 | Crypto defaults | MD5/SHA1, unsalted hashes, home-made tokens |
| 5 | Logging and PII | Passwords, emails or tokens in logs |
| 6 | Authentication | Missing rate limit or lockout, timing-unsafe comparison |

Report each finding as: severity (High/Med/Low), exact line, why it matters, and the negative test that proves it.
