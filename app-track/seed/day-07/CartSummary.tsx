"use client";

// Day 7: the "new version" of the cart summary from a teammate. Paste it over src/components/CartSummary.tsx
// (commit your own version first, so `git diff` gives you a real diff to describe).
// QA: a complaint came in, see the track page. Reproduce it and write the bug report.
import { useState } from "react";

export default function CartSummary({ unitPrice }: { unitPrice: number }) {
  const [qty, setQty] = useState("1");
  const quantity = parseInt(qty);
  const total = (unitPrice * quantity) / 100;

  return (
    <div>
      <label>
        Quantity
        <input value={qty} onChange={(e) => setQty(e.target.value)} />
      </label>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
