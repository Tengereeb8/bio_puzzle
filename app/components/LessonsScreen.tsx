import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, Volume2, ArrowRight, Trophy, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface Lesson {
  id: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  audioText: string;
}

interface LessonsScreenProps {
  chapterTitle: string;
  lessons: Lesson[];
  onComplete: (points: number) => void;
  onExit: () => void;
}

export default function LessonsScreen({
  chapterTitle,
  lessons,
  onComplete,
  onExit,
}: LessonsScreenProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);

  const currentLesson = lessons[currentLessonIndex];
  const isCorrect = selectedAnswer === currentLesson.correctAnswer;
  const progress = ((currentLessonIndex + 1) / lessons.length) * 100;

  const playAudio = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.lang = "mn-MN";
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);

    const correct = index === currentLesson.correctAnswer;
    if (correct) {
      setCorrectCount((n) => n + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#58CC02", "#FFB800", "#1CB0F6"],
      });
      playAudio("Зөв! Маш сайн!");
    } else {
      setHearts((h) => Math.max(0, h - 1));
      playAudio("Буруу. Дахин оролдоорой.");
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex((n) => n + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete(correctCount * 10);
    }
  };

  const isLast = currentLessonIndex === lessons.length - 1;

  return (
    <div className="min-h-screen pb-24 bg-linear-to-br from-blue-50 to-purple-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b-2 border-gray-200 z-10 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} color="#6B7280" strokeWidth={2.5} />
          </button>

          <div className="flex-1 mx-4">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  i < hearts ? "bg-red-500" : "bg-gray-200"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Heart
                  size={18}
                  fill={i < hearts ? "white" : "none"}
                  color={i < hearts ? "white" : "#9CA3AF"}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="flex-1 text-xl font-game-bold">{currentLesson.question}</h2>
            <button
              onClick={() => playAudio(currentLesson.audioText)}
              className="ml-4 p-4 bg-linear-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl shadow-lg transition-all"
            >
              <Volume2 size={22} color="white" />
            </button>
          </div>

          {currentLesson.image && (
            <motion.div
              className="bg-linear-to-br from-blue-100 to-purple-100 rounded-3xl p-12 mb-6 flex items-center justify-center shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-9xl filter drop-shadow-2xl">{currentLesson.image}</div>
            </motion.div>
          )}
        </div>

        {/* Answer options */}
        <div className="space-y-4">
          {currentLesson.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentLesson.correctAnswer;
            const showCorrect = showFeedback && isCorrectAnswer;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`w-full p-5 rounded-2xl border-3 text-left transition-all shadow-lg ${
                  showCorrect
                    ? "bg-green-100 border-green-500 shadow-green-200"
                    : showIncorrect
                      ? "bg-red-100 border-red-500 shadow-red-200"
                      : isSelected
                        ? "bg-blue-100 border-blue-500 shadow-blue-200"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl"
                }`}
                whileHover={!showFeedback ? { scale: 1.02, y: -2 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span
                  className={`text-lg font-game-bold ${
                    showCorrect
                      ? "text-green-700"
                      : showIncorrect
                        ? "text-red-700"
                        : "text-gray-800"
                  }`}
                >
                  {option}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Feedback drawer */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className={`fixed bottom-20 left-0 right-0 border-t-4 shadow-2xl ${
              isCorrect
                ? "bg-linear-to-r from-green-400 to-emerald-500 border-green-600"
                : "bg-linear-to-r from-red-400 to-rose-500 border-red-600"
            }`}
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          >
            <div className="max-w-2xl mx-auto p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 text-white">
                  <h3 className="text-2xl mb-3 font-game-black">
                    {isCorrect ? "Гайхалтай! 🎉" : "Буруу байна!"}
                  </h3>
                  <p className="text-lg leading-relaxed font-game">
                    {currentLesson.explanation}
                  </p>
                </div>

                <motion.button
                  onClick={handleNext}
                  className={`px-8 py-4 text-white rounded-2xl shadow-2xl flex items-center gap-3 ${
                    isCorrect
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg font-game-bold">
                    {isLast ? "Дуусгах" : "Дараах"}
                  </span>
                  {isLast ? (
                    <Trophy size={24} />
                  ) : (
                    <ArrowRight size={24} strokeWidth={3} />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
