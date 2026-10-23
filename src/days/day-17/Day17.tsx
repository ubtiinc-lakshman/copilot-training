import LabDay from "@/components/LabDay";

export default function Day17() {
  return (
    <LabDay
      cfg={{
        day: 17,
        objective: "Adopt one custom keybinding or snippet that removes real friction in your own workflow.",
        callout: "Bind the action you do most often, not the flashiest one.",
        concept: [
          "Copilot actions (accept, open Chat, /tests, /explain) can be bound to keys and wrapped in snippets.",
          "A snippet of your structured prompt template saves the typing that makes people skip the structure.",
          "Extensions and settings differ between VS Code, JetBrains and Visual Studio; use your own IDE.",
        ],
        labs: [
          {
            title: "Lab: configure keybindings and a snippet",
            files: [{ path: "keybindings.sample.json" }, { path: "snippets.sample.json" }],
            steps: [
              "Rebind accept-suggestion and open-Chat to keys you will actually use.",
              "Create one snippet for the Copilot action you use most (for example /tests).",
              "Share your keybinding with a partner and try theirs.",
            ],
          },
        ],
        checklist: {
          id: "day-17-setup",
          title: "Setup demo checklist (2 min each)",
          items: ["The keybinding works in my IDE", "It is faster than the default", "I can explain why I chose this one"],
        },
        assignment: ["Use one new keybinding or snippet in daily work for the rest of the week"],
        quiz: {},
        facilitator: [
          "Lighter day by design: use spare time as catch-up for anyone behind on Days 11-16.",
          "Each participant demos live for 2 minutes. 'Because it looked useful' is not an answer; ask what friction it removes.",
        ],
      }}
    />
  );
}
