import { Suspense } from "react";
import Link from "next/link";
import { DocList } from "@/components/Docs";

export const metadata = { title: "Documents | GitHub Copilot" };

export default function CopilotDocsPage() {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-6 py-10">
      <Link href="/courses/copilot" className="link text-sm">
        GitHub Copilot
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Documents</h1>
      <p className="text-muted">Playbooks for your role, the long lab workbooks and reference sheets. Open a document to read it, and use Copy to take a prompt or a file with you. The daily lessons and quizzes are in the Lesson library.</p>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <DocList course="copilot" base="/courses/copilot/docs" />
      </Suspense>
    </main>
  );
}
