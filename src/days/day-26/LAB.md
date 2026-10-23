# Day 26 Lab - Copilot for Data Workflows & Test Data Generation

**Level 3: Advanced | Individual | 20 min | Dev and QA variants**

Schema: `schema.sql`. Validator: `validate-orders.js`. Example of bad rows: `sample-rows.json`.

## Dev: query or script (20 min)

1. Write or optimize a SQL or reporting-script snippet against the schema.
2. Have Copilot explain the query logic back to you as a sanity check. Does it match what you meant?

## QA: synthetic test data (20 min)

```
# Context
Schema: orders(id, user_id, status ENUM('pending','shipped','cancelled'),
total_cents INT NOT NULL, created_at TIMESTAMP)
# Task
Generate 50 rows of realistic synthetic test data satisfying this
schema, with no real PII, plus a validation query confirming every row
matches the constraints.
```

1. Generate the data and the validation query.
2. RUN the validation: `node src/days/day-26/validate-orders.js your-rows.json`. Does every row pass?
3. Fix any row that fails.

"Looks realistic" and "satisfies the constraints" are different claims.

## Assignment

One real query/script or one real test-data set for a current project. No real PII.

## Assessment: query accuracy (Dev), data validity (QA). The validation query was actually run.
