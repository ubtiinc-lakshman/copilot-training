import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth, isFacilitator } from "@/auth";
import ResultsView from "./ResultsView";

export const metadata = { title: "Quiz results (facilitator)" };

async function FacilitatorOnly() {
  await connection(); // auth() uses random bytes, so render per request, not at build
  if (!isFacilitator((await auth())?.user?.email)) redirect("/");
  return <ResultsView />;
}

export default function ResultsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/" className="text-sm link">
        Home
      </Link>
      <h1 className="mb-6 mt-4 text-3xl font-bold">Quiz results</h1>
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <FacilitatorOnly />
      </Suspense>
    </main>
  );
}
