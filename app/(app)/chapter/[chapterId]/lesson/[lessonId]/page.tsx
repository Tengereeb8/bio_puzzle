import type { Metadata } from "next";
import { chapters } from "@/app/components/data/appData";
import { teethLessons } from "@/app/components/data/ToothLessons";
import { notFound } from "next/navigation";
import LessonView from "./lesson-view";

type Props = {
  params: Promise<{ chapterId: string; lessonId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const decodedLesson =
    typeof lessonId === "string" ? decodeURIComponent(lessonId) : lessonId;
  const lesson = teethLessons.find((l) => l.id === decodedLesson);
  return { title: lesson ? `${lesson.titleMn} · Quiz` : "Хичээл" };
}

export default async function LessonPage({ params }: Props) {
  const { chapterId, lessonId } = await params;
  const cid =
    typeof chapterId === "string" ? decodeURIComponent(chapterId) : chapterId;
  const lid =
    typeof lessonId === "string" ? decodeURIComponent(lessonId) : lessonId;

  if (!chapters.some((c) => c.id === cid)) notFound();
  if (!teethLessons.some((l) => l.id === lid)) notFound();

  return <LessonView chapterId={cid} lessonId={lid} />;
}
