"use client";

import { useState, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Organ {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
}

interface DropZone {
  id: string;
  label: string;
  x: number; // percent
  y: number; // percent
  acceptsOrgan: string;
}

interface Round {
  instruction: string;
  dropZones: DropZone[];
  organs: Organ[];
}

// ─── Game Data ────────────────────────────────────────────────────────────────
const ORGANS: Record<string, Organ> = {
  heart: {
    id: "heart",
    label: "Heart",
    emoji: "🫀",
    color: "#e05c6e",
    bg: "#fde8eb",
    border: "#f5aab8",
  },
  lungs: {
    id: "lungs",
    label: "Lungs",
    emoji: "🫁",
    color: "#5b9bd5",
    bg: "#ddeeff",
    border: "#9dc4ed",
  },
  stomach: {
    id: "stomach",
    label: "Stomach",
    emoji: "🍽️",
    color: "#d4982e",
    bg: "#fef3dc",
    border: "#f0c878",
  },
  brain: {
    id: "brain",
    label: "Brain",
    emoji: "🧠",
    color: "#9b6ec8",
    bg: "#f0e8fa",
    border: "#d0adf0",
  },
  liver: {
    id: "liver",
    label: "Liver",
    emoji: "",
    color: "#c0694e",
    bg: "#fae0d8",
    border: "#e5aa98",
  },
  kidney: {
    id: "kidney",
    label: "Kidney",
    emoji: "🫘",
    color: "#7a9e5f",
    bg: "#e4f2da",
    border: "#b0d49a",
  },
};

const ROUNDS: Round[] = [
  {
    instruction: "Place the organs correctly",
    dropZones: [
      { id: "dz-heart", label: "Heart", x: 48, y: 36, acceptsOrgan: "heart" },
      { id: "dz-lungs", label: "Lungs", x: 48, y: 52, acceptsOrgan: "lungs" },
      {
        id: "dz-stomach",
        label: "Stomach",
        x: 48,
        y: 68,
        acceptsOrgan: "stomach",
      },
    ],
    organs: [ORGANS.heart, ORGANS.lungs, ORGANS.stomach],
  },
  {
    instruction: "Place the upper organs",
    dropZones: [
      { id: "dz-brain", label: "Brain", x: 48, y: 22, acceptsOrgan: "brain" },
      { id: "dz-heart", label: "Heart", x: 48, y: 42, acceptsOrgan: "heart" },
      { id: "dz-lungs", label: "Lungs", x: 48, y: 60, acceptsOrgan: "lungs" },
    ],
    organs: [ORGANS.brain, ORGANS.heart, ORGANS.lungs],
  },
  {
    instruction: "Complete the digestive system",
    dropZones: [
      {
        id: "dz-stomach",
        label: "Stomach",
        x: 48,
        y: 40,
        acceptsOrgan: "stomach",
      },
      { id: "dz-liver", label: "Liver", x: 32, y: 55, acceptsOrgan: "liver" },
      {
        id: "dz-kidney",
        label: "Kidney",
        x: 64,
        y: 55,
        acceptsOrgan: "kidney",
      },
    ],
    organs: [ORGANS.stomach, ORGANS.liver, ORGANS.kidney],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function KineticAnatomy() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [placed, setPlaced] = useState<Record<string, string>>({}); // dzId → organId
  const [dragging, setDragging] = useState<string | null>(null);
  const [wrongZone, setWrongZone] = useState<string | null>(null);
  const [correct, setCorrect] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const dragOrgan = useRef<string | null>(null);

  const round = ROUNDS[roundIdx];
  const totalRounds = ROUNDS.length;

  const placedOrgans = Object.values(placed);

  const handleDragStart = (organId: string) => {
    dragOrgan.current = organId;
    setDragging(organId);
  };

  const handleDragEnd = () => {
    setDragging(null);
    dragOrgan.current = null;
  };

  const handleDrop = useCallback(
    (dzId: string) => {
      const organId = dragOrgan.current;
      if (!organId) return;
      const dz = round.dropZones.find((z) => z.id === dzId);
      if (!dz) return;

      if (dz.acceptsOrgan === organId) {
        const newPlaced = { ...placed, [dzId]: organId };
        setPlaced(newPlaced);
        setCorrect((c) => [...c, dzId]);

        if (Object.keys(newPlaced).length === round.dropZones.length) {
          setTimeout(() => {
            if (roundIdx < totalRounds - 1) {
              setRoundIdx((r) => r + 1);
              setPlaced({});
              setCorrect([]);
            } else {
              setGameComplete(true);
            }
          }, 800);
        }
      } else {
        setWrongZone(dzId);
        setShake(organId);
        setTimeout(() => {
          setWrongZone(null);
          setShake(null);
        }, 600);
      }
    },
    [placed, round, roundIdx, totalRounds],
  );

  const handleRestart = () => {
    setRoundIdx(0);
    setPlaced({});
    setCorrect([]);
    setGameComplete(false);
  };

  const progressPct = ((roundIdx / totalRounds) * 100).toFixed(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Nunito', sans-serif;
          background: #f0f4ff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .app {
          width: 390px;
          min-height: 844px;
          background: #f7f9ff;
          border-radius: 40px;
          box-shadow: 0 30px 80px rgba(60,80,180,0.18);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          border: 2px solid #d0d8ff;
        }

        /* ── Header ── */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 12px;
        }
        .header-menu {
          width: 36px; height: 36px;
          display: flex; flex-direction: column;
          gap: 5px; justify-content: center;
          cursor: pointer;
        }
        .header-menu span {
          display: block; height: 2.5px;
          background: #555; border-radius: 2px;
        }
        .header-title {
          font-size: 15px; font-weight: 900;
          letter-spacing: 1.5px; color: #3dba5e;
          text-transform: uppercase;
        }
        .header-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #4e7df8, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        /* ── Instruction ── */
        .instruction {
          text-align: center;
          font-size: 22px; font-weight: 900;
          color: #3dba5e;
          line-height: 1.3;
          padding: 8px 32px 4px;
        }

        /* ── Progress ── */
        .progress-row {
          display: flex; align-items: center;
          gap: 10px; padding: 8px 28px 4px;
        }
        .progress-track {
          flex: 1; height: 10px;
          background: #e0e8f5;
          border-radius: 10px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; background: #3dba5e;
          border-radius: 10px;
          transition: width 0.5s cubic-bezier(.4,0,.2,1);
        }
        .progress-label {
          font-size: 13px; font-weight: 700; color: #8895b3;
        }

        /* ── Body Stage ── */
        .stage {
          flex: 1;
          position: relative;
          margin: 10px 20px;
          background: #eef2fc;
          border-radius: 28px;
          overflow: hidden;
          min-height: 380px;
        }

        /* outer ellipse */
        .body-outer {
          position: absolute;
          width: 78%; height: 88%;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border: 2.5px dashed #b8c8f0;
          border-radius: 50% 50% 44% 44% / 55% 55% 45% 45%;
          background: rgba(255,255,255,0.35);
        }
        /* inner ellipse */
        .body-inner {
          position: absolute;
          width: 52%; height: 65%;
          top: 42%; left: 50%;
          transform: translate(-50%, -50%);
          border: 2px dashed #c8d8f8;
          border-radius: 50% 50% 44% 44% / 55% 55% 45% 45%;
          background: rgba(255,255,255,0.2);
        }

        /* silhouette */
        .silhouette {
          position: absolute;
          width: 60%; height: 85%;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.13;
          background: #6080c0;
          border-radius: 38% 38% 30% 30% / 45% 45% 30% 30%;
          clip-path: polygon(
            35% 0%, 65% 0%,
            75% 8%, 80% 22%, 76% 35%,
            88% 42%, 90% 65%,
            80% 70%, 75% 100%,
            25% 100%, 20% 70%,
            10% 65%, 12% 42%,
            24% 35%, 20% 22%,
            25% 8%
          );
        }

        /* Drop zones on body */
        .drop-zone {
          position: absolute;
          width: 54px; height: 54px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 2.5px dashed #93aad8;
          background: rgba(255,255,255,0.55);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
          cursor: default;
        }
        .drop-zone.active {
          border-color: #3dba5e;
          background: rgba(61,186,94,0.12);
          transform: translate(-50%, -50%) scale(1.12);
        }
        .drop-zone.wrong {
          border-color: #e05c6e;
          background: rgba(224,92,110,0.12);
          animation: wrongShake 0.5s ease;
        }
        .drop-zone.filled {
          border-color: #3dba5e;
          border-style: solid;
          background: rgba(61,186,94,0.15);
          transform: translate(-50%, -50%) scale(1);
        }
        .drop-zone-label {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%; transform: translateX(-50%);
          font-size: 10px; font-weight: 700;
          color: #7a90c0;
          white-space: nowrap;
          letter-spacing: 0.4px;
        }
        .drop-zone-inner {
          font-size: 22px;
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
        }
        .drop-zone.filled .drop-zone-inner {
          transform: scale(1.1);
        }

        /* checkmark ring */
        .check-ring {
          position: absolute;
          width: 54px; height: 54px;
          border-radius: 50%;
          border: 2.5px solid #3dba5e;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1);
        }

        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes wrongShake {
          0%,100% { transform: translate(-50%,-50%) rotate(0); }
          20% { transform: translate(-48%,-50%) rotate(-4deg); }
          40% { transform: translate(-52%,-50%) rotate(4deg); }
          60% { transform: translate(-47%,-50%) rotate(-3deg); }
          80% { transform: translate(-53%,-50%) rotate(2deg); }
        }

        /* ── Organ Tray ── */
        .tray {
          background: #fff;
          margin: 12px 16px 16px;
          border-radius: 24px;
          padding: 16px 20px 20px;
          box-shadow: 0 4px 20px rgba(60,80,180,0.08);
        }
        .tray-title {
          text-align: center;
          font-size: 15px; font-weight: 800;
          color: #2a3458; letter-spacing: 0.3px;
          margin-bottom: 14px;
        }
        .tray-organs {
          display: flex; gap: 16px; justify-content: center;
          flex-wrap: wrap;
        }

        .organ-card {
          display: flex; flex-direction: column;
          align-items: center; gap: 6px;
          cursor: grab;
          transition: transform 0.2s ease, opacity 0.2s ease;
          user-select: none;
        }
        .organ-card:active { cursor: grabbing; }
        .organ-card.placed { opacity: 0.35; pointer-events: none; }
        .organ-card.dragging-card { opacity: 0.5; transform: scale(0.9); }

        .organ-icon {
          width: 72px; height: 72px;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 30px;
          border: 2px solid;
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .organ-card:not(.placed):not(.dragging-card):hover .organ-icon {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }

        @keyframes shakeCard {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .organ-card.shake .organ-icon { animation: shakeCard 0.5s ease; }

        .organ-label {
          font-size: 12px; font-weight: 800;
          color: #3a4a72; letter-spacing: 0.3px;
        }

        /* ── Bottom Nav ── */
        .bottom-nav {
          display: flex; align-items: center;
          justify-content: space-around;
          padding: 12px 16px 20px;
          background: #fff;
          border-top: 1px solid #e8edf8;
        }
        .nav-item {
          display: flex; flex-direction: column;
          align-items: center; gap: 4px;
          cursor: pointer; flex: 1;
        }
        .nav-icon { font-size: 20px; }
        .nav-label {
          font-size: 10px; font-weight: 700;
          color: #9aa5c4; letter-spacing: 0.3px;
        }
        .nav-item.active .nav-icon { 
          background: #3dba5e;
          width: 44px; height: 44px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-item.active .nav-label { color: #3dba5e; }

        /* ── Win Screen ── */
        .win-overlay {
          position: absolute; inset: 0;
          background: rgba(247,249,255,0.97);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 20px; z-index: 100;
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .win-emoji { font-size: 72px; animation: bounce 1s infinite alternate; }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-12px); }
        }
        .win-title {
          font-size: 30px; font-weight: 900;
          color: #3dba5e; text-align: center;
        }
        .win-sub {
          font-size: 15px; color: #7a90c0;
          font-weight: 600; text-align: center;
        }
        .restart-btn {
          background: #3dba5e; color: #fff;
          border: none; border-radius: 16px;
          padding: 14px 40px;
          font-size: 16px; font-weight: 800;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 24px rgba(61,186,94,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .restart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(61,186,94,0.4);
        }
      `}</style>

      <div className="app" style={{ position: "relative" }}>
        {/* Win overlay */}
        {gameComplete && (
          <div className="win-overlay">
            <div className="win-emoji">🏆</div>
            <div className="win-title">All Rounds Complete!</div>
            <div className="win-sub">
              You placed every organ correctly.
              <br />
              Great work, anatomist!
            </div>
            <button className="restart-btn" onClick={handleRestart}>
              Play Again
            </button>
          </div>
        )}

        {/* Header */}
        <div className="header">
          <div className="header-menu">
            <span />
            <span />
            <span />
          </div>
          <div className="header-title">Kinetic Anatomy</div>
          <div className="header-avatar">🧑</div>
        </div>

        {/* Instruction */}
        <div className="instruction">{round.instruction}</div>

        {/* Progress */}
        <div className="progress-row">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${((roundIdx + Object.keys(placed).length / round.dropZones.length) / totalRounds) * 100}%`,
              }}
            />
          </div>
          <div className="progress-label">
            {roundIdx + 1}/{totalRounds}
          </div>
        </div>

        {/* Stage */}
        <div className="stage">
          <div className="body-outer" />
          <div className="body-inner" />
          <div className="silhouette" />

          {round.dropZones.map((dz) => {
            const isFilled = !!placed[dz.id];
            const isWrong = wrongZone === dz.id;
            const organ = isFilled ? ORGANS[placed[dz.id]] : null;

            return (
              <div
                key={dz.id}
                className={`drop-zone ${isFilled ? "filled" : ""} ${isWrong ? "wrong" : ""}`}
                style={{ left: `${dz.x}%`, top: `${dz.y}%` }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(dz.id)}
              >
                {isFilled && organ ? (
                  <div className="check-ring">
                    <span>{organ.emoji}</span>
                  </div>
                ) : (
                  <>
                    <div className="drop-zone-inner">+</div>
                    <div className="drop-zone-label">{dz.label}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Organ Tray */}
        <div className="tray">
          <div className="tray-title">Organ Tray</div>
          <div className="tray-organs">
            {round.organs.map((organ) => {
              const isPlaced = placedOrgans.includes(organ.id);
              const isDraggingThis = dragging === organ.id;
              const isShaking = shake === organ.id;

              return (
                <div
                  key={organ.id}
                  className={`organ-card${isPlaced ? " placed" : ""}${isDraggingThis ? " dragging-card" : ""}${isShaking ? " shake" : ""}`}
                  draggable={!isPlaced}
                  onDragStart={() => handleDragStart(organ.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className="organ-icon"
                    style={{
                      background: organ.bg,
                      borderColor: organ.border,
                    }}
                  >
                    {organ.emoji}
                  </div>
                  <div className="organ-label">{organ.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          {[
            { icon: "🗺️", label: "Map" },
            { icon: "🎮", label: "Games", active: true },
            { icon: "✅", label: "Tasks" },
            { icon: "📊", label: "Leaderboard" },
          ].map(({ icon, label, active }) => (
            <div key={label} className={`nav-item${active ? " active" : ""}`}>
              <div className="nav-icon">{icon}</div>
              <div className="nav-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
