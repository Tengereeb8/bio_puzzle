"use client";

import RoadmapScreen from "@/app/components/RoadmapScreen";
import { chapters } from "@/app/components/data/appData";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useRouter } from "next/navigation";

export default function RoadmapPage() {
  const router = useRouter();
  const { userPoints } = useProgress();

  return (
    <RoadmapScreen
      chapters={chapters}
      totalPoints={userPoints}
      onChapterClick={(id) => router.push(`/chapter/${encodeURIComponent(id)}`)}
    />
  );
}
