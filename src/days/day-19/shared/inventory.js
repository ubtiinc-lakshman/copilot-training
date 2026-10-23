// Shared inventory module (cross-team). Follows STYLE_GUIDE.md. Make a small change here with Copilot,
// e.g. add `removeItem(inventory, sku)` and a test, then run: node src/days/day-19/check-style.js
function addItem(inventory, sku, qty, logger) {
  const current = inventory[sku] ?? 0;
  const next = { ...inventory, [sku]: current + qty };
  logger.info(`added ${qty} of ${sku}`);
  return next;
}

function stockValueCents(inventory, priceCentsBySku) {
  let totalCents = 0;
  for (const [sku, qty] of Object.entries(inventory)) totalCents += qty * (priceCentsBySku[sku] ?? 0);
  return totalCents;
}

module.exports = { addItem, stockValueCents };
