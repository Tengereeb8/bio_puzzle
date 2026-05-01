"use client";

import { useState, useCallback } from "react";
import type { GameMode, Screen } from "./types";
import { questions, labelParts, funFacts } from "./gameData";
import HomeScreen from "./HomeScreen";
import QuizScreen from "./QuizScreen";
import LabelScreen from "./LabelScreen";
import ResultScreen from "./result/page";

export default function ToothGame() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<GameMode>("quiz");
  const [result, setResult] = useState({ score: 0, total: 0 });
  const [funFact] = useState(
    () => funFacts[Math.floor(Math.random() * funFacts.length)],
  );
  const [labelKey, setLabelKey] = useState(0);

  const start = useCallback(
    () => setScreen(mode === "quiz" ? "quiz" : "label"),
    [mode],
  );

  const quizDone = useCallback((score: number) => {
    setResult({ score, total: questions.length });
    setScreen("result");
  }, []);

  const labelDone = useCallback((correct: number, total: number) => {
    setResult({ score: correct, total });
    setScreen("result");
  }, []);

  const replay = useCallback(() => {
    setLabelKey((k) => k + 1);
    setScreen("home");
  }, []);

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6">
      {screen === "home" && (
        <HomeScreen
          selectedMode={mode}
          onSelectMode={setMode}
          onStart={start}
        />
      )}
      {screen === "quiz" && (
        <QuizScreen questions={questions} onComplete={quizDone} />
      )}
      {screen === "label" && (
        <LabelScreen key={labelKey} parts={labelParts} onComplete={labelDone} />
      )}
      {screen === "result" && (
        <ResultScreen
          score={result.score}
          total={result.total}
          mode={mode}
          funFact={funFact}
          onPlayAgain={replay}
        />
      )}
    </div>
  );
}
