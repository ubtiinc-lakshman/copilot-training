import Link from "next/link";
import { COURSES } from "@/courses";

export const metadata = { title: "Prompt Engineering | IC Training Center" };

export default function PromptEngineeringPage() {
  const course = COURSES.find((c) => c.id === "prompt-engineering")!;
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/" className="link text-sm">
        All courses
      </Link>
      <p className="chip-idle mt-4">Coming soon</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{course.title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{course.blurb}</p>
      <div className="card mt-6 p-5 text-sm">
        <p className="font-semibold">What this course will have</p>
        <ul className="ml-5 mt-2 list-disc space-y-1">
          {course.parts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="mt-3 text-muted">The material is being moved over from the earlier Prompt Engineering training.</p>
      </div>
    </main>
  );
}
