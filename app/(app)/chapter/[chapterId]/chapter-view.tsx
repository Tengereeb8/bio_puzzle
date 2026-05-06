"use client";

import LessonRoadmapScreen from "@/app/components/LessonRoadmapScreen";
import { chapters } from "@/app/components/data/appData";
import { teethLessons } from "@/app/components/data/ToothLessons";
import { useRouter } from "next/navigation";

export default function ChapterView({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;

  const roadmapLessons = teethLessons.map((l) => ({
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
      chapterIconType={chapter.iconType}
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
