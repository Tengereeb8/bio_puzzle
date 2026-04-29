import type { GameMode } from "./types";

export default function ResultScreen({
  score,
  total,
  mode,
  funFact,
  onPlayAgain,
}: {
  score: number;
  total: number;
  mode: GameMode;
  funFact: string;
  onPlayAgain: () => void;
}) {
  const pct = score / total;

  const { emoji, title, message } = pct === 1
    ? {
        emoji: "🏆",
        title: mode === "quiz" ? "PERFECT! Tooth Expert!" : "Perfect labelling!",
        message: mode === "quiz"
          ? "You got every question right. Your teeth are lucky to have such a smart owner!"
          : "You named every part of the tooth correctly! Amazing!",
      }
    : pct >= 0.75
      ? { emoji: "⭐", title: "Brilliant work!", message: "You really know your teeth! Keep brushing and learning!" }
      : pct >= 0.5
        ? { emoji: "😊", title: "Good effort!", message: "Nice job! Try playing again to beat your score!" }
        : { emoji: "🦷", title: "Keep learning!", message: "Every expert started as a beginner! Try again and learn something new each time." };

  return (
    <div className="text-center py-2">
      <div className="text-7xl mb-4">{emoji}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>

      <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl py-6 mb-5">
        <div className="text-5xl font-bold text-blue-500">{score}/{total}</div>
        <div className="text-yellow-500 text-2xl mt-1">{"⭐".repeat(score)}</div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4 text-sm text-gray-600 leading-relaxed text-left">
        <span className="font-semibold text-gray-800">Did you know? </span>
        {funFact}
      </div>

      <p className="text-gray-500 text-sm mb-6">{message}</p>

      <div className="flex flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-base rounded-2xl transition-colors touch-manipulation"
        >
          Play Again
        </button>
        <a
          href="https://www.nhs.uk/live-well/healthy-teeth-and-gums/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 border-2 border-gray-200 bg-white text-gray-700 font-medium text-base rounded-2xl transition-colors text-center touch-manipulation"
        >
          Learn More ↗
        </a>
      </div>
    </div>
  );
}
