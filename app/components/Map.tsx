import React from "react";
import {
  Dumbbell,
  Heart,
  Bone,
  Brain,
  Shield,
  Wind,
  Activity,
} from "lucide-react";
import { cn } from "../lib/utils";

interface Node {
  id: number;
  label: string;
  icon: React.ElementType;
  status: "completed" | "current" | "locked";
  color: string;
  offset: number;
}

const nodes: Node[] = [
  {
    id: 1,
    label: "ТАРХИ",
    icon: Brain,
    status: "locked",
    color: "bg-gray-400",
    offset: 0,
  },
  {
    id: 2,
    label: "ДОТООД ШҮҮРЭЛ",
    icon: Activity,
    status: "locked",
    color: "bg-gray-400",
    offset: 1,
  },
  {
    id: 3,
    label: "ДАРХЛАА",
    icon: Shield,
    status: "locked",
    color: "bg-gray-400",
    offset: -1,
  },
  {
    id: 4,
    label: "АМЬСГАЛЫН СИСТЕМ",
    icon: Wind,
    status: "locked",
    color: "bg-gray-400",
    offset: 0,
  },
  {
    id: 5,
    label: "ЗҮРХ",
    icon: Heart,
    status: "current",
    color: "bg-red-500",
    offset: 0,
  },
  {
    id: 6,
    label: "БУЛЧИН",
    icon: Dumbbell,
    status: "completed",
    color: "bg-blue-400",
    offset: -0.5,
  },
  {
    id: 7,
    label: "ХЭЛХЭЭ ЯС",
    icon: Bone,
    status: "completed",
    color: "bg-green-500",
    offset: 0,
  },
];

export default function Map() {
  return (
    <div className="relative flex flex-col items-center py-20 bg-gray-50 min-h-screen overflow-hidden w-110">
      <svg
        className="absolute top-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 1200"
        preserveAspectRatio="xMidYMin slice"
      >
        <path
          d="M 200 100 Q 350 250 200 400 T 50 700 T 200 1000 T 200 1300"
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="25 20"
          className="animate-path-flow"
        />
      </svg>

      <div className="flex flex-col-reverse gap-24 w-full max-w-md px-10">
        {nodes.reverse().map((node) => (
          <div
            key={node.id}
            className="relative flex flex-col items-center transition-transform hover:scale-105"
            style={{ transform: `translateX(${node.offset * 80}px)` }}
          >
            {node.status === "current" && (
              <div className="absolute -top-16 bg-red-700 text-white px-4 py-2 rounded-xl font-bold animate-bounce shadow-lg">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-red-700" />
                Start Here
              </div>
            )}

            <button
              className={cn(
                "relative z-10 w-24 h-24 rounded-full border-b-8 flex items-center justify-center transition-all active:border-b-0 active:translate-y-2",
                node.status === "locked"
                  ? "bg-gray-200 border-gray-300"
                  : `${node.color} border-black/20`,
                node.status === "current" && "ring-8 ring-red-100",
              )}
            >
              <node.icon
                className={cn(
                  "w-12 h-12",
                  node.status === "locked" ? "text-gray-400" : "text-white",
                )}
              />

              {node.status === "completed" && (
                <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1 border-4 border-gray-50">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              )}
            </button>

            <span className="mt-4 font-black text-gray-500 text-sm tracking-widest text-center uppercase">
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
