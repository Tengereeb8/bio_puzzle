"use client";
import { cn } from "@/app/lib/utils";
import { useState, useEffect } from "react";

interface Item {
  id: number;
  text: string;
  uniqueKey: string;
}

const initialData = [
  { id: 1, text: "Brain" },
  { id: 2, text: "Heart" },
  { id: 3, text: "Lungs" },
  { id: 4, text: "Bone" },
];

const MatchingGame = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [firstChoice, setFirstChoice] = useState<Item | null>(null);
  const [secondChoice, setSecondChoice] = useState<Item | null>(null);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const shuffled = [...initialData, ...initialData]
      .sort(() => Math.random() - 0.5)
      .map((item) => ({ ...item, uniqueKey: Math.random().toString() }));
    setItems(shuffled);
  }, []);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.id === secondChoice.id) {
        setSolved((prev) => [...prev, firstChoice.id]);
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  const handleChoice = (item: Item) => {
    if (disabled) return;
    if (firstChoice?.uniqueKey === item.uniqueKey) return;

    firstChoice ? setSecondChoice(item) : setFirstChoice(item);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Anatomy Match</h2>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const isSelected =
            firstChoice?.uniqueKey === item.uniqueKey ||
            secondChoice?.uniqueKey === item.uniqueKey;
          const isSolved = solved.includes(item.id);
          const isWrong =
            firstChoice &&
            secondChoice &&
            isSelected &&
            firstChoice.id !== secondChoice.id;

          return (
            <button
              key={item.uniqueKey}
              disabled={disabled || isSolved}
              onClick={() => handleChoice(item)}
              className={cn(
                "h-20 border-2 rounded-xl font-bold transition-all",
                "bg-white border-gray-200 text-gray-700",
                isSolved && "bg-green-100 border-green-500 text-green-700",
                isSelected &&
                  !isSolved &&
                  "border-blue-500 ring-2 ring-blue-100",
                isWrong &&
                  "bg-red-100 border-red-500 text-red-700 animate-shake",
              )}
            >
              {item.text}
            </button>
          );
        })}
      </div>

      {solved.length === initialData.length && (
        <button
          onClick={() => window.location.reload()}
          className="w-full mt-8 bg-black text-white py-3 rounded-lg font-bold"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default MatchingGame;
