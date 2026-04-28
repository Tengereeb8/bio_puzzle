"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import LessonsScreen from "./LessonsScreen";
import AdvancedGameScreen from "./AdvancedGameScreen";
import ImprovedMoreMenu from "./ImprovedMoreMenu";
import LessonRoadmapScreen from "./LessonRoadmapScreen";
import RoadmapScreen from "./RoadmapScreen";
import FooterNav from "./FooterNav";
import ToothGame from "./teeth-game/ToothGame";
import { teethLessons } from "./data/ToothLessons";

type TabType = "roadmap" | "game" | "more";
type ViewType =
  | "main-roadmap"
  | "lesson-roadmap"
  | "lesson-content"
  | "game"
  | "more";

interface AppState {
  activeTab: TabType;
  currentView: ViewType;
  selectedChapter: string | null;
  selectedLesson: string | null;
  userPoints: number;
  completedChapters: Set<string>;
  completedLessons: Map<string, Set<string>>;
  showMoreMenu: boolean;
}

const teethGameParts = [
  {
    id: "incisor-1",
    type: "incisor" as const,
    name: "Central Incisor",
    nameMn: "Төв хадаас",
    targetX: 48,
    targetY: 35,
    targetWidth: 80,
    targetHeight: 100,
    rotation: -5,
    info: "Central incisors are the front teeth used for cutting food",
    infoMn: "Төв хадаас нь урд талын шүд бөгөөд хоол зүсэхэд ашигладаг",
  },
  {
    id: "incisor-2",
    type: "incisor" as const,
    name: "Lateral Incisor",
    nameMn: "Хажуугийн хадаас",
    targetX: 62,
    targetY: 38,
    targetWidth: 75,
    targetHeight: 95,
    rotation: 5,
    info: "Lateral incisors help cut and tear food alongside central incisors",
    infoMn:
      "Хажуугийн хадаас нь төв хадаастай хамт хоол зүсэх, таслахад тусалдаг",
  },
  {
    id: "canine",
    type: "canine" as const,
    name: "Canine",
    nameMn: "Соёо шүд",
    targetX: 75,
    targetY: 42,
    targetWidth: 70,
    targetHeight: 110,
    rotation: 10,
    info: "Canines are pointed teeth used for tearing and gripping food",
    infoMn: "Соёо шүд нь хурц шүд бөгөөд хоол урах, барихад ашигладаг",
  },
  {
    id: "premolar",
    type: "premolar" as const,
    name: "Premolar",
    nameMn: "Өмнөх арааны шүд",
    targetX: 25,
    targetY: 42,
    targetWidth: 85,
    targetHeight: 105,
    rotation: -10,
    info: "Premolars crush and grind food into smaller pieces",
    infoMn: "Өмнөх арааны шүд нь хоолыг бутлаж, жижиг хэсэг болгодог",
  },
  {
    id: "molar-1",
    type: "molar" as const,
    name: "First Molar",
    nameMn: "Нэгдүгээр арааны шүд",
    targetX: 15,
    targetY: 48,
    targetWidth: 95,
    targetHeight: 110,
    rotation: -15,
    info: "First molars are large grinding teeth at the back of your mouth",
    infoMn:
      "Нэгдүгээр арааны шүд нь амны хойд хэсэгт байрлах том нунтаглагч шүд",
  },
  {
    id: "molar-2",
    type: "molar" as const,
    name: "Second Molar",
    nameMn: "Хоёрдугаар арааны шүд",
    targetX: 85,
    targetY: 48,
    targetWidth: 95,
    targetHeight: 110,
    rotation: 15,
    info: "Second molars help grind food thoroughly before swallowing",
    infoMn:
      "Хоёрдугаар арааны шүд нь хоолыг залгихын өмнө сайтар нунтаглахад тусалдаг",
  },
];

// Removed old duplicate lesson data - now using imported teethLessons from data/teethLessons.ts

export default function App() {
  const [state, setState] = useState<AppState>({
    activeTab: "roadmap",
    currentView: "main-roadmap",
    selectedChapter: null,
    selectedLesson: null,
    userPoints: 850,
    completedChapters: new Set(["teeth"]),
    completedLessons: new Map([["teeth", new Set(["teeth-1", "teeth-2"])]]),
    showMoreMenu: false,
  });

  const chapters = [
    {
      id: "teeth",
      title: "Teeth",
      titleMn: "Шүд",
      iconType: "molar" as const,
      color: "#FFB800",
      isUnlocked: true,
      isCompleted: false,
      progress: 20,
      totalLessons: 15,
      completedLessons: 3,
    },
    {
      id: "heart",
      title: "Heart",
      titleMn: "Зүрх",
      iconType: "heart" as const,
      color: "#FF4B4B",
      isUnlocked: true,
      isCompleted: false,
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
    },
    {
      id: "muscles",
      title: "Muscles",
      titleMn: "Булчин",
      iconType: "muscles" as const,
      color: "#CE82FF",
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      totalLessons: 8,
      completedLessons: 0,
    },
    {
      id: "digestion",
      title: "Digestion",
      titleMn: "Хоол боловсруулах",
      iconType: "stomach" as const,
      color: "#1CB0F6",
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      totalLessons: 12,
      completedLessons: 0,
    },
    {
      id: "brain",
      title: "Brain",
      titleMn: "Тархи",
      iconType: "brain" as const,
      color: "#FF9600",
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      totalLessons: 14,
      completedLessons: 0,
    },
    {
      id: "bones",
      title: "Bones",
      titleMn: "Яс",
      iconType: "bones" as const,
      color: "#94A3B8",
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
    },
    {
      id: "lungs",
      title: "Lungs",
      titleMn: "Уушиг",
      iconType: "lungs" as const,
      color: "#00CD9C",
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      totalLessons: 9,
      completedLessons: 0,
    },
    {
      id: "blood",
      title: "Blood",
      titleMn: "Цус",
      iconType: "blood" as const,
      color: "#DC2626",
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      totalLessons: 8,
      completedLessons: 0,
    },
  ];

  const userProfile = {
    name: "Junior Doctor",
    nameMn: "Бяцхан эмч",
    avatar: "👨‍⚕️",
    level: 5,
    totalPoints: state.userPoints,
    streak: 7,
    rank: 4,
    totalUsers: 1247,
    badges: [
      {
        id: "first-lesson",
        name: "First Steps",
        nameMn: "Эхний алхам",
        icon: "📚",
        description: "Complete first lesson",
        descriptionMn: "Эхний хичээлийг дуусгах",
        unlocked: true,
      },
      {
        id: "perfect-score",
        name: "Perfect Score",
        nameMn: "Төгс оноо",
        icon: "⭐",
        description: "Get 100% on quiz",
        descriptionMn: "Асуултад 100% авах",
        unlocked: true,
      },
      {
        id: "week-streak",
        name: "On Fire",
        nameMn: "Галт хүн",
        icon: "🔥",
        description: "7 day streak",
        descriptionMn: "7 өдрийн дараалал",
        unlocked: true,
      },
      {
        id: "game-master",
        name: "Game Master",
        nameMn: "Тоглоомын мастер",
        icon: "🎮",
        description: "Complete 10 games",
        descriptionMn: "10 тоглоом дуусгах",
        unlocked: false,
        progress: 6,
        maxProgress: 10,
      },
      {
        id: "tooth-expert",
        name: "Tooth Expert",
        nameMn: "Шүдний мэргэжилтэн",
        icon: "🦷",
        description: "Master teeth chapter",
        descriptionMn: "Шүдний бүлэг дуусгах",
        unlocked: false,
        progress: 2,
        maxProgress: 5,
      },
      {
        id: "body-pro",
        name: "Body Expert",
        nameMn: "Биеийн мэргэжилтэн",
        icon: "🏆",
        description: "Complete all chapters",
        descriptionMn: "Бүх бүлэг дуусгах",
        unlocked: false,
        progress: 1,
        maxProgress: 8,
      },
    ],
  };

  const leaderboard = [
    {
      rank: 1,
      name: "Dr. Emma",
      nameMn: "Эмч Эмма",
      avatar: "👩‍⚕️",
      points: 2450,
      level: 12,
      streak: 28,
      isCurrentUser: false,
      trend: "up" as const,
    },
    {
      rank: 2,
      name: "Dr. Alex",
      nameMn: "Эмч Алекс",
      avatar: "👨‍⚕️",
      points: 2180,
      level: 11,
      streak: 15,
      isCurrentUser: false,
      trend: "same" as const,
    },
    {
      rank: 3,
      name: "Dr. Sam",
      nameMn: "Эмч Сэм",
      avatar: "👨‍⚕️",
      points: 1920,
      level: 10,
      streak: 22,
      isCurrentUser: false,
      trend: "down" as const,
    },
    {
      rank: 4,
      name: "Junior Doctor",
      nameMn: "Бяцхан эмч",
      avatar: "👨‍⚕️",
      points: state.userPoints,
      level: 5,
      streak: 7,
      isCurrentUser: true,
      trend: "up" as const,
    },
    {
      rank: 5,
      name: "Dr. Maya",
      nameMn: "Эмч Маяа",
      avatar: "👩‍⚕️",
      points: 780,
      level: 4,
      streak: 12,
      isCurrentUser: false,
      trend: "up" as const,
    },
    {
      rank: 6,
      name: "Dr. Leo",
      nameMn: "Эмч Лео",
      avatar: "👨‍⚕️",
      points: 650,
      level: 4,
      streak: 5,
      isCurrentUser: false,
      trend: "same" as const,
    },
    {
      rank: 7,
      name: "Dr. Zoe",
      nameMn: "Эмч Зоэ",
      avatar: "👩‍⚕️",
      points: 520,
      level: 3,
      streak: 9,
      isCurrentUser: false,
      trend: "up" as const,
    },
  ];

  const handleTabChange = (tab: TabType) => {
    if (tab === "more") {
      setState({
        ...state,
        activeTab: tab,
        currentView: "more",
        showMoreMenu: true,
      });
    } else if (tab === "roadmap") {
      setState({
        ...state,
        activeTab: tab,
        currentView: "main-roadmap",
        showMoreMenu: false,
      });
    } else if (tab === "game") {
      setState({
        ...state,
        activeTab: tab,
        currentView: "game",
        showMoreMenu: false,
      });
    } else {
      setState({ ...state, activeTab: tab, showMoreMenu: false });
    }
  };

  const handleChapterClick = (chapterId: string) => {
    setState({
      ...state,
      selectedChapter: chapterId,
      currentView: "lesson-roadmap",
    });
  };

  const handleLessonClick = (lessonId: string) => {
    setState({
      ...state,
      selectedLesson: lessonId,
      currentView: "lesson-content",
    });
  };

  const handleLessonComplete = (points: number) => {
    setState({
      ...state,
      userPoints: state.userPoints + points,
      currentView: "lesson-roadmap",
      selectedLesson: null,
    });
  };

  const handleGameComplete = (points: number) => {
    setState({
      ...state,
      userPoints: state.userPoints + points,
      currentView: "main-roadmap",
      activeTab: "roadmap",
    });
  };

  const handleBackToChapterRoadmap = () => {
    setState({ ...state, currentView: "lesson-roadmap", selectedLesson: null });
  };

  const handleBackToMainRoadmap = () => {
    setState({
      ...state,
      currentView: "main-roadmap",
      selectedChapter: null,
      selectedLesson: null,
    });
  };

  const selectedChapterData = chapters.find(
    (c) => c.id === state.selectedChapter,
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
              chapterTitle={selectedChapterData?.title || "Teeth"}
              lessons={teethLessons.filter(
                (l) => l.id === state.selectedLesson,
              )}
              onComplete={handleLessonComplete}
              onExit={handleBackToChapterRoadmap}
            />
          </div>
        )}

        {state.currentView === "game" && (
          <div key="game-view" className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 overflow-auto pb-24">
            <div className="flex flex-col items-center px-4 pt-6">
              <div className="w-full max-w-lg">
                <h2 className="text-center text-2xl font-bold text-gray-800 mb-5">🦷 Teeth Game</h2>
                <ToothGame />
              </div>
            </div>
          </div>
        )}

        {state.currentView === "more" && (
          <div key="more-menu">
            <ImprovedMoreMenu
              userProfile={userProfile}
              leaderboard={leaderboard}
              onClose={() =>
                setState({
                  ...state,
                  activeTab: "roadmap",
                  currentView: "main-roadmap",
                  showMoreMenu: false,
                })
              }
            />
          </div>
        )}
      </AnimatePresence>

      <FooterNav activeTab={state.activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
