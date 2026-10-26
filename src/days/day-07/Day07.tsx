import { Section, CodeBlock, Callout } from "@/components/Section";
import ChecklistTracker from "@/components/ChecklistTracker";
import Quiz from "@/components/Quiz";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import { readDayFile } from "@/lib/readDayFile";
import LabTaskStatus from "@/components/LabTaskStatus";

const reviewer = [
  "A reviewer could act without asking a clarifying question",
  "(Dev) PR description links the requirement/ticket and lists test evidence explicitly",
  "(QA) Bug report repro steps are specific enough to reproduce on the first try",
  "Severity/priority is justified, not just asserted",
  "Draft was critiqued (by Copilot or a peer) for missing information, then revised",
];

type Result = { name: string; status: string; detail?: string };

export default function Day07() {
  const diff = readDayFile(7, "sample.diff");
  const data = JSON.parse(readDayFile(7, "test-results.json")) as { suite: string; environment: string; results: Result[]; complaint: string };
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Draft commit messages, PR descriptions and bug reports complete enough for a reviewer to act on without follow-up questions.</p>
        <Callout>A bug report that cannot be reproduced on the first try has failed, however well written.</Callout>
      </Section>

      <Section title="Concept">
        <ul className="ml-5 list-disc space-y-1">
          <li>Copilot turns a diff into a first-draft commit message and PR description. A first draft usually omits the why, the test evidence and the ticket link unless you ask.</li>
          <li>&quot;Tested&quot; alone tells a reviewer nothing. State what you ran and what passed.</li>
          <li>QA angle: Copilot can structure a vague complaint into observed / expected / steps, but you must supply details specific enough to reproduce: exact account type, exact wait time.</li>
        </ul>
      </Section>

      <Section title="Lab: Dev (input: sample.diff)">
        <CodeBlock label="src/days/day-07/sample.diff">{diff}</CodeBlock>
        <CodeBlock>{"# Context\n[paste the diff]\n# Task\nDraft a commit message, PR description, and README section for this\nchange.\n# Requirements\n- Link the requirement/ticket\n- List test evidence explicitly"}</CodeBlock>
      </Section>

      <Section title="Lab: QA (input: test-results.json)">
        <p className="text-sm">
          Suite <b>{data.suite}</b> on <b>{data.environment}</b>. Complaint: <i>&quot;{data.complaint}&quot;</i>
        </p>
        <table className="w-full text-sm">
          <tbody>
            {data.results.map((r) => (
              <tr key={r.name} className="border-b border-line">
                <td className={`w-16 py-1 font-semibold ${r.status === "pass" ? "text-green-600" : "text-red-600"}`}>{r.status}</td>
                <td>{r.name}</td>
                <td className="text-muted">{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CodeBlock>{"# Observed\nPassword reset email is never received for some users.\n# Expected\nEvery valid reset request receives the email within 2 minutes.\n# Steps to Reproduce\n1. Request reset for a user with a Gmail address created via SSO\n2. Wait 5 minutes\n# Task\nDraft a bug report with severity, environment, and suspected component."}</CodeBlock>
      </Section>

      <LabTaskStatus day={7} />

      <Section title="Reviewer checklist">
        <ChecklistTracker id="day-07-reviewer" items={reviewer} />
      </Section>

      <Section title="Assignment (due before Day 8)">
        <ul className="ml-5 list-disc">
          <li>One real PR description or bug report drafted with Copilot&apos;s help</li>
        </ul>
      </Section>

      <Section title="Quiz">
        <Quiz day={7} />
      </Section>

      <FacilitatorOnly>
        <ul className="list-disc space-y-1 pl-5">
          <li>Demo: draft a bug report from the one-line complaint, live.</li>
          <li>Evidence in the results: only the SSO-created Gmail case fails; the password-created user passes. Suspected component: reset-email path for SSO accounts.</li>
          <li>Swap drafts between two people and ask: could you act on this with no follow-up?</li>
        </ul>
      </FacilitatorOnly>
    </div>
  );
}
