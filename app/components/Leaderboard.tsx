import { motion } from "framer-motion"; // Use framer-motion for stability
import { Trophy, Medal, Clock, Crown, Zap } from "lucide-react";
import { useState } from "react";
import CharacterAvatar from "./CharacterAvatar";

// 1. FIXED: Character interface must match your Avatar component's props exactly
export interface CharacterCustomization {
  gender: "boy" | "girl";
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  shirtType: "classic" | "hoodie";
  accessory: "none" | "glasses" | "hat" | "bow" | "headphones" | "scarf";
}

interface GameTime {
  userId: string;
  userName: string;
  userNameMn: string;
  time: number;
  date: string;
  character?: CharacterCustomization;
}

interface LeaderboardScreenProps {
  gameTimes: GameTime[];
  currentUserId: string;
}

export default function LeaderboardScreen({
  gameTimes,
  currentUserId,
}: LeaderboardScreenProps) {
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week">("all");

  const filterGameTimes = (times: GameTime[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return times.filter((time) => {
      const gameDate = new Date(time.date);
      if (timeFilter === "today") return gameDate >= today;
      if (timeFilter === "week") return gameDate >= weekAgo;
      return true;
    });
  };

  const userBestTimes = new Map<string, GameTime>();
  filterGameTimes(gameTimes).forEach((gameTime) => {
    const existing = userBestTimes.get(gameTime.userId);
    if (!existing || gameTime.time < existing.time) {
      userBestTimes.set(gameTime.userId, gameTime);
    }
  });

  const leaderboardData = Array.from(userBestTimes.values())
    .sort((a, b) => a.time - b.time)
    .map((gameTime, index) => ({
      rank: index + 1,
      ...gameTime,
      isCurrentUser: gameTime.userId === currentUserId,
    }));

  const currentUser = leaderboardData.find((p) => p.isCurrentUser);
  const totalPlayers = leaderboardData.length;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-200">
            <Crown size={28} color="white" />
          </div>
          <motion.div
            className="absolute inset-0 bg-yellow-400 rounded-full blur-lg"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      );
    if (rank === 2)
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-200">
          <Medal size={24} color="white" />
        </div>
      );
    if (rank === 3)
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg border-4 border-orange-200">
          <Medal size={24} color="white" />
        </div>
      );
    return (
      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md text-white font-bold">
        {rank}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-red-50 pb-24 ">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white px-6 pt-8 pb-20 relative overflow-hidden">
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
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy size={56} color="white" fill="white" />
            </motion.div>
          </div>
          <h1 className="text-center font-bold mb-2 text-[32px]">
            Тэргүүлэгчид
          </h1>
          <p className="text-center opacity-90 text-[15px]">
            Хамгийн хурдан биеийн бүтэц мэргэжилтнүүд
          </p>
        </motion.div>
      </div>

      {/* User Stats Card */}
      {currentUser && (
        <div className="px-6 -mt-12 mb-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-5 shadow-2xl border-2 border-green-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-2 border-2 border-green-300 flex items-center justify-center overflow-hidden">
                {currentUser.character ? (
                  // 2. FIXED: Passed spread props to ensure literal types (boy/girl) match
                  <CharacterAvatar {...currentUser.character} size={48} />
                ) : (
                  <div className="w-full h-full bg-green-200 rounded-xl" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-700 font-bold text-[16px]">
                    Таны байрлал
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Trophy size={20} color="#22C55E" />
                    <span className="text-green-600 font-bold text-[28px]">
                      #{currentUser.rank}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="flex items-center gap-1.5">
                    <Clock size={20} color="#3B82F6" />
                    <span className="text-blue-600 font-bold font-mono text-[28px]">
                      {formatTime(currentUser.time)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl px-4 py-3 border-2 border-purple-200">
                <div className="text-purple-600 text-xs mb-1 font-bold">
                  Тоглогчид
                </div>
                <div className="text-purple-900 font-bold text-3xl">
                  {totalPlayers}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="px-6 mb-6 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-yellow-200"
          >
            <div className="flex items-end justify-center gap-3">
              {/* 2nd Place */}
              <div className="flex-1 flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="w-20 h-20 bg-white rounded-2xl p-2 shadow-lg mb-3 border-4 border-gray-300 overflow-hidden"
                >
                  {leaderboardData[1].character ? (
                    <CharacterAvatar
                      {...leaderboardData[1].character}
                      size={64}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-xl" />
                  )}
                </motion.div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-md mb-2 -mt-5 border-4 border-white">
                  <span className="font-bold text-white text-lg">2</span>
                </div>
                <div className="text-center mb-3">
                  <div className="font-bold text-gray-900 text-sm">
                    {leaderboardData[1].userNameMn}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Clock size={14} color="#9CA3AF" />
                    <span className="text-gray-600 font-bold text-sm">
                      {formatTime(leaderboardData[1].time)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-20 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-2xl shadow-inner" />
              </div>

              {/* 1st Place */}
              <div className="flex-1 flex flex-col items-center -mt-6">
                <motion.div
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="w-24 h-24 bg-white rounded-2xl p-2 shadow-2xl mb-3 border-4 border-yellow-400 overflow-hidden"
                >
                  {leaderboardData[0].character ? (
                    <CharacterAvatar
                      {...leaderboardData[0].character}
                      size={80}
                    />
                  ) : (
                    <div className="w-full h-full bg-yellow-200 rounded-xl" />
                  )}
                </motion.div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl mb-2 -mt-6 border-4 border-white">
                  <Crown size={24} color="white" />
                </div>
                <div className="text-center mb-3">
                  <div className="font-bold text-gray-900 text-base">
                    {leaderboardData[0].userNameMn}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Clock size={16} color="#FFB800" />
                    <span className="text-yellow-600 font-bold text-base">
                      {formatTime(leaderboardData[0].time)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-28 bg-gradient-to-t from-yellow-400 via-yellow-300 to-yellow-200 rounded-t-2xl shadow-inner relative" />
              </div>

              {/* 3rd Place */}
              <div className="flex-1 flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="w-20 h-20 bg-white rounded-2xl p-2 shadow-lg mb-3 border-4 border-orange-300 overflow-hidden"
                >
                  {leaderboardData[2].character ? (
                    <CharacterAvatar
                      {...leaderboardData[2].character}
                      size={64}
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-200 rounded-xl" />
                  )}
                </motion.div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-md mb-2 -mt-5 border-4 border-white">
                  <span className="font-bold text-white text-lg">3</span>
                </div>
                <div className="text-center mb-3">
                  <div className="font-bold text-gray-900 text-sm">
                    {leaderboardData[2].userNameMn}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Clock size={14} color="#9CA3AF" />
                    <span className="text-gray-600 font-bold text-sm">
                      {formatTime(leaderboardData[2].time)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-16 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-2xl shadow-inner" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="px-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} color="#F59E0B" fill="#F59E0B" />
          <h3 className="font-bold text-gray-900 text-[18px]">Бүх тоглогчид</h3>
        </div>
        <div className="space-y-3">
          {leaderboardData.map((player) => (
            <div
              key={player.userId}
              className={`rounded-2xl p-4 shadow-lg ${player.isCurrentUser ? "bg-gradient-to-r from-green-100 to-emerald-50 border-4 border-green-500" : "bg-white border-2 border-gray-100"}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">{getRankBadge(player.rank)}</div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl p-1.5 overflow-hidden">
                  {player.character ? (
                    <CharacterAvatar {...player.character} size={40} />
                  ) : (
                    <div className="w-full h-full bg-gray-300 rounded-lg" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${player.isCurrentUser ? "text-green-700" : "text-gray-900"} text-[16px]`}
                    >
                      {player.userNameMn}
                    </span>
                    {player.isCurrentUser && (
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        Та
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    {player.userName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Clock
                      size={18}
                      color={player.isCurrentUser ? "#58CC02" : "#9CA3AF"}
                    />
                    <span
                      className={`font-bold font-mono ${player.isCurrentUser ? "text-green-600" : "text-gray-900"} text-[18px]`}
                    >
                      {formatTime(player.time)}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
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
