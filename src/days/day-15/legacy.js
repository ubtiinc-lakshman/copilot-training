// Day 15 (Dev): legacy code, no tests, no docs. Mixes validation, pricing and logging.
// 1) Ask Chat to explain it. 2) Write characterization tests of what it does TODAY.
// 3) Refactor in small steps, running the tests after each step. Behavior must not change.
const log = [];

function processOrder(order, cfg) {
  log.push("start " + (order && order.id));
  if (!order) { log.push("no order"); return { ok: false, error: "no order" }; }
  if (!order.items || order.items.length == 0) { log.push("empty"); return { ok: false, error: "empty" }; }
  if (typeof order.email !== "string" || order.email.indexOf("@") < 1) { log.push("bad email"); return { ok: false, error: "email" }; }
  var total = 0;
  for (var i = 0; i < order.items.length; i++) {
    var it = order.items[i];
    if (!it || typeof it.price !== "number" || it.price < 0) { log.push("bad item " + i); return { ok: false, error: "item " + i }; }
    var q = it.qty === undefined ? 1 : it.qty;
    if (q < 1 || q % 1 !== 0) { log.push("bad qty " + i); return { ok: false, error: "qty " + i }; }
    total += it.price * q;
  }
  var discount = 0;
  if (cfg && cfg.coupon) {
    if (cfg.coupon === "SAVE10") discount = total * 0.1;
    else if (cfg.coupon === "SAVE25") { if (total >= 5000) discount = total * 0.25; else { log.push("coupon needs 5000"); } }
    else { log.push("unknown coupon " + cfg.coupon); }
  }
  var afterDiscount = total - discount;
  var shipping = 0;
  if (afterDiscount < 3000) shipping = 499;
  else if (afterDiscount < 10000) shipping = 199;
  if (cfg && cfg.country && cfg.country !== "US") shipping = shipping + 1500;
  var tax = 0;
  if (!cfg || cfg.country === undefined || cfg.country === "US") tax = Math.round(afterDiscount * 0.07);
  var grand = Math.round(afterDiscount) + shipping + tax;
  log.push("done " + order.id + " " + grand);
  return { ok: true, total: Math.round(total), discount: Math.round(discount), shipping: shipping, tax: tax, grand: grand };
}

module.exports = { processOrder, log };
