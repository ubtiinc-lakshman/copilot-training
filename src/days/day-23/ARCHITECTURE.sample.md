# Order Service - architecture note (sample)

## Components

- **API Gateway**: authenticates callers, rate limits, routes `/orders/*`.
- **Order Service**: validates orders and applies pricing rules.
- **Pricing Engine**: computes totals, discounts and tax.
- **Inventory Client**: reserves stock in the inventory system over HTTP.
- **Payment Adapter**: charges the customer through the payment provider.
- **Order Store**: PostgreSQL tables for orders and order lines.
- **Notification Worker**: sends order emails from a queue.

## Flow

Client -> API Gateway -> Order Service -> Pricing Engine -> Inventory Client -> Payment Adapter -> Order Store -> Notification Worker

## Risks named by the Dev

- Payment succeeded but the order write fails (money taken, no order).
- Inventory reserved but payment fails (stock stuck).
- Duplicate submission of the same order.
