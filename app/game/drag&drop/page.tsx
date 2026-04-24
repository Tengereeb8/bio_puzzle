"use client";
import React, { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useDraggable, useDroppable } from "@dnd-kit/react";

function Draggable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { ref } = useDraggable({ id });
  return (
    <button
      ref={ref}
      className="bg-blue-500 text-white rounded shadow-md cursor-grab active:cursor-grabbing"
      style={{ padding: "10px", margin: "5px" }}
    >
      {children}
    </button>
  );
}

function Droppable({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children?: React.ReactNode;
}) {
  const { ref } = useDroppable({ id });
  return (
    <div
      ref={ref}
      className="w-48 h-48 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-center p-2 rounded-lg"
    >
      <span className="text-xs text-gray-500 mb-2">{label}</span>
      {children}
    </div>
  );
}

const Drag = () => {
  const items = [
    { id: "heart", name: "Зүрх", description: "Цус шахах эрхтэн" },
    { id: "lungs", name: "Уушиг", description: "Амьсгалах эрхтэн" },
    { id: "brain", name: "Тархи", description: "Удирдах эрхтэн" },
  ];

  const [placements, setPlacements] = useState<Record<string, string>>({});

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled || !event.operation.target) return;

        const sourceId = event.operation.source?.id as string;
        const targetId = event.operation.target.id as string;

        if (sourceId === targetId) {
          setPlacements((prev) => ({
            ...prev,
            [sourceId]: targetId,
          }));
        }
      }}
    >
      <div className="p-10">
        <h2 className="text-xl font-bold mb-4">
          Эрхтнүүдийг байранд нь тавина уу:
        </h2>

        <div className="flex gap-4 mb-10 p-4 bg-gray-100 rounded-xl min-h-20 justify-center">
          {items.map(
            (item) =>
              !placements[item.id] && (
                <Draggable key={item.id} id={item.id}>
                  {item.name}
                </Draggable>
              ),
          )}
        </div>

        <div className="flex gap-10">
          {items.map((item) => (
            <Droppable key={item.id} id={item.id} label={item.description}>
              {placements[item.id] ? (
                <Draggable id={item.id}>{item.name}</Draggable>
              ) : null}
            </Droppable>
          ))}
        </div>

        <button
          onClick={() => setPlacements({})}
          className="mt-10 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 mx-auto"
        >
          Reset Game
        </button>
      </div>
    </DragDropProvider>
  );
};

export default Drag;
