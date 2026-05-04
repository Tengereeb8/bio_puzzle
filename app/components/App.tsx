"use client";

import { AnimatePresence } from "motion/react";
import { teethLessons } from "./data/ToothLessons";

import RoadmapScreen from "./RoadmapScreen";
import LessonRoadmapScreen from "./LessonRoadmapScreen";
import ImprovedMoreMenu from "./ImprovedMoreMenu";
import FooterNav from "./FooterNav";
import { useAppState } from "./hooks/useAppState";
import { BASE_LEADERBOARD, BASE_USER_PROFILE, chapters } from "./data/appData";
import GameView from "./GameView";
import QuizScreen from "../teeth-game/src/components/QuizScreen";
import { useState } from "react";
import { Question } from "./teeth-game/types";
import { useRouter } from "next/navigation";

const allQuestions: Question[] = teethLessons.map((lesson) => ({
  id: lesson.id,
  text: lesson.question,
  options: lesson.options,
  answer: lesson.correctAnswer,
  fact: lesson.explanation,
  visual: "🦷",
}));

export default function App() {
  const router = useRouter();
  const { state, handlers } = useAppState();

  const handleQuizComplete = (score: number) => {
    router.push("./teeth-game/result");
  };

  const {
    handleTabChange,
    handleChapterClick,
    handleLessonClick,
    handleBackToMainRoadmap,
    handleCloseMoreMenu,
  } = handlers;

  const selectedChapterData = chapters.find(
    (c) => c.id === state.selectedChapter,
  );

  const currentLessonData = teethLessons.find(
    (l) => l.id === state.selectedLesson,
  );

  const userProfile = {
    ...BASE_USER_PROFILE,
    totalPoints: state.userPoints,
  };

  const leaderboard = BASE_LEADERBOARD.map((entry) =>
    entry.isCurrentUser ? { ...entry, points: state.userPoints } : entry,
  );

  return (
    <div className="min-h-screen w-125 bg-gray-50 font-game">
      <AnimatePresence mode="wait">
        {state.currentView === "main-roadmap" && (
          <div key="main-roadmap">
            <RoadmapScreen
              chapters={chapters}
              onChapterClick={handleChapterClick}
            />
          </div>
        )}

        {state.currentView === "lesson-roadmap" && selectedChapterData && (
          <div key="lesson-roadmap">
            <LessonRoadmapScreen
              chapterTitle={selectedChapterData.title}
              chapterTitleMn={selectedChapterData.titleMn}
              chapterColor={selectedChapterData.color}
              chapterIconType={selectedChapterData.iconType}
              lessons={teethLessons}
              onLessonClick={handleLessonClick}
              onBack={handleBackToMainRoadmap}
            />
          </div>
        )}

        {state.currentView === "lesson-content" && currentLessonData && (
          <div className="p-4">
            <h1 className="text-center font-bold mb-4">
              {currentLessonData.titleMn}
            </h1>
            <QuizScreen
              key={currentLessonData.id}
              questions={allQuestions}
              onComplete={handleQuizComplete}
            />
          </div>
        )}
        {state.currentView === "game" && (
          <div key="game-view">
            <GameView />
          </div>
        )}

        {state.currentView === "more" && (
          <div key="more-menu">
            <ImprovedMoreMenu
              userProfile={userProfile}
              leaderboard={leaderboard}
              onClose={handleCloseMoreMenu}
            />
          </div>
        )}
      </AnimatePresence>

      <FooterNav activeTab={state.activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
