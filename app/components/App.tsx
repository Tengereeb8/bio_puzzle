
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

export default function App() {
  const { state, handlers } = useAppState();
  const {
    handleTabChange,
    handleChapterClick,
    handleLessonClick,
    handleLessonComplete,
    handleBackToChapterRoadmap,
    handleBackToMainRoadmap,
    handleCloseMoreMenu,
  } = handlers;

  const selectedChapterData = chapters.find(
    (c) => c.id === state.selectedChapter,
  );

  const currentLessonData = teethLessons.find(
    (l) => l.id === state.selectedLesson
  );

  const userProfile = {
    ...BASE_USER_PROFILE,
    totalPoints: state.userPoints,
  };

  const leaderboard = BASE_LEADERBOARD.map((entry) =>
    entry.isCurrentUser ? { ...entry, points: state.userPoints } : entry,
  );

  return (
    <div className="min-h-screen bg-gray-50 font-game">
      <AnimatePresence mode="wait">
        {/* ... other views remain the same ... */}
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

        {/* 3. Replaced LessonsScreen with QuizScreen */}
        {state.currentView === "lesson-content" && currentLessonData && (
          <div key={`quiz-${state.selectedLesson}`} className="max-w-md mx-auto p-4">
            <QuizScreen
              // We wrap the single lesson's question data into an array 
              // and rename the properties to match what QuizScreen wants.
              questions={[
                {
                  id: currentLessonData.id,
                  text: currentLessonData.question,      // Map 'question' to 'text'
                  options: currentLessonData.options,
                  answer: currentLessonData.correctAnswer, // Map 'correctAnswer' to 'answer'
                  fact: currentLessonData.explanation,    // Map 'explanation' to 'fact'
                  visual: "🦷", // You can use a default or logic to pick an emoji
                },
              ]}
              onComplete={(score) => {
                handleLessonComplete(score);
              }}
            />

            {/* Helpful Back Button */}
            <button
              onClick={handleBackToChapterRoadmap}
              className="mt-6 text-gray-400 text-sm w-full text-center hover:text-gray-600 transition-colors"
            >
              ← Буцах (Back)
            </button>
          </div>
        )}
        {state.currentView === "game" && (
          <div key="game-view" >
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