// Day 4 (QA + Dev) seeded bug. Paste into src/lib/cart.ts of your Order Desk app.
// QA: diagnose with /explain, do not fix. Dev: fix with /fix, keep the happy path working.

export type CartItem = { price: number; qty: number };

const RATES: Record<string, number> = { SAVE10: 0.1 };

function applyDiscount(total: number, code?: string): number {
  return total - total * (RATES[code ?? ""] ?? 0);
}

export function calculateCartTotal(items: CartItem[], code?: string): number {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discounted = applyDiscount(subtotal, code);
  return applyDiscount(discounted, code);
}
