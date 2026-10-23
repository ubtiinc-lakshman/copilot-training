// Day 25 (Dev): GET /api/orders?userId=X is slow (p95 about 1.8 s in production). Find the slow path with
// Copilot, optimize it, and PROVE it with node src/days/day-25/bench.js before and after. Results must not change.
const USERS = Array.from({ length: 3000 }, (_, i) => ({ id: `u-${i}`, name: `User ${i}` }));
const ORDERS = Array.from({ length: 30000 }, (_, i) => ({ id: `o-${i}`, userId: `u-${i % 3000}`, totalCents: 1000 + (i % 97) * 10 }));

function getOrdersForUser(userId) {
  const result = [];
  for (const order of ORDERS) {
    // looks the user up again for every single order
    const user = USERS.find((u) => u.id === order.userId);
    if (user && user.id === userId) result.push({ ...order, userName: user.name });
  }
  return result;
}

module.exports = { getOrdersForUser };
