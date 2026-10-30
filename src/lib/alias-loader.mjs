// Test helper: lets node load app files that import "@/lib/x" (the Next.js path alias) by mapping "@/" to src/ and adding the .ts extension.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = path.join(src, specifier.slice(2));
    const file = [".ts", ".tsx", "/index.ts"].map((e) => base + e).find(existsSync);
    if (file) return nextResolve(pathToFileURL(file).href, context);
  }
  return nextResolve(specifier, context);
}
