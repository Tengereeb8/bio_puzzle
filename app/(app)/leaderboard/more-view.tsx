"use client";

import {
  BASE_LEADERBOARD,
  BASE_USER_PROFILE,
} from "@/app/components/data/appData";
import { useProgress } from "@/app/components/context/ProgressContext";
import LeaderboardScreen from "@/app/components/Leaderboard";

export default function MoreView() {
  const { userPoints } = useProgress();

  const leaderboardData = BASE_LEADERBOARD.map((entry: any) => ({
    ...entry,

    time: entry.time ?? (entry.isCurrentUser ? 0 : undefined),
    date: (entry as any).date ?? new Date().toISOString(),
    userId: (entry as any).userId ?? (entry as any).id ?? entry.name,
    userName: entry.name,
    userNameMn: entry.nameMn,
  }));

  return (
    <LeaderboardScreen
      gameTimes={leaderboardData}
      currentUserId="some-user-id"
    />
  );
}
