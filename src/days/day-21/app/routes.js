// Existing route layer: thin handlers that call the service and shape the response.
const { listOrdersByUser, getOrder } = require("./orders");

function handleListOrders(req) {
  if (!req.userId) return { status: 401, body: { error: "unauthorized" } };
  return { status: 200, body: { orders: listOrdersByUser(req.userId) } };
}

function handleGetOrder(req) {
  if (!req.userId) return { status: 401, body: { error: "unauthorized" } };
  const result = getOrder(req.params.id);
  if (!result.ok) return { status: 404, body: { error: result.error } };
  return { status: 200, body: result.value };
}

module.exports = { handleListOrders, handleGetOrder };
