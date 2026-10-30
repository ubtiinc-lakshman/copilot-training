"use client";

import { useState } from "react";

// Copies text to the clipboard and says so. It tries the classic copy first (works straight from a click, no permission prompt)
// and falls back to the clipboard API, so it also works on plain http and inside embedded views.
function copyNow(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

export default function CopyButton({ text, label = "Copy", className = "btn-ghost !py-1 !text-xs" }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    let ok = copyNow(text);
    if (!ok && navigator.clipboard?.writeText) {
      try {
        // A browser can leave this pending while it waits for permission, so do not wait for it forever.
        await Promise.race([navigator.clipboard.writeText(text), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500))]);
        ok = true;
      } catch {
        ok = false;
      }
    }
    setState(ok ? "copied" : "failed");
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button type="button" className={className} onClick={copy} aria-live="polite">
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label}
    </button>
  );
}
