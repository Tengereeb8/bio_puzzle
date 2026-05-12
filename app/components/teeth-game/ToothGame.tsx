"use client";

import { useState, useCallback } from "react";
import type { GameMode, Screen } from "./types";
import { questions, labelParts, funFacts } from "./gameData";
import HomeScreen from "./HomeScreen";
import QuizScreen from "../QuizScreen";
import LabelScreen from "./LabelScreen";
import ResultScreen from "./ResultScreen";
import { postMiniGame } from "@/lib/progress-api";
import { requestCurriculumReload } from "@/lib/curriculum-reload";

type ToothGameProps = {
  getAuthToken?: () => string | null;
  onMiniGameSynced?: (
    payload: { user?: { totalPoints: number } } | null,
  ) => void | Promise<void>;
};

export default function ToothGame({
  getAuthToken,
  onMiniGameSynced,
}: ToothGameProps) {
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<GameMode>("quiz");
  const [result, setResult] = useState({ score: 0, total: 0 });
  const [funFact] = useState(
    () => funFacts[Math.floor(Math.random() * funFacts.length)],
  );
  const [labelKey, setLabelKey] = useState(0);

  const back = useCallback(() => setScreen("home"), []);

  const start = useCallback(
    () => setScreen(mode === "quiz" ? "quiz" : "label"),
    [mode],
  );

  const quizDone = useCallback(
    async (score: number) => {
      const tok = getAuthToken?.() ?? null;
      if (tok) {
        const json = await postMiniGame(tok, {
          gameKey: "tooth-quiz",
          correctCount: score,
          totalCount: questions.length,
        });
        await onMiniGameSynced?.(json);
        requestCurriculumReload();
      }
      setResult({ score, total: questions.length });
      setScreen("result");
    },
    [getAuthToken, onMiniGameSynced],
  );

  const labelDone = useCallback(
    async (correct: number, total: number) => {
      const tok = getAuthToken?.() ?? null;
      if (tok) {
        const json = await postMiniGame(tok, {
          gameKey: "tooth-label",
          correctCount: correct,
          totalCount: total,
        });
        await onMiniGameSynced?.(json);
        requestCurriculumReload();
      }
      setResult({ score: correct, total });
      setScreen("result");
    },
    [getAuthToken, onMiniGameSynced],
  );

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
        <QuizScreen questions={questions} onComplete={quizDone} onBack={back} />
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
