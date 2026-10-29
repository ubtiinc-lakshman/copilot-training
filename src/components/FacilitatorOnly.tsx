import type { ReactNode } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { actingFacilitator } from "@/lib/viewMode";

// Answer keys and demo scripts. Rendered on the server only for a facilitator who is not in participant view, so participants never receive the text.
export default async function FacilitatorOnly({ title = "Facilitator only", children }: { title?: string; children: ReactNode }) {
  await connection(); // auth() uses random bytes, so render per request, not at build
  if (!(await actingFacilitator((await auth())?.user?.email))) return null;
  return (
    <aside className="my-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
      <p className="mb-2 font-semibold">{title}</p>
      {children}
    </aside>
  );
}
