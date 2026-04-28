import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  User,
  Trophy,
  Award,
  Flame,
  Target,
  Star,
  Medal,
  TrendingUp,
  Crown,
  Zap,
  X,
} from "lucide-react";

interface UserProfile {
  name: string;
  nameMn: string;
  avatar: string;
  level: number;
  totalPoints: number;
  streak: number;
  badges: Badge[];
  rank: number;
  totalUsers: number;
}

interface Badge {
  id: string;
  name: string;
  nameMn: string;
  icon: string;
  description: string;
  descriptionMn: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

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

interface ImprovedMoreMenuProps {
  userProfile: UserProfile;
  leaderboard: LeaderboardEntry[];
  onClose: () => void;
}

function medalColors(rank: number) {
  if (rank === 1) return { gradient: "from-yellow-400 to-yellow-600", icon: "#FFD700" };
  if (rank === 2) return { gradient: "from-gray-300 to-gray-500", icon: "#C0C0C0" };
  if (rank === 3) return { gradient: "from-orange-400 to-orange-600", icon: "#CD7F32" };
  return { gradient: "from-blue-400 to-blue-600", icon: "#3B82F6" };
}

export default function ImprovedMoreMenu({
  userProfile,
  leaderboard,
  onClose,
}: ImprovedMoreMenuProps) {
  const [activeSection, setActiveSection] = useState<"profile" | "leaderboard">("profile");

  const unlockedBadges = userProfile.badges.filter((b) => b.unlocked).length;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-auto pb-24 shadow-2xl relative"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X size={24} color="#1F2937" />
        </button>

        {/* Tab navigation */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b-2 border-gray-200 z-10 pt-6">
          <div className="flex px-6">
            {(["profile", "leaderboard"] as const).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`flex-1 py-4 px-6 font-game-bold transition-colors relative ${
                  activeSection === section ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                {section === "profile" ? (
                  <><User size={20} className="inline mr-2" />Миний профайл</>
                ) : (
                  <><Trophy size={20} className="inline mr-2" />Тэргүүлэгчид</>
                )}
                {activeSection === section && (
                  <motion.div
                    layoutId="activeMenuTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-t"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-6"
              >
                {/* Profile header */}
                <motion.div
                  className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Decorative blob */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <motion.div
                      className="absolute w-40 h-40 bg-white rounded-full blur-3xl"
                      animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/20">
                          <span className="text-5xl">{userProfile.avatar}</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-game-black mb-1">
                            {userProfile.nameMn}
                          </h2>
                          <p className="text-white/80 text-sm font-game">{userProfile.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                              <Star size={14} fill="white" color="white" />
                              <span className="text-sm font-game-bold">
                                Түвшин {userProfile.level}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm mb-2">
                          <p className="text-xs opacity-80 font-game">Эрэмбэ</p>
                          <p className="text-2xl font-bold">#{userProfile.rank}</p>
                        </div>
                        <p className="text-xs opacity-70 font-game">
                          {userProfile.totalUsers} хэрэглэгчээс
                        </p>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { icon: Target, label: "Нийт оноо", value: userProfile.totalPoints, iconClass: "text-yellow-300" },
                        { icon: Flame, label: "Дараалал", value: userProfile.streak, sub: "өдөр", iconClass: "text-orange-300" },
                        { icon: Award, label: "Медаль", value: unlockedBadges, sub: `/${userProfile.badges.length}`, iconClass: "text-green-300" },
                      ].map(({ icon: Icon, label, value, sub, iconClass }) => (
                        <motion.div
                          key={label}
                          className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <Icon size={24} className={iconClass} />
                          </div>
                          <p className="text-xs opacity-80 mb-1 font-game">{label}</p>
                          <p className="text-2xl font-bold">{value}</p>
                          {sub && <p className="text-xs opacity-70 font-game">{sub}</p>}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Badges */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-game-black">Миний медалиуд</h3>
                    <span className="text-sm text-gray-500 font-game">
                      {unlockedBadges}/{userProfile.badges.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {userProfile.badges.map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        className={`bg-white rounded-2xl p-4 text-center border-3 shadow-lg ${
                          badge.unlocked
                            ? "border-yellow-400"
                            : "border-gray-200 opacity-50 grayscale"
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={badge.unlocked ? { scale: 1.08, y: -4 } : {}}
                      >
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <p className="text-xs font-game-bold mb-1">{badge.nameMn}</p>
                        <p className="text-[10px] text-gray-500 leading-tight font-game">
                          {badge.descriptionMn}
                        </p>

                        {!badge.unlocked && badge.progress !== undefined && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-indigo-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${(badge.progress / badge.maxProgress!) * 100}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 font-game">
                              {badge.progress}/{badge.maxProgress}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "leaderboard" && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    className="inline-block"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Trophy size={48} className="text-yellow-500 mx-auto mb-3" />
                  </motion.div>
                  <h2 className="text-2xl font-game-black mb-2">Тэргүүлэгчдийн самбар</h2>
                  <p className="text-gray-600 font-game">Хамгийн идэвхтэй сурагчид</p>
                </div>

                {/* Podium — top 3 */}
                <div className="flex items-end justify-center gap-4 mb-8">
                  {[1, 0, 2].map((idx) => {
                    const entry = leaderboard[idx];
                    if (!entry) return null;
                    const colors = medalColors(entry.rank);
                    const isFirst = idx === 1; // centre = rank 1

                    return (
                      <motion.div
                        key={entry.rank}
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                      >
                        {/* Avatar */}
                        <motion.div
                          className={`relative mb-3 ${isFirst ? "w-24 h-24" : "w-20 h-20"}`}
                          whileHover={{ scale: 1.1 }}
                        >
                          <div
                            className={`w-full h-full rounded-full bg-linear-to-br ${colors.gradient} flex items-center justify-center shadow-2xl border-4 border-white`}
                          >
                            <span className={isFirst ? "text-4xl" : "text-3xl"}>
                              {entry.avatar}
                            </span>
                          </div>

                          <motion.div
                            className="absolute -top-2 -right-2"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                          >
                            {entry.rank === 1 && <Crown size={28} fill="#FFD700" color="#FFD700" />}
                            {entry.rank === 2 && <Medal size={24} fill="#C0C0C0" color="#C0C0C0" />}
                            {entry.rank === 3 && <Medal size={24} fill="#CD7F32" color="#CD7F32" />}
                          </motion.div>
                        </motion.div>

                        {/* Podium block */}
                        <motion.div
                          className={`bg-linear-to-br ${colors.gradient} rounded-t-2xl px-6 pt-4 pb-2 text-white text-center shadow-xl min-w-[5rem]`}
                          style={{ height: isFirst ? "120px" : idx === 0 ? "100px" : "80px" }}
                          initial={{ height: 0 }}
                          animate={{ height: isFirst ? "120px" : idx === 0 ? "100px" : "80px" }}
                          transition={{ delay: 0.2 + idx * 0.1, type: "spring", stiffness: 200 }}
                        >
                          <p className="font-game-bold text-sm mb-1">{entry.nameMn}</p>
                          <p className="text-xs opacity-80 mb-2 font-game">{entry.name}</p>
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

                {/* Rest of leaderboard */}
                <div className="space-y-3">
                  {leaderboard.slice(3).map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        entry.isCurrentUser
                          ? "bg-linear-to-r from-indigo-100 to-purple-100 border-2 border-indigo-400 shadow-lg"
                          : "bg-white border-2 border-gray-100 shadow-md hover:shadow-lg"
                      }`}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-12 text-center">
                        <span
                          className={`text-lg font-bold ${
                            entry.isCurrentUser ? "text-indigo-600" : "text-gray-500"
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </div>

                      <div className="w-14 h-14 bg-linear-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-2xl">{entry.avatar}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`font-game-bold ${
                              entry.isCurrentUser ? "text-indigo-700" : "text-gray-800"
                            }`}
                          >
                            {entry.nameMn}
                          </p>
                          {entry.isCurrentUser && (
                            <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full font-game">
                              Та
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star size={12} fill="#FFB800" color="#FFB800" />
                            <span className="font-game">Түвшин {entry.level}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame size={12} className="text-orange-500" />
                            <span className="font-game">{entry.streak} өдөр</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          <Zap size={16} className="text-yellow-500" />
                          <span className="font-bold text-lg text-gray-800">{entry.points}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          {entry.trend === "up" && (
                            <TrendingUp size={14} className="text-green-500" />
                          )}
                          {entry.trend === "down" && (
                            <TrendingUp size={14} className="text-red-500 rotate-180" />
                          )}
                          <span
                            className={`text-xs font-game ${
                              entry.trend === "up"
                                ? "text-green-600"
                                : entry.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-500"
                            }`}
                          >
                            {entry.trend === "up" ? "+2" : entry.trend === "down" ? "-1" : "—"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
