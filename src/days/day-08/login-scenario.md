# Day 8 (QA) - Scenario to automate in an unfamiliar framework

Scenario (familiar to you): Login page

Given the login page is open
When I submit a valid email and password
Then I land on the dashboard and see my name

Negative cases:
- wrong password shows "Invalid email or password" and stays on the page
- empty email shows a required-field error and does not submit

Pick a framework you do NOT normally use (a Selenium user tries Playwright, a Postman user tries REST Assured, a Cypress user tries Selenium). Generate the test, then find one thing that is subtly wrong or non-idiomatic.
