"use client";
import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { useState, useRef } from "react";
import { ArrowLeft, Trophy, RotateCcw, Volume2, Star, Sparkles, Award } from "lucide-react";
import confetti from "canvas-confetti";
import ToothSVG from "./ToothSVG";

interface BodyPart {
  id: string;
  type: "incisor" | "canine" | "premolar" | "molar";
  name: string;
  nameMn: string;
  targetX: number;
  targetY: number;
  targetWidth: number;
  targetHeight: number;
  rotation: number;
  info: string;
  infoMn: string;
}

function DraggableTooth({
  part,
  isPlaced,
  onDragEnd,
  color,
}: {
  part: BodyPart;
  isPlaced: boolean;
  onDragEnd: (id: string, x: number, y: number) => void;
  color: string;
}) {
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useTransform(() => (dragging ? 1.2 : 1));

  if (isPlaced) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => setDragging(true)}
      onDragEnd={(_, info: PanInfo) => {
        setDragging(false);
        onDragEnd(part.id, info.point.x, info.point.y);
      }}
      style={{ x, y, scale }}
      className="cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-4 shadow-2xl border-4 relative overflow-hidden"
        style={{ borderColor: color }}
        animate={!dragging ? { y: [0, -10, 0] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 opacity-20 blur-xl" style={{ backgroundColor: color }} />
        <div className="relative z-10 flex justify-center mb-2">
          <ToothSVG type={part.type} size={100} color={color} />
        </div>
        <p className="text-center font-game-bold text-base relative z-10 text-gray-800">{part.nameMn}</p>
        <p className="text-center text-xs text-gray-500 relative z-10">{part.name}</p>
      </motion.div>
    </motion.div>
  );
}

export default function AdvancedGameScreen({
  chapterTitle,
  chapterTitleMn,
  chapterColor,
  bodyParts,
  onComplete,
  onBack,
}: {
  chapterTitle: string;
  chapterTitleMn: string;
  chapterColor: string;
  bodyParts: BodyPart[];
  onComplete: (points: number) => void;
  onBack: () => void;
}) {
  const [placed, setPlaced] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [mistakes, setMistakes] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; mn: string; en: string } | null>(null);
  const [info, setInfo] = useState<BodyPart | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.8;
    u.lang = "mn-MN";
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("mn"));
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  };

  const checkDrop = (partId: string, dropX: number, dropY: number) => {
    if (!canvasRef.current) return false;
    const rect = canvasRef.current.getBoundingClientRect();
    const part = bodyParts.find((p) => p.id === partId)!;
    const tx = rect.left + (part.targetX / 100) * rect.width;
    const ty = rect.top + (part.targetY / 100) * rect.height;
    return Math.hypot(dropX - tx, dropY - ty) < 100;
  };

  const handleDrop = (partId: string, x: number, y: number) => {
    const part = bodyParts.find((p) => p.id === partId)!;
    if (checkDrop(partId, x, y)) {
      const next = new Map(placed.set(partId, { x, y }));
      setPlaced(next);
      setFeedback({ ok: true, mn: `Гоё! ${part.nameMn} зөв байрлалд!`, en: `Perfect! ${part.name} is in the right place!` });
      speak(`Маш сайн! ${part.nameMn} зөв байрласан байна.`);
      confetti({ particleCount: 100, spread: 70, origin: { x: x / window.innerWidth, y: y / window.innerHeight } });
      setTimeout(() => setFeedback(null), 2000);

      if (next.size === bodyParts.length) {
        setCelebrating(true);
        speak("Баяр хүргэе! Та бүх шүдийг зөв байрлууллаа!");
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
        setTimeout(() => onComplete(Math.max(30, 100 - mistakes * 5)), 3500);
      }
    } else {
      setMistakes((n) => n + 1);
      setFeedback({ ok: false, mn: "Өөр газар оролдоорой!", en: "Try a different spot!" });
      speak("Буруу байна. Дахин оролдоорой!");
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const reset = () => {
    setPlaced(new Map());
    setMistakes(0);
    setCelebrating(false);
    setFeedback(null);
    setInfo(null);
  };

  const done = placed.size;
  const total = bodyParts.length;
  const stars = mistakes <= 2 ? 3 : mistakes <= 5 ? 2 : 1;
  const points = Math.max(30, 100 - mistakes * 5);

  return (
    <div className="min-h-screen pb-24 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b-2 border-gray-200 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={24} color="#1F2937" strokeWidth={2.5} />
              </motion.button>
              <div>
                <h2 className="font-game-black text-xl">{chapterTitleMn} Тоглоом</h2>
                <p className="text-sm text-gray-600">{chapterTitle} Placement Game</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => speak(`${chapterTitleMn}-ын хэсгүүдийг зөв байрлалд байрлуулна уу.`)}
                className="p-3 bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg"
              >
                <Volume2 size={22} color="white" />
              </button>
              <button onClick={reset} className="p-3 bg-linear-to-r from-gray-500 to-gray-600 rounded-xl shadow-lg">
                <RotateCcw size={22} color="white" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Sparkles size={20} style={{ color: chapterColor }} />
                <span className="font-game-bold text-gray-800">Явц: {done}/{total}</span>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} size={22} fill={i < stars ? "#FFB800" : "none"} color={i < stars ? "#FFB800" : "#D1D5DB"} strokeWidth={2.5} />
                ))}
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full rounded-full shadow-lg"
                style={{ background: `linear-gradient(90deg, ${chapterColor}, #58CC02)` }}
                initial={{ width: 0 }}
                animate={{ width: `${(done / total) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl sticky top-32 border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: chapterColor }}>
                  <Award size={24} color="white" />
                </div>
                <h3 className="font-game-black text-lg">Шүдний хэсгүүд</h3>
              </div>

              <div className="space-y-4 mb-6">
                {bodyParts.map((part) => (
                  <DraggableTooth
                    key={part.id}
                    part={part}
                    isPlaced={placed.has(part.id)}
                    onDragEnd={handleDrop}
                    color={chapterColor}
                  />
                ))}
              </div>

              <div className="pt-6 border-t-2 border-gray-200 space-y-3">
                {[
                  { label: "Зөв:", value: done, cls: "text-green-600", bg: "from-green-50 to-emerald-50" },
                  { label: "Алдаа:", value: mistakes, cls: "text-red-600", bg: "from-red-50 to-rose-50" },
                  { label: "Оноо:", value: points, cls: "text-yellow-700", bg: "from-yellow-50 to-amber-50" },
                ].map(({ label, value, cls, bg }) => (
                  <div key={label} className={`flex items-center justify-between p-3 bg-linear-to-r ${bg} rounded-xl`}>
                    <span className="text-sm font-semibold text-gray-700 font-game">{label}</span>
                    <span className={`text-xl font-bold ${cls}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div
              ref={canvasRef}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4"
              style={{ aspectRatio: "4/3", minHeight: "600px", borderColor: chapterColor }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-pink-50 to-red-50 p-12">
                <svg viewBox="0 0 500 600" className="w-full h-full">
                  <path d="M 100 200 Q 250 150 400 200" stroke="#FFB6C1" strokeWidth="8" fill="none" opacity="0.3" />
                  <path d="M 100 400 Q 250 450 400 400" stroke="#FFB6C1" strokeWidth="8" fill="none" opacity="0.3" />
                  <ellipse cx="250" cy="190" rx="170" ry="25" fill="#FFB6C1" opacity="0.2" />
                  <ellipse cx="250" cy="410" rx="170" ry="25" fill="#FFB6C1" opacity="0.2" />
                </svg>

                {bodyParts.map((part) => {
                  const isPlaced = placed.has(part.id);
                  return (
                    <motion.div
                      key={`zone-${part.id}`}
                      className={`absolute flex items-center justify-center rounded-2xl border-4 border-dashed backdrop-blur-sm ${
                        isPlaced ? "bg-green-100/80 border-green-500" : "bg-blue-50/60 border-blue-300"
                      }`}
                      style={{
                        left: `${part.targetX}%`,
                        top: `${part.targetY}%`,
                        width: `${part.targetWidth}px`,
                        height: `${part.targetHeight}px`,
                        transform: `translate(-50%, -50%) rotate(${part.rotation}deg)`,
                      }}
                      animate={!isPlaced ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      onClick={() => !isPlaced && setInfo(part)}
                    >
                      {isPlaced ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="filter drop-shadow-xl"
                        >
                          <ToothSVG type={part.type} size={part.targetWidth * 0.8} color={chapterColor} />
                        </motion.div>
                      ) : (
                        <p className="text-xs font-game-bold text-gray-600 text-center p-2">{part.nameMn}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {celebrating && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-md"
                  style={{ background: `linear-gradient(135deg, ${chapterColor}f0, #22c55ef0)` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-9xl mb-8"
                  >
                    🏆
                  </motion.div>
                  <h2 className="text-5xl font-game-black mb-4 text-white">Гайхалтай!</h2>
                  <p className="text-2xl mb-6 text-white font-game">Та бүх шүдийг зөв байрлууллаа!</p>
                  <div className="flex items-center gap-3">
                    {[...Array(stars)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.2, type: "spring", stiffness: 300 }}
                      >
                        <Star size={56} fill="#FFB800" color="#FFB800" strokeWidth={3} />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xl mt-6 text-white font-game-bold">+{points} оноо</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <motion.div
          className={`fixed top-32 right-6 px-8 py-5 rounded-2xl shadow-2xl border-4 z-40 text-white max-w-sm ${
            feedback.ok ? "bg-linear-to-r from-green-400 to-emerald-500 border-green-600" : "bg-linear-to-r from-orange-400 to-red-500 border-orange-600"
          }`}
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <p className="font-game-bold text-xl mb-1">{feedback.mn}</p>
          <p className="text-sm opacity-90">{feedback.en}</p>
        </motion.div>
      )}

      {info && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setInfo(null)}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-md shadow-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <ToothSVG type={info.type} size={120} color={chapterColor} />
            </div>
            <h3 className="text-2xl font-game-black mb-3 text-center">{info.nameMn}</h3>
            <p className="text-center text-gray-600 mb-2">{info.name}</p>
            <p className="text-gray-700 leading-relaxed mb-4 font-game">{info.infoMn}</p>
            <button
              onClick={() => setInfo(null)}
              className="w-full py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-game-bold"
            >
              Ойлголоо
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
