"use client";

import LessonRoadmapScreen from "@/app/components/LessonRoadmapScreen";
import { chapters } from "@/app/components/data/appData";
import { teethLessons } from "@/app/components/data/ToothLessons";
import { useRouter } from "next/navigation";

export default function ChapterView({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;

  return (
    <LessonRoadmapScreen
      chapterTitle={chapter.title}
      chapterTitleMn={chapter.titleMn}
      chapterColor={chapter.color}
      chapterIconType={chapter.iconType}
      lessons={teethLessons}
      onLessonClick={(lessonId) =>
        router.push(
          `/chapter/${encodeURIComponent(chapterId)}/lesson/${encodeURIComponent(lessonId)}`,
        )
      }
      onBack={() => router.push("/")}
    />
  );
}
