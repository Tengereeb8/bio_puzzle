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
    const base = "border rounded-xl py-3 px-3 text-sm text-left transition-all w-full ";
    if (!answered) return base + "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer text-gray-800";
    if (i === q.answer) return base + "border-green-400 bg-green-50 text-green-800 font-medium cursor-default";
    if (i === selected) return base + "border-red-400 bg-red-50 text-red-800 cursor-default";
    return base + "border-gray-100 bg-white text-gray-300 cursor-default";
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Question {qIndex + 1} of {questions.length}</span>
        <span className="text-sm text-gray-500">⭐ {score}</span>
      </div>

      <div className="bg-gray-200 rounded-full h-2 mb-5 overflow-hidden">
        <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-4">
        <div className="text-center text-5xl mb-4">{q.visual}</div>
        <p className="text-base font-semibold text-gray-900 leading-relaxed">{q.text}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.options.map((opt, i) => (
          <button key={i} className={btnClass(i)} onClick={() => pick(i)} disabled={answered}>
            {opt}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-4 min-h-[56px] text-sm text-gray-600 leading-relaxed">
        {answered ? (
          <>
            {selected === q.answer ? "✅ Correct! " : `❌ The answer is "${q.options[q.answer]}". `}
            {q.fact}
          </>
        ) : "Choose your answer above!"}
      </div>

      <button
        onClick={next}
        disabled={!answered}
        className="w-full py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-800 bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLast ? "See Results 🎉" : "Next →"}
      </button>
    </div>
  );
}
