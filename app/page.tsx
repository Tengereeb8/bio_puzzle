"use client";
import App from "next/app";
import FullBodySkeletonGame from "./FullBodySkeleton";

export default function Home() {
  const handleGameComplete = (completionTime: number) => {
    console.log(
      `Full Body Skeleton Game Completed in ${completionTime} seconds!`,
    );
  };

  const handleGameBack = () => {
    console.log("Navigating back from Full Body Skeleton Game.");
  };

  return (
    <div className="bg-white text-black h-fit flex justify-center items-center">
      {/* <FullBodySkeletonGame
        onComplete={handleGameComplete}
        onBack={handleGameBack}
      /> */}
      <App />
    </div>
  );
}
