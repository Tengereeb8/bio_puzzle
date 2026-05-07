"use client";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Trophy,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Award,
} from "lucide-react";

import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import OrganSVG, { organInfo } from "./OrganSVG";
import SkeletonIcon from "./assets/icons/skeleton.svg"; // New import for skeleton icon

interface Organ {
  id: string;
  type:
    | "brain"
    | "heart"
    | "lungs"
    | "liver"
    | "stomach"
    | "intestines"
    | "kidneys"
    | "bladder"
    | "pancreas"
    | "spleen";
  targetX: number;
  targetY: number;
  targetWidth: number;
  targetHeight: number;
}

interface FullBodySkeletonGameProps {
  onComplete: (completionTime: number) => void;
  onBack: () => void;
}

type DraggableOrganProps = { organ: Organ; isPlaced: boolean };

function DraggableOrgan({ organ, isPlaced }: DraggableOrganProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: organ.id,
      data: {
        organType: organ.type,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  if (isPlaced) return null;

  const info = organInfo[organ.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab relative active:cursor-grabbing"
    >
      <div className="bg-white rounded-2xl p-3 shadow-2xl border-4 border-indigo-400 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100" />

        {/* Shine effect */}
        <div
          className="absolute inset-0 bg-linear-to-br from-white/60 via-transparent to-transparent"
          style={{ transform: "translateX(-100%) rotate(45deg)" }}
        />

        <div className="relative z-10 flex justify-center mb-2">
          <OrganSVG type={organ.type} size={90} />
        </div>

        <p
          className="text-center font-bold text-sm relative z-10"
          style={{
            fontFamily: "Noto Sans Mongolian, Nunito",
            color: "#1F2937",
          }}
        >
          {info.nameMn}
        </p>
        <p className="text-center text-xs text-gray-600 relative z-10">
          {info.name}
        </p>

        {/* Drag indicator dots */}
        <div className="absolute top-2 right-2 flex gap-0.5 z-10">
          <div className="w-1 h-1 rounded-full bg-indigo-400" />
          <div className="w-1 h-1 rounded-full bg-indigo-400" />
          <div className="w-1 h-1 rounded-full bg-indigo-400" />
        </div>
      </div>
    </div>
  );
}

const organs: Organ[] = [
  {
    id: "brain",
    type: "brain",
    targetX: 50,
    targetY: 7,
    targetWidth: 130,
    targetHeight: 95,
  },
  {
    id: "heart",
    type: "heart",
    targetX: 48,
    targetY: 26,
    targetWidth: 95,
    targetHeight: 105,
  },
  {
    id: "lungs",
    type: "lungs",
    targetX: 50,
    targetY: 24,
    targetWidth: 175,
    targetHeight: 115,
  },
  {
    id: "liver",
    type: "liver",
    targetX: 56,
    targetY: 36,
    targetWidth: 145,
    targetHeight: 88,
  },
  {
    id: "stomach",
    type: "stomach",
    targetX: 44,
    targetY: 36,
    targetWidth: 88,
    targetHeight: 98,
  },
  {
    id: "pancreas",
    type: "pancreas",
    targetX: 50,
    targetY: 40,
    targetWidth: 115,
    targetHeight: 48,
  },
  {
    id: "spleen",
    type: "spleen",
    targetX: 37,
    targetY: 38,
    targetWidth: 68,
    targetHeight: 88,
  },
  {
    id: "intestines",
    type: "intestines",
    targetX: 50,
    targetY: 55,
    targetWidth: 110,
    targetHeight: 120,
  },
  {
    id: "kidneys",
    type: "kidneys",
    targetX: 50,
    targetY: 46,
    targetWidth: 135,
    targetHeight: 88,
  },
  {
    id: "bladder",
    type: "bladder",
    targetX: 50,
    targetY: 64,
    targetWidth: 78,
    targetHeight: 78,
  },
];

function OrganDropZone({
  organ,
  activeId,
  placedOrgans,
  setSelectedInfo,
}: {
  organ: Organ;
  activeId: UniqueIdentifier | null;
  placedOrgans: Map<string, { x: number; y: number }>;
  setSelectedInfo: (organ: Organ) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: organ.id,
  });
  const isPlaced = placedOrgans.has(organ.id);
  const info = organInfo[organ.type];

  return (
    <div
      ref={setNodeRef}
      className={`absolute flex items-center justify-center transition-all rounded-2xl ${
        isPlaced
          ? "bg-linear-to-br from-green-100/95 to-emerald-50/95 border-green-500 shadow-2xl"
          : isOver && activeId === organ.id
            ? "bg-linear-to-br from-yellow-100/80 to-amber-100/80 border-yellow-400 animate-pulse"
            : "bg-linear-to-br from-indigo-50/80 to-purple-50/80 border-indigo-400"
      } border-4 border-dashed backdrop-blur-sm cursor-pointer`}
      style={{
        left: `${organ.targetX}%`,
        top: `${organ.targetY}%`,
        width: `${organ.targetWidth}px`,
        height: `${organ.targetHeight}px`,
        transform: "translate(-50%, -50%)",
        boxShadow: isPlaced
          ? "0 20px 50px rgba(34, 197, 94, 0.3)"
          : "0 8px 30px rgba(99, 102, 241, 0.2)",
      }}
      onClick={() => !isPlaced && setSelectedInfo(organ)}
    >
      {isPlaced ? (
        <div className="filter drop-shadow-2xl relative">
          <OrganSVG
            type={organ.type}
            size={organ.targetWidth * 0.68}
            isPlaced={true}
          />
          <div className="absolute -top-2 -right-2">
            <div className="relative">
              <CheckCircle2 size={32} fill="#22c55e" color="white" />
              <div className="absolute inset-0 bg-green-400 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-2 relative">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-200/40 to-purple-200/40 rounded-xl" />
          <p
            className="text-xs font-bold text-indigo-800 relative z-10"
            style={{
              fontFamily: "Noto Sans Mongolian, Nunito",
            }}
          >
            {info.nameMn}
          </p>
          <p className="text-[10px] text-indigo-600 mt-0.5 relative z-10">
            {info.name}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FullBodySkeletonGame({
  onComplete,
  onBack,
}: FullBodySkeletonGameProps) {
  const [placedOrgans, setPlacedOrgans] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{
    correct: boolean;
    text: string;
    textMn: string;
  } | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState<Organ | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const playAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.lang = "mn-MN";
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkPlacement = (organId: string, dropX: number, dropY: number) => {
    if (!canvasRef.current) return false;

    const rect = canvasRef.current.getBoundingClientRect();
    const organ = organs.find((o) => o.id === organId);
    if (!organ) return false;

    const targetAbsX = rect.left + (organ.targetX / 100) * rect.width;
    const targetAbsY = rect.top + (organ.targetY / 100) * rect.height;

    const distance = Math.sqrt(
      Math.pow(dropX - targetAbsX, 2) + Math.pow(dropY - targetAbsY, 2),
    );
    const threshold = Math.max(organ.targetWidth, organ.targetHeight) * 0.65;

    return distance < threshold;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const organId = active.id.toString();
    const organ = organs.find((o) => o.id === organId);
    const info = organ ? organInfo[organ.type] : null;

    setActiveId(null);

    console.log("Drag Ended:");
    console.log("Active ID:", active.id);
    console.log("Over:", over);
    console.log("Delta:", event.delta);

    const initialRect = active.rect.current.translated;
    if (!initialRect) return;
    const delta = event.delta ?? { x: 0, y: 0 };
    const dropX = initialRect.left + delta.x + initialRect.width / 2;
    const dropY = initialRect.top + delta.y + initialRect.height / 2;

    console.log("Calculated DropX:", dropX, "DropY:", dropY);

    const isCorrect = checkPlacement(organId, dropX, dropY);
    console.log("Is Correct Placement:", isCorrect);

    if (over && organ && info) {
      if (isCorrect) {
        setPlacedOrgans(
          new Map(placedOrgans.set(organId, { x: dropX, y: dropY })),
        );
        setShowFeedback({
          correct: true,
          text: `Perfect! ${info.name} is in the right place!`,
          textMn: `Гоё! ${info.nameMn} зөв байрлалд!`,
        });
        playAudio(`Маш сайн! ${info.nameMn} зөв байрласан байна!`);

        setTimeout(() => setShowFeedback(null), 1800);

        if (placedOrgans.size === organs.length) {
          setIsRunning(false);
          setShowCelebration(true);
          playAudio("Баяр хүргэе! Та бүх эрхтнүүдийг зөв байрлууллаа!");

          setTimeout(() => {
            onComplete(elapsedTime);
          }, 3500);
        }
      } else {
        setIncorrectAttempts(incorrectAttempts + 1);
        setShowFeedback({
          correct: false,
          text: "That's not the right spot!",
          textMn: "Энэ буруу байрлал байна!",
        });
        playAudio("Буруу байна. Дахин оролдоорой!");
        setTimeout(() => setShowFeedback(null), 1200);
      }
    } else if (info) {
      setIncorrectAttempts(incorrectAttempts + 1);
      setShowFeedback({
        correct: false,
        text: "Try a different spot!",
        textMn: "Өөр газар оролдоорой!",
      });
      playAudio("Буруу байна. Дахин оролдоорой!");
      setTimeout(() => setShowFeedback(null), 1200);
    }
  };

  const handleReset = () => {
    setPlacedOrgans(new Map());
    setIncorrectAttempts(0);
    setShowCelebration(false);
    setShowFeedback(null);
    setElapsedTime(0);
    setIsRunning(true);
    setSelectedInfo(null);
  };

  const completedCount = placedOrgans.size;
  const totalCount = organs.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen pb-24 bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b-2 border-gray-200 shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft size={24} color="#1F2937" strokeWidth={2.5} />
                </button>

                <div>
                  <h2
                    className="font-bold text-xl"
                    style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                  >
                    Биеийн бүтэц тоглоом
                  </h2>
                  <p className="text-sm text-gray-600">
                    Full Body Anatomy Challenge
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <Clock size={24} />
                  <div>
                    <p className="text-2xl font-bold font-mono">
                      {formatTime(elapsedTime)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    playAudio(
                      "Эрхтнүүдийг зөв байрлалд чирж байрлуулна уу. Та хурдан дуусгахыг оролдоорой!",
                    )
                  }
                  className="p-3 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl shadow-lg transition-all"
                >
                  <Volume2 size={22} color="white" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-3 bg-linear-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <RotateCcw size={22} color="white" />
                  <span className="text-white">Restart</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-bold text-gray-800"
                  style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                >
                  Явц: {completedCount}/{totalCount} эрхтэн
                </span>
                <span className="text-sm text-gray-600">
                  Алдаа: {incorrectAttempts}
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full shadow-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Organs Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl sticky top-32 border-2 border-indigo-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Award size={24} color="white" />
                  </div>
                  <h3
                    className="font-bold text-lg"
                    style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                  >
                    Эрхтнүүд
                  </h3>
                </div>

                <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
                  {organs.map((organ) => (
                    <div key={organ.id} data-draggable-id={organ.id}>
                      <DraggableOrgan
                        organ={organ}
                        isPlaced={placedOrgans.has(organ.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skeleton Canvas */}
            <div className="lg:col-span-3">
              <div
                ref={canvasRef}
                className="relative rounded-3xl shadow-2xl overflow-hidden border-4 border-indigo-300"
                style={{
                  aspectRatio: "2/3",
                  minHeight: "800px",
                  background:
                    "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
                }}
              >
                {/* Anatomical Region Labels */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-10">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-indigo-200">
                    <p
                      className="text-xs font-bold text-indigo-700"
                      style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                    >
                      Толгой
                    </p>
                    <p className="text-[10px] text-indigo-600">Head</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-red-200">
                    <p
                      className="text-xs font-bold text-red-700"
                      style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                    >
                      Цээж
                    </p>
                    <p className="text-[10px] text-red-600">Chest</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-orange-200">
                    <p
                      className="text-xs font-bold text-orange-700"
                      style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                    >
                      Хэвлий
                    </p>
                    <p className="text-[10px] text-orange-600">Abdomen</p>
                  </div>
                </div>

                {/* Detailed Skeleton SVG Background */}
                <div className="absolute inset-0 p-8">
                  <img
                    src={SkeletonIcon.src || SkeletonIcon}
                    className="w-full h-full opacity-20"
                    alt="Skeleton Background"
                  />
                </div>

                {/* Drop Zones - With data attributes for easier detection */}
                {organs.map((organ) => (
                  <div key={`zone-${organ.id}`} data-droppable-id={organ.id}>
                    <OrganDropZone
                      organ={organ}
                      activeId={activeId}
                      placedOrgans={placedOrgans}
                      setSelectedInfo={setSelectedInfo}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Feedback */}
        {showFeedback && (
          <div
            className={`fixed top-32 right-6 px-8 py-5 rounded-2xl shadow-2xl border-4 z-40 animate-in slide-in-from-right-5 ${
              showFeedback.correct
                ? "bg-linear-to-r from-green-400 to-emerald-500 border-green-600"
                : "bg-linear-to-r from-orange-400 to-red-500 border-orange-600"
            } text-white max-w-sm`}
          >
            <p
              className="font-bold text-xl mb-1"
              style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
            >
              {showFeedback.textMn}
            </p>
            <p className="text-sm opacity-90">{showFeedback.text}</p>
          </div>
        )}

        {/* Info Modal */}
        {selectedInfo && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedInfo(null)}
          >
            <div
              className="bg-white rounded-3xl p-8 max-w-md shadow-2xl animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-6">
                <OrganSVG type={selectedInfo.type} size={140} />
              </div>
              <h3
                className="text-2xl font-bold mb-3 text-center"
                style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
              >
                {organInfo[selectedInfo.type].nameMn}
              </h3>
              <p className="text-center text-gray-600 mb-2">
                {organInfo[selectedInfo.type].name}
              </p>
              <p
                className="text-gray-700 leading-relaxed mb-4 text-center"
                style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
              >
                {organInfo[selectedInfo.type].descriptionMn}
              </p>
              <button
                onClick={() => setSelectedInfo(null)}
                className="w-full py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition-all"
              >
                Ойлголоо
              </button>
            </div>
          </div>
        )}
      </div>
      <DragOverlay modifiers={[restrictToWindowEdges]}>
        {activeId ? (
          <div className="bg-white rounded-2xl p-3 shadow-2xl border-4 border-indigo-400 relative overflow-hidden opacity-90 rotate-3 scale-105">
            <div className="relative z-10 flex justify-center mb-2">
              <OrganSVG
                type={organs.find((o) => o.id === activeId)?.type || "brain"}
                size={90}
              />
            </div>
            <p
              className="text-center font-bold text-sm relative z-10"
              style={{
                fontFamily: "Noto Sans Mongolian, Nunito",
                color: "#1F2937",
              }}
            >
              {
                organInfo[
                  organs.find((o) => o.id === activeId)?.type || "brain"
                ].nameMn
              }
            </p>
            <p className="text-center text-xs text-gray-600 relative z-10">
              {
                organInfo[
                  organs.find((o) => o.id === activeId)?.type || "brain"
                ].name
              }
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
