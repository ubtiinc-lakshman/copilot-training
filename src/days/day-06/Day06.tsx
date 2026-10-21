import { Section, CodeBlock, Callout } from "@/components/Section";
import ChecklistTracker from "@/components/ChecklistTracker";
import Quiz from "@/components/Quiz";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { QUIZZES } from "../assessments";
import { readDayFile } from "@/lib/readDayFile";

const coverage = [
  "Every public function / test has a description",
  "Descriptions match actual behavior, not aspirational or happy-path-only intent",
  "At least one mismatch between description and behavior was caught and fixed",
  "(Dev) JSDoc includes an example of when it throws, 8 lines or fewer",
  "(QA) Given-When-Then matches the assertions exactly; mismatched test names flagged",
];

export default function Day06() {
  const code = readDayFile(6, "rateLimiter.js");
  const tests = readDayFile(6, "rateLimiter.test.js");
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Generate accurate documentation and test descriptions, and catch the cases where Copilot documents intent instead of actual behavior.</p>
        <Callout>Does this describe what the code does, or what it should do?</Callout>
      </Section>

      <Section title="Concept">
        <ul className="ml-5 list-disc space-y-1">
          <li>Copilot can read code and write a docstring, but it may describe what the name and structure suggest, not what the code literally does.</li>
          <li>A wrong docstring is worse than none: it misleads the next reader instead of leaving an honest gap.</li>
          <li>QA angle: a Given-When-Then description can overstate what a test really checks. A suite full of confident but inaccurate descriptions erodes trust.</li>
        </ul>
      </Section>

      <Section title="Lab: Dev (docstrings)">
        <CodeBlock label="src/days/day-06/rateLimiter.js (read the docstring, then read the code)">{code}</CodeBlock>
        <CodeBlock>{"# Context\nThis is an undocumented Node.js middleware function for rate limiting.\n# Task\nGenerate a JSDoc comment explaining parameters, return value, and\nrate-limit behavior.\n# Requirements\n- Include an example of when it throws\n- Keep it under 8 lines"}</CodeBlock>
      </Section>

      <Section title="Lab: QA (Given-When-Then)">
        <CodeBlock label="src/days/day-06/rateLimiter.test.js">{tests}</CodeBlock>
        <CodeBlock>{"# Context\nThis test file has no descriptions, only assertions.\n# Task\nGenerate a Given-When-Then description above each test case.\n# Requirements\n- Match the description exactly to what the assertions actually check\n- Flag any test whose name doesn't match its assertions"}</CodeBlock>
      </Section>

      <Section title="Documentation-coverage check">
        <ChecklistTracker id="day-06-coverage" items={coverage} />
      </Section>

      <Section title="Assignment (due before Day 7)">
        <ul className="ml-5 list-disc">
          <li>One real module or test file in your own repo, documented with Copilot-generated, human-reviewed comments</li>
        </ul>
      </Section>

      <Section title="Quiz">
        <Quiz day={6} questions={QUIZZES[6]} />
      </Section>

      <FacilitatorOnly>
        <ul className="list-disc space-y-1 pl-5">
          <li>Planted mismatches: the docstring says sliding window (code is a fixed window that resets when the window expires), and says never throws (it throws a TypeError when options are missing, see test 4).</li>
          <li>Demo: regenerate the misleading docstring and show before/after.</li>
          <li>Spot-check 2-3 generated docstrings for accuracy, not just presence. Ask who found a happy-path-only docstring.</li>
        </ul>
      </FacilitatorOnly>
    </div>
  );
}
