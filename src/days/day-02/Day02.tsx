import { Section, CodeBlock, Callout } from "@/components/Section";
import ChecklistTracker from "@/components/ChecklistTracker";
import FacilitatorOnly from "@/components/FacilitatorOnly";
import LabTaskStatus from "@/components/LabTaskStatus";

const checklist = [
  "GitHub Copilot extension installed in the IDE you use for real work",
  "GitHub Copilot Chat extension installed",
  "Signed in with your GitHub account; license shows Active",
  "Model-selector dropdown lists multiple models",
  "Test prompt runs with the default model",
  "Same prompt re-run after switching models; difference noted",
  "Verified on your PRIMARY work machine, not only the training sandbox",
  "Facilitator confirmed via screenshare or screenshot",
];

const models = [
  ["Claude Opus", "Planning and architecture-level reasoning (deep multi-step thinking)"],
  ["Claude Sonnet", "Day-to-day implementation"],
  ["Claude Haiku", "Quick docs and boilerplate"],
  ["GPT-4 / MS Copilot", "Broader architecture and cross-tool work"],
];

export default function Day02() {
  return (
    <div className="space-y-10">
      <Section title="Objective">
        <p>Everyone leaves with a verified, working Copilot install on the IDE they actually use, not just the training sandbox.</p>
        <Callout>A broken Day 2 install compounds for the rest of the program. Do not move on with a red X.</Callout>
      </Section>

      <Section title="Concept">
        <ul className="ml-5 list-disc space-y-1">
          <li><b>Licensing:</b> seats are assigned per user in the GitHub org admin console. Propagation can take a few minutes. If the model dropdown shows nothing, wait and re-check, then escalate. Do not reinstall repeatedly.</li>
          <li><b>Install:</b> Copilot plus Copilot Chat in VS Code, JetBrains or Visual Studio. The steps differ slightly per marketplace; the end state is identical.</li>
          <li><b>Model picker:</b> the chosen model changes output quality, speed and cost.</li>
        </ul>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {models.map(([m, use]) => (
              <tr key={m} className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="py-1 pr-4 font-semibold">{m}</td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Setup checklist (saved in this browser)">
        <ChecklistTracker id="day-02-setup" items={checklist} />
      </Section>

      <Section title="Lab task 2: confirm the model responds">
        <CodeBlock>{"Write a one-line function that returns the current UTC timestamp."}</CodeBlock>
        <ol className="ml-5 list-decimal">
          <li>Run it with the default model.</li>
          <li>Switch models in the dropdown and run it again.</li>
          <li>Note any difference. Paste one answer into <code>src/days/day-02/utc.js</code>, then remove <code>todo</code> in the test.</li>
        </ol>
      </Section>

      <LabTaskStatus day={2} />

      <Section title="Assignment (due before Day 3)">
        <ul className="ml-5 list-disc">
          <li>Copilot is active on your primary work machine</li>
          <li>Submit the completed setup checklist</li>
        </ul>
      </Section>

      <FacilitatorOnly>
        <ul className="list-disc space-y-1 pl-5">
          <li>Demo: install the extension on a clean profile, sign in, switch models live.</li>
          <li>Escalate any license that has not propagated immediately; nobody sits idle.</li>
          <li>Show of hands: VS Code / JetBrains / Visual Studio, to plan later demos.</li>
        </ul>
      </FacilitatorOnly>
    </div>
  );
}
