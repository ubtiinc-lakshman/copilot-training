import type { ComponentType } from "react";
import Day01 from "./day-01/Day01";

// Register each day's showcase here as it is built. Days without an entry show a placeholder.
export const SHOWCASES: Record<number, ComponentType> = {
  1: Day01,
};
