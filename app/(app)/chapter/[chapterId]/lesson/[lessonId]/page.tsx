import type { Metadata } from "next";
import { fetchCurriculumBootstrap } from "@/lib/curriculumApi";
import { notFound } from "next/navigation";
import LessonView from "./lesson-view";

type Props = {
  params: Promise<{ chapterId: string; lessonId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const decodedLesson =
    typeof lessonId === "string" ? decodeURIComponent(lessonId) : lessonId;
  try {
    const data = await fetchCurriculumBootstrap();
    for (const list of Object.values(data.lessonsByChapter)) {
      const lesson = list.find((l) => l.id === decodedLesson);
      if (lesson) return { title: `${lesson.titleMn} · Quiz` };
    }
    return { title: "Хичээл" };
  } catch {
    return { title: "Хичээл · Bio Puzzle" };
  }
}

export default async function LessonPage({ params }: Props) {
  const { chapterId, lessonId } = await params;
  const cid =
    typeof chapterId === "string" ? decodeURIComponent(chapterId) : chapterId;
  const lid =
    typeof lessonId === "string" ? decodeURIComponent(lessonId) : lessonId;

  let data;
  try {
    data = await fetchCurriculumBootstrap();
  } catch {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-sm text-red-700">
        <p className="font-semibold mb-2">Backend-тай холбогдож чадсангүй</p>
        <p>
          <code className="text-xs">NEXT_PUBLIC_API_URL</code> ба серверээ шалгана уу.
        </p>
      </div>
    );
  }

  if (!data.chapters.some((c) => c.id === cid)) notFound();

  const lessons = data.lessonsByChapter[cid] ?? [];
  if (!lessons.some((l) => l.id === lid)) notFound();

  return <LessonView chapterId={cid} lessonId={lid} />;
}
