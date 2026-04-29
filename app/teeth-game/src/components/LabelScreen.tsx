"use client";

import { useState, useMemo } from "react";
import type { LabelPart, DropZone } from "@/types";
import ToothDiagram from "./ToothDiagram";

interface LabelScreenProps {
  parts: LabelPart[];
  onComplete: (correct: number, total: number) => void;
}

const circleNumbers = ["①", "②", "③", "④", "⑤"];

export default function LabelScreen({ parts, onComplete }: LabelScreenProps) {
  const shuffled = useMemo(
    () => [...parts].sort(() => Math.random() - 0.5),
    [parts]
  );

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [dropZones, setDropZones] = useState<DropZone[]>(
    parts.map(() => ({ placed: null, state: "empty" as const }))
  );
  const [checked, setChecked] = useState(false);

  const usedWords = dropZones.map((dz) => dz.placed).filter(Boolean) as string[];
  const allFilled = dropZones.every((dz) => dz.placed !== null);

  function selectWord(word: string) {
    if (checked) return;
    setSelectedWord((prev) => (prev === word ? null : word));
  }

  function dropWord(zoneIndex: number) {
    if (checked || !selectedWord) return;

    setDropZones((prev) => {
      const next = [...prev];
      // Remove word from any existing zone
      next.forEach((dz, i) => {
        if (dz.placed === selectedWord && i !== zoneIndex) {
          next[i] = { placed: null, state: "empty" };
        }
      });
      next[zoneIndex] = { placed: selectedWord, state: "filled" };
      return next;
    });

    setSelectedWord(null);
  }

  function checkAnswers() {
    let correct = 0;
    const updated = dropZones.map((dz, i) => {
      const isCorrect = dz.placed === parts[i].name;
      if (isCorrect) correct++;
      return { ...dz, state: (isCorrect ? "correct" : "wrong") as DropZone["state"] };
    });
    setDropZones(updated);
    setChecked(true);
    setTimeout(() => onComplete(correct, parts.length), 1800);
  }

  function getZoneClass(dz: DropZone): string {
    const base = "border rounded-xl px-3 py-2.5 min-h-[44px] flex items-center justify-between text-sm transition-all cursor-pointer ";
    if (dz.state === "correct") return base + "border-green-400 bg-green-50 text-green-800";
    if (dz.state === "wrong") return base + "border-red-400 bg-red-50 text-red-800";
    if (dz.state === "filled") return base + "border-gray-400 bg-gray-50 text-gray-800";
    return base + "border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:bg-blue-50";
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">Label the Tooth Parts!</h2>
      <p className="text-sm text-gray-500 mb-4">
        Tap a word from the bank, then tap the matching number slot.
      </p>

      <div className="flex gap-4 items-start">
        {/* SVG diagram */}
        <div className="flex-shrink-0">
          <ToothDiagram />
        </div>

        {/* Drop zones */}
        <div className="flex-1 flex flex-col gap-2.5">
          {parts.map((part, i) => {
            const dz = dropZones[i];
            return (
              <div
                key={part.id}
                className={getZoneClass(dz)}
                onClick={() => dropWord(i)}
              >
                <span>
                  <span className="text-gray-400 mr-1">{circleNumbers[i]}</span>
                  {dz.placed ?? (
                    <span className="text-gray-300 italic">tap to place...</span>
                  )}
                </span>
                {dz.state === "correct" && <span>✓</span>}
                {dz.state === "wrong" && <span>✗</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 mt-4">
        {shuffled.map((part) => {
          const isUsed = usedWords.includes(part.name);
          const isSelected = selectedWord === part.name;
          return (
            <button
              key={part.name}
              onClick={() => selectWord(part.name)}
              disabled={checked}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all
                ${isUsed ? "opacity-30 pointer-events-none border-gray-200 bg-gray-50 text-gray-400" : ""}
                ${isSelected ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-300" : ""}
                ${!isUsed && !isSelected ? "border-gray-200 bg-gray-100 text-gray-700 hover:bg-white hover:border-gray-400 cursor-pointer" : ""}
              `}
            >
              {part.name}
            </button>
          );
        })}
      </div>

      {/* Hint row */}
      <div className="mt-3 flex flex-wrap gap-2">
        {parts.map((part, i) => (
          <span key={i} className="text-xs text-gray-400">
            {circleNumbers[i]} {part.hint}
          </span>
        ))}
      </div>

      <button
        onClick={checkAnswers}
        disabled={!allFilled || checked}
        className="mt-4 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Check My Answers!
      </button>
    </div>
  );
}
