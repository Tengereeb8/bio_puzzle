"use client";

import { AnimatePresence } from "motion/react";
import { teethLessons } from "./data/ToothLessons";

import RoadmapScreen from "./RoadmapScreen";
import LessonRoadmapScreen from "./LessonRoadmapScreen";
import LessonsScreen from "./LessonsScreen";
import ImprovedMoreMenu from "./ImprovedMoreMenu";
import FooterNav from "./FooterNav";
import { useAppState } from "./hooks/useAppState";
import { BASE_LEADERBOARD, BASE_USER_PROFILE, chapters } from "./data/appData";
import GameView from "./GameView";

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

        {state.currentView === "lesson-content" && state.selectedLesson && (
          <div key={`lesson-${state.selectedLesson}`}>
            <LessonsScreen
              chapterTitle={selectedChapterData?.title ?? "Teeth"}
              lessons={teethLessons.filter(
                (l) => l.id === state.selectedLesson,
              )}
              onComplete={handleLessonComplete}
              onExit={handleBackToChapterRoadmap}
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
