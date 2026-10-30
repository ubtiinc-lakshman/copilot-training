import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { actingFacilitator } from "@/lib/viewMode";
import ProgressView from "./ProgressView";

export const metadata = { title: "Program progress (facilitator)" };

async function FacilitatorOnly() {
  await connection(); // auth() uses random bytes, so render per request, not at build
  if (!(await actingFacilitator((await auth())?.user?.email))) redirect("/courses/copilot");
  return <ProgressView />;
}

export default function ProgressPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/copilot" className="text-sm link">
        GitHub Copilot
      </Link>
      <h1 className="mb-6 mt-4 text-3xl font-bold">Program progress</h1>
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <FacilitatorOnly />
      </Suspense>
    </main>
  );
}
