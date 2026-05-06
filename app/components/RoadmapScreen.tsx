import { motion } from "motion/react";
import { Lock, CheckCircle, Star, Trophy, Sparkles } from "lucide-react";
import ToothSVG, { BodyPartIcon } from "./ToothSVG";

interface Chapter {
  id: string;
  title: string;
  titleMn: string;
  iconType:
    | "molar"
    | "heart"
    | "brain"
    | "lungs"
    | "stomach"
    | "muscles"
    | "bones"
    | "blood";
  color: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export default function RoadmapScreen({
  chapters,
  totalPoints,
  onChapterClick,
}: {
  chapters: Chapter[];
  totalPoints: number;
  onChapterClick: (id: string) => void;
}) {
  const completedCount = chapters.filter((c) => c.isCompleted).length;

  return (
    <div className="min-h-full pb-24 overflow-auto relative bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-6 pt-8 pb-16">
        <div className="max-w-2xl  mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-3xl mb-1 font-game-black">
                Бие Махбодын Аялал
              </h1>
              <p className="text-purple-100 text-sm">Өөрийнхөө биеийг судал!</p>
            </div>
            <motion.div
              className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-300" size={24} />
                <div>
                  <p className="text-xs opacity-80">Нийт оноо</p>
                  <p className="font-bold text-lg">{totalPoints}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              {
                icon: <Sparkles size={20} className="text-yellow-300" />,
                value: completedCount,
                label: "Дууссан",
              },
              {
                icon: <Star size={20} className="text-blue-300" />,
                value: 5,
                label: "Түвшин",
              },
              {
                icon: <span className="text-xl">🔥</span>,
                value: 7,
                label: "Өдөр",
              },
            ].map(({ icon, value, label }) => (
              <div
                key={label}
                className="bg-white/15 backdrop-blur-md rounded-xl p-3 text-center"
              >
                <div className="flex justify-center mb-1">{icon}</div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs opacity-90">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative px-6">
        <div className="relative max-w-2xl mx-auto">
          <svg
            className="absolute left-1/2 top-0 bottom-0 w-32 -ml-16 pointer-events-none"
            style={{ height: `${chapters.length * 200}px` }}
          >
            <defs>
              <linearGradient
                id="pathGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 64 0 Q 40 50 64 100 Q 88 150 64 200 Q 40 250 64 300 Q 88 350 64 400 Q 40 450 64 500 Q 88 550 64 600 Q 40 650 64 700 Q 88 750 64 800 Q 40 850 64 900 Q 88 950 64 1000 Q 40 1050 64 1100 Q 88 1150 64 1200 Q 40 1250 64 1300 Q 88 1350 64 1400"
              stroke="url(#pathGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray="20 15"
              animate={{ strokeDashoffset: [0, -35] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          <div className="relative z-10 space-y-16 pt-8 pb-8">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                className="relative"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <div
                  className={`flex items-center gap-6 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <motion.button
                    onClick={() =>
                      chapter.isUnlocked && onChapterClick(chapter.id)
                    }
                    disabled={!chapter.isUnlocked}
                    className="relative group"
                    whileHover={
                      chapter.isUnlocked ? { scale: 1.15, rotate: 5 } : {}
                    }
                    whileTap={chapter.isUnlocked ? { scale: 0.95 } : {}}
                  >
                    {chapter.isUnlocked && !chapter.isCompleted && (
                      <motion.div
                        className="absolute inset-0 rounded-full blur-2xl opacity-60"
                        style={{ backgroundColor: chapter.color }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    <div
                      className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 ${
                        chapter.isUnlocked
                          ? "border-white shadow-xl"
                          : "border-gray-300 opacity-60 grayscale"
                      }`}
                      style={{
                        backgroundColor: chapter.isUnlocked
                          ? chapter.color
                          : "#E5E7EB",
                      }}
                    >
                      <div className="mb-1">
                        {chapter.iconType === "molar" ? (
                          <ToothSVG type="molar" size={64} color="white" />
                        ) : (
                          <BodyPartIcon type={chapter.iconType} size={64} />
                        )}
                      </div>

                      {!chapter.isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-sm">
                          <Lock size={40} color="white" strokeWidth={2.5} />
                        </div>
                      )}

                      {chapter.isCompleted && (
                        <motion.div
                          className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2 shadow-xl border-4 border-white"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            delay: 0.3,
                          }}
                        >
                          <CheckCircle size={28} color="white" fill="#22c55e" />
                        </motion.div>
                      )}

                      {chapter.isUnlocked &&
                        !chapter.isCompleted &&
                        chapter.progress > 0 && (
                          <svg
                            className="absolute inset-0 w-full h-full -rotate-90"
                            style={{ overflow: "visible" }}
                          >
                            <circle
                              cx="64"
                              cy="64"
                              r="68"
                              stroke="white"
                              strokeWidth="6"
                              fill="none"
                              opacity="0.3"
                            />
                            <motion.circle
                              cx="64"
                              cy="64"
                              r="68"
                              stroke="white"
                              strokeWidth="6"
                              fill="none"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: chapter.progress / 100 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              style={{
                                strokeDasharray: "427",
                                strokeDashoffset: 0,
                              }}
                            />
                          </svg>
                        )}
                    </div>
                  </motion.button>

                  <motion.div
                    className={`flex-1 bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-100 game-card ${
                      !chapter.isUnlocked && "opacity-60"
                    } ${index % 2 === 0 ? "text-left" : "text-right"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={index % 2 === 0 ? "" : "order-2"}>
                        <h3
                          className={`text-xl mb-1 font-game-bold ${chapter.isUnlocked ? "text-gray-800" : "text-gray-400"}`}
                        >
                          {chapter.titleMn}
                        </h3>
                        <p className="text-sm text-gray-500">{chapter.title}</p>
                      </div>

                      {chapter.isUnlocked && (
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold ${index % 2 === 0 ? "" : "order-1"}`}
                          style={{
                            backgroundColor: `${chapter.color}20`,
                            color: chapter.color,
                          }}
                        >
                          {chapter.completedLessons}/{chapter.totalLessons}
                        </div>
                      )}
                    </div>

                    {chapter.isUnlocked && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: chapter.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${chapter.progress}%` }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-600">
                            {chapter.progress}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {chapter.isCompleted
                            ? "✓ Дууслаа!"
                            : chapter.completedLessons > 0
                              ? "Үргэлжлүүлэх..."
                              : "Эхлүүлэх"}
                        </p>
                      </div>
                    )}

                    {!chapter.isUnlocked && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Lock size={12} />
                        Өмнөх бүлгийг дуусгана уу
                      </p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
