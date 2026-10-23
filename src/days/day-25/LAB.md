# Day 25 Lab - Performance Optimization & Performance/Load Test Scripting

**Level 3: Advanced | PAIRED Dev + QA | 20 min**

Slow endpoint: `ordersEndpoint.js`. Benchmark: `node src/days/day-25/bench.js`. Guard: `ordersEndpoint.test.js` (`npm test`). Load template: `k6-orders.js`.

## Dev: optimize (10 min)

1. Record the baseline with `bench.js`.
2. Use Copilot to identify the slow path.
3. Apply an optimization. `npm test` must still pass (same data out).
4. Hand the endpoint to your QA partner.

## QA: load test (10 min)

```
# Context
Endpoint: GET /api/orders?userId=X, currently p95 latency 1.8s
# Task
Scaffold a k6 load test simulating 50 concurrent users, 5-minute
ramp-up, and establish a baseline.
```

## Confirm the improvement (remaining time)

Run the same profile against the original and the optimized version and compare the p95 numbers. "Feels faster" is not evidence.

## Assignment

One real slow path optimized, or one real load test scripted, for a current project.

## Assessment: before/after benchmark (Dev), baseline-vs-optimized load report (QA)
