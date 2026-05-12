"use client";

import { useEffect, useState } from "react";
import LeaderboardScreen, {
  type LeaderboardRow,
  type CharacterCustomization,
} from "@/app/components/Leaderboard";
import { useAuthContext } from "@/lib/auth-context";
import { fetchGlobalLeaderboard } from "@/lib/progress-api";

type GlobalLbResponse = {
  entries: Array<{
    rank: number;
    userId: string;
    name: string;
    nameMn: string;
    points: number;
    level: number;
    streak: number;
    isCurrentUser: boolean;
    bestSkeletonSeconds?: number | null;
    date?: string;
    character?: unknown;
  }>;
  totalUsers: number;
};

export default function MoreView() {
  const { token, user, isHydrated } = useAuthContext();
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) return;
    let cancelled = false;
    void (async () => {
      try {
        const json = (await fetchGlobalLeaderboard(token)) as GlobalLbResponse;
        if (cancelled) return;
        const mapped: LeaderboardRow[] = (json.entries ?? []).map((e) => ({
          userId: e.userId,
          userName: e.name,
          userNameMn: e.nameMn,
          points: e.points,
          bestSkeletonSeconds:
            e.bestSkeletonSeconds !== undefined && e.bestSkeletonSeconds !== null
              ? e.bestSkeletonSeconds
              : null,
          date: e.date ?? new Date().toISOString(),
          character:
            e.character && typeof e.character === "object"
              ? (e.character as CharacterCustomization)
              : undefined,
        }));
        setRows(mapped);
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setRows(null);
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isHydrated, token]);

  if (!isHydrated || rows === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500 px-4">
        Жагсаалтыг ачаалж байна…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-red-700">
        <p className="font-semibold mb-2">Жагсаалт ачаалагдаагүй байна</p>
        <p>{error}</p>
      </div>
    );
  }

  const currentUserId = user?.id ?? "";

  return (
    <LeaderboardScreen
      gameTimes={rows}
      currentUserId={currentUserId || "anonymous"}
    />
  );
}
