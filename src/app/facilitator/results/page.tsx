import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isFacilitator } from "@/auth";
import ResultsView from "./ResultsView";

export const metadata = { title: "Quiz results (facilitator)" };

async function FacilitatorOnly() {
  if (!isFacilitator((await auth())?.user?.email)) redirect("/");
  return <ResultsView />;
}

export default function ResultsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        Home
      </Link>
      <h1 className="mb-6 mt-4 text-3xl font-bold">Quiz results</h1>
      <Suspense fallback={<p className="text-zinc-500">Loading...</p>}>
        <FacilitatorOnly />
      </Suspense>
    </main>
  );
}
