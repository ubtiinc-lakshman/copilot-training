// Existing orders module. The agent must follow the conventions in ../CONVENTIONS.md.
const ORDERS = [
  { id: "o-1001", userId: "u-1", totalCents: 4500, status: "shipped", createdAt: "2026-10-01" },
  { id: "o-1002", userId: "u-1", totalCents: 1299, status: "pending", createdAt: "2026-10-03" },
  { id: "o-1003", userId: "u-2", totalCents: 9900, status: "cancelled", createdAt: "2026-10-04" },
];

function listOrdersByUser(userId) {
  return ORDERS.filter((o) => o.userId === userId);
}

function getOrder(id) {
  const order = ORDERS.find((o) => o.id === id);
  if (!order) return { ok: false, error: "not_found" };
  return { ok: true, value: order };
}

module.exports = { listOrdersByUser, getOrder };
