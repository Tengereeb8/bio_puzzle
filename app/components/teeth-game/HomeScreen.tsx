import type { GameMode } from "./types";

export default function HomeScreen({
  selectedMode,
  onSelectMode,
  onStart,
}: {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStart: () => void;
}) {
  return (
    <div className="text-center py-2">
      <div className="text-6xl mb-4">🦷</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tooth Explorer!</h1>
      <p className="text-gray-500 mb-8 text-sm">Learn all about your amazing teeth</p>

      <div className="flex flex-col gap-4 mb-8">
        <button
          onClick={() => onSelectMode("quiz")}
          className={`rounded-2xl border-2 p-5 text-left transition-all active:scale-95 touch-manipulation flex items-center gap-4 ${
            selectedMode === "quiz"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="text-4xl flex-shrink-0">🧠</div>
          <div>
            <div className="font-bold text-gray-900 text-base">Teeth Quiz</div>
            <div className="text-sm text-gray-500 mt-0.5">8 multiple-choice questions</div>
          </div>
          {selectedMode === "quiz" && <span className="ml-auto text-blue-500 text-xl">✓</span>}
        </button>

        <button
          onClick={() => onSelectMode("label")}
          className={`rounded-2xl border-2 p-5 text-left transition-all active:scale-95 touch-manipulation flex items-center gap-4 ${
            selectedMode === "label"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="text-4xl flex-shrink-0">🔍</div>
          <div>
            <div className="font-bold text-gray-900 text-base">Label a Tooth</div>
            <div className="text-sm text-gray-500 mt-0.5">Match parts to their names</div>
          </div>
          {selectedMode === "label" && <span className="ml-auto text-blue-500 text-xl">✓</span>}
        </button>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-lg py-4 rounded-2xl transition-colors touch-manipulation"
      >
        Let&apos;s Go! ▶
      </button>
    </div>
  );
}
