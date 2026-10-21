import type { ComponentType } from "react";
import Day01 from "./day-01/Day01";
import Day02 from "./day-02/Day02";
import Day03 from "./day-03/Day03";
import Day04 from "./day-04/Day04";
import Day05 from "./day-05/Day05";
import Day06 from "./day-06/Day06";
import Day07 from "./day-07/Day07";
import Day08 from "./day-08/Day08";
import Day09 from "./day-09/Day09";
import Day10 from "./day-10/Day10";

// Register each day's showcase here as it is built. Days without an entry show a placeholder.
export const SHOWCASES: Record<number, ComponentType> = {
  1: Day01,
  2: Day02,
  3: Day03,
  4: Day04,
  5: Day05,
  6: Day06,
  7: Day07,
  8: Day08,
  9: Day09,
  10: Day10,
};
