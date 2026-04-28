export function ToothCare() {
  return (
    <div className="flex justify-center gap-8 p-8 bg-green-50 rounded-3xl">
      <div className="flex flex-col items-center">
        <span className="text-7xl mb-4">🪥</span>
        <h3 className="text-2xl font-black text-green-800">Brush Twice</h3>
      </div>
      <div className="w-1 bg-green-200 rounded-full" /> {/* Divider */}
      <div className="flex flex-col items-center">
        <span className="text-7xl mb-4 text-red-500">
          🍬<span className="absolute text-red-600 font-black">🚫</span>
        </span>
        <h3 className="text-2xl font-black text-red-800">Less Sugar</h3>
      </div>
    </div>
  );
}
