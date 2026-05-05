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
  MeasuringStrategy,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import OrganSVG, { organInfo } from "./OrganSVG";

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

function DraggableOrgan({ organ, isPlaced }: DraggableOrganProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: organ.id,
    data: {
      organType: organ.type,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
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
      className="cursor-grab relative"
    >
      <div className="bg-white rounded-2xl p-3 shadow-2xl border-4 border-indigo-400 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100" />

        {/* Shine effect */}
        <div
          className="absolute inset-0 bg-linear-to-br from-white/60 via-transparent to-transparent"
          style={{ transform: "translateX(-100%) rotate(45deg)" }}
        />

        {/* Organ SVG */}
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
    targetY: 52,
    targetWidth: 125,
    targetHeight: 135,
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
    useSensor(PointerSensor),
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

    // dnd-kit gives coordinates relative to the viewport.
    // We need to convert organ target percentages to absolute pixel values within the canvas.
    const targetAbsX = rect.left + (organ.targetX / 100) * rect.width;
    const targetAbsY = rect.top + (organ.targetY / 100) * rect.height;

    const distance = Math.sqrt(
      Math.pow(dropX - targetAbsX, 2) + Math.pow(dropY - targetAbsY, 2),
    );
    const threshold = Math.max(organ.targetWidth, organ.targetHeight) * 0.65; // Adjust threshold as needed

    return distance < threshold;
  };

  const handleDragStart = (event: { active: { id: UniqueIdentifier } }) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: {
    active: {
      rect: any;
      id: UniqueIdentifier;
    };
    over: { id: UniqueIdentifier } | null;
    delta: { x: number; y: number };
  }) => {
    const { active, over, delta } = event;
    const organId = active.id.toString();
    const organ = organs.find((o) => o.id === organId);
    const info = organ ? organInfo[organ.type] : null;

    setActiveId(null); // Reset active draggable

    if (over && over.id === organId && organ && info) {
      // Logic for successful drop (organ dropped on its own target zone)
      // The current drag-and-drop system doesn't directly give final dropped coordinates relative to parent
      // For now, we'll assume a successful drop means it's correctly placed if 'over.id' matches.
      // A more robust solution might involve custom collision detection or coordinate tracking.

      // For simplicity, we'll use the current logic which relies on a checkPlacement function.
      // We need to pass the actual drop coordinates for checkPlacement.
      // Since dnd-kit gives delta, we need to calculate the final position
      // For now, let's simplify and assume the 'over' means correct placement if ID matches.
      // Or, we need to compute the final absolute coordinates based on active.rect.current.initial + delta

      // Recalculate drop position based on initial position of draggable and delta
      const initialRect = event.active.rect.current.translated;
      const dropX = initialRect.left + delta.x + initialRect.width / 2; // Center of the dropped organ
      const dropY = initialRect.top + delta.y + initialRect.height / 2;

      const isCorrect = checkPlacement(organId, dropX, dropY);

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

        if (placedOrgans.size + 1 === organs.length) {
          setIsRunning(false);
          setShowCelebration(true);
          playAudio("Баяр хүргэе! Та бүх эрхтнүүдийг зөв байрлууллаа!");

          setTimeout(() => {
            onComplete(elapsedTime);
          }, 3500);
        }
      } else {
        // Dropped on a target, but incorrect organ or position
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
      // Dropped outside any valid target or wrong target
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

  const activeOrgan = activeId
    ? organs.find((organ) => organ.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // modifiers={[restrictToWindowEdges]} // Use if drag should be restricted to window boundaries
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
                    <p className="text-xs opacity-90">Цаг</p>
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
                  className="p-3 bg-linear-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 rounded-xl shadow-lg transition-all"
                >
                  <RotateCcw size={22} color="white" />
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

                <div className="space-y-3 max-h-150 overflow-y-auto">
                  {organs.map((organ) => (
                    <DraggableOrgan
                      key={organ.id}
                      organ={organ}
                      isPlaced={placedOrgans.has(organ.id)}
                      onDragEnd={handleDragEnd}
                    />
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

                {/* Detailed Skeleton Background */}
                <div className="absolute inset-0 p-8">
                  <svg
                    viewBox="0 0 300 450"
                    className="w-full h-full opacity-20"
                  >
                    {/* Skull - detailed */}
                    <g id="skull">
                      <ellipse
                        cx="150"
                        cy="32"
                        rx="38"
                        ry="42"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="4"
                      />
                      {/* Eye sockets */}
                      <ellipse
                        cx="138"
                        cy="28"
                        rx="8"
                        ry="10"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                      <ellipse
                        cx="162"
                        cy="28"
                        rx="8"
                        ry="10"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                      {/* Nasal cavity */}
                      <path
                        d="M 145 38 L 150 45 L 155 38 Z"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                      {/* Jaw */}
                      <path
                        d="M 118 48 Q 150 65 182 48"
                        stroke="#1F2937"
                        strokeWidth="4"
                        fill="none"
                      />
                      <ellipse
                        cx="150"
                        cy="52"
                        rx="32"
                        ry="18"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                      {/* Teeth indication */}
                      <line
                        x1="135"
                        y1="60"
                        x2="135"
                        y2="65"
                        stroke="#1F2937"
                        strokeWidth="2"
                      />
                      <line
                        x1="145"
                        y1="60"
                        x2="145"
                        y2="65"
                        stroke="#1F2937"
                        strokeWidth="2"
                      />
                      <line
                        x1="155"
                        y1="60"
                        x2="155"
                        y2="65"
                        stroke="#1F2937"
                        strokeWidth="2"
                      />
                      <line
                        x1="165"
                        y1="60"
                        x2="165"
                        y2="65"
                        stroke="#1F2937"
                        strokeWidth="2"
                      />
                    </g>

                    {/* Cervical Spine (Neck) */}
                    <g id="cervical-spine">
                      <rect
                        x="147"
                        y="70"
                        width="6"
                        height="8"
                        rx="2"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="2.5"
                      />
                      <rect
                        x="147"
                        y="80"
                        width="6"
                        height="8"
                        rx="2"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="2.5"
                      />
                    </g>

                    {/* Clavicles (Collar bones) */}
                    <g id="clavicles">
                      <path
                        d="M 150 90 Q 130 88 110 95"
                        stroke="#1F2937"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 150 90 Q 170 88 190 95"
                        stroke="#1F2937"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Scapulae (Shoulder blades) */}
                    <g id="scapulae">
                      <ellipse
                        cx="110"
                        cy="105"
                        rx="12"
                        ry="18"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                        opacity="0.6"
                      />
                      <ellipse
                        cx="190"
                        cy="105"
                        rx="12"
                        ry="18"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                        opacity="0.6"
                      />
                    </g>

                    {/* Sternum (Breastbone) */}
                    <g id="sternum">
                      <rect
                        x="147"
                        y="95"
                        width="6"
                        height="65"
                        rx="3"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                      <circle
                        cx="150"
                        cy="95"
                        r="5"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="2"
                      />
                    </g>

                    {/* Ribcage - detailed with multiple ribs */}
                    <g id="ribcage">
                      {/* Right ribs */}
                      <path
                        d="M 153 100 Q 185 105 195 120 Q 195 125 185 130 Q 175 133 153 135"
                        stroke="#1F2937"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M 153 110 Q 190 115 200 130 Q 200 135 190 140 Q 180 143 153 145"
                        stroke="#1F2937"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M 153 120 Q 195 125 205 140 Q 205 145 195 150 Q 185 153 153 155"
                        stroke="#1F2937"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M 153 130 Q 192 135 200 148 Q 200 153 192 158 Q 182 160 153 160"
                        stroke="#1F2937"
                        strokeWidth="2.5"
                        fill="none"
                      />

                      {/* Left ribs */}
                      <path
                        d="M 147 100 Q 115 105 105 120 Q 105 125 115 130 Q 125 133 147 135"
                        stroke="#1F2937"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M 147 110 Q 110 115 100 130 Q 100 135 110 140 Q 120 143 147 145"
                        stroke="#1F2937"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M 147 120 Q 105 125 95 140 Q 95 145 105 150 Q 115 153 147 155"
                        stroke="#1F2937"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M 147 130 Q 108 135 100 148 Q 100 153 108 158 Q 118 160 147 160"
                        stroke="#1F2937"
                        strokeWidth="2.5"
                        fill="none"
                      />
                    </g>

                    {/* Thoracic Spine */}
                    <g id="thoracic-spine">
                      <rect
                        x="147"
                        y="95"
                        width="6"
                        height="70"
                        rx="3"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="2"
                      />
                      {/* Vertebrae bumps */}
                      <circle
                        cx="150"
                        cy="100"
                        r="3"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                      <circle
                        cx="150"
                        cy="115"
                        r="3"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                      <circle
                        cx="150"
                        cy="130"
                        r="3"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                      <circle
                        cx="150"
                        cy="145"
                        r="3"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                      <circle
                        cx="150"
                        cy="160"
                        r="3"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                    </g>

                    {/* Lumbar Spine */}
                    <g id="lumbar-spine">
                      <rect
                        x="146"
                        y="165"
                        width="8"
                        height="50"
                        rx="4"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="150"
                        cy="175"
                        r="3"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                      <circle
                        cx="150"
                        cy="190"
                        r="3"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                      <circle
                        cx="150"
                        cy="205"
                        r="3"
                        fill="#1F2937"
                        opacity="0.3"
                      />
                    </g>

                    {/* Pelvis - detailed */}
                    <g id="pelvis">
                      <ellipse
                        cx="150"
                        cy="235"
                        rx="55"
                        ry="30"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="4"
                      />
                      <path
                        d="M 95 235 Q 95 250 110 255"
                        stroke="#1F2937"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        d="M 205 235 Q 205 250 190 255"
                        stroke="#1F2937"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="120"
                        cy="245"
                        r="8"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                      <circle
                        cx="180"
                        cy="245"
                        r="8"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                      <path
                        d="M 140 255 L 160 255"
                        stroke="#1F2937"
                        strokeWidth="4"
                      />
                    </g>

                    {/* Arms - Humerus (upper arm) */}
                    <g id="arms">
                      <line
                        x1="110"
                        y1="100"
                        x2="75"
                        y2="175"
                        stroke="#1F2937"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <line
                        x1="190"
                        y1="100"
                        x2="225"
                        y2="175"
                        stroke="#1F2937"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="110"
                        cy="100"
                        r="6"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                      <circle
                        cx="190"
                        cy="100"
                        r="6"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />

                      {/* Elbow joints */}
                      <circle
                        cx="75"
                        cy="175"
                        r="5"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                      <circle
                        cx="225"
                        cy="175"
                        r="5"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />

                      {/* Radius and Ulna (forearm) */}
                      <line
                        x1="75"
                        y1="175"
                        x2="55"
                        y2="240"
                        stroke="#1F2937"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <line
                        x1="77"
                        y1="175"
                        x2="60"
                        y2="240"
                        stroke="#1F2937"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                      <line
                        x1="225"
                        y1="175"
                        x2="245"
                        y2="240"
                        stroke="#1F2937"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <line
                        x1="223"
                        y1="175"
                        x2="240"
                        y2="240"
                        stroke="#1F2937"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.6"
                      />

                      {/* Hands */}
                      <ellipse
                        cx="57"
                        cy="250"
                        rx="8"
                        ry="12"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                      <ellipse
                        cx="243"
                        cy="250"
                        rx="8"
                        ry="12"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                    </g>

                    {/* Legs - Femur (thigh bone) */}
                    <g id="legs">
                      <line
                        x1="120"
                        y1="255"
                        x2="115"
                        y2="330"
                        stroke="#1F2937"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <line
                        x1="180"
                        y1="255"
                        x2="185"
                        y2="330"
                        stroke="#1F2937"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />

                      {/* Knee joints - patella */}
                      <circle
                        cx="115"
                        cy="330"
                        r="8"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                      <circle
                        cx="185"
                        cy="330"
                        r="8"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />

                      {/* Tibia and Fibula (shin) */}
                      <line
                        x1="115"
                        y1="335"
                        x2="110"
                        y2="410"
                        stroke="#1F2937"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <line
                        x1="117"
                        y1="335"
                        x2="115"
                        y2="410"
                        stroke="#1F2937"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                      <line
                        x1="185"
                        y1="335"
                        x2="190"
                        y2="410"
                        stroke="#1F2937"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <line
                        x1="183"
                        y1="335"
                        x2="185"
                        y2="410"
                        stroke="#1F2937"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.6"
                      />

                      {/* Feet */}
                      <ellipse
                        cx="110"
                        cy="425"
                        rx="12"
                        ry="8"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                      <ellipse
                        cx="190"
                        cy="425"
                        rx="12"
                        ry="8"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="3"
                      />
                    </g>
                  </svg>

                  {/* Drop Zones */}
                  {organs.map((organ) => {
                    const { setNodeRef, isOver } = useDroppable({
                      id: organ.id,
                    });
                    const isPlaced = placedOrgans.has(organ.id);
                    const info = organInfo[organ.type];

                    return (
                      <div
                        key={`zone-${organ.id}`}
                        ref={setNodeRef}
                        className={`absolute flex items-center justify-center transition-all rounded-2xl ${
                          isPlaced
                            ? "bg-linear-to-br from-green-100/95 to-emerald-50/95 border-green-500 shadow-2xl"
                            : isOver && activeId === organ.id
                              ? "bg-linear-to-br from-yellow-100/80 to-amber-100/80 border-yellow-400 animate-pulse"
                              : "bg-linear-to-br from-indigo-50/80 to-purple-50/80 border-indigo-400"
                        } border-4 border-dashed backdrop-blur-sm`}
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
                                <CheckCircle2
                                  size={32}
                                  fill="#22c55e"
                                  color="white"
                                />
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
                  })}
                </div>

                {/* Celebration Overlay */}
                {showCelebration && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-md"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.97), rgba(139, 92, 246, 0.97), rgba(236, 72, 153, 0.97))",
                    }}
                  >
                    {/* Animated trophy */}
                    <div className="relative mb-8">
                      <div>
                        <Trophy size={120} color="#fbbf24" fill="#fbbf24" />
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl" />
                    </div>

                    <h2
                      className="text-6xl font-bold mb-4 text-white"
                      style={{ fontFamily: "Noto Sans Mongolian, Nunito" }}
                    >
                      Гайхалтай!
                    </h2>

                    <p className="text-2xl mb-8 text-white">
                      Та бүх эрхтнийг зөв байрлууллаа!
                    </p>

                    <div className="bg-white/25 backdrop-blur-xl rounded-3xl px-14 py-8 mb-8 border-4 border-white/30 shadow-2xl">
                      <div className="flex items-center gap-6">
                        <div>
                          <Clock size={56} color="white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-white/90 text-base mb-2">
                            Таны хугацаа
                          </p>
                          <p className="text-6xl font-bold text-white font-mono">
                            {formatTime(elapsedTime)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-white/80 text-sm mb-1">Алдаа</p>
                        <p className="text-3xl font-bold text-white">
                          {incorrectAttempts}
                        </p>
                      </div>
                      <div className="w-px h-12 bg-white/30" />
                      <div className="text-center">
                        <p className="text-white/80 text-sm mb-1">Амжилт</p>
                        <p className="text-3xl font-bold text-white">
                          {Math.round(
                            (totalCount / (totalCount + incorrectAttempts)) *
                              100,
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Feedback */}
        {showFeedback && (
          <div
            className={`fixed top-32 right-6 px-8 py-5 rounded-2xl shadow-2xl border-4 z-40 ${
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
              className="bg-white rounded-3xl p-8 max-w-md shadow-2xl"
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
                className="w-full py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold"
              >
                Ойлголоо
              </button>
            </div>
          </div>
        )}
      </div>
      <DragOverlay modifiers={[restrictToWindowEdges]}>
        {activeId ? (
          <div className="bg-white rounded-2xl p-3 shadow-2xl border-4 border-indigo-400 relative overflow-hidden opacity-80">
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
