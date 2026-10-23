import LabDay from "@/components/LabDay";

export default function Day29() {
  return (
    <LabDay
      cfg={{
        day: 29,
        objective: "Teach one technique clearly enough that a peer who does not know it can apply it afterwards.",
        callout: "Teach one technique deeply, not three shallowly.",
        concept: [
          "Dev teaches a Dev technique, QA teaches a QA technique, to a partner who does not already know it.",
          "A lesson that only makes sense to someone who already knows the technique has failed.",
          "The real test is whether your partner can say the core idea back in their own words.",
        ],
        labs: [
          {
            title: "Lab: prepare and deliver a 10-minute mini-lesson",
            files: [{ path: "MINI_LESSON.template.md" }],
            steps: [
              "Pick one technique from anywhere in the program that you know well.",
              "Deliver it to a partner unfamiliar with it, and let them try it themselves.",
              "Ask them to repeat the idea back, collect one piece of feedback, and refine the lesson.",
            ],
          },
        ],
        checklist: {
          id: "day-29-lesson",
          title: "Mini-lesson check",
          items: [
            "My partner did not already know the technique",
            "My partner could restate the core idea afterwards",
            "I changed the lesson because of their feedback",
          ],
        },
        assignment: ["The mini-lesson, refined with your partner's feedback, ahead of the capstone"],
        quiz: {},
        facilitator: [
          "Coach presenters to test the lesson on someone unfamiliar first. Watch for lessons that rush the 'they try it' step.",
          "Pairs should rehearse their capstone Q&A defense now. Tomorrow is leadership-facing.",
        ],
      }}
    />
  );
}
