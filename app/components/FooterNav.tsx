"use client";

import { motion, AnimatePresence } from "motion/react";
import { Map, Gamepad2, Menu } from "lucide-react";

type TabId = "roadmap" | "game" | "more";

interface FooterNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS = [
  { id: "roadmap" as const, label: "Roadmap", icon: Map },
  { id: "game" as const, label: "Game", icon: Gamepad2 },
  { id: "more" as const, label: "More", icon: Menu },
] as const;

export default function FooterNav({ activeTab, onTabChange }: FooterNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

      <div
        className="flex items-stretch justify-between px-4 bg-white/90 backdrop-blur-xl"
        style={{
          height: "72px",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <motion.button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 outline-none"
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-x-2 inset-y-2 rounded-2xl bg-green-50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-green-500"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                className="relative z-10"
                animate={isActive ? { y: -1, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-green-500" : "text-gray-400"
                  }`}
                />
              </motion.div>

              {/* Label */}
              <span
                className={`relative z-10 text-[11px] leading-none font-game transition-all duration-150 ${
                  isActive
                    ? "text-green-700 font-bold"
                    : "text-gray-400 font-semibold"
                }`}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
