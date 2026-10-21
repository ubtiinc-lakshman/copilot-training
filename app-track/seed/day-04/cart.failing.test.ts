// Day 4 (QA) seeded failing test. Paste into src/lib/cart.test.ts (Vitest). Expected: one test fails.
import { describe, it, expect } from "vitest";
import { calculateCartTotal } from "./cart";

describe("calculateCartTotal", () => {
  it("applies SAVE10 once to a 100 cart", () => {
    expect(calculateCartTotal([{ price: 50, qty: 2 }], "SAVE10")).toBe(90);
  });

  it("no code means no discount", () => {
    expect(calculateCartTotal([{ price: 50, qty: 2 }])).toBe(100);
  });
});
