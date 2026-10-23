import { Section, CodeBlock, Callout } from "@/components/Section";
import ChecklistTracker from "@/components/ChecklistTracker";
import Quiz from "@/components/Quiz";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { readDayFile } from "@/lib/readDayFile";

export type LabSection = {
  title: string;
  intro?: string;
  steps?: string[];
  files?: { path: string; label?: string }[]; // read from src/days/day-NN/
  prompt?: string;
};

export type DayConfig = {
  day: number;
  objective: string;
  callout: string;
  concept: string[];
  labs: LabSection[];
  checklist?: { id: string; title: string; items: string[] };
  assignment: string[];
  quiz?: { passPercent?: number }; // omit for rubric-assessed days
  facilitator: string[];
};

// Standard day page (objective, concept, labs, checklist, assignment, quiz, facilitator notes) built from data.
export default function LabDay({ cfg }: { cfg: DayConfig }) {
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>{cfg.objective}</p>
        <Callout>{cfg.callout}</Callout>
      </Section>

      <Section title="Concept">
        <ul className="ml-5 list-disc space-y-1">
          {cfg.concept.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>

      {cfg.labs.map((lab) => (
        <Section key={lab.title} title={lab.title}>
          {lab.intro && <p className="text-sm">{lab.intro}</p>}
          {lab.files?.map((f) => (
            <CodeBlock key={f.path} label={f.label ?? `src/days/day-${String(cfg.day).padStart(2, "0")}/${f.path}`}>
              {readDayFile(cfg.day, f.path)}
            </CodeBlock>
          ))}
          {lab.prompt && <CodeBlock>{lab.prompt}</CodeBlock>}
          {lab.steps && (
            <ol className="ml-5 list-decimal space-y-1 text-sm">
              {lab.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          )}
        </Section>
      ))}

      {cfg.checklist && (
        <Section title={cfg.checklist.title}>
          <ChecklistTracker id={cfg.checklist.id} items={cfg.checklist.items} />
        </Section>
      )}

      <Section title="Assignment">
        <ul className="ml-5 list-disc">
          {cfg.assignment.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Section>

      {cfg.quiz && (
        <Section title="Quiz">
          <Quiz day={cfg.day} passPercent={cfg.quiz.passPercent} />
        </Section>
      )}

      <FacilitatorOnly>
        <ul className="list-disc space-y-1 pl-5">
          {cfg.facilitator.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </FacilitatorOnly>
    </div>
  );
}
