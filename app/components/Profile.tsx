import { motion } from "motion/react";
import { Award, Flame, Target, Star } from "lucide-react";

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

export default function ProfileTab({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const unlocked = userProfile.badges.filter((b) => b.unlocked).length;

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="space-y-6"
    >
      <motion.div
        className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
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
                <p className="text-white/80 text-sm">{userProfile.name}</p>
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm mt-2 w-fit">
                  <Star size={14} fill="white" color="white" />
                  <span className="text-sm font-game-bold">
                    Түвшин {userProfile.level}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm mb-2">
                <p className="text-xs opacity-80">Эрэмбэ</p>
                <p className="text-2xl font-bold">#{userProfile.rank}</p>
              </div>
              <p className="text-xs opacity-70">
                {userProfile.totalUsers} хэрэглэгчээс
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: Target,
                label: "Нийт оноо",
                value: userProfile.totalPoints,
                cls: "text-yellow-300",
              },
              {
                icon: Flame,
                label: "Дараалал",
                value: `${userProfile.streak} өдөр`,
                cls: "text-orange-300",
              },
              {
                icon: Award,
                label: "Медаль",
                value: `${unlocked}/${userProfile.badges.length}`,
                cls: "text-green-300",
              },
            ].map(({ icon: Icon, label, value, cls }) => (
              <motion.div
                key={label}
                className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <Icon size={24} className={`${cls} mx-auto mb-2`} />
                <p className="text-xs opacity-80 mb-1">{label}</p>
                <p className="font-bold">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-game-black">Миний медалиуд</h3>
          <span className="text-sm text-gray-500">
            {unlocked}/{userProfile.badges.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {userProfile.badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              className={`bg-white rounded-2xl p-4 text-center border-3 shadow-lg ${badge.unlocked ? "border-yellow-400" : "border-gray-200 opacity-50 grayscale"}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={badge.unlocked ? { scale: 1.08, y: -4 } : {}}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="text-xs font-game-bold mb-1">{badge.nameMn}</p>
              <p className="text-[10px] text-gray-500 leading-tight">
                {badge.descriptionMn}
              </p>

              {!badge.unlocked && badge.progress != null && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(badge.progress / badge.maxProgress!) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {badge.progress}/{badge.maxProgress}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
