"use client";

import FullBodySkeletonGame from "@/app/FullBodySkeleton";

export default function GameView() {
  const handleGameComplete = (time: number) => {
    console.log(`Full Body Skeleton Game Completed in ${time} seconds!`);
    // Here you would typically navigate to a results screen or show a modal
    alert(`Game Completed! Time: ${time} seconds`);
  };

  const handleGameBack = () => {
    console.log("Navigating back from Full Body Skeleton Game.");
    // Here you would typically navigate to a previous page or menu
    alert("Going back!");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 overflow-auto pb-24">
      <div className="flex flex-col items-center px-4 pt-6">
        <div className="w-full max-w-lg">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-5">
            💀 Full Body Skeleton Game
          </h2>
          <FullBodySkeletonGame
            onComplete={handleGameComplete}
            onBack={handleGameBack}
          />
        </div>
      </div>
    </div>
  );
}