import { Suspense } from "react";
import { connection } from "next/server";
import { auth, isFacilitator } from "@/auth";
import { NavLinks } from "@/components/HeaderClient";

const ITEMS = [
  { href: "/courses/copilot", label: "Overview" },
  { href: "/courses/copilot/common", label: "Common days" },
  { href: "/courses/copilot/today", label: "My week" },
  { href: "/courses/copilot/library", label: "Library" },
];
const FACILITATOR_ITEMS = [
  { href: "/courses/copilot/progress", label: "Progress" },
  { href: "/courses/copilot/results", label: "Results" },
];

// Progress and Results only appear for facilitators.
async function CourseLinks() {
  await connection(); // auth() uses random bytes, so render per request, not at build
  const facilitator = isFacilitator((await auth())?.user?.email);
  return <NavLinks items={facilitator ? [...ITEMS, ...FACILITATOR_ITEMS] : ITEMS} />;
}

// Course sub-navigation shared by every GitHub Copilot page.
export default function CopilotLayout({ children }: LayoutProps<"/courses/copilot">) {
  return (
    <>
      <div className="border-b border-line bg-surface">
        <nav className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-6 py-1.5" aria-label="GitHub Copilot course">
          <span className="mr-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">GitHub Copilot</span>
          <Suspense>
            <CourseLinks />
          </Suspense>
        </nav>
      </div>
      {children}
    </>
  );
}
