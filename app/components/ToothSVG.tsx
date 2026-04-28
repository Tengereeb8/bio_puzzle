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
        {/* Crown */}
        <path
          d="M 40 20 Q 35 10 50 5 Q 65 10 60 20 L 58 45 Q 50 50 42 45 Z"
          fill={color}
          stroke="#2D3142"
          strokeWidth="2"
        />
        {/* Root */}
        <path
          d="M 42 45 Q 40 60 45 80 Q 50 85 55 80 Q 60 60 58 45"
          fill="#F5E6D3"
          stroke="#2D3142"
          strokeWidth="2"
        />
        {/* Enamel highlight */}
        <path
          d="M 45 15 Q 48 12 52 15 Q 50 20 48 20 Z"
          fill="rgba(255,255,255,0.6)"
        />
      </g>
    ),
    canine: (
      <g>
        {/* Crown - pointed */}
        <path
          d="M 45 10 Q 50 5 55 10 L 58 40 Q 50 48 42 40 Z"
          fill={color}
          stroke="#2D3142"
          strokeWidth="2"
        />
        {/* Root - long and single */}
        <path
          d="M 42 40 Q 40 55 43 75 Q 45 88 50 90 Q 55 88 57 75 Q 60 55 58 40"
          fill="#F5E6D3"
          stroke="#2D3142"
          strokeWidth="2"
        />
        {/* Highlight */}
        <path
          d="M 48 15 Q 50 12 52 15 L 51 25 L 49 25 Z"
          fill="rgba(255,255,255,0.6)"
        />
      </g>
    ),
    premolar: (
      <g>
        {/* Crown - two cusps */}
        <path
          d="M 35 15 Q 40 8 45 12 Q 50 8 55 12 Q 60 8 65 15 L 63 45 Q 50 52 37 45 Z"
          fill={color}
          stroke="#2D3142"
          strokeWidth="2"
        />
        {/* Root - bifurcated */}
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
        {/* Highlight */}
        <path
          d="M 47 18 Q 50 15 53 18 Q 52 22 48 22 Z"
          fill="rgba(255,255,255,0.6)"
        />
      </g>
    ),
    molar: (
      <g>
        {/* Crown - multiple cusps */}
        <path
          d="M 30 18 Q 35 10 40 15 Q 45 10 50 15 Q 55 10 60 15 Q 65 10 70 18 L 68 50 Q 50 58 32 50 Z"
          fill={color}
          stroke="#2D3142"
          strokeWidth="2"
        />
        {/* Roots - multiple */}
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
        {/* Cusps detail */}
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
        {/* Highlight */}
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
  type: "brain" | "heart" | "lungs" | "stomach" | "muscles" | "bones" | "blood";
  size?: number;
}

export function BodyPartIcon({ type, size = 60 }: BodyPartIconProps) {
  const icons = {
    brain: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <path
          d="M 30 35 Q 25 25 35 20 Q 45 15 50 20 Q 55 15 65 20 Q 75 25 70 35 Q 75 45 70 55 Q 75 65 65 70 Q 60 75 55 70 Q 50 75 45 70 Q 40 75 35 70 Q 25 65 30 55 Q 25 45 30 35 Z"
          fill="#C084FC"
          stroke="#7C3AED"
          strokeWidth="2"
        />
        <path d="M 40 35 Q 38 40 40 45" stroke="#7C3AED" strokeWidth="1.5" />
        <path d="M 48 32 Q 46 38 48 44" stroke="#7C3AED" strokeWidth="1.5" />
        <path d="M 56 35 Q 54 40 56 45" stroke="#7C3AED" strokeWidth="1.5" />
      </svg>
    ),
    heart: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <path
          d="M 50 75 Q 30 60 25 45 Q 20 30 30 25 Q 40 20 50 30 Q 60 20 70 25 Q 80 30 75 45 Q 70 60 50 75 Z"
          fill="#FF4B4B"
          stroke="#DC2626"
          strokeWidth="2"
        />
        <path
          d="M 40 35 Q 45 32 48 35"
          stroke="#FCA5A5"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    lungs: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <path
          d="M 50 20 L 50 50 M 50 30 Q 35 35 30 50 Q 28 65 35 75 Q 40 80 45 75 L 50 50"
          stroke="#1CB0F6"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 50 30 Q 65 35 70 50 Q 72 65 65 75 Q 60 80 55 75 L 50 50"
          stroke="#1CB0F6"
          strokeWidth="2"
          fill="none"
        />
        <ellipse cx="35" cy="55" rx="8" ry="15" fill="#7DD3FC" opacity="0.5" />
        <ellipse cx="65" cy="55" rx="8" ry="15" fill="#7DD3FC" opacity="0.5" />
      </svg>
    ),
    stomach: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <path
          d="M 40 30 Q 35 28 35 35 L 35 55 Q 35 70 45 75 Q 55 70 65 75 Q 65 60 65 45 L 65 35 Q 65 28 60 30"
          fill="#FFB84D"
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <path
          d="M 45 40 Q 50 42 55 40"
          stroke="#F59E0B"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 45 50 Q 50 52 55 50"
          stroke="#F59E0B"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    muscles: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <ellipse
          cx="50"
          cy="50"
          rx="20"
          ry="30"
          fill="#FB923C"
          stroke="#EA580C"
          strokeWidth="2"
        />
        <path
          d="M 38 40 Q 50 45 62 40"
          stroke="#EA580C"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 38 50 Q 50 55 62 50"
          stroke="#EA580C"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 38 60 Q 50 65 62 60"
          stroke="#EA580C"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    bones: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect
          x="45"
          y="35"
          width="10"
          height="30"
          fill="#E5E7EB"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="30"
          r="8"
          fill="#E5E7EB"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="70"
          r="8"
          fill="#E5E7EB"
          stroke="#94A3B8"
          strokeWidth="2"
        />
      </svg>
    ),
    blood: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <path
          d="M 50 20 Q 45 35 50 50 Q 55 65 50 80 Q 45 75 40 65 Q 35 50 45 35 Q 50 20 50 20 Z"
          fill="#DC2626"
          stroke="#991B1B"
          strokeWidth="2"
        />
        <circle cx="48" cy="45" r="3" fill="#FCA5A5" opacity="0.6" />
      </svg>
    ),
  };

  return icons[type];
}
