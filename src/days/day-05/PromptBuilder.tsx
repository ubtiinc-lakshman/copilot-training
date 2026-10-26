"use client";

import { useState } from "react";

const input = "input";
const VAGUE = ["good", "better", "modern", "nice", "clean", "fast"];

// Day 5: fill the four sections, preview the prompt, and self-score it against the rubric.
export default function PromptBuilder() {
  const [f, setF] = useState({ context: "", task: "", requirements: "", extra: "" });
  const reqs = f.requirements.split("\n").map((r) => r.trim()).filter(Boolean);
  const vagueWords = VAGUE.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(f.requirements));

  const prompt = [
    `# Context\n${f.context || "[What you're working on]"}`,
    `# Task\n${f.task || "[What you want the AI to do]"}`,
    `# Requirements\n${reqs.length ? reqs.map((r) => `- ${r}`).join("\n") : "- [Requirement 1]\n- [Requirement 2]"}`,
    `# Additional Info\n${f.extra || "[Tech stack, constraints, preferences]"}`,
  ].join("\n");

  const checks: [string, boolean][] = [
    ["Context names the real tech stack or constraint (20+ characters)", f.context.trim().length >= 20],
    ["Task states what the AI should do (10+ characters)", f.task.trim().length >= 10],
    ["Requirements has at least 2 concrete bullets", reqs.length >= 2],
    ["No vague words (good, better, modern...) in Requirements", reqs.length > 0 && vagueWords.length === 0],
    ["Additional Info lists constraints or preferences", f.extra.trim().length >= 10],
  ];
  const score = checks.filter(([, ok]) => ok).length;

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <label className="block text-sm font-semibold">Context<textarea className={input} rows={2} value={f.context} onChange={set("context")} placeholder="Next.js 16 app, TypeScript, orders module" /></label>
        <label className="block text-sm font-semibold">Task<textarea className={input} rows={2} value={f.task} onChange={set("task")} placeholder="Add a function that formats an order total" /></label>
        <label className="block text-sm font-semibold">Requirements (one per line)<textarea className={input} rows={4} value={f.requirements} onChange={set("requirements")} placeholder={"Return $1,234.50 style strings\nHandle 0 and negative amounts"} /></label>
        <label className="block text-sm font-semibold">Additional Info<textarea className={input} rows={2} value={f.extra} onChange={set("extra")} placeholder="No new dependencies; Node 24; use Intl.NumberFormat" /></label>
      </div>
      <div className="space-y-3">
        <pre className="whitespace-pre-wrap rounded-xl bg-[#0f1220] p-4 text-sm text-slate-100">{prompt}</pre>
        <ul className="space-y-1 text-sm">
          {checks.map(([label, ok]) => (
            <li key={label} className={ok ? "text-green-600" : "text-muted"}>
              {ok ? "PASS" : "todo"} - {label}
            </li>
          ))}
        </ul>
        <p className="font-semibold">Self-score: {score}/5</p>
        {vagueWords.length > 0 && <p className="text-sm text-red-600">Replace vague words with specifics: {vagueWords.join(", ")}</p>}
        <button className="btn-ghost !px-3 !py-1" onClick={() => navigator.clipboard.writeText(prompt)}>
          Copy prompt
        </button>
      </div>
    </div>
  );
}
