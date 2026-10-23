# Order Service - test strategy (sample, deliberately incomplete)

## Coverage matrix

| Component | Level | Priority | Notes |
|---|---|---|---|
| API Gateway | integration | P1 | auth failure, rate limit |
| Order Service | unit + integration | P0 | validation, duplicate submit |
| Pricing Engine | unit | P0 | discount and tax edge cases |
| Inventory Client | contract | P1 | stock-out, timeout |
| Order Store | integration | P1 | transactions, constraints |

## Environment and data

Staging database with synthetic orders (no real customer data). Payment provider in sandbox mode.

## Risk-based priorities

1. Payment taken but no order written
2. Duplicate submission
