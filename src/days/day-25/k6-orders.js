// Day 25 (QA): k6 load test for GET /api/orders?userId=X. A template to adapt with Copilot.
// Run: k6 run src/days/day-25/k6-orders.js   (BASE_URL=https://staging.example.com k6 run ...)
// Keep the profile IDENTICAL for the baseline and the optimized run, or the comparison means nothing.
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 50 }, // ramp up to 50 virtual users
    { duration: "4m", target: 50 }, // hold (5-minute test, ramp included)
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800"], // the target after optimization (baseline is about 1800 ms)
  },
};

export default function () {
  const userId = `u-${Math.floor(Math.random() * 3000)}`;
  const res = http.get(`${__ENV.BASE_URL || "http://localhost:3000"}/api/orders?userId=${userId}`);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1);
}
