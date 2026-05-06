"use client";
import App from "./components/App";
import FullBodySkeletonGame from "./FullBodySkeleton";

export default function Home() {
  const handleGameComplete = (completionTime: number) => {
    console.log(
      `Full Body Skeleton Game Completed in ${completionTime} seconds!`,
    );
    // In a real application, you might want to:
    // - Save the score
    // - Navigate to a results page
    // - Show a modal with results
  };

  const handleGameBack = () => {
    console.log("Navigating back from Full Body Skeleton Game.");
    // In a real application, you might want to:
    // - Navigate to a previous page using useRouter().back()
    // - Change a state variable to render a different component
  };

  return (
    <div className="bg-white text-black h-fit flex justify-center items-center">
      <FullBodySkeletonGame
        onComplete={handleGameComplete}
        onBack={handleGameBack}
      />
    </div>
  );
}
