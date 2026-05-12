"use client";

import { useState, useRef } from "react";
import type { Question } from "./teeth-game/types";
import { Heart } from "lucide-react";

export default function QuizScreen({
  questions,
  onComplete,
  onBack,
}: {
  questions: Question[];
  onComplete: (score: number) => void;
  onBack: () => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);

  const q = questions[qIndex];
  const progress = (qIndex / questions.length) * 100;

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

  function pick(i: number) {
    if (answered || gameOver) return;

    setSelected(i);
    setAnswered(true);

    if (i === q.answer) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setTimeout(() => next(), 1500);
    } else {
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      if (nextHearts <= 0) {
        setGameOver(true);
      } else {
        setTimeout(() => {
          setSelected(null);
          setAnswered(false);
        }, 1500);
      }
    }
  }

  function btnClass(i: number) {
    const base =
      "relative border-2 rounded-2xl py-4 px-4 text-sm text-left transition-all w-full font-bold touch-manipulation shadow-sm ";
    if (!answered)
      return (
        base +
        "border-gray-200 bg-white text-gray-700 hover:border-blue-400 active:scale-95"
      );
    if (i === q.answer)
      return (
        base + "border-green-500 bg-green-50 text-green-700 scale-[1.02] z-10"
      );
    if (i === selected) return base + "border-red-500 bg-red-50 text-red-700";
    return base + "border-gray-100 bg-white text-gray-300 opacity-50";
  }

  return (
    <div className="font-game-black max-w-md mx-auto ">
      {/* Header */}
      <div className="flex justify-between items-end mb-3 px-1">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
            явц
          </span>
          <span className="text-sm text-gray-700 font-bold">
            {qIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Hearts */}
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              size={22}
              color="#ef4444"
              fill={i < hearts ? "#ef4444" : "none"}
              strokeWidth={2}
              className={`transition-all duration-300 ${i >= hearts ? "opacity-30 scale-90" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-100 rounded-full h-3 mb-8 p-1 shadow-inner">
        <div
          className="bg-linear-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="relative bg-white border-2 border-gray-100 rounded-[2rem] p-6 mb-6 shadow-xl shadow-blue-900/5 overflow-hidden">
        <div className="text-center text-6xl mb-4 drop-shadow-sm">
          {q.visual}
        </div>
        <h2 className="text-xl font-black text-gray-800 leading-tight text-center">
          {q.text}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4 mb-8">
        {q.options.map((opt, i) => (
          <button
            key={i}
            className={btnClass(i)}
            onClick={() => pick(i)}
            disabled={answered && i !== q.answer}
          >
            <span className="flex items-center gap-4">
              <span
                className={`w-8 h-8 rounded-xl border-2 shrink-0 flex items-center justify-center text-sm font-black transition-colors ${
                  !answered
                    ? "border-gray-200 text-gray-400"
                    : i === q.answer
                      ? "border-green-500 bg-green-500 text-white"
                      : i === selected
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-gray-100 text-gray-200"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </span>
          </button>
        ))}
      </div>

      {/* Feedback banner */}
      <div
        className={`transition-all duration-500 transform ${answered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div
          className={`rounded-3xl p-5 border-b-4 ${
            selected === q.answer
              ? "bg-green-100 border-green-200 text-green-800"
              : "bg-red-100 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-black">
              {selected === q.answer ? "Awesome!" : "Not quite!"}
            </span>
          </div>
          <p className="text-sm font-medium leading-snug opacity-90">
            {q.fact}
          </p>
        </div>
      </div>

      {/* Game over modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-xs mx-4 shadow-2xl">
            <div className="text-5xl mb-4">💔</div>
            <h2 className="text-xl font-black mb-2">Оролдлого дууслаа!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Зүрхний цохилт дуусав. Дахин сурч, хичээлдээ буцаарай.
            </p>
            <button
              onClick={onBack}
              className="w-full bg-indigo-500 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2"
            >
              ← Буцах
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
