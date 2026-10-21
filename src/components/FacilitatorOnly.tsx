"use client";

import type { ReactNode } from "react";
import { useFacilitator } from "@/lib/facilitator";

export default function FacilitatorOnly({ title = "Facilitator only", children }: { title?: string; children: ReactNode }) {
  if (!useFacilitator()) return null;
  return (
    <aside className="my-4 rounded-lg border border-amber-400 bg-amber-50 p-4 text-sm text-amber-950">
      <p className="mb-2 font-semibold">{title}</p>
      {children}
    </aside>
  );
}
