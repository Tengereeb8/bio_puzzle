"use client";
import { cn } from "@/app/lib/utils";
import { Bone, Skull, Activity } from "lucide-react";
import React, { useState, useEffect } from "react";

const Data = [
  { id: 1, text: "Гавлын яс", type: "term", icon: Skull },
  { id: 2, text: "Хавирга", type: "term", icon: Bone },
  { id: 3, text: "Дунд чөмөг", type: "term", icon: Activity },
  {
    id: 1,
    text: "Тархийг гадны нөлөөнөөс хамгаална",
    type: "definition",
  },
  {
    id: 2,
    text: "Цээжний хөндийн эрхтнүүдийг хамгаална",
    type: "definition",
  },
  {
    id: 3,
    text: "Биеийн тулгуур болж, хөдөлгөөнийг хангана",
    type: "definition",
  },
];

const MatchingGame = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selection, setSelection] = useState<any>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState<number[]>([]);

  useEffect(() => {
    const shuffled = [...Data].sort(() => Math.random() - 0.5);
    const sorted = shuffled.sort((a, b) => {
      if (a.icon && !b.icon) return -1;
      if (!a.icon && b.icon) return 1;
      return 0;
    });
    setItems(sorted);
  }, []);

  const handleSelect = (item: any, uniqueKey: string) => {
    if (solved.includes(item.id)) return;

    if (!selection) {
      setSelection({ ...item, uniqueKey });
      setWrongId(null);
    } else {
      if (selection.type === item.type) {
        if (selection.uniqueKey === uniqueKey) {
          setSelection(null);
        } else {
          setSelection({ ...item, uniqueKey });
        }
        return;
      }

      if (selection.id === item.id) {
        setSolved((prev) => [...prev, item.id]);
        setSelection(null);
      } else {
        setWrongId(uniqueKey);
        setTimeout(() => {
          setSelection(null);
          setWrongId(null);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto bg-white min-h-screen">
      {items.map((item, index) => {
        const uniqueKey = `${item.id}-${item.type}-${index}`;
        const isSelected = selection?.uniqueKey === uniqueKey;
        const isSolved = solved.includes(item.id);
        const isWrong = isSelected && wrongId;
        const hasIcon = !!item.icon;

        const iconColor = isSolved ? "text-white" : "text-gray-600";

        return (
          <button
            key={uniqueKey}
            onClick={() => handleSelect(item, uniqueKey)}
            className={cn(
              "w-full p-4 text-left rounded-[40px] border-[3px] transition-all duration-200 font-bold text-lg shadow-sm flex items-center gap-4 min-h-[90px]",
              "bg-white border-gray-200 text-gray-800",
              isSolved &&
                "bg-gray-50 border-green-500 text-green-700 opacity-60",
              isSelected && !wrongId && "border-blue-400 bg-blue-50",
              isWrong && "border-red-500 bg-red-50 text-red-700 animate-shake",
            )}
          >
            {hasIcon && (
              <div
                className={cn(
                  "w-14 h-14 rounded-full shrink-0 border-2 flex items-center justify-center transition-colors",
                  isSolved
                    ? "bg-green-500 border-green-600"
                    : "bg-gray-100 border-gray-200",
                  isSelected && !isSolved && !isWrong && "border-blue-300",
                )}
              >
                <item.icon size={28} className={iconColor} />
              </div>
            )}

            <span className="flex-1 leading-tight">{item.text}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MatchingGame;
