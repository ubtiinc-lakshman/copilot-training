# Day 14 Lab - Multi-File / Workspace-Aware Context

**Level 2: Intermediate | Individual | 20 min | Dev and QA variants**

The `status` field of an order moves from boolean (`shipped`) to the enum `"pending" | "shipped" | "cancelled"`. Files: `orders/`.

## Dev (20 min)

```
@workspace
This API contract changed: the "status" field is now an enum, not a
boolean. Find every file that reads or writes this field and list what
needs to change.
```

1. Run the `@workspace` prompt and check its file list is complete (there are 4 source files plus the test).
2. Implement the change across every flagged file.
3. Close the relevant files, re-run a related suggestion, and note the quality drop.

## QA (20 min)

1. Use `@workspace` to find every test asserting the old boolean.
2. Update the assertions to the enum, consistently across files.
3. Narrow the context on purpose and observe the quality change.

## Assignment

One real cross-file change (feature or test-suite update) in your own repo.

## Assessment: code / test-suite review checklist, consistency across files
