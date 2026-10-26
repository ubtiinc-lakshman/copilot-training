import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth, isFacilitator } from "@/auth";
import ProgressView from "./ProgressView";

export const metadata = { title: "Program progress (facilitator)" };

async function FacilitatorOnly() {
  await connection(); // auth() uses random bytes, so render per request, not at build
  if (!isFacilitator((await auth())?.user?.email)) redirect("/");
  return <ProgressView />;
}

export default function ProgressPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link href="/" className="text-sm link">
        Home
      </Link>
      <h1 className="mb-6 mt-4 text-3xl font-bold">Program progress</h1>
      <Suspense fallback={<p className="text-muted">Loading...</p>}>
        <FacilitatorOnly />
      </Suspense>
    </main>
  );
}
