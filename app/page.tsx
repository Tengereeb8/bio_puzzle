"use client";

import RoadmapScreen from "@/app/components/RoadmapScreen";
import { chapters } from "@/app/components/data/appData";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useRouter } from "next/navigation";
import { AppShell } from "@/app/(app)/app-shell";
import FullBodySkeletonGame from "./FullBodySkeleton";

function HomeRoadmap() {
  const router = useRouter();
  const { userPoints } = useProgress();

  return (
    // <RoadmapScreen
    //   chapters={chapters}
    //   totalPoints={userPoints}
    //   onChapterClick={(id) => router.push(`/chapter/${encodeURIComponent(id)}`)}
    // />
    <FullBodySkeletonGame
      onComplete={function (completionTime: number): void {
        console.log(`Full Body Skeleton Game Completed on Homepage in ${completionTime} seconds!`);
        alert(`Homepage Game Completed! Time: ${completionTime} seconds`);
      }}
      onBack={function (): void {
        console.log("Navigating back from Full Body Skeleton Game on Homepage.");
        alert("Going back from Homepage Game!");
      }}
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
