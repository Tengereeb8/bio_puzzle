"use client";

import { BASE_LEADERBOARD } from "@/app/components/data/appData";
import LeaderboardScreen from "@/app/components/Leaderboard";

export default function MoreView() {
  const gameTimes = BASE_LEADERBOARD.map((entry) => ({
    userId: entry.isCurrentUser ? "current-user" : `player-${entry.rank}`,
    userName: entry.name,
    userNameMn: entry.nameMn,
    time: Math.max(30, 420 - entry.points / 5),
    date: new Date().toISOString(),
  }));

  return (
    <LeaderboardScreen
      gameTimes={gameTimes}
      currentUserId="current-user"
    />
  );
}
