import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCurriculumBootstrap } from "@/lib/curriculumApi";
import ChapterView from "./chapter-view";

type Props = { params: Promise<{ chapterId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterId } = await params;
  const decoded =
    typeof chapterId === "string" ? decodeURIComponent(chapterId) : chapterId;
  try {
    const data = await fetchCurriculumBootstrap();
    const chapter = data.chapters.find((c) => c.id === decoded);
    return { title: chapter ? chapter.titleMn : "Бүлэг" };
  } catch {
    return { title: "Бүлэг · Bio Puzzle" };
  }
}

export async function generateStaticParams() {
  try {
    const data = await fetchCurriculumBootstrap();
    return data.chapters.map((c) => ({ chapterId: c.id }));
  } catch {
    return [];
  }
}

export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params;
  const decoded =
    typeof chapterId === "string" ? decodeURIComponent(chapterId) : chapterId;

  let data;
  try {
    data = await fetchCurriculumBootstrap();
  } catch {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-sm text-red-700">
        <p className="font-semibold mb-2">Backend-тай холбогдож чадсангүй</p>
        <p>
          <code className="text-xs">NEXT_PUBLIC_API_URL</code> болон Bio-Puzzle-Backend серверийг
          шалгана уу.
        </p>
      </div>
    );
  }

  const chapter = data.chapters.find((c) => c.id === decoded);
  if (!chapter) notFound();

  return <ChapterView chapterId={decoded} />;
}
