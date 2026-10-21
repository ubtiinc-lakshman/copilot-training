// Copilot output #4 (QA): checkout test script with diagnostics
const { test } = require("node:test");

test("checkout completes for a returning customer", async () => {
  const customer = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 555 010 0199",
    card: "4111 1111 1111 1111",
  };

  console.log("Starting checkout for customer:", JSON.stringify(customer));

  const result = await checkout(customer);

  console.log("Checkout response:", JSON.stringify(result));
  if (!result.ok) throw new Error(`Checkout failed for ${customer.email}`);
});
