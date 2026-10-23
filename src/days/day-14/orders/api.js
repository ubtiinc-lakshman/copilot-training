// Day 14: the "status" field of an order used to be a boolean (true = shipped).
// The contract changed: status is now one of "pending" | "shipped" | "cancelled".
// Use @workspace to find EVERY place that reads or writes it (src/days/day-14/**), then update them consistently.
function toApiOrder(order) {
  return { id: order.id, total: order.total, status: order.shipped };
}

function fromApiOrder(body) {
  return { id: body.id, total: body.total, shipped: body.status === true };
}

module.exports = { toApiOrder, fromApiOrder };
