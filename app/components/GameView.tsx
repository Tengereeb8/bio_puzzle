"use client";

import FullBodySkeletonGame from "@/app/FullBodySkeleton";
// import ToothGame from "@/app/components/teeth-game/ToothGame";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useAuthContext } from "@/lib/auth-context";
import { postMiniGame } from "@/lib/progress-api";
import { requestCurriculumReload } from "@/lib/curriculum-reload";
import { useRouter } from "next/navigation";

export default function GameView() {
  const router = useRouter();
  const { token, refreshUser } = useAuthContext();
  const { setUserPoints } = useProgress();

  const syncAfterGame = async (
    json: { user?: { totalPoints: number } } | null,
  ) => {
    if (json?.user?.totalPoints != null) {
      setUserPoints(json.user.totalPoints);
    }
    await refreshUser();
    requestCurriculumReload();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 overflow-auto pb-24">
      <div className="flex flex-col items-center px-4 pt-6 gap-12 pb-8">
        <div className="w-full max-w-lg">
          <FullBodySkeletonGame
            onComplete={async (completionTime: number) => {
              if (token) {
                const json = await postMiniGame(token, {
                  gameKey: "skeleton",
                  timeSeconds: completionTime,
                });
                await syncAfterGame(json);
              }
              router.push("/game");
            }}
            onBack={() => router.push("/")}
          />
        </div>
      </div>
    </div>
  );
}
