import { useState } from "react";

export function ToothStructure() {
  // 0: Whole tooth, 1: Enamel removed, 2: Dentin removed (Pulp showing)
  const [sliceLevel, setSliceLevel] = useState(0);

  return (
    <div
      className="relative w-64 h-64 mx-auto cursor-pointer overflow-hidden rounded-3xl bg-slate-100 border-4 border-slate-200"
      onClick={() => setSliceLevel((prev) => (prev > 1 ? 0 : prev + 1))}
    >
      {/* Layer 3: Pulp (Inside) - Always at the bottom */}
      <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500 font-bold text-2xl">
        Pulp (Nerves) ⚡
      </div>

      {/* Layer 2: Dentin (Middle) */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-yellow-100 text-yellow-700 font-bold text-2xl transition-transform duration-500 origin-left ${sliceLevel > 1 ? "-translate-x-[110%] opacity-0" : "translate-x-0"}`}
      >
        Dentin (Middle) 🦴
      </div>

      {/* Layer 1: Enamel (Outer) */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-white text-slate-800 font-bold text-2xl shadow-inner transition-transform duration-500 origin-left ${sliceLevel > 0 ? "-translate-x-[110%] opacity-0" : "translate-x-0"}`}
      >
        Enamel (Outer) 🛡️
      </div>

      <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-gray-400 font-bold z-10 pointer-events-none">
        Tap to slice 🔪
      </div>
    </div>
  );
}
