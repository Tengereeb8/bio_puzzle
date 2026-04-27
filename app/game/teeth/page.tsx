"use client";
import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";

// --- Draggable Tooth ---
function DraggableTooth({
  id,
  name,
  emoji,
  type,
}: {
  id: string;
  name: string;
  emoji: string;
  type: string;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex-shrink-0 bg-white border-2 border-blue-100 rounded-xl shadow-sm flex flex-col items-center justify-center w-16 h-20 touch-none active:scale-110 ${isDragging ? "opacity-20" : "opacity-100"}`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">
        {type}
      </span>
    </div>
  );
}

// --- Clinical Tooth Slot ---
function ToothSlot({
  id,
  num,
  isPlaced,
  emoji,
}: {
  id: string;
  num: string;
  isPlaced: boolean;
  emoji?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative w-12 h-14 border rounded-md flex flex-col items-center justify-center transition-all ${
        isPlaced
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-gray-50/50"
      } ${isOver ? "bg-yellow-100 border-yellow-400 scale-110 z-10" : ""}`}
    >
      <span className="absolute top-0.5 right-1 text-[8px] font-mono text-gray-400">
        {num}
      </span>
      {isPlaced ? (
        <span className="text-xl animate-in zoom-in duration-200">{emoji}</span>
      ) : (
        <div className="w-4 h-4 rounded-full border border-gray-200" />
      )}
    </div>
  );
}

const ClinicalDentalGame = () => {
  // Clinical Tooth Map based on the quadrant image
  const teethData = [
    { id: "t1", num: "1", quad: "UR", type: "Molar", emoji: "🧱" },
    { id: "t5", num: "5", quad: "UR", type: "Premolar", emoji: "🦷" },
    { id: "t8", num: "8", quad: "UR", type: "Incisor", emoji: "💎" },
    { id: "t9", num: "9", quad: "UL", type: "Incisor", emoji: "💎" },
    { id: "t12", num: "12", quad: "UL", type: "Premolar", emoji: "🦷" },
    { id: "t16", num: "16", quad: "UL", type: "Molar", emoji: "🧱" },
    { id: "t24", num: "24", quad: "LL", type: "Incisor", emoji: "💎" },
    { id: "t32", num: "32", quad: "LR", type: "Molar", emoji: "🧱" },
  ];

  const [placements, setPlacements] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id === over.id) {
      setPlacements((prev) => ({ ...prev, [active.id]: true }));
    }
    setActiveId(null);
  };

  const activeItem = teethData.find((i) => i.id === activeId);

  // Helper to render quadrants
  const renderQuadrant = (quadName: string) => (
    <div className="flex-1 bg-white p-2 border-dashed border-gray-100 border">
      <div className="text-[10px] font-black text-gray-300 mb-2">
        {quadName}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {teethData
          .filter((t) => t.quad === quadName)
          .map((tooth) => (
            <ToothSlot
              key={tooth.id}
              id={tooth.id}
              num={tooth.num}
              isPlaced={!!placements[tooth.id]}
              emoji={tooth.emoji}
            />
          ))}
      </div>
    </div>
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="fixed inset-0 bg-slate-50 flex flex-col font-sans select-none overflow-hidden">
        {/* Clinical Header */}
        <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Шүдний оношилгоо
            </h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase">
              Dental Charting v1.0
            </p>
          </div>
          <button
            onClick={() => setPlacements({})}
            className="text-xs font-bold text-red-400 bg-red-50 px-3 py-1 rounded-md"
          >
            ШИНЭЧЛЭХ
          </button>
        </div>

        {/* Main Chart Area (The 2x2 Grid) */}
        <div className="flex-1 p-4 grid grid-cols-2 grid-rows-2 gap-1 overflow-auto">
          {renderQuadrant("UR")}
          {renderQuadrant("UL")}
          {renderQuadrant("LR")}
          {renderQuadrant("LL")}
        </div>

        {/* Clinical Dock (Bottom) */}
        <div className="bg-white border-t p-6 pb-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-blue-500 rounded-full" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Тавигдаагүй шүднүүд
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {teethData.map(
              (item) =>
                !placements[item.id] && (
                  <DraggableTooth
                    key={item.id}
                    id={item.id}
                    name={item.num}
                    emoji={item.emoji}
                    type={item.type}
                  />
                ),
            )}
          </div>
        </div>

        <DragOverlay>
          {activeId && activeItem && (
            <div className="bg-white border-2 border-blue-500 rounded-xl shadow-2xl flex flex-col items-center justify-center w-16 h-20 scale-110 opacity-90">
              <span className="text-2xl">{activeItem.emoji}</span>
              <span className="text-[8px] font-bold text-blue-500 mt-1 uppercase">
                {activeItem.type}
              </span>
            </div>
          )}
        </DragOverlay>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </DndContext>
  );
};

export default ClinicalDentalGame;
