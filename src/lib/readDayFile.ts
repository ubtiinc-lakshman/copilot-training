import fs from "node:fs";
import path from "node:path";

// Read a file from src/days/day-NN/ at build/render time (server components only).
export function readDayFile(day: number, file: string): string {
  const dir = `day-${String(day).padStart(2, "0")}`;
  return fs.readFileSync(path.join(process.cwd(), "src", "days", dir, file), "utf8");
}
