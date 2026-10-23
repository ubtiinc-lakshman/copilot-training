// Order rules. Reads and writes the boolean `shipped` (the old "status").
function createOrder(id, total) {
  return { id, total, shipped: false };
}

function markShipped(order) {
  return { ...order, shipped: true };
}

function canCancel(order) {
  return order.shipped === false;
}

module.exports = { createOrder, markShipped, canCancel };
