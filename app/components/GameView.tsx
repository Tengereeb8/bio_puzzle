"use client";

import FullBodySkeletonGame from "@/app/FullBodySkeleton";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useRouter } from "next/navigation";
import ToothGame from "./teeth-game/ToothGame";

function SkeletonGame() {
  const router = useRouter();
  const { userPoints } = useProgress();

  return (
    <FullBodySkeletonGame
      onComplete={function (completionTime: number): void {
        throw new Error("Function not implemented.");
      }}
      onBack={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
export default function GameView() {
  return (
    // <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 overflow-auto pb-24">
    //   <div className="flex flex-col items-center px-4 pt-6">
    //     <div className="w-full max-w-lg">
    //       <h2 className="text-center text-2xl font-bold text-gray-800 mb-5">
    //         🦷 Teeth Game
    //       </h2>
    //       <ToothGame />
    //     </div>
    //   </div>
    // </div>
    <div>
      <SkeletonGame />
    </div>
  );
}
