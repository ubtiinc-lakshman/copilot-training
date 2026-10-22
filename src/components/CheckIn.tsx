"use client";

import { useEffect } from "react";

// Records attendance for the day being viewed. Renders nothing.
export default function CheckIn({ day }: { day: number }) {
  useEffect(() => {
    fetch("/api/attendance", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ day }) });
  }, [day]);
  return null;
}
