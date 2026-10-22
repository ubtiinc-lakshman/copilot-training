import { Section, CodeBlock, Callout } from "@/components/Section";
import Quiz from "@/components/Quiz";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { readDayFile } from "@/lib/readDayFile";

const commands = [
  ["/explain", "Narrates what selected code or an error means. Changes nothing."],
  ["/fix", "Proposes a concrete patch for selected code or an error."],
  ["/tests", "Generates tests for selected code."],
];

export default function Day04() {
  const trace = readDayFile(4, "STACKTRACE.txt");
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Use /explain, /fix and /tests correctly, and know when to hand a diagnosis to someone else instead of fixing it yourself.</p>
        <Callout>QA diagnoses and hands off. Dev fixes and hands back.</Callout>
      </Section>

      <Section title="Concept">
        <table className="w-full text-sm">
          <tbody>
            {commands.map(([c, d]) => (
              <tr key={c} className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="py-1 pr-4 font-mono font-semibold">{c}</td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="ml-5 mt-3 list-disc space-y-1">
          <li>Select the relevant code before asking. Asking cold forces Copilot to guess the scope.</li>
          <li>Paste the full stack trace, not a paraphrase. Exact type, message and location beat &quot;it sometimes breaks&quot;.</li>
          <li>A confident diagnosis still needs evidence. Ask &quot;how do I know that is the fix?&quot;</li>
        </ul>
      </Section>

      <Section title="Lab: Dev variant (files in src/days/day-04)">
        <CodeBlock>{"/fix\nTypeError: Cannot read properties of undefined (reading 'name')\n    at getUserName (user.service.js:10)\n\nfunction getUserName(userList, id) {\n  const user = userList.find((u) => u.id === id);\n  return user.name;\n}"}</CodeBlock>
        <ol className="ml-5 list-decimal text-sm">
          <li>Run /fix on the seeded bug and read the root-cause explanation.</li>
          <li>Apply the fix. Confirm the happy path still returns the name.</li>
          <li>Run <code>npm run test:seeded</code> to check (these tests are excluded from <code>npm test</code>).</li>
        </ol>
      </Section>

      <Section title="Lab: QA variant">
        <CodeBlock label="STACKTRACE.txt (seeded failing test)">{trace}</CodeBlock>
        <CodeBlock>{"/explain\n[paste the failing test's stack trace]\n\nIs this most likely a real defect, a flaky test, or bad test data?\nWhat evidence in the trace points that way?"}</CodeBlock>
        <p className="text-sm">Do NOT touch the fix. Write the diagnosis, with evidence, for a Dev to act on.</p>
      </Section>

      <Section title="Assignment (due before Day 5)">
        <ul className="ml-5 list-disc">
          <li>Screen-recorded or written walkthrough of your fix (Dev) or diagnosis (QA)</li>
          <li>The exact prompt used and the outcome, on one real bug or failing test in your own project</li>
        </ul>
      </Section>

      <Section title="Quiz">
        <Quiz day={4} />
      </Section>

      <FacilitatorOnly>
        <ul className="list-disc space-y-1 pl-5">
          <li>Dev bug: <code>getUserName</code> dereferences <code>undefined</code> when the id is unknown. Root fix: handle the not-found case (return null or throw a clear error), not a try/catch around the symptom.</li>
          <li>QA failure: <code>calculateCartTotal</code> applies the discount twice (81 instead of 90). A real defect, not flaky: deterministic, same result every run.</li>
          <li>Do not let QA start editing app code today. Ask &quot;how do you know that is the fix?&quot; after every answer.</li>
        </ul>
      </FacilitatorOnly>
    </div>
  );
}
