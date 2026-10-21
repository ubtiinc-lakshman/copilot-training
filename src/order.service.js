// Order service: small module used for Dev practice in the Copilot training.
// Day 1: place the cursor under a "// TODO" comment and let Copilot suggest the code.
// READ every suggestion before accepting. Copilot suggests, you decide.

const DISCOUNT_CODES = { SAVE10: 0.1, SAVE20: 0.2 };

/** Sum of price * quantity for all items. */
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/** Apply a discount code to a total. Unknown codes leave the total unchanged. */
function applyDiscount(total, code) {
  const rate = DISCOUNT_CODES[code] || 0;
  return total - total * rate;
}

// TODO (Day 1 - Task 1, suggestion 1): return true if the given string is a valid email address using regex.
function isValidEmail(email) {}

// TODO (Day 1 - Task 1, suggestion 2): return the order total formatted as a currency string, e.g. "$1,234.50".
function formatCurrency(amount) {}

// TODO (Day 1 - Task 1, suggestion 3): return the number of items in the order (sum of quantities).
function countItems(items) {}

// TODO (Day 1 - Task 1, suggestion 4): return the most expensive item, or null when the order is empty.
function getMostExpensiveItem(items) {}

// TODO (Day 1 - Task 1, suggestion 5): return true if the order qualifies for free shipping (total of 500 or more).
function qualifiesForFreeShipping(total) {}

module.exports = {
  calculateTotal,
  applyDiscount,
  isValidEmail,
  formatCurrency,
  countItems,
  getMostExpensiveItem,
  qualifiesForFreeShipping,
};
