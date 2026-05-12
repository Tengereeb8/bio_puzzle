import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { Lock, CheckCircle, Sparkles, Flame, Zap } from "lucide-react";
import ToothSVG, { BodyPartIcon } from "./ToothSVG";

interface Chapter {
  id: string;
  title: string;
  titleMn: string;
  iconType: string;
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
  streakDays,
  onChapterClick,
}: {
  chapters: Chapter[];
  totalPoints: number;
  streakDays: number;
  onChapterClick: (id: string) => void;
}) {
  const completedCount = chapters.filter((c) => c.isCompleted).length;

  return (
    <div className="min-h-screen relative bg-orange-50 ">
      <div className="relative bg-[#fa8e1b] text-white px-10 pt-6 rounded-b-full pb-15">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-game-black">Бие Махбодын Аялал</h1>
              <p className="text-purple-100 text-sm">Өөрийнхөө биеийг судал!</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center-safe gap-10 sm:gap-15">
            {[
              {
                icon: <Sparkles size={23} className="text-yellow-300" />,
                value: completedCount,
                label: "Бүлэг дууссан",
              },
              {
                icon: <Zap size={23} className="text-yellow-200" />,
                value: totalPoints,
                label: "Нийт оноо",
              },
              {
                icon: <Flame className="text-base text-yellow-200" />,
                value: streakDays,
                label: "Дараалал",
              },
            ].map(({ icon, value, label }) => (
              <div key={label} className="rounded-xl p-3 text-center min-w-10">
                <div className="flex justify-center mb-1">{icon}</div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs opacity-90">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative  ">
        <div className="relative mx-auto w-full ">
          <svg
            className="absolute left-1/2 top-0 bottom-0 w-32 -ml-16 pointer-events-none"
            style={{ height: `${chapters.length * 204}px` }}
          >
            <defs>
              <linearGradient
                id="pathGradient"
                x1="20%"
                y1="0%"
                x2="60%"
                y2="80%"
              >
                <stop offset="0%" stopColor="#f5c118" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 64 0 Q 40 50 64 100 Q 88 150 64 200 Q 40 250 64 300 Q 88 350 64 400 Q 40 450 64 500 Q 88 550 64 600 Q 40 650 64 700 Q 88 750 64 800 Q 40 850 64 900 Q 88 950 64 1000 Q 40 1050 64 1100 Q 88 1150 64 1200 Q 40 1250 64 1300 Q 88 1350 64 1400 Q 40 1450 64 1500 Q 88 1550 64 1600"
              stroke="url(#pathGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray="20 15"
              animate={{ strokeDashoffset: [0, -35] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          <div className="min-w-screen relative z-10 space-y-16 pt-20 px-10 md:px-40 lg:px-65 xl:px-100 2xl:px-120">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="relative 2xl:mx-20">
                <div
                  className={`flex items-center gap-6 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <button
                    onClick={() =>
                      chapter.isUnlocked && onChapterClick(chapter.id)
                    }
                    disabled={!chapter.isUnlocked}
                    className="relative group"
                  >
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
                          <img src="tooth.svg" className="size-12"></img>
                        ) : (
                          <BodyPartIcon
                            type={
                              chapter.iconType as ComponentProps<
                                typeof BodyPartIcon
                              >["type"]
                            }
                            size={64}
                          />
                        )}
                      </div>

                      {!chapter.isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-sm">
                          <Lock size={40} color="white" strokeWidth={2.5} />
                        </div>
                      )}

                      {chapter.isCompleted && (
                        <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2 shadow-xl border-4 border-white">
                          <CheckCircle size={28} color="white" fill="#22c55e" />
                        </div>
                      )}

                      {chapter.isUnlocked &&
                        !chapter.isCompleted &&
                        chapter.progress > 0 && (
                          <svg className="absolute inset-0 w-full h-full -rotate-90"></svg>
                        )}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
