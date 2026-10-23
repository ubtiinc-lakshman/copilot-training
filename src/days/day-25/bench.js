// Day 25: repeatable benchmark. Same profile every run: 200 calls, rotating through 50 users.
// Usage: node src/days/day-25/bench.js    Compare p95 before and after your optimization.
const { getOrdersForUser } = require("./ordersEndpoint");

const CALLS = 200;
const times = [];
for (let i = 0; i < CALLS; i++) {
  const userId = `u-${(i * 37) % 3000}`;
  const start = process.hrtime.bigint();
  getOrdersForUser(userId);
  times.push(Number(process.hrtime.bigint() - start) / 1e6);
}
times.sort((a, b) => a - b);
const pct = (p) => times[Math.min(times.length - 1, Math.ceil((p / 100) * times.length) - 1)];
console.log(`calls=${CALLS} p50=${pct(50).toFixed(2)}ms p95=${pct(95).toFixed(2)}ms max=${times.at(-1).toFixed(2)}ms`);
