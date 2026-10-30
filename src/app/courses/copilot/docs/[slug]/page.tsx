import { Suspense } from "react";
import Link from "next/link";
import { DocView } from "@/components/Docs";

async function Doc({ params }: { params: Promise<{ slug: string }> }) {
  return <DocView course="copilot" slug={(await params).slug} />;
}

export default function CopilotDocPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/courses/copilot/docs" className="link text-sm">
        Documents
      </Link>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <Doc params={params} />
      </Suspense>
    </main>
  );
}
