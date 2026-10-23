// Day 12 (Dev): three bugs live in this file. Reproduce each, use Chat to find the ROOT cause, fix it,
// then check the happy path still works (bugs.test.js stays green). Failing checks: npm run test:seeded

// 1) Page numbers start at 1.
function paginate(items, page, size) {
  const start = page * size;
  return items.slice(start, start + size);
}

// 2) Percent coupons: "10" means 10% off.
const COUPONS = { SAVE10: 10, SAVE25: 25 };
function applyCoupon(totalCents, code) {
  const percent = COUPONS[code];
  if (percent === undefined) return totalCents;
  return Math.round(totalCents - totalCents * percent);
}

// 3) Look up a SKU typed by a person ("ab-1", " AB-1 ").
const STOCK = new Map([["AB-1", 4], ["CD-2", 0]]);
function stockFor(sku) {
  return STOCK.get(sku) ?? 0;
}

module.exports = { paginate, applyCoupon, stockFor };
