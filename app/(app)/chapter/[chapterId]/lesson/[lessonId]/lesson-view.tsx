"use client";

import QuizScreen from "@/app/components/QuizScreen";
import { useCurriculum } from "@/app/components/context/CurriculumContext";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useAuthContext } from "@/lib/auth-context";
import { postChapterQuiz } from "@/lib/progress-api";
import { requestCurriculumReload } from "@/lib/curriculum-reload";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const CHAPTER_VISUAL: Record<string, string> = {
  teeth: "🦷",
  bones: "🦴",
  heart: "❤️",
  muscles: "💪",
  digestion: "🍽️",
  brain: "🧠",
  blood: "🩸",
};

export default function LessonView({
  chapterId,
  lessonId,
}: {
  chapterId: string;
  lessonId: string;
}) {
  const router = useRouter();
  const { setUserPoints } = useProgress();
  const { token, refreshUser } = useAuthContext();
  const { lessonsByChapter } = useCurriculum();
  const chapterLessons = lessonsByChapter[chapterId] ?? [];

  const lesson = chapterLessons.find((l) => l.id === lessonId);
  if (!lesson) return null;

  const visual = CHAPTER_VISUAL[chapterId] ?? "🧬";

  const allQuestions = chapterLessons.map((l) => ({
    visual,
    text: l.question,
    options: l.options,
    answer: l.correctAnswer,
    fact: l.explanation,
  }));

  async function handleQuizComplete(score: number) {
    const totalCount = allQuestions.length;
    if (token) {
      const data = await postChapterQuiz(token, {
        chapterId,
        correctCount: score,
        totalCount,
      });
      if (data?.user?.totalPoints != null) {
        setUserPoints(data.user.totalPoints);
      }
      await refreshUser();
      requestCurriculumReload();
    }
    router.push(`/chapter/${encodeURIComponent(chapterId)}`);
  }

  const backHref = `/chapter/${encodeURIComponent(chapterId)}`;

  return (
    <div className="font-game-black min-h-full p-4 pb-28 bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className=" flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          aria-label="Буцах"
        >
          <ArrowLeft className="size-4 relative top-0.5" />
          Бүлэг рүү буцах
        </button>
      </div>
      <h1 className="text-center font-bold text-lg mb-4 text-gray-900">
        {lesson.titleMn}
      </h1>
      <QuizScreen
        key={lesson.id}
        questions={allQuestions}
        onComplete={handleQuizComplete}
        onBack={() => router.push(backHref)}
      />
    </div>
  );
}
