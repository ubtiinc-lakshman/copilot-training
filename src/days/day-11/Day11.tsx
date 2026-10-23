import LabDay from "@/components/LabDay";

export default function Day11() {
  return (
    <LabDay
      cfg={{
        day: 11,
        objective: "Chain three prompts where each response feeds the next, and package the chain as a reusable template.",
        callout: "A chain only earns its name if step 2 uses step 1's actual output.",
        concept: [
          "Multi-step prompting: one response becomes the context for the next prompt.",
          "Build a personal prompt library: save chains with [BRACKETS] so they can be reused.",
          "Start a fresh Chat session when the topic changes; continue the session when the next step depends on the last answer.",
        ],
        labs: [
          { title: "Lab: Dev and QA chains (Plan, Scaffold, Test / Requirement, Cases, Automation)", files: [{ path: "chain-template.md" }] },
          {
            title: "Steps",
            steps: [
              "Run step 1 and get the plan (Dev) or the scenario list (QA).",
              "Feed the ACTUAL output (not a rewrite) into step 2, then step 3.",
              "Save the 3-prompt chain as a template with [BRACKETS] for reuse.",
            ],
          },
        ],
        checklist: {
          id: "day-11-chain",
          title: "Chain check",
          items: [
            "Step 2 genuinely uses step 1's actual output, not a from-scratch rewrite",
            "Step 3 genuinely uses step 2's actual output",
            "The template has clear [BRACKETS] a teammate could fill in without asking me",
          ],
        },
        assignment: ["Your saved 3-prompt chain template", "Applied to one real task in your own repo"],
        quiz: {},
        facilitator: [
          "Watch for participants rewriting context from scratch at each step: that is not a chain.",
          "Debrief: 2-minute presentations per person. Capture the best 2-3 for the team playbook (Day 27).",
        ],
      }}
    />
  );
}
