"use client";

/**
 * KineticAnatomy – drag-and-drop anatomy game
 *
 * Install dependencies:
 *   npm install @dnd-kit/core @dnd-kit/utilities
 *
 * Usage in Next.js:
 *   Place this file at app/anatomy/page.tsx
 *   Place KineticAnatomy.module.css in the same folder
 */

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import styles from "./KineticAnatomy.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Organ {
  id: string;
  label: string;
  emoji: string;
  bg: string;
  border: string;
}

interface DropZone {
  id: string;
  label: string;
  x: number; // % from left
  y: number; // % from top
  accepts: string; // organId
}

interface Round {
  instruction: string;
  zones: DropZone[];
  organs: Organ[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ORGANS: Record<string, Organ> = {
  heart: {
    id: "heart",
    label: "Heart",
    emoji: "❤️",
    bg: "#fde8eb",
    border: "#f5aab8",
  },
  lungs: {
    id: "lungs",
    label: "Lungs",
    emoji: "🫁",
    bg: "#ddeeff",
    border: "#9dc4ed",
  },
  stomach: {
    id: "stomach",
    label: "Stomach",
    emoji: "🍽️",
    bg: "#fef3dc",
    border: "#f0c878",
  },
  brain: {
    id: "brain",
    label: "Brain",
    emoji: "🧠",
    bg: "#f0e8fa",
    border: "#d0adf0",
  },
  liver: {
    id: "liver",
    label: "Liver",
    emoji: "🫀",
    bg: "#fae0d8",
    border: "#e5aa98",
  },
  kidney: {
    id: "kidney",
    label: "Kidney",
    emoji: "🫘",
    bg: "#e4f2da",
    border: "#b0d49a",
  },
};

const ROUNDS: Round[] = [
  {
    instruction: "Place the organs correctly",
    zones: [
      { id: "z-heart", label: "Heart", x: 50, y: 34, accepts: "heart" },
      { id: "z-lungs", label: "Lungs", x: 50, y: 52, accepts: "lungs" },
      { id: "z-stomach", label: "Stomach", x: 50, y: 70, accepts: "stomach" },
    ],
    organs: [ORGANS.heart, ORGANS.lungs, ORGANS.stomach],
  },
  {
    instruction: "Place the upper organs",
    zones: [
      { id: "z-brain", label: "Brain", x: 50, y: 18, accepts: "brain" },
      { id: "z-heart", label: "Heart", x: 50, y: 40, accepts: "heart" },
      { id: "z-lungs", label: "Lungs", x: 50, y: 60, accepts: "lungs" },
    ],
    organs: [ORGANS.brain, ORGANS.heart, ORGANS.lungs],
  },
  {
    instruction: "Complete the digestive system",
    zones: [
      { id: "z-stomach", label: "Stomach", x: 50, y: 38, accepts: "stomach" },
      { id: "z-liver", label: "Liver", x: 30, y: 56, accepts: "liver" },
      { id: "z-kidney", label: "Kidney", x: 70, y: 56, accepts: "kidney" },
    ],
    organs: [ORGANS.stomach, ORGANS.liver, ORGANS.kidney],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** A draggable organ card in the tray */
function DraggableOrgan({
  organ,
  placed,
  shaking,
}: {
  organ: Organ;
  placed: boolean;
  shaking: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: organ.id, disabled: placed });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={[
        styles.organCard,
        placed ? styles.placed : "",
        isDragging ? styles.isDragging : "",
        shaking ? styles.shake : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <OrganIcon organ={organ} />
      <span className={styles.organLabel}>{organ.label}</span>
    </div>
  );
}

/** Reusable icon box (used in tray card & drag overlay) */
function OrganIcon({ organ }: { organ: Organ }) {
  return (
    <div
      className={styles.organIcon}
      style={{ background: organ.bg, borderColor: organ.border }}
    >
      {organ.emoji}
    </div>
  );
}

/** A droppable zone on the body */
function DroppableZone({
  zone,
  filledOrgan,
  isWrong,
}: {
  zone: DropZone;
  filledOrgan: Organ | null;
  isWrong: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: zone.id });

  const cls = [
    styles.dropZone,
    isOver ? styles.isOver : "",
    isWrong ? styles.wrong : "",
    filledOrgan ? styles.filled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      className={cls}
      style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
    >
      {filledOrgan ? (
        <span className={styles.filledOrgan}>{filledOrgan.emoji}</span>
      ) : (
        <>
          <span className={styles.dropZonePlus}>+</span>
          <span className={styles.dropZoneLabel}>{zone.label}</span>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KineticAnatomy() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [placed, setPlaced] = useState<Record<string, string>>({}); // zoneId → organId
  const [wrongZone, setWrongZone] = useState<string | null>(null);
  const [shakingOrgan, setShakedOrgan] = useState<string | null>(null);
  const [activeOrgan, setActiveOrgan] = useState<Organ | null>(null);
  const [complete, setComplete] = useState(false);

  const round = ROUNDS[roundIdx];
  const totalRounds = ROUNDS.length;
  const placedOrgans = Object.values(placed);

  // Sensors — pointer (mouse/pen) + touch
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
  );

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const organ = round.organs.find((o) => o.id === active.id);
      setActiveOrgan(organ ?? null);
    },
    [round],
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveOrgan(null);

      if (!over) return;

      const organId = active.id as string;
      const zoneId = over.id as string;
      const zone = round.zones.find((z) => z.id === zoneId);

      if (!zone) return;

      if (zone.accepts === organId) {
        // ✅ Correct
        const newPlaced = { ...placed, [zoneId]: organId };
        setPlaced(newPlaced);

        if (Object.keys(newPlaced).length === round.zones.length) {
          setTimeout(() => {
            if (roundIdx < totalRounds - 1) {
              setRoundIdx((r) => r + 1);
              setPlaced({});
            } else {
              setComplete(true);
            }
          }, 700);
        }
      } else {
        // ❌ Wrong
        setWrongZone(zoneId);
        setShakedOrgan(organId);
        setTimeout(() => {
          setWrongZone(null);
          setShakedOrgan(null);
        }, 600);
      }
    },
    [placed, round, roundIdx, totalRounds],
  );

  const handleRestart = () => {
    setRoundIdx(0);
    setPlaced({});
    setComplete(false);
  };

  // progress 0→100
  const progressPct = Math.round(
    ((roundIdx + Object.keys(placed).length / round.zones.length) /
      totalRounds) *
      100,
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.app}>
        {/* ── Win overlay ── */}
        {complete && (
          <div className={styles.winOverlay}>
            <div className={styles.winEmoji}>🏆</div>
            <div className={styles.winTitle}>All Rounds Complete!</div>
            <div className={styles.winSub}>
              You placed every organ correctly.
              <br />
              Great work, anatomist!
            </div>
            <button className={styles.restartBtn} onClick={handleRestart}>
              Play Again
            </button>
          </div>
        )}

        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles.menuBtn}>
            <span />
            <span />
            <span />
          </div>
          <span className={styles.headerTitle}>Kinetic Anatomy</span>
          <div className={styles.avatar}>🧑</div>
        </header>

        {/* ── Instruction ── */}
        <h2 className={styles.instruction}>{round.instruction}</h2>

        {/* ── Progress ── */}
        <div className={styles.progressRow}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {roundIdx + 1}/{totalRounds}
          </span>
        </div>

        {/* ── Stage ── */}
        <div className={styles.stage}>
          {/* glowing cavity outline */}
          <div className={styles.cavityRing} />

          {/* human body SVG silhouette */}
          <div className={styles.humanBody}>
            <svg
              viewBox="0 0 200 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* head */}
              <ellipse
                cx="100"
                cy="38"
                rx="30"
                ry="36"
                fill="rgba(220,170,110,0.55)"
              />
              {/* neck */}
              <rect
                x="88"
                y="70"
                width="24"
                height="22"
                rx="8"
                fill="rgba(210,155,95,0.45)"
              />
              {/* shoulders + torso */}
              <path
                d="M30 92 Q20 95 18 130 L18 290 Q18 310 40 315 L60 318 L60 420 L140 420 L140 318 L160 315 Q182 310 182 290 L182 130 Q180 95 170 92 Q140 82 100 82 Q60 82 30 92Z"
                fill="rgba(200,145,88,0.50)"
              />
              {/* left arm */}
              <path
                d="M30 100 Q10 110 8 160 L10 230 Q12 245 22 248 L30 250 L35 170 L38 108Z"
                fill="rgba(195,140,82,0.42)"
              />
              {/* right arm */}
              <path
                d="M170 100 Q190 110 192 160 L190 230 Q188 245 178 248 L170 250 L165 170 L162 108Z"
                fill="rgba(195,140,82,0.42)"
              />
              {/* sternum line */}
              <line
                x1="100"
                y1="90"
                x2="100"
                y2="250"
                stroke="rgba(140,80,30,0.30)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* collar bones */}
              <path
                d="M60 94 Q80 88 100 90 Q120 88 140 94"
                stroke="rgba(140,80,30,0.28)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* ── Drop zones ── */}
          {round.zones.map((zone) => (
            <DroppableZone
              key={zone.id}
              zone={zone}
              filledOrgan={placed[zone.id] ? ORGANS[placed[zone.id]] : null}
              isWrong={wrongZone === zone.id}
            />
          ))}
        </div>

        {/* ── Organ Tray ── */}
        <div className={styles.tray}>
          <div className={styles.trayTitle}>Organ Tray</div>
          <div className={styles.trayOrgans}>
            {round.organs.map((organ) => (
              <DraggableOrgan
                key={organ.id}
                organ={organ}
                placed={placedOrgans.includes(organ.id)}
                shaking={shakingOrgan === organ.id}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom Nav ── */}
        <nav className={styles.bottomNav}>
          {(
            [
              { icon: "🗺️", label: "Map" },
              { icon: "🎮", label: "Games", active: true },
              { icon: "✅", label: "Tasks" },
              { icon: "📊", label: "Leaderboard" },
            ] as const
          ).map(({ icon, label }) => (
            <div
              key={label}
              className={[styles.navItem, activeOrgan ? styles.activeNav : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <div className={styles.navIcon}>{icon}</div>
              <span className={styles.navLabel}>{label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Drag overlay (follows cursor) ── */}
      <DragOverlay dropAnimation={null}>
        {activeOrgan ? (
          <div className={styles.dragOverlayCard}>
            <OrganIcon organ={activeOrgan} />
            <span className={styles.organLabel}>{activeOrgan.label}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
