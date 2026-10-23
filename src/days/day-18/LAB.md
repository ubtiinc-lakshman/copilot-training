# Day 18 Lab - Copilot for APIs & Integration Work (core QA day)

**Level 2: Intermediate | PAIRED Dev + QA on the same contract | 20 min**

## Dev: scaffold the contract (10 min)

```
# Context
New endpoint: create an order.
# Task
Scaffold an API contract/schema and boilerplate client code.
# Requirements
- POST /api/orders
- Request: items array + shipping address
- Response: 201 with orderId and status
```

(`contract.json` is a reference contract if you want a baseline.)

## QA: generate the test collection (10 min)

```
# API Contract
[paste the Dev partner's ACTUAL contract]
# Task
Generate a test collection covering happy path, auth failure, and
schema-validation errors.
```

## Cross-check (remaining time)

Compare the collection with the contract field by field and fix mismatches together. `crosscheck.js` does this mechanically: see `collection.sample.json` for what a generic, non-contract-based collection gets wrong.

## Assignment

One real API endpoint scaffolded or test-scripted in your own project.

## Assessment: contract-review checklist (Dev) / test-collection-review checklist (QA)
