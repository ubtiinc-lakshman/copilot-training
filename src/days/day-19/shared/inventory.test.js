const { test } = require("node:test");
const assert = require("node:assert/strict");
const { addItem, stockValueCents } = require("./inventory");

const logger = { info() {} };

test("should add stock to an existing sku", () => {
  assert.deepEqual(addItem({ "AB-1": 2 }, "AB-1", 3, logger), { "AB-1": 5 });
});

test("should value stock in integer cents", () => {
  assert.equal(stockValueCents({ "AB-1": 2 }, { "AB-1": 150 }), 300);
});
