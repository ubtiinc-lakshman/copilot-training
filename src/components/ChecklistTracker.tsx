"use client";

import { useEffect, useState } from "react";

// Tick-box list saved in this browser (localStorage), so progress survives a reload.
export default function ChecklistTracker({ id, items }: { id: string; items: string[] }) {
  const key = `checklist:${id}`;
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "null");
      if (Array.isArray(saved) && saved.length === items.length) setDone(saved);
    } catch {}
  }, [key, items.length]);

  const toggle = (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v));
    setDone(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const count = done.filter(Boolean).length;
  return (
    <div className="card p-5">
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 accent-[var(--brand)]" checked={done[i]} onChange={() => toggle(i)} />
              <span className={done[i] ? "text-muted line-through" : ""}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        {count} of {items.length} done {count === items.length && "- all set"}
      </p>
    </div>
  );
}
