import React from "react";
import { motion } from "framer-motion";

// Төрлүүдийг хатуу зааж өгснөөр string-ээс ирэх алдааг засна
export interface CharacterAvatarProps {
  gender: "boy" | "girl";
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  shirtType: "classic" | "hoodie";
  accessory: "none" | "glasses" | "hat" | "bow" | "headphones" | "scarf";
  size?: number;
}

export default function CharacterAvatar({
  gender,
  skinTone,
  hairColor,
  shirtColor,
  shirtType,
  accessory,
  size = 150,
}: CharacterAvatarProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <ellipse cx="50" cy="95" rx="25" ry="4" fill="black" opacity="0.1" />

      {/* Бие болон Хувцас */}
      <g>
        {shirtType === "hoodie" ? (
          <path
            d="M 25 80 Q 25 65 50 65 Q 75 65 75 80 L 75 95 L 25 95 Z"
            fill={shirtColor}
          />
        ) : (
          <path
            d="M 30 70 Q 30 60 50 60 Q 70 60 70 70 L 70 95 L 30 95 Z"
            fill={shirtColor}
          />
        )}
        <rect x="47" y="55" width="6" height="10" rx="2" fill={skinTone} />
      </g>

      {/* Гавал */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <path
          d={
            gender === "boy"
              ? "M 28 40 C 28 20 72 20 72 40 C 72 55 65 65 50 65 C 35 65 28 55 28 40 Z"
              : "M 32 40 C 32 18 68 18 68 40 C 68 55 60 62 50 62 C 40 62 32 55 32 40 Z"
          }
          fill={skinTone}
        />
        <circle cx="42" cy="38" r="6" fill="#1A1A1A" />
        <circle cx="42" cy="38" r="2" fill={hairColor} />
        <circle cx="58" cy="38" r="6" fill="#1A1A1A" />
        <circle cx="58" cy="38" r="2" fill={hairColor} />
        <path d="M 48 46 L 50 44 L 52 46 Z" fill="#1A1A1A" opacity="0.6" />
      </motion.g>

      {/* Дагалдах хэрэгслүүд */}
      {accessory === "headphones" && (
        <g stroke="#333" strokeWidth="5" fill="none">
          <path d="M 28 40 Q 28 15 50 15 Q 72 15 72 40" />
          <rect
            x="22"
            y="35"
            width="8"
            height="12"
            rx="3"
            fill="#333"
            stroke="none"
          />
          <rect
            x="70"
            y="35"
            width="8"
            height="12"
            rx="3"
            fill="#333"
            stroke="none"
          />
        </g>
      )}
      {accessory === "scarf" && (
        <path
          d="M 35 59 Q 54 67 67 59 L 68 72 Q 54 82 32 72 Z"
          fill="#E53E3E"
        />
      )}
      {accessory === "glasses" && (
        <g stroke="#2D3748" strokeWidth="2" fill="none">
          <circle cx="42" cy="38" r="8.5" />
          <circle cx="58" cy="38" r="8.5" />
          <line x1="29" y1="38" x2="35" y2="34" />
          <line x1="71" y1="38" x2="65" y2="34" />
        </g>
      )}
      {accessory === "hat" && (
        <g transform="translate(0, 4)">
          <path d="M 25 25 L 75 25 L 70 12 L 30 12 Z" fill="#2D3748" />
          <rect x="20" y="22" width="60" height="4" rx="1" fill="#1A202C" />
        </g>
      )}
      {accessory === "bow" && (
        <g transform="translate(65, 26) rotate(32) scale(0.8)" fill="#F687B3">
          <path d="M -2 -1 C -10 -8, -18 -5, -18 4 C -18 10, -10 7, -2 1" />
          <path d="M 2 -1 C 10 -8, 18 -5, 18 4 C 18 10, 10 7, 2 1" />

          <path d="M -3 3 L -8 12 L -2 10 Z" opacity="0.7" />
          <path d="M 3 3 L 8 12 L 2 10 Z" opacity="0.7" />

          <rect
            x="-3"
            y="-3"
            width="6"
            height="6"
            rx="3"
            fill="#F687B3"
            stroke="#FFF"
            strokeWidth="0.5"
          />
        </g>
      )}
    </motion.svg>
  );
}
