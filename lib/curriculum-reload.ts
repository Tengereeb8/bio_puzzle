/** Хичээл/тоглоомын явц шинэчлэгдэхэд roadmap bootstrap дахин татагдана. */
export const CURRICULUM_RELOAD_EVENT = "bio-curriculum-reload";

export function requestCurriculumReload(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CURRICULUM_RELOAD_EVENT));
}
