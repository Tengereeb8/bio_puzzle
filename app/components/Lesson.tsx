import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type ToothType = "incisor" | "canine" | "molar";

interface ToothData {
  id: ToothType;
  label: string;
  job: string;
  color: string;
}

// --- Simplified SVG Tooth Icons ---
const ToothIcon = ({ type, color }: { type: ToothType; color: string }) => {
  const paths = {
    incisor:
      "M12 2C10 2 8 3 8 5V15C8 18 10 21 12 22C14 21 16 18 16 15V5C16 3 14 2 12 2Z", // Flat edge
    canine:
      "M12 2C10 2 8 4 8 7V14C8 18 10 21 12 22C14 21 16 18 16 14V7C16 4 14 2 12 2Z", // Pointed
    molar:
      "M8 4C6 4 4 6 4 9V14C4 18 7 21 12 22C17 21 20 18 20 14V9C20 6 18 4 16 4H8Z", // Wide/Flat
  };

  return (
    <svg viewBox="0 0 24 24" className="w-12 h-12" fill={color}>
      <path d={paths[type]} />
    </svg>
  );
};

// --- Draggable Tooth ---
const DraggableTooth: React.FC<{ tooth: ToothData }> = ({ tooth }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: tooth.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <ToothIcon type={tooth.id} color={tooth.color} />
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {tooth.label}
      </span>
    </div>
  );
};

// --- Droppable Target ---
const JobZone: React.FC<{
  id: string;
  label: string;
  matched: boolean;
  color: string;
}> = ({ id, label, matched, color }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative w-40 h-40 flex flex-col items-center justify-center rounded-3xl border-2 transition-all duration-300 ${
        matched
          ? "bg-white border-transparent shadow-lg"
          : isOver
            ? "bg-slate-100 border-blue-400 scale-105"
            : "bg-slate-50 border-slate-200 border-dashed"
      }`}
    >
      {matched ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter">
            Correct
          </span>
        </motion.div>
      ) : (
        <div className="text-center p-4">
          <p
            className={`text-sm font-black uppercase tracking-widest transition-colors ${isOver ? "text-blue-500" : "text-slate-400"}`}
          >
            {label}
          </p>
        </div>
      )}
    </div>
  );
};

// --- Main Game ---
export const BetterToothGame: React.FC = () => {
  const [completed, setCompleted] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const teeth: ToothData[] = [
    { id: "incisor", label: "Incisor", job: "cutting", color: "#cbd5e1" },
    { id: "canine", label: "Canine", job: "tearing", color: "#94a3b8" },
    { id: "molar", label: "Molar", job: "grinding", color: "#64748b" },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const tooth = teeth.find((t) => t.id === active.id);
    if (tooth && tooth.job === over.id) {
      setCompleted((prev) => [...prev, over.id as string]);
      setError(null);
    } else {
      setError(active.id as string);
      setTimeout(() => setError(null), 500); // Shakes the UI
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="max-w-2xl mx-auto p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Functional Anatomy
          </h2>
          <p className="text-slate-500 font-medium">
            Match the specialized tool to its primary function.
          </p>
        </div>

        {/* Draggable Dock */}
        <div className="flex gap-6 min-h-[120px]">
          {teeth.map(
            (tooth) =>
              !completed.includes(tooth.job) && (
                <motion.div
                  key={tooth.id}
                  animate={error === tooth.id ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <DraggableTooth tooth={tooth} />
                </motion.div>
              ),
          )}
        </div>

        {/* Drop Zones */}
        <div className="flex gap-4">
          <JobZone
            id="cutting"
            label="Mechanical Cutting"
            matched={completed.includes("cutting")}
            color="#cbd5e1"
          />
          <JobZone
            id="tearing"
            label="Tissue Tearing"
            matched={completed.includes("tearing")}
            color="#94a3b8"
          />
          <JobZone
            id="grinding"
            label="Surface Grinding"
            matched={completed.includes("grinding")}
            color="#64748b"
          />
        </div>

        {completed.length === 3 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setCompleted([])}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors"
          >
            Reset Simulation
          </motion.button>
        )}
      </div>
    </DndContext>
  );
};
