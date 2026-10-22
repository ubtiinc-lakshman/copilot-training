import { Section, CodeBlock, Callout } from "@/components/Section";
import PromptBuilder from "./PromptBuilder";
import Quiz from "@/components/Quiz";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { readDayFile } from "@/lib/readDayFile";

export default function Day05() {
  const seeds = readDayFile(5, "vague-prompts.md");
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Rewrite a vague prompt into the Context / Task / Requirements / Additional Info template and see the output improve.</p>
        <Callout>Vague prompts produce vague code. &quot;Make it good&quot; is not a requirement.</Callout>
      </Section>

      <Section title="Concept">
        <ul className="ml-5 list-disc space-y-1">
          <li>A model has to resolve ambiguity somehow, so it guesses the most common interpretation, which is often not what you needed.</li>
          <li>The template removes guesswork: what you work on, what you want, concrete requirements, constraints.</li>
          <li>Name the tech stack, framework and version. Replace words like good, better, modern with checkable specifics.</li>
        </ul>
        <CodeBlock>{"# Context\n[What you're working on]\n# Task\n[What you want the AI to do]\n# Requirements\n- [Requirement 1]\n- [Requirement 2]\n# Additional Info\n[Tech stack, constraints, preferences]"}</CodeBlock>
      </Section>

      <Section title="Lab: rewrite 3 prompts (20 min)">
        <ol className="ml-5 list-decimal text-sm">
          <li>Pick a vague prompt (yours or from the seed list below).</li>
          <li>Rewrite it with the builder. Aim for 5/5.</li>
          <li>Run both the vague and the rewritten version in Chat and compare the outputs side by side.</li>
        </ol>
        <PromptBuilder />
        <CodeBlock label="Seed prompts and a worked example (src/days/day-05/vague-prompts.md)">{seeds}</CodeBlock>
      </Section>

      <Section title="Assignment (due before Day 6)">
        <ul className="ml-5 list-disc">
          <li>2 rewritten prompts (before and after) from your own work</li>
        </ul>
      </Section>

      <Section title="Quiz">
        <Quiz day={5} />
      </Section>

      <FacilitatorOnly>
        <ul className="list-disc space-y-1 pl-5">
          <li>Demo: run a weak prompt and the templated prompt side by side.</li>
          <li>Walk the room: Requirements must have 2+ concrete bullets and Context must name the real stack.</li>
          <li>Have two people read their before/after aloud.</li>
        </ul>
      </FacilitatorOnly>
    </div>
  );
}
