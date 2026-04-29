"use client";

import ToothGame from "./teeth-game/ToothGame";

export default function GameView() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 overflow-auto pb-24">
      <div className="flex flex-col items-center px-4 pt-6">
        <div className="w-full max-w-lg">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-5">
            🦷 Teeth Game
          </h2>
          <ToothGame />
        </div>
      </div>
    </div>
  );
}