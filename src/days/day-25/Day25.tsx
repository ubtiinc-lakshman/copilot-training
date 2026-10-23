import LabDay from "@/components/LabDay";

export default function Day25() {
  return (
    <LabDay
      cfg={{
        day: 25,
        objective: "Confirm a performance fix against a load test or benchmark, not intuition.",
        callout: "Baseline first. A real number, not a feeling.",
        concept: [
          "Optimize the slow path (here, a repeated linear lookup inside a loop), but keep the output identical.",
          "Establish a baseline before changing anything, then run the SAME load profile after.",
          "A changed load profile makes the before/after comparison meaningless.",
        ],
        labs: [
          {
            title: "Lab: the slow endpoint, benchmark and load test",
            files: [{ path: "ordersEndpoint.js" }, { path: "bench.js" }, { path: "k6-orders.js" }],
          },
          {
            title: "Lab: Dev optimizes, QA load-tests, then confirm",
            prompt:
              "# Context\nEndpoint: GET /api/orders?userId=X, currently p95 latency 1.8s\n# Task\nScaffold a k6 load test simulating 50 concurrent users, 5-minute\nramp-up, and establish a baseline.",
            steps: [
              "Dev: run bench.js for the baseline, find the slow path with Copilot, optimize, keep npm test green.",
              "QA: scaffold or adapt the k6 test and record the baseline.",
              "Both: run the identical profile on the original and the optimized version and compare p95.",
            ],
          },
        ],
        assignment: ["One real slow path optimized, or one real load test scripted, for a current project"],
        quiz: {},
        facilitator: [
          "The slow path: USERS.find() runs for every one of 30,000 orders. Fix: index users in a Map once, or filter orders by userId first. Expect p95 to drop from about 100+ ms to about 1 ms on the bench.",
          "Do not accept 'feels faster' from any pair. Insist on the number and on an identical profile.",
        ],
      }}
    />
  );
}
