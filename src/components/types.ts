import type { CSSProperties } from "react";

export type DisplayKey =
  "blank" | "flag" | "explosion" | "value" | "bomb" | "question" | "wrong";

export interface DisplayEntry {
  text: string | number;
  style: CSSProperties;
}

export interface SquareData {
  id: number;
  displayIndex: DisplayKey;
  bomb: boolean;
  clicked: boolean;
  flag: number;
  display: Record<DisplayKey, DisplayEntry>;
  Ranges?: { iRange: number[]; jRange: number[] };
}
