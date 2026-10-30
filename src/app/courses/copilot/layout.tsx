import CourseShell from "@/components/CourseShell";

const GROUPS = [
  { items: [{ href: "/courses/copilot", label: "Overview" }] },
  {
    label: "Your path",
    items: [
      { href: "/courses/copilot/common", label: "1. Common days" },
      { href: "/courses/copilot/tracks", label: "2. Team tracks" },
      { href: "/courses/copilot/today", label: "3. Weekly apps" },
    ],
  },
  {
    label: "Reference",
    items: [
      { href: "/courses/copilot/library", label: "Lesson library" },
      { href: "/courses/copilot/docs", label: "Documents" },
    ],
  },
  { label: "Me", items: [{ href: "/courses/copilot/me", label: "My progress" }] },
];
const FACILITATOR = {
  label: "Facilitator",
  items: [
    { href: "/courses/copilot/progress", label: "Progress" },
    { href: "/courses/copilot/tracks/roster", label: "Track roster" },
    { href: "/courses/copilot/tracks/progress", label: "Track reviews" },
    { href: "/courses/copilot/results", label: "Results" },
  ],
};

// Course menu shared by every GitHub Copilot page.
export default function CopilotLayout({ children }: LayoutProps<"/courses/copilot">) {
  return (
    <CourseShell title="GitHub Copilot" groups={GROUPS} facilitatorGroup={FACILITATOR}>
      {children}
    </CourseShell>
  );
}
