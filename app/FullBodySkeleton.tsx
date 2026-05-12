"use client";

import { useState, useRef, useEffect, useMemo, FC } from "react";
import {
  ArrowLeft,
  Clock,
  RotateCcw,
  CheckCircle2,
  Award,
  BookOpenText,
} from "lucide-react";

import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import OrganSVG, { OrganType, organInfo } from "./OrganSVG";

// -- Data Definition --

interface Organ {
  id: string;
  type: OrganType;
  // Position targets as percentage of the background
  targetX: number; // Center X
  targetY: number; // Center Y
  targetWidth: number; // Used for the drop zone size
  targetHeight: number;
}

const ORGANS_DATA: Organ[] = [
  {
    id: "o-brain",
    type: "brain",
    targetX: 50,
    targetY: 7,
    targetWidth: 20,
    targetHeight: 12,
  },
  {
    id: "o-heart",
    type: "heart",
    targetX: 47,
    targetY: 26,
    targetWidth: 16,
    targetHeight: 14,
  },
  {
    id: "o-lungs",
    type: "lungs",
    targetX: 50,
    targetY: 24,
    targetWidth: 30,
    targetHeight: 18,
  },
  {
    id: "o-liver",
    type: "liver",
    targetX: 58,
    targetY: 36,
    targetWidth: 25,
    targetHeight: 14,
  },
  {
    id: "o-stomach",
    type: "stomach",
    targetX: 42,
    targetY: 37,
    targetWidth: 18,
    targetHeight: 16,
  },
  {
    id: "o-pancreas",
    type: "pancreas",
    targetX: 50,
    targetY: 41,
    targetWidth: 20,
    targetHeight: 6,
  },
  {
    id: "o-intestines",
    type: "intestines",
    targetX: 50,
    targetY: 55,
    targetWidth: 22,
    targetHeight: 22,
  },
  {
    id: "o-kidneys",
    type: "kidneys",
    targetX: 50,
    targetY: 46,
    targetWidth: 28,
    targetHeight: 14,
  },
  {
    id: "o-bladder",
    type: "bladder",
    targetX: 50,
    targetY: 66,
    targetWidth: 14,
    targetHeight: 12,
  },
];

interface Props {
  onComplete: (completionTime: number) => void;
  onBack: () => void;
}

// -- SVG Skeleton Background Component --
const SkeletonSVG = () => (
  <svg
    viewBox="0 0 100 150"
    className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
    fill="none"
    stroke="#4338ca"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="50" cy="10" rx="8" ry="10" strokeWidth="1.5" />

    <path d="M50 20 L50 80 M50 25 L49 25 M50 30 L51 30 M50 35 L49 35 M50 40 L51 40 M50 45 L49 45 M50 50 L51 50 M50 55 L49 55 M50 60 L51 60 M50 65 L49 65 M50 70 L51 70 M50 75 L49 75 M50 80 L51 80" />

    <path d="M50 22 C 30 25, 30 45, 50 48 M50 22 C 70 25, 70 45, 50 48" />
    <path d="M50 28 L 35 30 M50 28 L 65 30 M50 34 L 33 36 M50 34 L 67 36 M50 40 L 33 42 M50 40 L 67 42" />

    <path
      d="M50 78 C 35 75, 35 90, 50 92 M50 78 C 65 75, 65 90, 50 92"
      strokeWidth="1.5"
    />

    <path d="M38 22 L15 50 L10 70" />
    <path d="M62 22 L85 50 L90 70" />

    <path d="M42 85 L40 120 L45 145" />
    <path d="M58 85 L60 120 L55 145" />
  </svg>
);

// -- UI Component: Draggable Organ Card (Bottom Carousel) --
const DraggableOrganCard: FC<{ organ: Organ }> = ({ organ }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: organ.id,
      data: { organType: organ.type },
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
      }
    : undefined;

  const info = organInfo[organ.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex-shrink-0 cursor-grab active:cursor-grabbing touch-none select-none transition-opacity ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="bg-white rounded-2xl p-3 shadow-lg border-2 border-indigo-100 flex flex-col items-center gap-1.5 w-28 h-36">
        <div className="flex-grow flex items-center justify-center">
          <OrganSVG
            type={organ.type}
            size={56}
            className={isDragging ? "scale-125" : ""}
            isPlaced={false}
          />
        </div>
        <div className="text-center">
          <p
            className="font-bold text-sm text-gray-900"
            style={{ fontFamily: "Noto Sans Mongolian, sans-serif" }}
          >
            {info.nameMn}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            {info.nameEn}
          </p>
        </div>
      </div>
    </div>
  );
};

// -- UI Component: Drop Zone (On Skeleton) --
const OrganDropZone: FC<{
  organ: Organ;
  activeOrganType: OrganType | null;
  isPlaced: boolean;
  onShowInfo: () => void;
}> = ({ organ, activeOrganType, isPlaced, onShowInfo }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `zone-${organ.id}`,
    data: { accepts: organ.id },
  });

  const info = organInfo[organ.type];
  const isCorrectActive = activeOrganType === organ.type;

  const stateClasses = useMemo(() => {
    if (isPlaced) {
      return "bg-green-100/90 border-green-500 shadow-xl";
    }
    if (isOver) {
      return isCorrectActive
        ? "bg-emerald-100/90 border-emerald-500 animate-pulse"
        : "bg-red-100/90 border-red-500";
    }
    if (isCorrectActive) {
      return "bg-indigo-100/80 border-indigo-500 border-2";
    }
    return "bg-white/70 border-gray-300";
  }, [isPlaced, isOver, isCorrectActive]);

  return (
    <div
      ref={setNodeRef}
      className={`absolute flex items-center justify-center transition-all rounded-xl border-2 border-dashed backdrop-blur-sm ${stateClasses}`}
      style={{
        left: `${organ.targetX}%`,
        top: `${organ.targetY}%`,
        width: `${organ.targetWidth}%`,
        height: `${organ.targetHeight}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: isPlaced ? "auto" : "none",
      }}
    >
      {isPlaced ? (
        <div className="relative flex items-center justify-center w-full h-full p-1 group">
          <OrganSVG type={organ.type} size={48} isPlaced={true} />
          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-0.5 shadow-lg">
            <CheckCircle2 size={20} className="text-white" />
          </div>

          <button
            onClick={onShowInfo}
            className="absolute inset-0 bg-white/70 opacity-0 group-active:opacity-100 flex items-center justify-center rounded-xl transition-opacity"
          >
            <BookOpenText className="text-indigo-700" size={24} />
          </button>
        </div>
      ) : (
        <div
          className={`transition-opacity ${isCorrectActive ? "opacity-100" : "opacity-20"}`}
        >
          <OrganSVG
            type={organ.type}
            size={32}
            isPlaced={false}
            className="opacity-40 saturate-0"
          />
        </div>
      )}
    </div>
  );
};

// -- Main Game Component --
export default function FullBodySkeletonGame({ onComplete, onBack }: Props) {
  const [placedOrgans, setPlacedOrgans] = useState<Set<string>>(new Set());
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [activeOrgan, setActiveOrgan] = useState<Organ | null>(null);
  const [selectedInfoType, setSelectedInfoType] = useState<OrganType | null>(
    null,
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setElapsedTime((p) => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (placedOrgans.size === ORGANS_DATA.length && isRunning) {
      setIsRunning(false);
      setTimeout(() => onComplete(elapsedTime), 1500);
    }
  }, [placedOrgans, isRunning, onComplete, elapsedTime]);

  const validatePlacement = (
    organId: string,
    clientX: number,
    clientY: number,
  ): boolean => {
    if (!canvasRef.current) return false;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const organData = ORGANS_DATA.find((o) => o.id === organId);
    if (!organData) return false;

    const targetPixelX =
      canvasRect.left + (organData.targetX / 100) * canvasRect.width;
    const targetPixelY =
      canvasRect.top + (organData.targetY / 100) * canvasRect.height;

    const distX = clientX - targetPixelX;
    const distY = clientY - targetPixelY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    const thresholdPixelX = (organData.targetWidth / 100) * canvasRect.width;
    const thresholdPixelY = (organData.targetHeight / 100) * canvasRect.height;
    const threshold = Math.max(thresholdPixelX, thresholdPixelY) * 0.7;

    return distance < threshold;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const organ = ORGANS_DATA.find((o) => o.id === event.active.id);
    if (organ) setActiveOrgan(organ);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;
    const organId = active.id.toString();

    const activator = event.activatorEvent as PointerEvent;
    if (!activator) return;

    const isCorrect = validatePlacement(
      organId,
      activator.clientX,
      activator.clientY,
    );

    if (isCorrect) {
      setPlacedOrgans((prev) => new Set(prev).add(organId));
    } else {
      setIncorrectAttempts((p) => p + 1);
    }

    setActiveOrgan(null);
  };

  const handleReset = () => {
    setPlacedOrgans(new Set());
    setIncorrectAttempts(0);
    setElapsedTime(0);
    setIsRunning(true);
    setSelectedInfoType(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const availableOrgans = useMemo(
    () => ORGANS_DATA.filter((o) => !placedOrgans.has(o.id)),
    [placedOrgans],
  );

  const completedCount = placedOrgans.size;
  const totalCount = ORGANS_DATA.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={22} className="text-gray-600" />
            </button>
            <h1
              className="font-extrabold text-lg"
              style={{ fontFamily: "Noto Sans Mongolian, sans-serif" }}
            >
              Биеийн бүтэц
            </h1>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <RotateCcw size={20} />
          </button>
        </header>

        <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-indigo-700 font-mono text-xl font-bold bg-indigo-50 px-3 py-1 rounded-full shadow-inner">
            <Clock size={20} /> {formatTime(elapsedTime)}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-green-500" />{" "}
              {completedCount}
            </div>
            <div className="flex items-center gap-1.5">
              <Award size={16} className="text-red-500" /> {incorrectAttempts}
            </div>
          </div>
        </div>

        <div className="h-1 bg-gray-100 w-full">
          <div
            className="h-1 bg-indigo-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden bg-gray-100">
          <div
            ref={canvasRef}
            className="relative bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden w-full max-w-[450px]"
            style={{ aspectRatio: "2 / 3" }}
          >
            <SkeletonSVG />

            {ORGANS_DATA.map((organ) => (
              <OrganDropZone
                key={`zone-${organ.id}`}
                organ={organ}
                activeOrganType={activeOrgan?.type || null}
                isPlaced={placedOrgans.has(organ.id)}
                onShowInfo={() => setSelectedInfoType(organ.type)}
              />
            ))}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-100 shadow-lg px-2 pt-3 pb-6 z-10 relative">
          <div className="flex items-center gap-2 mb-2.5 px-3">
            <BookOpenText size={18} className="text-indigo-400" />
            <h2
              className="font-bold text-gray-700 text-sm"
              style={{ fontFamily: "Noto Sans Mongolian, sans-serif" }}
            >
              Эрхтнүүдийг байрлуул
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-thin scrollbar-thumb-indigo-100 scrollbar-track-transparent">
            {availableOrgans.length > 0 ? (
              availableOrgans.map((organ) => (
                <DraggableOrganCard key={organ.id} organ={organ} />
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center h-36 gap-3 text-center py-6 text-green-700 font-bold bg-green-50 rounded-2xl border border-green-200">
                <CheckCircle2
                  size={48}
                  className="text-green-500 animate-bounce"
                />
                <span style={{ fontFamily: "Noto Sans Mongolian, sans-serif" }}>
                  Тоглоом дууслаа! Гоё байна!
                </span>
              </div>
            )}
          </div>
        </footer>

        <DragOverlay modifiers={[restrictToWindowEdges]} dropAnimation={null}>
          {activeOrgan ? (
            <div className="opacity-80 scale-125 rotate-3 transition-transform cursor-grabbing shadow-2xl">
              <OrganSVG
                type={activeOrgan.type}
                size={80}
                isPlaced={false}
                className="drop-shadow-2xl"
              />
            </div>
          ) : null}
        </DragOverlay>

        {selectedInfoType && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedInfoType(null)}
          >
            <div
              className="bg-white rounded-3xl p-8 max-w-sm shadow-2xl animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-6">
                <OrganSVG type={selectedInfoType} size={96} isPlaced={false} />
              </div>
              <h3
                className="text-3xl font-extrabold mb-2 text-center text-gray-950"
                style={{ fontFamily: "Noto Sans Mongolian, sans-serif" }}
              >
                {organInfo[selectedInfoType].nameMn}
              </h3>
              <p className="text-sm text-center text-gray-500 uppercase tracking-widest font-bold mb-4">
                {organInfo[selectedInfoType].nameEn}
              </p>
              <p
                className="text-gray-700 leading-relaxed text-center mb-6"
                style={{ fontFamily: "Noto Sans Mongolian, sans-serif" }}
              >
                {organInfo[selectedInfoType].descriptionMn}
              </p>
              <button
                onClick={() => setSelectedInfoType(null)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Хаах
              </button>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}
