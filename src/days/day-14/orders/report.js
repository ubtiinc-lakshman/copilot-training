// Daily report: counts orders by state using the boolean `shipped`.
function summarize(orders) {
  const shipped = orders.filter((o) => o.shipped).length;
  return { shipped, notShipped: orders.length - shipped };
}

module.exports = { summarize };
