import { Section, CodeBlock, Callout } from "@/components/Section";
import PhoneTester from "./PhoneTester";
import Quiz from "@/components/Quiz";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { QUIZZES } from "../assessments";
import { readDayFile } from "@/lib/readDayFile";

const reflection = `Language / framework I tried:
What Copilot got right:
One specific mistake or gap I found:
Was it syntax, logic, or convention?
How did I verify (or: what could I NOT verify)? `;

export default function Day08() {
  const src = readDayFile(8, "phone-validation.ts");
  const scenario = readDayFile(8, "login-scenario.md");
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Recognize the extra scrutiny needed when you cannot personally verify Copilot&apos;s output in an unfamiliar language or framework.</p>
        <Callout>&quot;I don&apos;t know this well enough to catch a mistake&quot; is exactly when Copilot needs the MOST scrutiny.</Callout>
      </Section>

      <Section title="Concept">
        <ul className="ml-5 list-disc space-y-1">
          <li>Suggestion quality is strongest in widely used ecosystems and can be subtly wrong in less familiar ones, with no drop in fluency or confidence.</li>
          <li>When you cannot verify, say so explicitly in a PR note or handoff. Silence implies confidence that is not there.</li>
        </ul>
      </Section>

      <Section title="Lab: Dev">
        <CodeBlock label="src/days/day-08/phone-validation.ts">{src}</CodeBlock>
        <p className="text-sm">Try the behavior first:</p>
        <PhoneTester />
        <CodeBlock>{"# Context\nThis TypeScript function validates a phone number for a signup form.\n# Task\nRewrite this same validation in [an unfamiliar language], keeping\nidentical edge-case behavior.\n# Requirements\n- Same accepted/rejected formats\n- Note any behavior you couldn't guarantee is identical"}</CodeBlock>
      </Section>

      <Section title="Lab: QA">
        <CodeBlock label="src/days/day-08/login-scenario.md">{scenario}</CodeBlock>
      </Section>

      <Section title="Reflection template (your assignment)">
        <CodeBlock>{reflection}</CodeBlock>
      </Section>

      <Section title="Quiz">
        <Quiz questions={QUIZZES[8]} />
      </Section>

      <FacilitatorOnly>
        <ul className="list-disc space-y-1 pl-5">
          <li>Demo: ask for this validation in Go (or any language nobody uses daily) and hunt for the subtle mistake live.</li>
          <li>Typical misses: counting runes vs bytes, regex dialect differences, Unicode digits matching \d, trimming whitespace, the empty string.</li>
          <li>Pair people who picked different unfamiliar stacks so they compare notes.</li>
        </ul>
      </FacilitatorOnly>
    </div>
  );
}
