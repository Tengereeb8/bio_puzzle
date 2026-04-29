export type GameMode = "quiz" | "label";
export type Screen = "home" | "quiz" | "label" | "result";

export interface Question {
  visual: string;
  text: string;
  options: string[];
  answer: number;
  fact: string;
}

export interface LabelPart {
  id: number;
  name: string;
  hint: string;
}

export type DropState = "empty" | "filled" | "correct" | "wrong";

export interface DropZone {
  placed: string | null;
  state: DropState;
}
