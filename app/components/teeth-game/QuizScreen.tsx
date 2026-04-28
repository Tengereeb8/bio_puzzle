"use client";

import { useState, useRef } from "react";
import type { Question } from "./types";

export default function QuizScreen({
  questions,
  onComplete,
}: {
  questions: Question[];
  onComplete: (score: number) => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const scoreRef = useRef(0);

  const q = questions[qIndex];
  const progress = (qIndex / questions.length) * 100;
  const isLast = qIndex + 1 >= questions.length;

  function pick(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.answer) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
  }

  function next() {
    const nextIdx = qIndex + 1;
    if (nextIdx >= questions.length) {
      onComplete(scoreRef.current);
    } else {
      setQIndex(nextIdx);
      setSelected(null);
      setAnswered(false);
    }
  }

  function btnClass(i: number) {
    const base = "border-2 rounded-2xl py-4 px-4 text-sm text-left transition-all w-full font-medium touch-manipulation active:scale-95 ";
    if (!answered) return base + "border-gray-200 bg-white text-gray-800";
    if (i === q.answer) return base + "border-green-400 bg-green-50 text-green-800";
    if (i === selected) return base + "border-red-400 bg-red-50 text-red-800";
    return base + "border-gray-100 bg-white text-gray-300";
  }

  return (
    <div>
      {/* Progress row */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500 font-medium">{qIndex + 1} / {questions.length}</span>
        <span className="text-sm font-bold text-yellow-500">⭐ {score}</span>
      </div>

      <div className="bg-gray-200 rounded-full h-2.5 mb-5 overflow-hidden">
        <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Question card */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-5 mb-5">
        <div className="text-center text-6xl mb-4">{q.visual}</div>
        <p className="text-base font-semibold text-gray-900 leading-relaxed text-center">{q.text}</p>
      </div>

      {/* Options — single column on mobile */}
      <div className="flex flex-col gap-3 mb-4">
        {q.options.map((opt, i) => (
          <button key={i} className={btnClass(i)} onClick={() => pick(i)} disabled={answered}>
            <span className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full border-2 shrink-0 flex items-center justify-center text-xs font-bold ${
                !answered ? "border-gray-300 text-gray-500"
                : i === q.answer ? "border-green-500 bg-green-500 text-white"
                : i === selected ? "border-red-400 bg-red-400 text-white"
                : "border-gray-200 text-gray-300"
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </span>
          </button>
        ))}
      </div>

      {/* Fact box */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mb-5 min-h-[56px] text-sm text-gray-600 leading-relaxed">
        {answered ? (
          <>
            {selected === q.answer ? "✅ Correct! " : `❌ Answer: "${q.options[q.answer]}". `}
            {q.fact}
          </>
        ) : (
          <span className="text-gray-400">Choose your answer above!</span>
        )}
      </div>

      <button
        onClick={next}
        disabled={!answered}
        className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-base rounded-2xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
      >
        {isLast ? "See Results 🎉" : "Next →"}
      </button>
    </div>
  );
}
