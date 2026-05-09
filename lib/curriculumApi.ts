/**
 * Curriculum өгөгдлийг backend API-аас авна (`API_URL` / NEXT_PUBLIC_API_URL).
 */

import { API_URL } from "./api-url";

export type CurriculumChapter = {
  id: string;
  title: string;
  titleMn: string;
  iconType: string;
  color: string;
  sortOrder: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
};

export type CurriculumLesson = {
  id: string;
  type: string;
  title: string;
  titleMn: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  audioText: string;
  questions: unknown[];
};

export type CurriculumBootstrap = {
  chapters: CurriculumChapter[];
  lessonsByChapter: Record<string, CurriculumLesson[]>;
  teethGameParts: unknown;
};

/** Next.js сервер компонент, metadata зэргээс дуудах (JWT байхгүй — ерөнхий агуулга). */
export async function fetchCurriculumBootstrap(): Promise<CurriculumBootstrap> {
  const res = await fetch(`${API_URL}/curriculum/bootstrap`, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Curriculum API алдаа: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<CurriculumBootstrap>;
}
