"use client";
import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";

interface ToothProps {
  id: string;
  icon: string;
}

interface JobZoneProps {
  id: string;
  title: string;
  matchedIcon: string | null;
}

const DraggableTooth: React.FC<ToothProps> = ({ id, icon }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="text-6xl p-4 bg-white border-4 border-slate-100 rounded-2xl shadow-lg cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
    >
      {icon}
    </div>
  );
};

const JobZone: React.FC<JobZoneProps> = ({ id, title, matchedIcon }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-32 h-40 flex flex-col items-center justify-center border-4 border-dashed rounded-3xl transition-colors ${
        isOver ? "bg-blue-100 border-blue-400" : "bg-slate-50 border-slate-200"
      }`}
    >
      {matchedIcon ? (
        <span className="text-6xl animate-bounce">{matchedIcon}</span>
      ) : (
        <span className="font-black text-slate-400 text-center px-2 uppercase text-sm">
          {title}
        </span>
      )}
    </div>
  );
};

const ToothGame: React.FC = () => {
  const [matches, setMatches] = useState<Record<string, string | null>>({
    cutting: null,
    tearing: null,
    grinding: null,
  });

  const teethData: Record<string, { icon: string; job: string }> = {
    incisor: { icon: "🦷", job: "cutting" },
    canine: { icon: "🧛", job: "tearing" },
    molar: { icon: "🪨", job: "grinding" },
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const toothId = active.id as string;
    const dropZoneId = over.id as string;

    if (teethData[toothId].job === dropZoneId) {
      setMatches((prev) => ({
        ...prev,
        [dropZoneId]: teethData[toothId].icon,
      }));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-8 bg-indigo-50 rounded-[2rem] flex flex-col items-center gap-10">
        <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-widest">
          Match the Job!
        </h2>

        <div className="flex gap-6 min-h-[120px]">
          {Object.entries(teethData).map(
            ([id, data]) =>
              !Object.values(matches).includes(data.icon) && (
                <DraggableTooth key={id} id={id} icon={data.icon} />
              ),
          )}
        </div>

        <div className="flex gap-4">
          <JobZone
            id="cutting"
            title="Cutting ✂️"
            matchedIcon={matches.cutting}
          />
          <JobZone
            id="tearing"
            title="Tearing 🗡️"
            matchedIcon={matches.tearing}
          />
          <JobZone
            id="grinding"
            title="Grinding 🔨"
            matchedIcon={matches.grinding}
          />
        </div>
      </div>
    </DndContext>
  );
};

export default ToothGame;
