"use client";

import { motion, AnimatePresence } from "motion/react";
import { Map, Gamepad2, Menu } from "lucide-react";

interface FooterNavProps {
  activeTab: "roadmap" | "game" | "more";
  onTabChange: (tab: "roadmap" | "game" | "more") => void;
}

export default function FooterNav({ activeTab, onTabChange }: FooterNavProps) {
  const tabs = [
    { id: "roadmap" as const, label: "Roadmap", icon: Map },
    { id: "game" as const, label: "Game", icon: Gamepad2 },
    { id: "more" as const, label: "More", icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Frosted glass top border */}
      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

      <div
        className="flex items-stretch justify-between px-4 bg-white/90 backdrop-blur-xl"
        style={{
          height: "72px",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 outline-none"
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {/* Pill background */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-x-2 inset-y-2 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #e8fde7 0%, #d4f5d0 100%)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              {/* Top indicator dot */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full"
                    style={{ background: "#58CC02" }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <motion.div
                className="relative z-10"
                animate={isActive ? { y: -1, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{
                    color: isActive ? "#58CC02" : "#9CA3AF",
                    filter: isActive
                      ? "drop-shadow(0 2px 4px rgba(88,204,2,0.35))"
                      : "none",
                    transition: "color 0.2s, filter 0.2s",
                  }}
                />
              </motion.div>

              {/* Label */}
              <motion.span
                className="relative z-10 text-xs leading-none"
                animate={
                  isActive
                    ? { color: "#3a9a00", fontWeight: 700 }
                    : { color: "#9CA3AF", fontWeight: 600 }
                }
                transition={{ duration: 0.15 }}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  letterSpacing: isActive ? "0.01em" : "0",
                }}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
