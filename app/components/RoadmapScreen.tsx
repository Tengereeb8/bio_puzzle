"use client";

import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { useId, useMemo } from "react";
import { Lock, CheckCircle, Sparkles, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { BodyPartIcon } from "./ToothSVG";

interface Chapter {
  id: string;
  title: string;
  titleMn: string;
  iconType: string;
  color: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

/** Serpentine in viewBox width 128; one segment per chapter row (matches vertical rhythm). */
function buildSerpentinePath(n: number, stepY: number): string {
  if (n <= 0) return "";
  let d = "M 64 0";
  for (let i = 0; i < n; i++) {
    const y1 = (i + 1) * stepY;
    const mid = (i * stepY + y1) / 2;
    const cx = i % 2 === 0 ? 38 : 90;
    d += ` Q ${cx} ${mid} 64 ${y1}`;
  }
  return d;
}

function ChapterProgressRing({
  progress,
  gradId,
}: {
  progress: number;
  gradId: string;
}) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, progress));
  const dash = (pct / 100) * c;

  return (
    <svg
      className="absolute inset-0 size-full -rotate-90 pointer-events-none"
      viewBox="0 0 100 100"
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
        >
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fffbeb" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="5"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
      />
    </svg>
  );
}

export default function RoadmapScreen({
  chapters,
  totalPoints,
  streakDays,
  onChapterClick,
}: {
  chapters: Chapter[];
  totalPoints: number;
  streakDays: number;
  onChapterClick: (id: string) => void;
}) {
  const completedCount = chapters.filter((c) => c.isCompleted).length;
  const reactId = useId().replace(/:/g, "");
  const pathStrokeId = `rs-${reactId}-trail`;
  const pathBlurId = `rs-${reactId}-blur`;
  const headerShineId = `rs-${reactId}-header-shine`;

  const rowStep = 192;
  const pathD = useMemo(
    () => buildSerpentinePath(chapters.length, rowStep),
    [chapters.length],
  );
  const svgViewHeight = Math.max(chapters.length, 1) * rowStep;

  return (
    <div className="min-h-screen relative bg-linear-to-b from-orange-50 to-amber-50/80">
      <div className="relative overflow-hidden bg-[#fa8e1b] text-white px-4 sm:px-8 pt-6 pb-10 sm:pb-12 rounded-b-[2rem] sm:rounded-b-[2.5rem] shadow-md shadow-orange-900/10">
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.18] pointer-events-none"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={headerShineId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="45%" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${headerShineId})`} />
        </svg>

        <div className="relative max-w-2xl mx-auto">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-game-black tracking-tight">
              Бие Махбодын Аялал
            </h1>
            <p className="text-white/85 text-sm mt-1">Өөрийнхөө биеийг судал!</p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 max-w-md mx-auto sm:max-w-none sm:flex sm:flex-wrap sm:justify-center sm:items-stretch sm:gap-8">
            {[
              {
                icon: (
                  <Sparkles
                    size={22}
                    className="text-amber-100 sm:size-6"
                    strokeWidth={2}
                  />
                ),
                value: completedCount,
                label: "Бүлэг дууссан",
              },
              {
                icon: (
                  <Zap
                    size={22}
                    className="text-amber-100 sm:size-6"
                    strokeWidth={2}
                  />
                ),
                value: totalPoints,
                label: "Нийт оноо",
              },
              {
                icon: (
                  <Flame
                    size={22}
                    className="text-amber-100 sm:size-6"
                    strokeWidth={2}
                  />
                ),
                value: streakDays,
                label: "Дараалал",
              },
            ].map(({ icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-2 py-3 sm:px-4 sm:py-3 text-center min-w-0"
              >
                <div className="flex justify-center mb-1 [&_svg]:shrink-0">{icon}</div>
                <p className="text-xl sm:text-2xl font-bold tabular-nums leading-none">
                  {value}
                </p>
                <p className="text-[10px] sm:text-xs opacity-90 mt-1.5 leading-tight">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-xl sm:max-w-2xl mx-auto px-3 sm:px-6 pb-16">
        <svg
          className="absolute left-1/2 top-0 -translate-x-1/2 w-20 sm:w-28 pointer-events-none z-0"
          style={{ height: `${svgViewHeight}px` }}
          viewBox={`0 0 128 ${svgViewHeight}`}
          preserveAspectRatio="xMidYMin meet"
          aria-hidden
        >
          <defs>
            <linearGradient
              id={pathStrokeId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#f9a8d4" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.85" />
            </linearGradient>
            <filter
              id={pathBlurId}
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d={pathD}
            stroke={`url(#${pathStrokeId})`}
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            opacity={0.35}
            filter={`url(#${pathBlurId})`}
            initial={false}
          />
          <motion.path
            d={pathD}
            stroke={`url(#${pathStrokeId})`}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="18 14"
            animate={{ strokeDashoffset: [0, -32] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <div className="relative z-10 flex flex-col pt-8 sm:pt-10">
          {chapters.map((chapter, index) => {
            const ringGradId = `rs-${reactId}-prog-${chapter.id}`;

            return (
              <div
                key={chapter.id}
                className={cn(
                  "flex w-full min-h-[168px] sm:min-h-[192px] items-center",
                  "justify-center",
                  index % 2 === 0
                    ? "sm:justify-start sm:pl-[5%] md:pl-[9%] lg:pl-[14%]"
                    : "sm:justify-end sm:pr-[5%] md:pr-[9%] lg:pr-[14%]",
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    chapter.isUnlocked && onChapterClick(chapter.id)
                  }
                  disabled={!chapter.isUnlocked}
                  className="relative group outline-none focus-visible:ring-4 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-50 rounded-full"
                >
                  <div
                    className={`relative size-28 sm:size-32 rounded-full flex flex-col items-center justify-center shadow-xl border-4 overflow-hidden ${
                      chapter.isUnlocked
                        ? "border-white ring-2 ring-white/40"
                        : "border-gray-300 opacity-65 grayscale"
                    }`}
                    style={{
                      backgroundColor: chapter.isUnlocked
                        ? chapter.color
                        : "#E5E7EB",
                    }}
                  >
                    {chapter.isUnlocked &&
                      !chapter.isCompleted &&
                      chapter.progress > 0 && (
                        <ChapterProgressRing
                          progress={chapter.progress}
                          gradId={ringGradId}
                        />
                      )}

                    <div className="relative z-1 flex size-11 sm:size-13 items-center justify-center text-white [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:shrink-0">
                      <BodyPartIcon
                        type={
                          chapter.iconType as ComponentProps<
                            typeof BodyPartIcon
                          >["type"]
                        }
                        size={52}
                        color="white"
                      />
                    </div>

                    {!chapter.isUnlocked && (
                      <div className="absolute inset-0 z-2 flex items-center justify-center bg-black/35 rounded-full backdrop-blur-[2px]">
                        <Lock
                          size={36}
                          className="text-white sm:size-10"
                          strokeWidth={2.5}
                        />
                      </div>
                    )}

                    {chapter.isCompleted && (
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-2 bg-green-500 rounded-full p-1.5 sm:p-2 shadow-lg border-[3px] sm:border-4 border-white">
                        <CheckCircle
                          className="size-6 sm:size-7 text-white"
                          fill="#22c55e"
                        />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
