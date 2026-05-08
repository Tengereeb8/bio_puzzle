"use client";

import LeaderboardScreen from "@/app/components/Leaderboard";
import { useCurriculum } from "@/app/components/context/CurriculumContext";
import { BASE_LEADERBOARD } from "@/app/components/data/appData";

type LbEntry = {
  rank: number;
  name: string;
  nameMn: string;
  points: number;
  isCurrentUser?: boolean;
  [key: string]: unknown;
};

function normalizeLb(entries: unknown): LbEntry[] {
  if (!Array.isArray(entries) || entries.length === 0) {
    return BASE_LEADERBOARD as LbEntry[];
  }
  return entries as LbEntry[];
}

export default function MoreView() {
  const { leaderboard } = useCurriculum();
  const source = normalizeLb(leaderboard);

  const leaderboardData = source.map((entry) => ({
    ...entry,
    time:
      (entry as { time?: number }).time ??
      Math.max(30, 420 - (entry.points ?? 0) / 5),
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
