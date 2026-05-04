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
import { CSS } from "@dnd-kit/utilities";

// --- Draggable Organ Piece (The Source) ---
function Draggable({
  id,
  name,
  emoji,
  isPlaced,
}: {
  id: string;
  name: string;
  emoji: string;
  isPlaced: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex-shrink-0 bg-white border-2 border-blue-200 rounded-2xl shadow-sm flex flex-col items-center justify-center w-20 h-20 touch-none ${
        isDragging || isPlaced ? "opacity-20" : "opacity-100"
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-[10px] font-bold text-blue-600 mt-1 uppercase">
        {name}
      </span>
    </div>
  );
}

// --- The Active Item appearing under your finger ---
function OrganOverlay({ emoji, name }: { emoji: string; name: string }) {
  return (
    <div className="bg-white border-4 border-yellow-400 rounded-2xl shadow-2xl flex flex-col items-center justify-center w-24 h-24 scale-110 rotate-3 opacity-90">
      <span className="text-4xl">{emoji}</span>
      <span className="text-xs font-bold text-blue-600 mt-1 uppercase">
        {name}
      </span>
    </div>
  );
}

// --- Tiny Droppable Target ---
function Droppable({
  id,
  isPlaced,
  children,
  positionClass,
}: {
  id: string;
  isPlaced: boolean;
  children?: React.ReactNode;
  positionClass: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${positionClass} ${isPlaced ? "z-20" : "z-10"}`}
    >
      <div
        className={`
        relative flex items-center justify-center rounded-full border-2
        ${isPlaced ? "w-16 h-16 border-transparent" : "w-10 h-10 border-dashed border-white bg-white/30 animate-pulse"}
        ${isOver && !isPlaced ? "scale-150 border-yellow-400 bg-yellow-400/60" : ""}
      `}
      >
        {children}
      </div>
    </div>
  );
}

const MobileAnatomyGame = () => {
  const items = [
    { id: "brain", name: "Тархи", emoji: "🧠", pos: "top-[11.5%] left-[50%]" },
    { id: "lungs", name: "Уушиг", emoji: "🫁", pos: "top-[31%] left-[50%]" },
    { id: "heart", name: "Зүрх", emoji: "🫀", pos: "top-[33%] left-[56%]" },
    { id: "stomach", name: "Ходоод", emoji: "🥣", pos: "top-[46%] left-[48%]" },
    { id: "liver", name: "Элэг", emoji: "🍷", pos: "top-[44%] left-[58%]" },
  ];

  const [placements, setPlacements] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id === over.id) {
      setPlacements((prev) => ({ ...prev, [active.id]: true }));
    }
    setActiveId(null);
  };

  const activeItem = items.find((i) => i.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="fixed inset-0 bg-sky-100 flex flex-col items-center font-sans overflow-hidden select-none">
        {/* Header */}
        <div className="w-full pt-6 pb-2 text-center bg-white/90 backdrop-blur-md shadow-sm z-30">
          <h1 className="text-xl font-black text-blue-600">БИЕИЙН БҮТЭЦ 🦴</h1>
        </div>

        {/* Skeleton Area */}
        <div className="relative flex-1 w-full max-w-md bg-white overflow-hidden">
          <img
            src="https://images.imagerenderer.com/images/artworkimages/mediumlarge/2/1-childs-skeleton-growth-plates-monica-schroeder.jpg"
            alt="Skeleton"
            className="absolute inset-0 w-full h-full object-contain object-top mt-4 pointer-events-none"
          />

          {items.map((item) => (
            <Droppable
              key={item.id}
              id={item.id}
              isPlaced={!!placements[item.id]}
              positionClass={item.pos}
            >
              {placements[item.id] && (
                <span className="text-5xl drop-shadow-lg scale-110">
                  {item.emoji}
                </span>
              )}
            </Droppable>
          ))}
        </div>

        {/* Organ Dock */}
        <div className="w-full bg-slate-50 p-4 pb-10 rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-30">
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Эрхтнээ сонгоно уу
            </p>
            <button
              onClick={() => setPlacements({})}
              className="text-[10px] font-bold text-red-400 border border-red-100 px-3 py-1 rounded-full active:bg-red-50"
            >
              СУУРЬ ТОГТООХ
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-2">
            {items.map((item) => (
              <Draggable
                key={item.id}
                id={item.id}
                name={item.name}
                emoji={item.emoji}
                isPlaced={!!placements[item.id]}
              />
            ))}
          </div>
        </div>

        {/* Drag Overlay - This makes the "floating" item visible! */}
        <DragOverlay adjustScale={true}>
          {activeId && activeItem ? (
            <OrganOverlay emoji={activeItem.emoji} name={activeItem.name} />
          ) : null}
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

export default MobileAnatomyGame;
