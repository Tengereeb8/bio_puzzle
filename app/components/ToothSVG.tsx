import {
  Heart,
  Bone,
  Dumbbell,
  Brain,
  Droplets,
  Utensils,
  Wind,
} from "lucide-react";

interface ToothSVGProps {
  type: "incisor" | "canine" | "premolar" | "molar";
  size?: number;
  color?: string;
}

export default function ToothSVG({
  type,
  size = 100,
  color = "#FFFFFF",
}: ToothSVGProps) {
  const toothPaths = {
    incisor: (
      <g>
        <path
          d="M 40 20 Q 35 10 50 5 Q 65 10 60 20 L 58 45 Q 50 50 42 45 Z"
          fill={color}
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 42 45 Q 40 60 45 80 Q 50 85 55 80 Q 60 60 58 45"
          fill="#F5E6D3"
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 45 15 Q 48 12 52 15 Q 50 20 48 20 Z"
          fill="rgba(255,255,255,0.6)"
        />
      </g>
    ),
    canine: (
      <g>
        <path
          d="M 45 10 Q 50 5 55 10 L 58 40 Q 50 48 42 40 Z"
          fill={color}
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 42 40 Q 40 55 43 75 Q 45 88 50 90 Q 55 88 57 75 Q 60 55 58 40"
          fill="#F5E6D3"
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 48 15 Q 50 12 52 15 L 51 25 L 49 25 Z"
          fill="rgba(255,255,255,0.6)"
        />
      </g>
    ),
    premolar: (
      <g>
        <path
          d="M 35 15 Q 40 8 45 12 Q 50 8 55 12 Q 60 8 65 15 L 63 45 Q 50 52 37 45 Z"
          fill={color}
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 43 45 Q 40 60 42 80 Q 44 85 46 83 L 48 50"
          fill="#F5E6D3"
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 57 45 Q 60 60 58 80 Q 56 85 54 83 L 52 50"
          fill="#F5E6D3"
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 47 18 Q 50 15 53 18 Q 52 22 48 22 Z"
          fill="rgba(255,255,255,0.6)"
        />
      </g>
    ),
    molar: (
      <g>
        <path
          d="M 30 18 Q 35 10 40 15 Q 45 10 50 15 Q 55 10 60 15 Q 65 10 70 18 L 68 50 Q 50 58 32 50 Z"
          fill={color}
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 38 50 Q 35 65 37 85 Q 39 90 41 88 L 42 52"
          fill="#F5E6D3"
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 50 50 Q 48 70 50 88 Q 52 70 50 50"
          fill="#F5E6D3"
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 62 50 Q 65 65 63 85 Q 61 90 59 88 L 58 52"
          fill="#F5E6D3"
          stroke="#2D3142"
          strokeWidth="2"
        />
        <path
          d="M 38 22 L 40 25 L 38 28"
          stroke="#94A3B8"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 48 20 L 50 23 L 48 26"
          stroke="#94A3B8"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 58 22 L 60 25 L 58 28"
          stroke="#94A3B8"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 45 20 Q 50 17 55 20 Q 53 24 47 24 Z"
          fill="rgba(255,255,255,0.6)"
        />
      </g>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {toothPaths[type]}
    </svg>
  );
}

interface BodyPartIconProps {
  type:
    | "molar"
    | "brain"
    | "heart"
    | "lungs"
    | "stomach"
    | "muscles"
    | "bones"
    | "blood";
  size?: number;
  color?: string;
}

export function BodyPartIcon({
  type,
  size = 24,
  color = "white",
}: BodyPartIconProps) {
  const props = { size, color, strokeWidth: 1.8 };

  switch (type) {
    case "molar":
      return <ToothSVG type="molar" size={size} color={color} />;
    case "heart":
      return <Heart {...props} />;
    case "bones":
      return <Bone {...props} />;
    case "muscles":
      return <Dumbbell {...props} />;
    case "stomach":
      return <Utensils {...props} />;
    case "lungs":
      return <Wind {...props} />;
    case "brain":
      return <Brain {...props} />;
    case "blood":
      return <Droplets {...props} />;
    default:
      return null;
  }
}
