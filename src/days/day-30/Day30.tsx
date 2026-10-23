import { Section, CodeBlock, Callout } from "@/components/Section";
import ChecklistTracker from "@/components/ChecklistTracker";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { RubricScorer, LevelGate } from "../day-10/Capstone";
import { readDayFile } from "@/lib/readDayFile";

const success = [
  "All 4 tasks (plan, scaffold, implement and test, review and present) were completed and demonstrated live",
  "At least one Agent-mode checkpoint intervention is documented",
  "The AI-usage log is complete and specific: tool/agent and phase, not generic",
  "Both partners can defend a design decision and a testing decision under Q&A",
];

export default function Day30() {
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Demonstrate the full lifecycle (plan, scaffold, implement, test, review, present) using the AI-agent-per-phase model, and defend the decisions made along the way.</p>
        <Callout>Leadership is evaluating judgment, not just output. Keep the AI-usage log updated as you go.</Callout>
      </Section>

      <Section title="The four tasks (35 min)">
        <CodeBlock label="src/days/day-30/CAPSTONE.md">{readDayFile(30, "CAPSTONE.md")}</CodeBlock>
      </Section>

      <Section title="Success criteria">
        <ChecklistTracker id="day-30-success" items={success} />
      </Section>

      <Section title="AI-usage log template">
        <CodeBlock label="src/days/day-30/AI_USAGE_LOG.template.md">{readDayFile(30, "AI_USAGE_LOG.template.md")}</CodeBlock>
      </Section>

      <FacilitatorOnly title="Scoring and certification (facilitator only)">
        <p className="mb-2">Score each dimension 1-5. 20-25 Certified, 15-19 Competent, 10-14 Developing, below 10 Not Yet Competent.</p>
        <RubricScorer />
        <p className="my-2">Level completion gate (Days 21-30):</p>
        <LevelGate />
        <p className="mt-2 text-xs">
          Rehearse the Q&amp;A defense with each pair beforehand. Program certification is awarded on passing all three levels, noting Dev, QA or Dev+QA completion. Close the program here: name the AI Champions and preview the monthly follow-up cadence.
        </p>
      </FacilitatorOnly>
    </div>
  );
}
