"use client";

import type { GameMode } from "@/types";

interface HomeScreenProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStart: () => void;
}

export default function HomeScreen({
  selectedMode,
  onSelectMode,
  onStart,
}: HomeScreenProps) {
  return (
    <div className="text-center py-2">
      <div className="text-4xl mb-2">🦷</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tooth Explorer!</h1>
      <p className="text-gray-500 mb-8 text-base">Learn all about your amazing teeth</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Quiz Mode */}
        <button
          onClick={() => onSelectMode("quiz")}
          className={`rounded-2xl border-2 p-6 text-center cursor-pointer transition-all hover:-translate-y-1 ${
            selectedMode === "quiz"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-400"
          }`}
        >
          <div className="text-4xl mb-3">🧠</div>
          <div className="font-semibold text-gray-900 text-base">Teeth Quiz</div>
          <div className="text-sm text-gray-500 mt-1">Answer fun questions about teeth</div>
        </button>

        {/* Label Mode */}
        <button
          onClick={() => onSelectMode("label")}
          className={`rounded-2xl border-2 p-6 text-center cursor-pointer transition-all hover:-translate-y-1 ${
            selectedMode === "label"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-400"
          }`}
        >
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-semibold text-gray-900 text-base">Label a Tooth</div>
          <div className="text-sm text-gray-500 mt-1">Match the parts to their names</div>
        </button>
      </div>

      <button
        onClick={onStart}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg px-10 py-3 rounded-xl transition-colors"
      >
        Let&apos;s Go! ▶
      </button>
    </div>
  );
}
