import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// SQLite file at ./data/results.db (git-ignored). Built into Node 24, no extra dependency.
let db: DatabaseSync | undefined;

export function getDb(): DatabaseSync {
  if (!db) {
    const dir = path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });
    db = new DatabaseSync(path.join(dir, "results.db"));
    db.exec(`CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      day INTEGER NOT NULL,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percent INTEGER NOT NULL,
      answers TEXT NOT NULL
    )`);
  }
  return db;
}

export type ResultRow = {
  id: number;
  created_at: string;
  day: number;
  name: string;
  score: number;
  total: number;
  percent: number;
};
