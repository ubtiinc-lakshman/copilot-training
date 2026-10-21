"use client";

import { useState } from "react";
import { calculateTotal, applyDiscount, isValidEmail } from "./order.service";

// Live demo of the Day 1 practice module: the page itself uses the service code
// that participants read, judge, and extend with Copilot.
export default function OrderPlayground() {
  const [price, setPrice] = useState(10);
  const [quantity, setQuantity] = useState(2);
  const [code, setCode] = useState("SAVE10");
  const [email, setEmail] = useState("user@example.com");

  const total = calculateTotal([{ price, quantity }]);
  const discounted = applyDiscount(total, code);
  const emailOk = isValidEmail(email);

  const field = "w-full rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="font-semibold">Order</h3>
        <label className="block text-sm">
          Price
          <input className={field} type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </label>
        <label className="block text-sm">
          Quantity
          <input className={field} type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </label>
        <label className="block text-sm">
          Discount code (try SAVE10, SAVE20, NOPE)
          <input className={field} value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
        <p className="text-sm">
          calculateTotal: <b>{total}</b> | applyDiscount: <b>{discounted}</b>
        </p>
      </div>
      <div className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="font-semibold">Email check (Copilot-suggested isValidEmail)</h3>
        <label className="block text-sm">
          Email
          <input className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <p className={`text-sm font-semibold ${emailOk ? "text-green-600" : "text-red-600"}`}>
          {emailOk ? "Valid" : "Invalid"}
        </p>
        <p className="text-xs text-zinc-500">
          Judge the suggestion: does it accept &quot;a@b.c&quot;? What about an email with a space? Reject or edit what you disagree with.
        </p>
      </div>
    </div>
  );
}
