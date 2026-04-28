"use client";

import type { GameMode } from "@/types";

interface ResultScreenProps {
  score: number;
  total: number;
  mode: GameMode;
  funFact: string;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  score,
  total,
  mode,
  funFact,
  onPlayAgain,
}: ResultScreenProps) {
  const pct = score / total;

  let emoji: string;
  let title: string;
  let message: string;

  if (pct === 1) {
    emoji = "🏆";
    title = mode === "quiz" ? "PERFECT! You're a Tooth Expert!" : "Perfect labelling!";
    message =
      mode === "quiz"
        ? "Incredible! You got every question right. Your teeth are lucky to have such a smart owner!"
        : "You named every part of the tooth correctly! Amazing!";
  } else if (pct >= 0.75) {
    emoji = "⭐";
    title = "Brilliant work!";
    message = "You really know your teeth! Keep brushing and learning!";
  } else if (pct >= 0.5) {
    emoji = "😊";
    title = "Good effort!";
    message = "Nice job! Try playing again to beat your score!";
  } else {
    emoji = "🦷";
    title = "Keep learning!";
    message =
      "Every expert started as a beginner! Try again and learn something new each time.";
  }

  return (
    <div className="text-center py-4">
      <div className="text-6xl mb-3">{emoji}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <div className="text-4xl font-bold text-blue-500 mb-2">
        {score}/{total} ⭐
      </div>

      {/* Fun fact */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4 text-sm text-gray-600 leading-relaxed text-left">
        <span className="font-semibold text-gray-800">Did you know? </span>
        {funFact}
      </div>

      <p className="text-gray-500 text-sm mb-6">{message}</p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onPlayAgain}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Play Again
        </button>
        <a
          href="https://www.nhs.uk/live-well/healthy-teeth-and-gums/"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors text-sm flex items-center gap-1"
        >
          Learn More ↗
        </a>
      </div>
    </div>
  );
}
