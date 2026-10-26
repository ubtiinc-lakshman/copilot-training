import { Section, CodeBlock, Callout } from "@/components/Section";
import ChecklistTracker from "@/components/ChecklistTracker";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { RubricScorer, LevelGate } from "./Capstone";
import { readDayFile } from "@/lib/readDayFile";
import LabTaskStatus from "@/components/LabTaskStatus";

const success = [
  "Feature runs and does what it claims",
  "Tests actually exercise the feature (not trivial or tautological assertions)",
  "Both partners can explain the OTHER half of the work",
  "PR description states what Copilot was used for at each step",
];

export default function Day10() {
  const csv = readDayFile(10, "capstone/validate-csv.js");
  const pw = readDayFile(10, "capstone/password-strength.js");
  const pr = readDayFile(10, "PR_TEMPLATE.md");
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Apply Days 1-9 end to end: a Dev and a QA partner build and test a small feature together with Copilot, then explain each other&apos;s half.</p>
        <Callout>No new content today. QA starts testing from the requirement immediately, in parallel with the Dev.</Callout>
      </Section>

      <Section title="Pick one option (starters in src/days/day-10/capstone)">
        <CodeBlock label="Option A: capstone/validate-csv.js (with sample.csv)">{csv}</CodeBlock>
        <CodeBlock label="Option B: capstone/password-strength.js">{pw}</CodeBlock>
      </Section>

      <Section title="Plan (35 min)">
        <ol className="ml-5 list-decimal space-y-1 text-sm">
          <li><b>Dev (20 min):</b> scaffold, implement, run once. Keep code on a <code>capstone/&lt;pair-name&gt;</code> branch.</li>
          <li><b>QA (parallel, 20 min):</b> generate Given-When-Then cases and runnable tests from the requirement, then run them against the Dev&apos;s feature and report failures.</li>
          <li><b>Mutual walkthrough (5 min):</b> QA explains the feature from the code only. Dev explains the tests from the test suite only. Flag any surprise.</li>
        </ol>
        <CodeBlock>{"# Context\nBuilding a small CLI tool: [feature description]\n# Task\nScaffold the implementation.\n# Requirements\n- [functional requirement 1]\n- [functional requirement 2]\n# Additional Info\n[language/runtime, no external dependencies]"}</CodeBlock>
      </Section>

      <LabTaskStatus day={10} />

      <Section title="Success criteria">
        <ChecklistTracker id="day-10-success" items={success} />
      </Section>

      <Section title="Deliverable: PR description template">
        <CodeBlock label="src/days/day-10/PR_TEMPLATE.md">{pr}</CodeBlock>
      </Section>

      <FacilitatorOnly title="Scoring (facilitator only)">
        <p className="mb-2">Score each dimension 1-5. 20-25 Certified, 15-19 Competent, 10-14 Developing, below 10 Not Yet Competent.</p>
        <RubricScorer />
        <p className="my-2">Level completion gate:</p>
        <LevelGate />
        <p className="mt-2 text-xs">Circulate pair by pair. The walkthrough is the real signal of whether the pairing worked. Do not let one partner do all the talking. Ask 1-2 pairs to demo live as the transition into Intermediate.</p>
      </FacilitatorOnly>
    </div>
  );
}
