import { motion } from "framer-motion";
import { Trophy, Medal, Clock, Crown, Zap, User } from "lucide-react";
import CharacterAvatar from "./CharacterAvatar";

export interface CharacterCustomization {
  gender: "boy" | "girl";
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  shirtType: "classic" | "hoodie";
  accessory: "none" | "glasses" | "hat" | "bow" | "headphones" | "scarf";
}

export interface LeaderboardRow {
  userId: string;
  userName: string;
  userNameMn: string;
  /** Нийт оноо (database User.totalPoints) */
  points: number;
  /** Ясны тоглоомын хамгийн хурдан секунд — байхгүй бол null */
  bestSkeletonSeconds: number | null;
  date: string;
  character?: CharacterCustomization;
}

interface LeaderboardScreenProps {
  gameTimes: LeaderboardRow[];
  currentUserId: string;
}

export default function LeaderboardScreen({
  gameTimes,
  currentUserId,
}: LeaderboardScreenProps) {
  const byUser = new Map<string, LeaderboardRow>();
  gameTimes.forEach((row) => {
    const existing = byUser.get(row.userId);
    if (!existing || row.points > existing.points) {
      byUser.set(row.userId, row);
    } else if (existing.points === row.points) {
      const a = row.bestSkeletonSeconds;
      const b = existing.bestSkeletonSeconds;
      if (a != null && (b == null || a < b)) byUser.set(row.userId, row);
    }
  });

  const leaderboardData = Array.from(byUser.values())
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const ta = a.bestSkeletonSeconds;
      const tb = b.bestSkeletonSeconds;
      if (ta == null && tb == null) return 0;
      if (ta == null) return 1;
      if (tb == null) return -1;
      return ta - tb;
    })
    .map((row, index) => ({
      rank: index + 1,
      ...row,
      isCurrentUser: row.userId === currentUserId,
    }));

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const PointsBlock = ({
    points,
    skeletonSec,
    emphasize,
  }: {
    points: number;
    skeletonSec: number | null;
    emphasize?: boolean;
  }) => (
    <div className="space-y-1">
      <div
        className={`flex items-center justify-center gap-1 ${emphasize ? "text-base" : "text-sm"}`}
      >
        <Zap size={emphasize ? 18 : 14} className="text-amber-500 shrink-0" />
        <span
          className={`font-bold tabular-nums ${emphasize ? "text-yellow-700 text-lg" : "text-gray-800"}`}
        >
          {points.toLocaleString("mn-MN")}
        </span>
        <span className="text-gray-500 font-medium text-xs">оноо</span>
      </div>
      <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
        <Clock size={12} className="shrink-0" />
        <span>Яс: {skeletonSec != null ? formatTime(skeletonSec) : "—"}</span>
      </div>
    </div>
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className="relative">
          <div className="w-14 h-14 bg-linear-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-200">
            <Crown size={28} color="white" />
          </div>
        </div>
      );
    if (rank === 2)
      return (
        <div className="w-12 h-12 bg-linear-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-200">
          <Medal size={24} color="white" />
        </div>
      );
    if (rank === 3)
      return (
        <div className="w-12 h-12 bg-linear-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg border-4 border-orange-200">
          <Medal size={24} color="white" />
        </div>
      );
    return (
      <div className="w-10 h-10 bg-linear-to-br from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md text-white font-bold">
        {rank}
      </div>
    );
  };

  return (
    <div className="font-game-black min-h-screen bg-linear-to-b from-yellow-50 via-orange-50 to-red-50 pb-24 ">
      <div className="bg-linear-to-br from-yellow-500 via-orange-500 to-red-500 text-white px-6 pt-8 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex justify-center mb-4">
            <div>
              <Trophy size={56} color="white" />
            </div>
          </div>
          <h1 className="text-center font-bold mb-2 text-[32px]">
            Тэргүүлэгчид
          </h1>
          <p className="text-center opacity-90 text-[15px]">
            Нийт оноогоор эрэмбэлэгдсэн — ясны тоглоомын хурд нэмэлтээр
          </p>
        </motion.div>
      </div>

      {leaderboardData.length >= 3 && (
        <div className="px-6 mb-6 mt-10">
          <div className="bg-amber-50 rounded-3xl pt-10 px-6 pb-6 shadow-2xl border-2 border-yellow-200">
            <div className="flex items-end justify-center gap-3">
              <div className="flex-1 flex flex-col items-center">
                <div className="flex w-20 h-20 bg-amber-400 rounded-2xl p-2 shadow-lg mb-3 border-4 border-yellow-400 overflow-hidden">
                  {leaderboardData[1].character ? (
                    <CharacterAvatar
                      {...leaderboardData[1].character}
                      size={64}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-xl" />
                  )}
                </div>
                <div className="w-10 h-10 bg-linear-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-md mb-2 -mt-5 border-4 border-white">
                  <span className="font-bold text-white text-lg">2</span>
                </div>
                <div className="text-center mb-3 min-h-18 flex flex-col justify-center">
                  <div className="font-bold text-gray-900 text-sm">
                    {leaderboardData[1].userNameMn}
                  </div>
                  <PointsBlock
                    points={leaderboardData[1].points}
                    skeletonSec={leaderboardData[1].bestSkeletonSeconds}
                  />
                </div>
                <div className="w-full h-20 bg-linear-to-t from-gray-300 to-gray-200 rounded-t-2xl shadow-inner" />
              </div>

              <div className="flex-1 flex flex-col items-center -mt-6">
                <div className="flex w-24 h-24 bg-amber-400 rounded-2xl p-2 shadow-2xl mb-3 border-4 border-yellow-400 overflow-hidden">
                  {leaderboardData[0].character ? (
                    <CharacterAvatar
                      {...leaderboardData[0].character}
                      size={80}
                    />
                  ) : (
                    <div className="w-full h-full bg-yellow-200 rounded-xl" />
                  )}
                </div>
                <div className="w-12 h-12 bg-linear-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl mb-2 -mt-6 border-4 border-white">
                  <Crown size={24} color="white" />
                </div>
                <div className="text-center mb-3 min-h-20 flex flex-col justify-center">
                  <div className="font-bold text-gray-900 text-base">
                    {leaderboardData[0].userNameMn}
                  </div>
                  <PointsBlock
                    points={leaderboardData[0].points}
                    skeletonSec={leaderboardData[0].bestSkeletonSeconds}
                    emphasize
                  />
                </div>
                <div className="w-full h-28 bg-linear-to-t from-yellow-400 via-yellow-300 to-yellow-200 rounded-t-2xl shadow-inner relative" />
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="flex w-20 h-20 bg-amber-400 rounded-2xl p-2 shadow-lg mb-3 border-4 border-yellow-400 overflow-hidden">
                  {leaderboardData[2].character ? (
                    <CharacterAvatar
                      {...leaderboardData[2].character}
                      size={64}
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-200 rounded-xl justify-center" />
                  )}
                </div>
                <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-md mb-2 -mt-5 border-4 border-white">
                  <span className="font-bold text-white text-lg">3</span>
                </div>
                <div className="text-center mb-3 min-h-18 flex flex-col justify-center">
                  <div className="font-bold text-gray-900 text-sm">
                    {leaderboardData[2].userNameMn}
                  </div>
                  <PointsBlock
                    points={leaderboardData[2].points}
                    skeletonSec={leaderboardData[2].bestSkeletonSeconds}
                  />
                </div>
                <div className="w-full h-16 bg-linear-to-t from-orange-400 to-orange-300 rounded-t-2xl shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} color="#F59E0B" fill="#F59E0B" />
          <h3 className="font-bold text-gray-900 text-[18px]">Бүх тоглогчид</h3>
        </div>
        <div className="space-y-3">
          {leaderboardData.map((player) => (
            <div
              key={player.userId}
              className={`rounded-2xl p-4 shadow-lg ${player.isCurrentUser ? "bg-linear-to-r from-amber-200 to-amber-100 border-4 border-amber-500" : "bg-white border-2 border-gray-100"}`}
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">{getRankBadge(player.rank)}</div>
                <div className="flex w-12 h-12 bg-amber-300 rounded-xl p-1.5 overflow-hidden justify-center items-center">
                  {player.character ? (
                    <CharacterAvatar {...player.character} size={40} />
                  ) : (
                    <div className=" flex justify-center  items-center w-10 bg-amber-300 rounded-lg ">
                      <User className="text-amber-800" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-bold ${player.isCurrentUser ? "text-amber-700" : "text-gray-900"} text-[16px]`}
                    >
                      {player.userNameMn}
                    </span>
                    {player.isCurrentUser && (
                      <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        Та
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5 truncate">
                    {player.userName}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Zap
                      size={18}
                      color={player.isCurrentUser ? "#F59E0B" : "#F59E0B"}
                    />
                    <span
                      className={`font-bold tabular-nums ${player.isCurrentUser ? "text-amber-600" : "text-gray-900"} text-[18px]`}
                    >
                      {player.points.toLocaleString("mn-MN")}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs flex items-center justify-end gap-1">
                    <Clock size={12} />
                    <span>
                      Яс:{" "}
                      {player.bestSkeletonSeconds != null
                        ? formatTime(player.bestSkeletonSeconds)
                        : "—"}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {new Date(player.date).toLocaleDateString("mn-MN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
