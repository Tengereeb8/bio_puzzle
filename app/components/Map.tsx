import React from "react";
import {
  Dumbbell,
  Heart,
  Bone,
  Brain,
  Shield,
  Activity,
  Syringe,
} from "lucide-react";
import { cn } from "../lib/utils";

const nodes: Node[] = [
  {
    id: 1,
    label: "ТАРХИ",
    icon: Brain,
    status: "locked",
    color: "bg-gray-400",
    x: 50,
    y: 100,
  },
  {
    id: 2,
    label: "ДОТООД ШҮҮРЭЛ",
    icon: Activity,
    status: "locked",
    color: "bg-gray-400",
    x: 85,
    y: 300,
  },
  {
    id: 3,
    label: "ДАРХЛАА",
    icon: Shield,
    status: "locked",
    color: "bg-gray-400",
    x: 30,
    y: 400,
  },
  {
    id: 4,
    label: "АМЬСГАЛЫН СИСТЕМ",
    icon: Syringe,
    status: "locked",
    color: "bg-gray-400",
    x: 50,
    y: 600,
  },
  {
    id: 5,
    label: "ЗҮРХ",
    icon: Heart,
    status: "current",
    color: "bg-red-500",
    x: 70,
    y: 750,
  },
  {
    id: 6,
    label: "БУЛЧИН",
    icon: Dumbbell,
    status: "completed",
    color: "bg-blue-400",
    x: 20,
    y: 950,
  },
  {
    id: 7,
    label: "ХЭЛХЭЭ ЯС",
    icon: Bone,
    status: "completed",
    color: "bg-green-500",
    x: 60,
    y: 1100,
  },
];

interface Node {
  id: number;
  label: string;
  icon: React.ElementType;
  status: "completed" | "current" | "locked";
  color: string;
  x: number;
  y: number;
}

const createPath = (nodes: Node[]) => {
  if (nodes.length === 0) return "";
  let d = `M ${nodes[0].x} ${nodes[0].y}`;

  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const controlY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${controlY}, ${curr.x} ${controlY}, ${curr.x} ${curr.y}`;
  }
  return d;
};

export default function LearningMap() {
  const displayNodes = [...nodes].reverse();

  return (
    <div className="relative w-full max-w-md mx-auto bg-gray-50 min-h-screen overflow-x-hidden pb-20">
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 1150"
        preserveAspectRatio="none"
      >
        <path
          d={createPath(nodes)}
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="7 8"
          className="animate-path-flow"
        />
      </svg>

      <div className="relative h-287.5 w-full">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${node.x}%`,
              top: `${node.y}px`,
            }}
          >
            {node.status === "current" && (
              <div className="absolute -top-14 z-20 bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs animate-bounce whitespace-nowrap shadow-md">
                ЭНДЭЭС ЭХЭЛ!
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-red-600" />
              </div>
            )}

            <button
              className={cn(
                "relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-b-[6px] sm:border-b-8 flex items-center justify-center transition-all active:border-b-0 active:translate-y-1",
                node.status === "locked"
                  ? "bg-gray-200 border-gray-300"
                  : `${node.color} border-black/10`,
                node.status === "current" && "ring-4 ring-red-100",
              )}
            >
              <node.icon
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10",
                  node.status === "locked" ? "text-gray-400" : "text-white",
                )}
              />

              {node.status === "completed" && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>

            <span className="mt-3 font-bold text-gray-500 text-[10px] sm:text-xs tracking-tighter text-center uppercase max-w-[80px]">
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
