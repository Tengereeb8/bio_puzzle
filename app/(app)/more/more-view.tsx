"use client";

import ImprovedMoreMenu from "@/app/components/ImprovedMoreMenu";
import { BASE_LEADERBOARD, BASE_USER_PROFILE } from "@/app/components/data/appData";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useRouter } from "next/navigation";

export default function MoreView() {
  const router = useRouter();
  const { userPoints } = useProgress();

  const userProfile = {
    ...BASE_USER_PROFILE,
    totalPoints: userPoints,
  };

  const leaderboard = BASE_LEADERBOARD.map((entry) =>
    entry.isCurrentUser ? { ...entry, points: userPoints } : entry,
  );

  return (
    <ImprovedMoreMenu
      userProfile={userProfile}
      leaderboard={leaderboard}
      onClose={() => router.push("/")}
    />
  );
}
