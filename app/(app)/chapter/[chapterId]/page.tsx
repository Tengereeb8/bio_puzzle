import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { chapters } from "@/app/components/data/appData";
import ChapterView from "./chapter-view";

type Props = { params: Promise<{ chapterId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId } = await params;
  const chapter = chapters.find((c) => c.id === chapterId);
  return { title: chapter ? chapter.titleMn : "Бүлэг" };
}

export async function generateStaticParams() {
  return chapters.map((c) => ({ chapterId: c.id }));
}

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params;
  const decoded =
    typeof chapterId === "string" ? decodeURIComponent(chapterId) : chapterId;

  const chapter = chapters.find((c) => c.id === decoded);
  if (!chapter) notFound();

  return <ChapterView chapterId={decoded} />;
}
