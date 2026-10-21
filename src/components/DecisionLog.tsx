"use client";

import { useState } from "react";

type Row = { prompt: string; action: "accepted" | "rejected" | "edited"; reason: string };

// Day 3: log each inline suggestion decision, copy as CSV for the peer review.
export default function DecisionLog() {
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Row>({ prompt: "", action: "accepted", reason: "" });
  const [copied, setCopied] = useState(false);

  const add = () => {
    if (!draft.prompt.trim()) return;
    setRows([...rows, draft]);
    setDraft({ prompt: "", action: "accepted", reason: "" });
  };
  const csv = ["#,comment,action,reason", ...rows.map((r, i) => [i + 1, r.prompt, r.action, r.reason].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  const edited = rows.filter((r) => r.action !== "accepted").length;
  const input = "rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input className={`${input} min-w-48 flex-1`} placeholder="Comment you wrote" value={draft.prompt} onChange={(e) => setDraft({ ...draft, prompt: e.target.value })} />
        <select className={input} value={draft.action} onChange={(e) => setDraft({ ...draft, action: e.target.value as Row["action"] })}>
          <option>accepted</option>
          <option>rejected</option>
          <option>edited</option>
        </select>
        <input className={`${input} min-w-48 flex-1`} placeholder="Why? (what did you check or fix)" value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} />
        <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white" onClick={add}>
          Add
        </button>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-zinc-200 dark:border-zinc-800">
              <td className="py-1 pr-2">{i + 1}</td>
              <td className="pr-2">{r.prompt}</td>
              <td className="pr-2 font-semibold">{r.action}</td>
              <td>{r.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm">
        {rows.length} logged, {edited} edited or rejected.{" "}
        {rows.length >= 5 && edited === 0 && <b className="text-red-600">Everything accepted: read them again, are you sure?</b>}
      </p>
      <button
        className="rounded border border-zinc-400 px-3 py-1 text-sm"
        onClick={() => navigator.clipboard.writeText(csv).then(() => setCopied(true))}
      >
        {copied ? "Copied" : "Copy as CSV"}
      </button>
    </div>
  );
}
