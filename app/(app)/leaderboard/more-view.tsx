"use client";

import {
  BASE_LEADERBOARD,
  BASE_USER_PROFILE,
} from "@/app/components/data/appData";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useRouter } from "next/navigation";
import LeaderboardTab from "@/app/components/Leaderboard";

export default function MoreView() {
  const { userPoints } = useProgress();

  const leaderboard = BASE_LEADERBOARD.map((entry) =>
    entry.isCurrentUser ? { ...entry, points: userPoints } : entry,
  );

  return <LeaderboardTab leaderboard={leaderboard} />;
}
