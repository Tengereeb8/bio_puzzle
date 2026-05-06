"use client";

import { useState, useMemo } from "react";
import type { LabelPart, DropZone } from "./types";
import ToothDiagram from "./ToothDiagram";

const NUMBERS = ["①", "②", "③", "④", "⑤"];

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
  }
  return Math.abs(h) || 1;
}

function shuffleDeterministic<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let state = seed;
  const rnd = () => {
    state = (Math.imul(state, 1103515245) + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function zoneClass(dz: DropZone) {
  const base = "border-2 rounded-xl px-3 py-3 min-h-[48px] flex items-center justify-between text-sm transition-all active:scale-95 ";
  if (dz.state === "correct") return base + "border-green-400 bg-green-50 text-green-800";
  if (dz.state === "wrong") return base + "border-red-400 bg-red-50 text-red-800";
  if (dz.state === "filled") return base + "border-blue-400 bg-blue-50 text-blue-800";
  return base + "border-dashed border-gray-300 text-gray-400 bg-white";
}

export default function LabelScreen({
  parts,
  onComplete,
}: {
  parts: LabelPart[];
  onComplete: (correct: number, total: number) => void;
}) {
  const shuffled = useMemo(
    () =>
      shuffleDeterministic(
        parts,
        hashSeed(parts.map((p) => `${p.id}:${p.name}`).join("\0")),
      ),
    [parts],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [zones, setZones] = useState<DropZone[]>(parts.map(() => ({ placed: null, state: "empty" as const })));
  const [checked, setChecked] = useState(false);

  const used = zones.map((z) => z.placed).filter(Boolean) as string[];
  const allFilled = zones.every((z) => z.placed !== null);

  function pickWord(word: string) {
    if (checked) return;
    setSelected((prev) => (prev === word ? null : word));
  }

  function placeWord(i: number) {
    if (checked || !selected) return;
    setZones((prev) => {
      const next = [...prev];
      next.forEach((z, j) => {
        if (z.placed === selected && j !== i) next[j] = { placed: null, state: "empty" };
      });
      next[i] = { placed: selected, state: "filled" };
      return next;
    });
    setSelected(null);
  }

  function check() {
    let correct = 0;
    const updated = zones.map((z, i) => {
      const ok = z.placed === parts[i].name;
      if (ok) correct++;
      return { ...z, state: (ok ? "correct" : "wrong") as DropZone["state"] };
    });
    setZones(updated);
    setChecked(true);
    setTimeout(() => onComplete(correct, parts.length), 1800);
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Label the Tooth Parts!</h2>
      <p className="text-sm text-gray-500 mb-4">Tap a word, then tap the matching slot.</p>

      {/* Word bank — prominent on mobile, shown first */}
      <div className="flex flex-wrap gap-2 mb-5">
        {shuffled.map((part) => {
          const isUsed = used.includes(part.name);
          const isSel = selected === part.name;
          return (
            <button
              key={part.name}
              onClick={() => pickWord(part.name)}
              disabled={checked}
              className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all active:scale-95 touch-manipulation
                ${isUsed ? "opacity-25 pointer-events-none border-gray-200 bg-gray-50 text-gray-400" : ""}
                ${isSel ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-105" : ""}
                ${!isUsed && !isSel ? "border-gray-300 bg-white text-gray-700" : ""}
              `}
            >
              {part.name}
            </button>
          );
        })}
      </div>

      {/* Diagram + drop zones stacked on mobile */}
      <div className="flex flex-col items-center gap-4">
        <ToothDiagram />

        <div className="w-full flex flex-col gap-3">
          {parts.map((part, i) => {
            const z = zones[i];
            return (
              <div
                key={part.id}
                className={zoneClass(z)}
                onClick={() => placeWord(i)}
              >
                <span className="flex items-center gap-2">
                  <span className="text-gray-400 text-base font-bold">{NUMBERS[i]}</span>
                  <span className={z.placed ? "" : "text-gray-300 italic text-sm"}>
                    {z.placed ?? "tap to place..."}
                  </span>
                </span>
                <span className="text-lg">
                  {z.state === "correct" && "✓"}
                  {z.state === "wrong" && "✗"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hints */}
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1">
          {parts.map((part, i) => (
            <span key={i} className="text-xs text-gray-400">{NUMBERS[i]} {part.hint}</span>
          ))}
        </div>
      </div>

      <button
        onClick={check}
        disabled={!allFilled || checked}
        className="mt-6 w-full py-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-base rounded-2xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
      >
        Check My Answers!
      </button>
    </div>
  );
}
