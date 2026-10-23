// UI label for an order row. Relies on the boolean `shipped`.
function badge(order) {
  return order.shipped ? "Shipped" : "Waiting";
}

module.exports = { badge };
