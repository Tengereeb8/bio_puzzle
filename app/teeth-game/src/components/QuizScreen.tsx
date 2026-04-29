"use client";

import { useState, useRef } from "react";
import type { Question } from "@/types";

interface QuizScreenProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function QuizScreen({ questions, onComplete }: QuizScreenProps) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const scoreRef = useRef(0);

  const question = questions[qIndex];
  const progress = (qIndex / questions.length) * 100;
  const isLast = qIndex + 1 >= questions.length;

  function handleAnswer(i: number) {
    if (answered) return;
    setSelectedAnswer(i);
    setAnswered(true);
    if (i === question.answer) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
  }

  function handleNext() {
    const nextIndex = qIndex + 1;
    if (nextIndex >= questions.length) {
      onComplete(scoreRef.current);
    } else {
      setQIndex(nextIndex);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  }

  function getButtonClass(i: number): string {
    const base =
      "border rounded-xl py-3 px-3 text-sm text-left transition-all w-full ";
    if (!answered) {
      return base + "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer text-gray-800";
    }
    if (i === question.answer) {
      return base + "border-green-400 bg-green-50 text-green-800 font-medium cursor-default";
    }
    if (i === selectedAnswer) {
      return base + "border-red-400 bg-red-50 text-red-800 cursor-default";
    }
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
        <div className="text-center text-5xl mb-4">{question.visual}</div>
        <p className="text-base font-semibold text-gray-900 leading-relaxed">{question.text}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {question.options.map((opt, i) => (
          <button key={i} className={getButtonClass(i)} onClick={() => handleAnswer(i)} disabled={answered}>
            {opt}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-4 min-h-[56px] text-sm text-gray-600 leading-relaxed">
        {answered ? (
          <>
            {selectedAnswer === question.answer
              ? "✅ Correct! "
              : `❌ The answer is "${question.options[question.answer]}". `}
            {question.fact}
          </>
        ) : (
          "Choose your answer above!"
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={!answered}
        className="w-full py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-800 bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLast ? "See Results 🎉" : "Next →"}
      </button>
    </div>
  );
}
