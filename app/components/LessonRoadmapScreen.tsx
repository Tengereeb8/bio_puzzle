import { motion } from "motion/react";
import {
  ArrowLeft,
  Star,
  Lock,
  Play,
  CheckCircle2,
  Trophy,
  BookOpen,
  Gamepad2,
  Zap,
  Heart,
} from "lucide-react";
import ToothSVG, { BodyPartIcon } from "./ToothSVG";

interface LessonNode {
  id: string;
  type: "lesson" | "quiz" | "game" | "story" | "practice";
  title: string;
  titleMn: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  maxStars: number;
}

interface LessonRoadmapScreenProps {
  chapterTitle: string;
  chapterTitleMn: string;
  chapterColor: string;
  chapterIconType:
    | "molar"
    | "heart"
    | "brain"
    | "lungs"
    | "stomach"
    | "muscles"
    | "bones"
    | "blood";
  lessons: LessonNode[];
  onLessonClick: (lessonId: string) => void;
  onBack: () => void;
}

export default function LessonRoadmapScreen({
  chapterTitle,
  chapterTitleMn,
  chapterColor,
  chapterIconType,
  lessons,
  onLessonClick,
  onBack,
}: LessonRoadmapScreenProps) {
  return (
    <div className="min-h-screen pb-24 overflow-auto relative bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: chapterColor,
              opacity: 0.15,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b-2 border-gray-200 px-6 py-4"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <motion.button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={24} color="#1F2937" strokeWidth={2.5} />
          </motion.button>

          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: chapterColor }}
            >
              {chapterIconType === "molar" ? (
                <ToothSVG type="molar" size={40} color="white" />
              ) : (
                <BodyPartIcon type={chapterIconType} size={40} />
              )}
            </div>
            <div>
              <h2
                className="font-bold text-lg"
                style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
              >
                {chapterTitleMn}
              </h2>
              <p className="text-sm text-gray-600">{chapterTitle}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Явц</p>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < 2 ? "#FFB800" : "none"}
                  color="#FFB800"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Path */}
      <div className="relative px-6 py-12">
        <div className="max-w-xl mx-auto relative">
          {/* Flowing path SVG */}
          <svg
            className="absolute left-1/2 top-0 w-24 -ml-12 pointer-events-none"
            style={{ height: `${lessons.length * 180}px` }}
          >
            <defs>
              <linearGradient id="lessonPath" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={chapterColor} stopOpacity="0.5" />
                <stop
                  offset="100%"
                  stopColor={chapterColor}
                  stopOpacity="0.2"
                />
              </linearGradient>
            </defs>

            <motion.path
              d={`M 48 0 Q 24 40 48 80 Q 72 120 48 160 Q 24 200 48 240 Q 72 280 48 320 Q 24 360 48 400 Q 72 440 48 480 Q 24 520 48 560 Q 72 600 48 640 Q 24 680 48 720 Q 72 760 48 800 Q 24 840 48 880 Q 72 920 48 960 Q 24 1000 48 1040 Q 72 1080 48 1120 Q 24 1160 48 1200 Q 72 1240 48 1280 Q 24 1320 48 1360`}
              stroke="url(#lessonPath)"
              strokeWidth="12"
              fill="none"
              strokeDasharray="15 10"
              animate={{
                strokeDashoffset: [0, -25],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>

          {/* Lesson Nodes */}
          <div className="relative z-10 space-y-12">
            {lessons.map((lesson, index) => {
              const typeIcons = {
                lesson: BookOpen,
                quiz: Trophy,
                game: Gamepad2,
                story: Star,
                practice: Zap,
              };
              const TypeIcon = typeIcons[lesson.type];

              // Determine icon based on lesson id for teeth
              const getToothType = (
                id: string,
              ): "incisor" | "canine" | "premolar" | "molar" => {
                if (
                  id.includes("incisor") ||
                  id.includes("1") ||
                  id.includes("2") ||
                  id.includes("3")
                )
                  return "incisor";
                if (
                  id.includes("canine") ||
                  id.includes("4") ||
                  id.includes("5")
                )
                  return "canine";
                if (
                  id.includes("premolar") ||
                  id.includes("6") ||
                  id.includes("7")
                )
                  return "premolar";
                return "molar";
              };

              return (
                <motion.div
                  key={lesson.id}
                  className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  {/* Lesson Button */}
                  <motion.button
                    onClick={() =>
                      lesson.isUnlocked && onLessonClick(lesson.id)
                    }
                    disabled={!lesson.isUnlocked}
                    className="relative group"
                    whileHover={lesson.isUnlocked ? { scale: 1.1 } : {}}
                    whileTap={lesson.isUnlocked ? { scale: 0.95 } : {}}
                  >
                    {/* Glow effect */}
                    {lesson.isUnlocked && !lesson.isCompleted && (
                      <motion.div
                        className="absolute inset-0 rounded-full blur-xl"
                        style={{ backgroundColor: chapterColor, opacity: 0.4 }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}

                    {/* Main circle */}
                    <div
                      className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white ${
                        lesson.isUnlocked ? "" : "opacity-50 grayscale"
                      }`}
                      style={{
                        backgroundColor: lesson.isUnlocked
                          ? lesson.isCompleted
                            ? "#22c55e"
                            : chapterColor
                          : "#E5E7EB",
                      }}
                    >
                      <div className="mb-1">
                        <ToothSVG
                          type={getToothType(lesson.id)}
                          size={45}
                          color="white"
                        />
                      </div>

                      {!lesson.isUnlocked && (
                        <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Lock size={28} color="white" strokeWidth={2.5} />
                        </div>
                      )}

                      {lesson.isCompleted && (
                        <motion.div
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <CheckCircle2
                            size={20}
                            color="#22c55e"
                            fill="#22c55e"
                          />
                        </motion.div>
                      )}

                      {lesson.isUnlocked && !lesson.isCompleted && (
                        <motion.div
                          className="absolute -bottom-1 bg-white rounded-full px-2 py-0.5 shadow-md"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Play
                            size={12}
                            color={chapterColor}
                            fill={chapterColor}
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Type badge */}
                    <div
                      className="absolute -top-2 -left-2 bg-white rounded-full p-1.5 shadow-lg border-2"
                      style={{ borderColor: chapterColor }}
                    >
                      <TypeIcon size={16} color={chapterColor} />
                    </div>
                  </motion.button>

                  {/* Lesson Info Card */}
                  <motion.div
                    className={`flex-1 max-w-xs ${index % 2 === 0 ? "ml-6" : "mr-6"}`}
                    whileHover={
                      lesson.isUnlocked ? { x: index % 2 === 0 ? 4 : -4 } : {}
                    }
                  >
                    <div
                      className={`bg-white rounded-2xl p-4 shadow-lg border-2 ${
                        lesson.isUnlocked
                          ? "border-gray-100"
                          : "border-gray-200 opacity-60"
                      }`}
                    >
                      <h3
                        className="font-bold mb-1"
                        style={{
                          fontFamily: "Noto Sans Mongolian, Nunito",
                          color: lesson.isUnlocked ? "#1F2937" : "#9CA3AF",
                        }}
                      >
                        {lesson.titleMn}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {lesson.title}
                      </p>

                      {lesson.isUnlocked && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(lesson.maxStars)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < lesson.stars ? "#FFB800" : "none"}
                                color={i < lesson.stars ? "#FFB800" : "#D1D5DB"}
                              />
                            ))}
                          </div>

                          {lesson.isCompleted ? (
                            <span className="text-xs font-semibold text-green-600">
                              Дууслаа
                            </span>
                          ) : (
                            <span
                              className="text-xs font-semibold"
                              style={{ color: chapterColor }}
                            >
                              {lesson.stars > 0 ? "Үргэлжлүүлэх" : "Эхлэх"}
                            </span>
                          )}
                        </div>
                      )}

                      {!lesson.isUnlocked && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Lock size={12} />
                          <span className="text-xs">Түгжээтэй</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Completion Celebration */}
          {lessons.every((l) => l.isCompleted) && (
            <motion.div
              className="mt-12 bg-linear-to-r from-yellow-400 to-orange-400 rounded-3xl p-8 text-center text-white shadow-2xl"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
              >
                Баяр хүргэе!
              </h2>
              <p className="text-white/90">
                Та {chapterTitleMn} бүлгийг дууслаа!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
