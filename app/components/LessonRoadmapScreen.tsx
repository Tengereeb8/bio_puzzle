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
  Smile,
} from "lucide-react";
import ToothSVG, { BodyPartIcon } from "./ToothSVG";

interface LessonNode {
  id: string;
  type: string;
  title: string;
  titleMn: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  maxStars: number;
}

const TYPE_ICONS = {
  lesson: BookOpen,
  quiz: Trophy,
  game: Gamepad2,
  story: Star,
  practice: Zap,
};

function toothType(id: string): "incisor" | "canine" | "premolar" | "molar" {
  if (id.includes("incisor") || /[123]/.test(id)) return "incisor";
  if (id.includes("canine") || /[45]/.test(id)) return "canine";
  if (id.includes("premolar") || /[67]/.test(id)) return "premolar";
  return "molar";
}

function buildPath(count: number): string {
  const points = ["M 48 0"];
  for (let i = 0; i < count; i++) {
    const y1 = i * 120 + 40;
    const y2 = i * 120 + 80;
    const side = i % 2 === 0 ? 24 : 72;
    points.push(`Q ${side} ${y1} 48 ${y2}`);
  }
  return points.join(" ");
}
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: ((i * 37 + 13) % 100).toFixed(1),
  top: ((i * 53 + 7) % 100).toFixed(1),
  xOffset: (i % 5) * 6 - 12,
  duration: 3 + (i % 3),
  delay: i * 0.2,
}));

export default function LessonRoadmapScreen({
  chapterTitle,
  chapterTitleMn,
  chapterColor,
  chapterIconType,
  lessons,
  onLessonClick,
  onBack,
}: {
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
  onLessonClick: (id: string) => void;
  onBack: () => void;
}) {
  const allDone = lessons.every((l) => l.isCompleted);

  return (
    <div className="font-game-black min-h-screen relative bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="fixed inset-0  pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: chapterColor,
              opacity: 0.15,
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, p.xOffset, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div
        className=" font-game-black sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b-2 border-gray-200 px-6 py-4"
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
                <img src="/tooth.svg" className="size-7"></img>
              ) : (
                <BodyPartIcon type={chapterIconType} size={40} />
              )}
            </div>
            <div>
              <h2 className="font-bold text-lg font-game">{chapterTitleMn}</h2>
              <p className="text-sm text-gray-600">{chapterTitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-6 pt-14 pb-20">
        <div className="max-w-xl mx-auto relative">
          <svg
            className="absolute left-1/2 top-0 w-24 -ml-12 pointer-events-none"
            style={{ height: `${(lessons.length + 5) * 120}px` }}
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
              d={buildPath(lessons.length + 6)}
              stroke="url(#lessonPath)"
              strokeWidth="12"
              fill="none"
              strokeDasharray="15 10"
              animate={{ strokeDashoffset: [0, -25] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          <div className="relative z-10 space-y-12">
            {lessons.map((lesson, index) => {
              const TypeIcon =
                TYPE_ICONS[lesson.type as keyof typeof TYPE_ICONS] ?? BookOpen;
              const left = index % 2 === 0;

              return (
                <motion.div
                  key={lesson.id}
                  className={`flex items-center ${left ? "flex-row" : "flex-row-reverse"}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <motion.button
                    onClick={() =>
                      lesson.isUnlocked && onLessonClick(lesson.id)
                    }
                    disabled={!lesson.isUnlocked}
                    className="relative group"
                    whileHover={lesson.isUnlocked ? { scale: 1.1 } : {}}
                    whileTap={lesson.isUnlocked ? { scale: 0.95 } : {}}
                  >
                    {lesson.isUnlocked && !lesson.isCompleted && (
                      <div
                        className="absolute inset-0 rounded-full blur-xl"
                        style={{ backgroundColor: chapterColor, opacity: 0.4 }}
                      />
                    )}

                    <div
                      className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white ${!lesson.isUnlocked && "opacity-50 grayscale"}`}
                      style={{
                        backgroundColor: lesson.isUnlocked
                          ? lesson.isCompleted
                            ? "#ffab2b"
                            : chapterColor
                          : "#ffab2b",
                      }}
                    >
                      <div className="mb-1">
                        <img src="/tooth.svg" className="size-8 " />
                      </div>

                      {!lesson.isUnlocked && (
                        <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Lock size={28} color="white" strokeWidth={2.5} />
                        </div>
                      )}

                      {lesson.isCompleted && (
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                          <CheckCircle2
                            size={20}
                            color="#fa7b14"
                            fill="#fa7b14"
                          />
                        </div>
                      )}

                      {lesson.isUnlocked && !lesson.isCompleted && (
                        <div className="absolute -bottom-1 bg-white rounded-full px-2 py-0.5 shadow-md">
                          <Play
                            size={12}
                            color={chapterColor}
                            fill={chapterColor}
                          />
                        </div>
                      )}
                    </div>

                    <div
                      className="absolute -top-2 -left-2 bg-white rounded-full p-1.5 shadow-lg border-2"
                      style={{ borderColor: chapterColor }}
                    >
                      <TypeIcon size={16} color={chapterColor} />
                    </div>
                  </motion.button>

                  <div className={`flex-1 max-w-xs ${left ? "ml-6" : "mr-6"}`}>
                    <div
                      className={`bg-white rounded-2xl p-4 shadow-lg border-2 ${lesson.isUnlocked ? "border-gray-100" : "border-gray-200 opacity-60"}`}
                    >
                      <h3
                        className={`font-game-bold mb-1 ${lesson.isUnlocked ? "text-gray-800" : "text-gray-400"}`}
                      >
                        {lesson.titleMn}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {lesson.title}
                      </p>
                      {lesson.isUnlocked ? (
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs font-semibold"
                            style={{
                              color: lesson.isCompleted
                                ? "#f57e1d"
                                : chapterColor,
                            }}
                          >
                            {lesson.isCompleted
                              ? "Дууслаа"
                              : lesson.stars > 0
                                ? "Үргэлжлүүлэх"
                                : "Эхлэх"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Lock size={12} />
                          <span className="text-xs">Түгжээтэй</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {allDone && (
            <div className="mt-12 bg-linear-to-r from-yellow-400 to-orange-400 rounded-3xl p-8 text-center text-white shadow-2xl">
              <div className="flex justify-center mb-4">
                <Trophy className="size-10 " />
              </div>
              <h2 className="text-2xl font-black mb-2 font-game">
                Баяр хүргэе!
              </h2>
              <p className="text-white/90 font-game">
                Та {chapterTitleMn} бүлгийг дууслаа!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
