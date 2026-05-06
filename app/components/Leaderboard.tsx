import { motion } from "motion/react";
import {
  Trophy,
  Crown,
  Medal,
  Zap,
  Star,
  Flame,
  TrendingUp,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  nameMn: string;
  avatar: string;
  points: number;
  level: number;
  streak: number;
  isCurrentUser: boolean;
  trend: "up" | "down" | "same";
}

const MEDAL = {
  1: { gradient: "from-yellow-400 to-yellow-600" },
  2: { gradient: "from-gray-300 to-gray-500" },
  3: { gradient: "from-orange-400 to-orange-600" },
} as Record<number, { gradient: string }>;

export default function LeaderboardTab({
  leaderboard,
}: {
  leaderboard: LeaderboardEntry[];
}) {
  return (
    <motion.div
      key="leaderboard"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <motion.div
          className="inline-block"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Trophy size={48} className="text-yellow-500 mx-auto mb-3" />
        </motion.div>
        <h2 className="text-2xl font-game-black mb-2">Тэргүүлэгчдийн самбар</h2>
        <p className="text-gray-600">Хамгийн идэвхтэй сурагчид</p>
      </div>

      <div className="flex items-end justify-center gap-4 mb-8">
        {[1, 0, 2].map((idx) => {
          const entry = leaderboard[idx];
          if (!entry) return null;
          const grad =
            MEDAL[entry.rank]?.gradient ?? "from-blue-400 to-blue-600";
          const big = idx === 1;

          return (
            <motion.div
              key={entry.rank}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className={`relative mb-3 ${big ? "w-24 h-24" : "w-20 h-20"}`}
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className={`w-full h-full rounded-full bg-linear-to-br ${grad} flex items-center justify-center shadow-2xl border-4 border-white`}
                >
                  <span className={big ? "text-4xl" : "text-3xl"}>
                    {entry.avatar}
                  </span>
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                >
                  {entry.rank === 1 && (
                    <Crown size={28} fill="#FFD700" color="#FFD700" />
                  )}
                  {entry.rank === 2 && (
                    <Medal size={24} fill="#C0C0C0" color="#C0C0C0" />
                  )}
                  {entry.rank === 3 && (
                    <Medal size={24} fill="#CD7F32" color="#CD7F32" />
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className={`bg-linear-to-br ${grad} rounded-t-2xl px-6 pt-4 pb-2 text-white text-center shadow-xl min-w-20`}
                style={{ height: big ? "120px" : idx === 0 ? "100px" : "80px" }}
                initial={{ height: 0 }}
                animate={{
                  height: big ? "120px" : idx === 0 ? "100px" : "80px",
                }}
                transition={{
                  delay: 0.2 + idx * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <p className="font-game-bold text-sm mb-1">{entry.nameMn}</p>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap size={14} fill="white" />
                  <span className="font-bold">{entry.points}</span>
                </div>
                <p className="text-xs opacity-70">#{entry.rank}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3">
        {leaderboard.slice(3).map((entry, i) => (
          <motion.div
            key={entry.rank}
            className={`flex items-center gap-4 p-4 rounded-2xl ${
              entry.isCurrentUser
                ? "bg-linear-to-r from-indigo-100 to-purple-100 border-2 border-indigo-400 shadow-lg"
                : "bg-white border-2 border-gray-100 shadow-md hover:shadow-lg"
            }`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: 4 }}
          >
            <span
              className={`w-12 text-center text-lg font-bold ${entry.isCurrentUser ? "text-indigo-600" : "text-gray-500"}`}
            >
              #{entry.rank}
            </span>

            <div className="w-14 h-14 bg-linear-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-2xl">{entry.avatar}</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p
                  className={`font-game-bold ${entry.isCurrentUser ? "text-indigo-700" : "text-gray-800"}`}
                >
                  {entry.nameMn}
                </p>
                {entry.isCurrentUser && (
                  <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
                    Та
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Star size={12} fill="#FFB800" color="#FFB800" />
                  Түвшин {entry.level}
                </span>
                <span className="flex items-center gap-1">
                  <Flame size={12} className="text-orange-500" />
                  {entry.streak} өдөр
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 mb-1">
                <Zap size={16} className="text-yellow-500" />
                <span className="font-bold text-lg text-gray-800">
                  {entry.points}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                {entry.trend === "up" && (
                  <TrendingUp size={14} className="text-green-500" />
                )}
                {entry.trend === "down" && (
                  <TrendingUp size={14} className="text-red-500 rotate-180" />
                )}
                <span
                  className={`text-xs ${entry.trend === "up" ? "text-green-600" : entry.trend === "down" ? "text-red-600" : "text-gray-500"}`}
                >
                  {entry.trend === "up"
                    ? "+2"
                    : entry.trend === "down"
                      ? "-1"
                      : "—"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
