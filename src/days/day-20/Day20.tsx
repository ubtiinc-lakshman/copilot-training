import { Section, CodeBlock, Callout } from "@/components/Section";
import ChecklistTracker from "@/components/ChecklistTracker";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { RubricScorer, LevelGate } from "../day-10/Capstone";
import { readDayFile } from "@/lib/readDayFile";
import LabTaskStatus from "@/components/LabTaskStatus";

const success = [
  "The automation runs against the real feature, live, not a canned demo",
  "At least one real failure was diagnosed and fixed during the session",
  "The retrospective names a specific place Copilot needed a human override",
  "Both partners can explain the OTHER half of the work",
];

export default function Day20() {
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Pair-program a real backlog item end to end: Dev implements, QA automates, and the automation runs against the live feature in the room.</p>
        <Callout>Parallel work, not sequential. A capstone with zero failures to fix probably picked something too trivial.</Callout>
      </Section>

      <Section title="Plan (35 min)">
        <CodeBlock label="src/days/day-20/CAPSTONE.md">{readDayFile(20, "CAPSTONE.md")}</CodeBlock>
      </Section>

      <LabTaskStatus day={20} />

      <Section title="Success criteria">
        <ChecklistTracker id="day-20-success" items={success} />
      </Section>

      <Section title="Retrospective template">
        <CodeBlock label="src/days/day-20/RETRO_TEMPLATE.md">{readDayFile(20, "RETRO_TEMPLATE.md")}</CodeBlock>
      </Section>

      <FacilitatorOnly title="Scoring (facilitator only)">
        <p className="mb-2">Score each dimension 1-5. 20-25 Certified, 15-19 Competent, 10-14 Developing, below 10 Not Yet Competent.</p>
        <RubricScorer />
        <p className="my-2">Level completion gate (Days 11-20):</p>
        <LevelGate />
        <p className="mt-2 text-xs">
          Encourage QA to start automating from the requirement immediately. Closing question: what did you have to override Copilot on, and how did you know to?
        </p>
      </FacilitatorOnly>
    </div>
  );
}
