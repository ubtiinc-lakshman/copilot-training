import OrderPlayground from "./OrderPlayground";
import Quiz from "@/components/Quiz";
import { QUIZZES } from "../assessments";

const agenda = [
  ["Concept", "What Copilot is and is not; where it fits in the 7-phase AI Enabled Development Guide; the five AI agents the org uses"],
  ["Live demo", "Accept an inline suggestion, ask Chat for a summary, read both critically"],
  ["Lab (20 min)", "Accept/reject 5 suggestions; first Chat summary of the codebase"],
  ["Assessment + wrap", "5-question concept quiz; assignment issued"],
];

const prompt = `# Context
This practice repo (Dev: the service modules in src/days/day-01, QA: the test file).
# Task
Summarize what this codebase does in 3 sentences.`;

export default function Day01() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-semibold">Objective</h2>
        <p className="mt-2">
          Explain what Copilot is and is not, where it sits in the org&apos;s AI Enabled Development Guide workflow, and get a first
          inline suggestion and Chat answer on the board.
        </p>
        <p className="mt-3 rounded bg-amber-100 px-3 py-2 font-semibold text-amber-900">Copilot suggests, you decide.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Agenda</h2>
        <ul className="mt-2 space-y-1">
          {agenda.map(([name, text]) => (
            <li key={name}>
              <b>{name}:</b> {text}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Live practice module</h2>
        <p className="mb-3 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Code lives in <code>src/days/day-01/order.service.js</code> (Dev) with tests in <code>order.service.test.js</code> (QA).
          Five TODO comments are waiting for Copilot suggestions. Run <code>npm test</code> to check your work.
        </p>
        <OrderPlayground />
      </section>

      <section>
        <h2 className="text-xl font-semibold">Lab</h2>
        <h3 className="mt-3 font-semibold">Task 1: Accept / reject practice (10 min)</h3>
        <ol className="ml-5 list-decimal space-y-1">
          <li>Place the cursor under a TODO comment and wait for the ghost-text suggestion.</li>
          <li>Read the whole suggestion before pressing Tab.</li>
          <li>Accept 3 and reject 2 (Esc). Write down why you rejected each one.</li>
          <li>Pick the rejection you are most confident about for the debrief.</li>
        </ol>
        <p className="mt-2 text-sm">Check each suggestion for: empty or null input, rounding, wrong threshold (500 means 500 or more), off-by-one.</p>

        <h3 className="mt-5 font-semibold">Task 2: First Chat summary (10 min)</h3>
        <pre className="mt-2 overflow-x-auto rounded bg-zinc-900 p-3 text-sm text-zinc-100">{prompt}</pre>
        <p className="mt-2 text-sm">Compare the summary to the real code. If it missed or invented something, write your own 3-sentence version.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Assignment (due before Day 2)</h2>
        <ul className="ml-5 list-disc">
          <li>One screenshot of an accepted inline suggestion</li>
          <li>One screenshot of a Chat response</li>
          <li>Post both to the shared Day-1 channel</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Quiz</h2>
        <p className="mb-3 mt-2 text-sm">Also check: did you name a suggestion you rejected, and why? Did you check the Chat summary against the real code?</p>
        <Quiz day={1} questions={QUIZZES[1]} />
      </section>
    </div>
  );
}
