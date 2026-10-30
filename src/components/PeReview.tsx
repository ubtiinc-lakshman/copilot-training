"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Facilitator control on one lab submission: approve it, or send it back with feedback (the person must resubmit).
export default function PeReview({ email, unit, status, feedback }: { email: string; unit: string; status: string; feedback: string | null }) {
  const router = useRouter();
  const [text, setText] = useState(feedback ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (next: "approved" | "changes") => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/pe/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, unit, status: next, feedback: text }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not save the review");
    router.refresh();
  };

  return (
    <div className="mt-3 space-y-2 border-t border-line pt-3">
      <p className="text-xs font-semibold text-muted">Review: {status === "approved" ? "approved" : status === "changes" ? "sent back" : "waiting for review"}</p>
      <textarea className="input min-h-16" placeholder="Feedback (required when sending back)" value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} />
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-primary" disabled={busy} aria-busy={busy} onClick={() => send("approved")}>Approve</button>
        <button className="btn-ghost" disabled={busy} aria-busy={busy} onClick={() => send("changes")}>Send back for changes</button>
        {error && <span className="text-sm text-rose-600">{error}</span>}
      </div>
    </div>
  );
}
