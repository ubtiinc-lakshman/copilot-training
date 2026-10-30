import { Suspense } from "react";
import Link from "next/link";
import { DocList } from "@/components/Docs";

export const metadata = { title: "Documents | GitHub Copilot" };

export default function CopilotDocsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/courses/copilot" className="link text-sm">
        GitHub Copilot
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Documents</h1>
      <p className="text-muted">Playbooks, lab workbooks, reference sheets, guides and the program plan. The daily lessons, labs and quizzes are in the Library.</p>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <DocList course="copilot" base="/courses/copilot/docs" />
      </Suspense>
    </main>
  );
}
