import { useState } from "react";

export type TabType = "roadmap" | "game" | "more";
export type ViewType =
  | "main-roadmap"
  | "lesson-roadmap"
  | "lesson-content"
  | "game"
  | "more";

export interface AppState {
  activeTab: TabType;
  currentView: ViewType;
  selectedChapter: string | null;
  selectedLesson: string | null;
  userPoints: number;
  completedChapters: Set<string>;
  completedLessons: Map<string, Set<string>>;
  showMoreMenu: boolean;
}

const INITIAL_STATE: AppState = {
  activeTab: "roadmap",
  currentView: "main-roadmap",
  selectedChapter: null,
  selectedLesson: null,
  userPoints: 850,
  completedChapters: new Set(["teeth"]),
  completedLessons: new Map([["teeth", new Set(["teeth-1", "teeth-2"])]]),
  showMoreMenu: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const handleTabChange = (tab: TabType) => {
    if (tab === "more") {
      setState((s) => ({
        ...s,
        activeTab: tab,
        currentView: "more",
        showMoreMenu: true,
      }));
    } else if (tab === "roadmap") {
      setState((s) => ({
        ...s,
        activeTab: tab,
        currentView: "main-roadmap",
        showMoreMenu: false,
      }));
    } else if (tab === "game") {
      setState((s) => ({
        ...s,
        activeTab: tab,
        currentView: "game",
        showMoreMenu: false,
      }));
    } else {
      setState((s) => ({ ...s, activeTab: tab, showMoreMenu: false }));
    }
  };

  const handleChapterClick = (chapterId: string) =>
    setState((s) => ({
      ...s,
      selectedChapter: chapterId,
      currentView: "lesson-roadmap",
    }));

  const handleLessonClick = (lessonId: string) =>
    setState((s) => ({
      ...s,
      selectedLesson: lessonId,
      currentView: "lesson-content",
    }));

  const handleLessonComplete = (points: number) =>
    setState((s) => ({
      ...s,
      userPoints: s.userPoints + points,
      currentView: "lesson-roadmap",
      selectedLesson: null,
    }));

  const handleGameComplete = (points: number) =>
    setState((s) => ({
      ...s,
      userPoints: s.userPoints + points,
      currentView: "main-roadmap",
      activeTab: "roadmap",
    }));

  const handleBackToChapterRoadmap = () =>
    setState((s) => ({
      ...s,
      currentView: "lesson-roadmap",
      selectedLesson: null,
    }));

  const handleBackToMainRoadmap = () =>
    setState((s) => ({
      ...s,
      currentView: "main-roadmap",
      selectedChapter: null,
      selectedLesson: null,
    }));

  const handleCloseMoreMenu = () =>
    setState((s) => ({
      ...s,
      activeTab: "roadmap",
      currentView: "main-roadmap",
      showMoreMenu: false,
    }));

  return {
    state,
    handlers: {
      handleTabChange,
      handleChapterClick,
      handleLessonClick,
      handleLessonComplete,
      handleGameComplete,
      handleBackToChapterRoadmap,
      handleBackToMainRoadmap,
      handleCloseMoreMenu,
    },
  };
}
