import { Section, CodeBlock, Callout } from "@/components/Section";
import Quiz from "@/components/Quiz";
import ChecklistTracker from "@/components/ChecklistTracker";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { readDayFile } from "@/lib/readDayFile";

const checklist = [
  "Hardcoded secrets (keys, tokens, passwords in code)",
  "Missing input validation",
  "Weak crypto defaults (MD5/SHA1 for passwords, no salt, no expiry)",
  "PII or secrets in logs",
  "Licensing / provenance (does it look copied from a known project?)",
];

export default function Day09() {
  const outputs = [1, 2, 3, 4, 5].map((n) => ({ n, code: readDayFile(9, `seeded/output-${n}.js`) }));
  const key = readDayFile(9, "ANSWER-KEY.md");
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Apply the org&apos;s security checklist to Copilot output and correctly identify licensing and data-leakage red flags.</p>
        <Callout>This is a hard gate: the 10-question test needs 70%.</Callout>
      </Section>

      <Section title="Concept">
        <ul className="ml-5 list-disc space-y-1">
          <li><b>IP / licensing risk:</b> Copilot can suggest code resembling licensed third-party code. A distinctive implementation or a license header is a signal to stop and check provenance.</li>
          <li><b>Data leakage risk:</b> anything pasted into a prompt (a trace, a log line, a sample record) can carry secrets or customer PII. Sanitize first. Once pasted, it has left your boundary.</li>
          <li><b>Never paste into a prompt:</b> secrets and credentials, customer PII, proprietary algorithms, confidential business data.</li>
        </ul>
        <p className="mt-2 text-sm font-semibold">The four-point scan for every output:</p>
        <ChecklistTracker id="day-09-scan" items={checklist} />
      </Section>

      <Section title="Lab: review the 5 seeded outputs (credentials are fake)">
        <CodeBlock>{"# Context\nThis is a Copilot-generated authentication snippet.\n# Task\nReview it against our security checklist: hardcoded secrets, missing\ninput validation, weak crypto defaults, PII in logs.\n# Requirements\nList every finding with severity and the line it's on."}</CodeBlock>
        {outputs.map((o) => (
          <CodeBlock key={o.n} label={`src/days/day-09/seeded/output-${o.n}.js`}>
            {o.code}
          </CodeBlock>
        ))}
      </Section>

      <Section title="Written test (10 questions, pass mark 70%)">
        <Quiz day={9} passPercent={70} />
      </Section>

      <Section title="Assignment (due before Day 10)">
        <ul className="ml-5 list-disc">
          <li>Read the org&apos;s AI usage policy (or the Guide&apos;s Security Considerations section)</li>
          <li>Submit one question or one real example from your own Day 1-8 work</li>
        </ul>
      </Section>

      <FacilitatorOnly title="Answer key for the seeded outputs">
        <pre className="whitespace-pre-wrap text-xs">{key}</pre>
        <p className="mt-2 text-xs">Demo: run output 1 (clean) and output 2 (hardcoded secret) through the checklist live. Go through the key together; do not leave a missed red flag unaddressed. Every participant should name 2 things they would never paste into a prompt.</p>
      </FacilitatorOnly>
    </div>
  );
}
