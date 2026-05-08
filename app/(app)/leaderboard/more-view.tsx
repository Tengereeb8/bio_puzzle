"use client";

import { BASE_LEADERBOARD } from "@/app/components/data/appData";
import LeaderboardScreen from "@/app/components/Leaderboard";

export default function MoreView() {
  const leaderboardData = BASE_LEADERBOARD.map((entry) => ({
    ...entry,
    time:
      (entry as { time?: number }).time ??
      Math.max(30, 420 - entry.points / 5),
    date:
      (entry as { date?: string }).date ?? new Date().toISOString(),
    userId: entry.isCurrentUser
      ? "current-user"
      : `player-${entry.rank}`,
    userName: entry.name,
    userNameMn: entry.nameMn,
  }));

  return (
    <LeaderboardScreen
      gameTimes={leaderboardData}
      currentUserId="current-user"
    />
  );
}
