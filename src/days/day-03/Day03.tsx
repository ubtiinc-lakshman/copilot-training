import { Section, CodeBlock, Callout } from "@/components/Section";
import DecisionLog from "@/components/DecisionLog";
import Quiz from "@/components/Quiz";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import LabTaskStatus from "@/components/LabTaskStatus";

export default function Day03() {
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Use accept / reject / edit judgment on inline suggestions instead of reflexive Tab-accepting.</p>
        <Callout>Accept, read it back, then decide.</Callout>
      </Section>

      <Section title="Concept">
        <ul className="ml-5 list-disc space-y-1">
          <li>Ghost-text suggestions come from the code, comments, file name and imports around the cursor. A specific comment gives a more relevant suggestion, but relevant is not the same as correct.</li>
          <li>Three outcomes, not two: accept as-is, reject, or accept and edit. Editing a mostly-right suggestion is often the fastest path.</li>
          <li>Trust scales with how well you can verify the output. In unfamiliar territory assume it needs more scrutiny (Day 8).</li>
        </ul>
      </Section>

      <Section title="Lab: Dev variant">
        <p className="text-sm">Open <code>src/days/day-03/utils.js</code>. Five comments, five stubs.</p>
        <CodeBlock>{"// Return true if the given string is a valid email address using regex."}</CodeBlock>
        <ol className="ml-5 list-decimal text-sm">
          <li>Write the comment, accept the suggestion.</li>
          <li>Test it against 2 valid and 2 invalid emails.</li>
          <li>Edit one suggestion to fix a subtle issue: off-by-one, wrong null check, missing await.</li>
          <li>Repeat for the other four. <code>utils.test.js</code> has todo tests to switch on as you go.</li>
        </ol>
      </Section>

      <Section title="Lab: QA variant">
        <p className="text-sm">Open <code>src/days/day-03/test-helpers.js</code>. Five assertion helpers.</p>
        <CodeBlock>{"// Assert that response.status equals 201 and response.body.id is a\n// non-empty string."}</CodeBlock>
        <ol className="ml-5 list-decimal text-sm">
          <li>Accept the suggestion.</li>
          <li>Mutate the expected value mentally: does the assertion really fail?</li>
          <li>Edit one suggestion, then repeat for the other four.</li>
        </ol>
      </Section>

      <LabTaskStatus day={3} />

      <Section title="Decision log (for the peer review)">
        <DecisionLog />
      </Section>

      <Section title="Assignment (due before Day 4)">
        <ul className="ml-5 list-disc">
          <li>One real function or test-helper from your own repo, written with inline suggestions</li>
          <li>The diff, for peer review</li>
        </ul>
      </Section>

      <Section title="Quiz">
        <Quiz day={3} />
      </Section>

      <FacilitatorOnly>
        <ul className="list-disc space-y-1 pl-5">
          <li>Demo: write a comment, show a suggestion that is subtly wrong (off-by-one), fix it live.</li>
          <li>If nobody rejects anything they are not reading critically. Intervene when someone accepts all five with zero edits.</li>
          <li>Common miss to watch for: unhandled null or empty input.</li>
        </ul>
      </FacilitatorOnly>
    </div>
  );
}
