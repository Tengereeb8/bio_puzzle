"use client";

import QuizScreen from "@/app/components/teeth-game/QuizScreen";
import { teethLessons } from "@/app/components/data/ToothLessons";
import { useProgress } from "@/app/components/context/ProgressContext";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LessonView({
  chapterId,
  lessonId,
}: {
  chapterId: string;
  lessonId: string;
}) {
  const router = useRouter();
  const { addPoints } = useProgress();

  const lesson = teethLessons.find((l) => l.id === lessonId);
  if (!lesson) return null;

  const allQuestions = teethLessons.map((l) => ({
    visual: "🦷" as const,
    text: l.question,
    options: l.options,
    answer: l.correctAnswer,
    fact: l.explanation,
  }));

  function handleQuizComplete(score: number) {
    addPoints(score * 10);
    router.push(`/chapter/${encodeURIComponent(chapterId)}`);
  }

  const backHref = `/chapter/${encodeURIComponent(chapterId)}`;

  return (
    <div className="min-h-full p-4 pb-28 bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          aria-label="Буцах"
        >
          <ArrowLeft className="size-4" />
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
      />
    </div>
  );
}
