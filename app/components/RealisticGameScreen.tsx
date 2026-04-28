import { motion, useMotionValue, useTransform } from "motion/react";
import { useState, useRef } from "react";
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Volume2,
  Star,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface BodyPart {
  id: string;
  name: string;
  nameMn: string;
  image: string;
  targetX: number;
  targetY: number;
  width: number;
  height: number;
  rotation: number;
}

interface RealisticGameScreenProps {
  chapterTitle: string;
  chapterTitleMn: string;
  chapterColor: string;
  bodyParts: BodyPart[];
  backgroundImage: string;
  onComplete: (points: number) => void;
  onBack: () => void;
}

interface DraggablePartProps {
  part: BodyPart;
  isPlaced: boolean;
  onDragEnd: (id: string, x: number, y: number) => void;
  color: string;
}

function DraggablePart({
  part,
  isPlaced,
  onDragEnd,
  color,
}: DraggablePartProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useTransform(() => (isDragging ? 1.1 : 1));

  if (isPlaced) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onDragEnd(part.id, info.point.x, info.point.y);
      }}
      style={{ x, y, scale }}
      className="cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-4 shadow-2xl border-3"
        style={{
          borderColor: color,
          borderWidth: 3,
        }}
        animate={
          !isDragging
            ? {
                y: [0, -8, 0],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <div className="text-6xl mb-2 text-center filter drop-shadow-lg">
            {part.image}
          </div>
          <div
            className="absolute inset-0 blur-2xl opacity-40"
            style={{ backgroundColor: color }}
          />
        </div>
        <p
          className="text-center font-bold text-sm"
          style={{
            fontFamily: "Noto Sans Mongolian, Nunito",
            color: "#1F2937",
          }}
        >
          {part.nameMn}
        </p>
        <p className="text-center text-xs text-gray-500">{part.name}</p>
      </motion.div>
    </motion.div>
  );
}

export default function RealisticGameScreen({
  chapterTitle,
  chapterTitleMn,
  chapterColor,
  bodyParts,
  backgroundImage,
  onComplete,
  onBack,
}: RealisticGameScreenProps) {
  const [placedParts, setPlacedParts] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const playAudio = (text: string, pitch = 1.1) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = pitch;
      utterance.lang = "mn-MN";
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkPlacement = (partId: string, dropX: number, dropY: number) => {
    if (!canvasRef.current) return false;

    const rect = canvasRef.current.getBoundingClientRect();
    const part = bodyParts.find((p) => p.id === partId);
    if (!part) return false;

    const targetAbsX = rect.left + (part.targetX / 100) * rect.width;
    const targetAbsY = rect.top + (part.targetY / 100) * rect.height;

    const distance = Math.sqrt(
      Math.pow(dropX - targetAbsX, 2) + Math.pow(dropY - targetAbsY, 2),
    );
    const threshold = 80;

    return distance < threshold;
  };

  const handleDragEnd = (partId: string, x: number, y: number) => {
    const isCorrect = checkPlacement(partId, x, y);

    if (isCorrect) {
      const part = bodyParts.find((p) => p.id === partId);
      setPlacedParts(new Map(placedParts.set(partId, { x, y })));
      setShowFeedback({
        correct: true,
        text: `Гоё! ${part?.nameMn} зөв байрлалд!`,
      });
      playAudio("Маш сайн! Үргэлжлүүлээрэй!", 1.3);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        colors: [chapterColor, "#FFB800", "#58CC02"],
      });

      setTimeout(() => setShowFeedback(null), 2000);

      if (placedParts.size + 1 === bodyParts.length) {
        setShowCelebration(true);
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: [chapterColor, "#FFB800", "#58CC02", "#FF9600"],
        });

        setTimeout(() => {
          const points = Math.max(30, 100 - incorrectAttempts * 10);
          onComplete(points);
        }, 3000);
      }
    } else {
      setIncorrectAttempts(incorrectAttempts + 1);
      setShowFeedback({ correct: false, text: "Өөр газар оролд!" });
      playAudio("Дахин оролдоорой!", 1.0);
      setTimeout(() => setShowFeedback(null), 1500);
    }
  };

  const handleReset = () => {
    setPlacedParts(new Map());
    setIncorrectAttempts(0);
    setShowCelebration(false);
    setShowFeedback(null);
  };

  const completedCount = placedParts.size;
  const totalCount = bodyParts.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen pb-24 bg-linear-to-br from-slate-100 to-blue-100 overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b-2 border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={24} color="#1F2937" strokeWidth={2.5} />
              </motion.button>

              <div>
                <h2
                  className="font-bold text-lg"
                  style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                >
                  {chapterTitleMn} Тоглоом
                </h2>
                <p className="text-sm text-gray-600">{chapterTitle} Game</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  playAudio(
                    `${chapterTitleMn}-ны хэсгүүдийг зөв байрлалд байрлуулна уу!`,
                  )
                }
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl shadow-lg transition-all"
              >
                <Volume2 size={20} color="white" />
              </button>
              <button
                onClick={handleReset}
                className="p-3 bg-gray-500 hover:bg-gray-600 rounded-xl shadow-lg transition-all"
              >
                <RotateCcw size={20} color="white" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Явц: {completedCount}/{totalCount}
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: chapterColor }}
              >
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: chapterColor }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Parts Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl sticky top-32">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} color={chapterColor} />
                <h3
                  className="font-bold"
                  style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                >
                  Хэсгүүд
                </h3>
              </div>
              <div className="space-y-4">
                {bodyParts.map((part) => (
                  <DraggablePart
                    key={part.id}
                    part={part}
                    isPlaced={placedParts.has(part.id)}
                    onDragEnd={handleDragEnd}
                    color={chapterColor}
                  />
                ))}
              </div>

              {/* Score Display */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Алдаа:</span>
                  <span className="font-bold text-red-500">
                    {incorrectAttempts}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Оноо:</span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={incorrectAttempts <= i * 3 ? "#FFB800" : "none"}
                        color="#FFB800"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div
              ref={canvasRef}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{ aspectRatio: "4/3", minHeight: "500px" }}
            >
              {/* Background illustration */}
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="relative w-full h-full">
                  <div className="text-9xl opacity-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {backgroundImage}
                  </div>

                  {/* SVG body outline */}
                  <svg
                    viewBox="0 0 400 500"
                    className="w-full h-full opacity-20"
                  >
                    <ellipse
                      cx="200"
                      cy="80"
                      rx="60"
                      ry="70"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="4"
                    />
                    <line
                      x1="200"
                      y1="150"
                      x2="200"
                      y2="350"
                      stroke="#94a3b8"
                      strokeWidth="5"
                    />
                    <ellipse
                      cx="200"
                      cy="220"
                      rx="80"
                      ry="70"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="4"
                    />
                    <line
                      x1="140"
                      y1="180"
                      x2="60"
                      y2="280"
                      stroke="#94a3b8"
                      strokeWidth="4"
                    />
                    <line
                      x1="260"
                      y1="180"
                      x2="340"
                      y2="280"
                      stroke="#94a3b8"
                      strokeWidth="4"
                    />
                    <line
                      x1="180"
                      y1="350"
                      x2="160"
                      y2="480"
                      stroke="#94a3b8"
                      strokeWidth="4"
                    />
                    <line
                      x1="220"
                      y1="350"
                      x2="240"
                      y2="480"
                      stroke="#94a3b8"
                      strokeWidth="4"
                    />
                  </svg>

                  {/* Drop zones */}
                  {bodyParts.map((part) => {
                    const hexColor = chapterColor.startsWith("#")
                      ? chapterColor
                      : "#1CB0F6";

                    return (
                      <motion.div
                        key={`zone-${part.id}`}
                        className={`absolute rounded-full border-4 border-dashed flex items-center justify-center transition-all ${
                          placedParts.has(part.id)
                            ? "border-green-400 bg-green-100"
                            : "border-gray-300"
                        }`}
                        style={{
                          left: `${part.targetX}%`,
                          top: `${part.targetY}%`,
                          width: `${part.width}px`,
                          height: `${part.height}px`,
                          transform: `translate(-50%, -50%) rotate(${part.rotation}deg)`,
                          backgroundColor: placedParts.has(part.id)
                            ? "#dcfce7"
                            : "rgba(255, 255, 255, 0.5)",
                        }}
                        animate={
                          !placedParts.has(part.id)
                            ? {
                                scale: [1, 1.1, 1],
                              }
                            : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {placedParts.has(part.id) && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="text-5xl filter drop-shadow-lg"
                          >
                            {part.image}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Celebration Overlay */}
              {showCelebration && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-20"
                  style={{
                    background: `linear-gradient(135deg, ${chapterColor}ee, #22c55eee)`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center text-white">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                      }}
                      className="text-8xl mb-6"
                    >
                      🏆
                    </motion.div>
                    <h2
                      className="text-4xl font-bold mb-4"
                      style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                    >
                      Гайхалтай!
                    </h2>
                    <p className="text-xl mb-2">
                      Та бүх хэсгийг зөв байрлууллаа!
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: i * 0.2,
                            type: "spring",
                            stiffness: 300,
                          }}
                        >
                          <Star size={40} fill="#FFB800" color="#FFB800" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Feedback */}
      {showFeedback && (
        <motion.div
          className={`fixed top-28 right-6 px-6 py-4 rounded-2xl shadow-2xl border-3 ${
            showFeedback.correct
              ? "bg-green-500 border-green-600"
              : "bg-orange-500 border-orange-600"
          } text-white z-40`}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
        >
          <p
            className="font-bold"
            style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
          >
            {showFeedback.text}
          </p>
        </motion.div>
      )}
    </div>
  );
}
