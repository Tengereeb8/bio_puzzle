"use client";

import RoadmapScreen from "@/app/components/RoadmapScreen";
import { chapters } from "@/app/components/data/appData";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useRouter } from "next/navigation";
import { AppShell } from "@/app/(app)/app-shell";

function HomeRoadmap() {
  const router = useRouter();
  const { userPoints } = useProgress();

  return (
    <RoadmapScreen
      chapters={chapters}
      totalPoints={userPoints}
      onChapterClick={(id) =>
        router.push(`/chapter/${encodeURIComponent(id)}`)
      }
    />
  );
}

/** Нүүр (`/`). `(app)` layout энд үл хамаарах тул AppShell-ийг энд оруулна. */
export default function HomePage() {
  return (
    <AppShell>
      <HomeRoadmap />
    </AppShell>
  );
}
