import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { actingFacilitator } from "@/lib/viewMode";
import { NavLinks } from "@/components/HeaderClient";
import ScrollChrome from "@/components/ScrollChrome";

const ITEMS = [
  { href: "/courses/prompt-engineering", label: "Overview" },
  { href: "/courses/prompt-engineering/l1", label: "Level 1" },
  { href: "/courses/prompt-engineering/l2", label: "Level 2" },
  { href: "/courses/prompt-engineering/l3", label: "Level 3" },
  { href: "/courses/prompt-engineering/library", label: "Library" },
  { href: "/courses/prompt-engineering/me", label: "My progress" },
];
const FACILITATOR_ITEMS = [{ href: "/courses/prompt-engineering/progress", label: "Progress" }];

// Progress only appears for facilitators.
async function CourseLinks() {
  await connection(); // auth() uses random bytes, so render per request, not at build
  const facilitator = await actingFacilitator((await auth())?.user?.email);
  return <NavLinks items={facilitator ? [...ITEMS, ...FACILITATOR_ITEMS] : ITEMS} />;
}

// Course sub-navigation shared by every Prompt Engineering page.
export default function PromptEngineeringLayout({ children }: LayoutProps<"/courses/prompt-engineering">) {
  return (
    <>
      <ScrollChrome />
      <div className="course-nav sticky top-[49px] z-10 border-b border-line bg-surface">
        <nav className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-6 py-1.5" aria-label="Prompt Engineering course">
          <span className="mr-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">Prompt Engineering</span>
          <Suspense>
            <CourseLinks />
          </Suspense>
        </nav>
      </div>
      {children}
    </>
  );
}
