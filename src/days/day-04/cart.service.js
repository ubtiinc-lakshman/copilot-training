// Day 4 (QA): the code under a seeded failing test. QA diagnoses with /explain and hands the
// diagnosis to a Dev. Do NOT fix it yourself today.

const RATES = { SAVE10: 0.1 };

function applyDiscount(total, code) {
  return total - total * (RATES[code] || 0);
}

function calculateCartTotal(items, code) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discounted = applyDiscount(subtotal, code);
  return applyDiscount(discounted, code);
}

module.exports = { calculateCartTotal };
