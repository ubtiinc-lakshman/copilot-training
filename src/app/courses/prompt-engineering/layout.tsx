import CourseShell from "@/components/CourseShell";

const GROUPS = [
  {
    label: "Learn",
    items: [
      { href: "/courses/prompt-engineering", label: "Overview" },
      { href: "/courses/prompt-engineering/l1", label: "Level 1" },
      { href: "/courses/prompt-engineering/l2", label: "Level 2" },
      { href: "/courses/prompt-engineering/l3", label: "Level 3" },
    ],
  },
  { label: "Reference", items: [{ href: "/courses/prompt-engineering/library", label: "Library" }] },
  { label: "Me", items: [{ href: "/courses/prompt-engineering/me", label: "My progress" }] },
];
const FACILITATOR = { label: "Facilitator", items: [{ href: "/courses/prompt-engineering/progress", label: "Progress" }] };

// Course menu shared by every Prompt Engineering page.
export default function PromptEngineeringLayout({ children }: LayoutProps<"/courses/prompt-engineering">) {
  return (
    <CourseShell title="Prompt Engineering" groups={GROUPS} facilitatorGroup={FACILITATOR}>
      {children}
    </CourseShell>
  );
}
