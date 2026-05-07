"use client";

import type { ComponentProps } from "react";
import LessonRoadmapScreen from "@/app/components/LessonRoadmapScreen";
import { useCurriculum } from "@/app/components/context/CurriculumContext";
import { useRouter } from "next/navigation";

type ChapterIconType = ComponentProps<
  typeof LessonRoadmapScreen
>["chapterIconType"];

export default function ChapterView({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const { chapters, lessonsByChapter } = useCurriculum();
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;

  const chapterLessons = lessonsByChapter[chapterId] ?? [];

  const roadmapLessons = chapterLessons.map((l) => ({
    id: l.id,
    type: l.type,
    title: l.title,
    titleMn: l.titleMn,
    isUnlocked: l.isUnlocked,
    isCompleted: l.isCompleted,
    stars: 0,
    maxStars: 3,
  }));

  return (
    <LessonRoadmapScreen
      chapterTitle={chapter.title}
      chapterTitleMn={chapter.titleMn}
      chapterColor={chapter.color}
      chapterIconType={chapter.iconType as ChapterIconType}
      lessons={roadmapLessons}
      onLessonClick={(lessonId) =>
        router.push(
          `/chapter/${encodeURIComponent(chapterId)}/lesson/${encodeURIComponent(lessonId)}`,
        )
      }
      onBack={() => router.push("/")}
    />
  );
}
