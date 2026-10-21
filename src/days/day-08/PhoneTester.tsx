"use client";

import { useState } from "react";
import { validatePhone, ACCEPTED_EXAMPLES, REJECTED_EXAMPLES } from "./phone-validation";

export default function PhoneTester() {
  const [value, setValue] = useState("+91 98765 43210");
  const ok = validatePhone(value);
  return (
    <div className="space-y-3">
      <input className="w-full rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900" value={value} onChange={(e) => setValue(e.target.value)} />
      <p className={`font-semibold ${ok ? "text-green-600" : "text-red-600"}`}>{ok ? "Accepted" : "Rejected"}</p>
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold">Should be accepted</p>
          {ACCEPTED_EXAMPLES.map((e) => (
            <button key={e} className="block text-blue-600 hover:underline" onClick={() => setValue(e)}>
              {e}
            </button>
          ))}
        </div>
        <div>
          <p className="font-semibold">Should be rejected</p>
          {REJECTED_EXAMPLES.map((e) => (
            <button key={e || "empty"} className="block text-blue-600 hover:underline" onClick={() => setValue(e)}>
              {e === "" ? "(empty)" : `"${e}"`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
