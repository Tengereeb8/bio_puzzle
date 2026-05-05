interface OrganSVGProps {
  type:
    | "brain"
    | "heart"
    | "lungs"
    | "liver"
    | "stomach"
    | "intestines"
    | "kidneys"
    | "bladder"
    | "pancreas"
    | "spleen";
  size?: number;
  isPlaced?: boolean;
}

export default function OrganSVG({
  type,
  size = 120,
  isPlaced = false,
}: OrganSVGProps) {
  const organs = {
    brain: (
      <svg
        width={size}
        height={size * 0.8}
        viewBox="0 0 120 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-brain)" : ""}>
          {/* Left hemisphere */}
          <path
            d="M 30 35 Q 20 20 35 10 Q 50 5 60 15 Q 60 25 55 35 Q 50 45 45 50 Q 40 52 35 50 Q 25 45 30 35 Z"
            fill="#E8A5D4"
            stroke="#B565A7"
            strokeWidth="2.5"
          />
          {/* Right hemisphere */}
          <path
            d="M 60 15 Q 70 5 85 10 Q 100 20 90 35 Q 95 45 85 50 Q 80 52 75 50 Q 70 45 65 35 Q 60 25 60 15 Z"
            fill="#E8A5D4"
            stroke="#B565A7"
            strokeWidth="2.5"
          />
          {/* Cerebellum */}
          <ellipse
            cx="60"
            cy="65"
            rx="28"
            ry="18"
            fill="#D48BC0"
            stroke="#B565A7"
            strokeWidth="2.5"
          />
          {/* Brain folds (gyri) */}
          <path
            d="M 35 25 Q 40 20 45 25"
            stroke="#B565A7"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 40 35 Q 45 32 50 35"
            stroke="#B565A7"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 75 25 Q 80 20 85 25"
            stroke="#B565A7"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 70 35 Q 75 32 80 35"
            stroke="#B565A7"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Brainstem */}
          <rect
            x="55"
            y="75"
            width="10"
            height="15"
            rx="2"
            fill="#D48BC0"
            stroke="#B565A7"
            strokeWidth="2"
          />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-brain"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
    heart: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-heart)" : ""}>
          {/* Main heart shape */}
          <path
            d="M 50 85 L 30 60 Q 20 45 25 35 Q 30 25 40 28 Q 45 30 50 35 Q 55 30 60 28 Q 70 25 75 35 Q 80 45 70 60 L 50 85 Z"
            fill="#FF6B7A"
            stroke="#DC143C"
            strokeWidth="2.5"
          />
          {/* Left atrium */}
          <ellipse
            cx="40"
            cy="38"
            rx="8"
            ry="10"
            fill="#FF8A94"
            stroke="#DC143C"
            strokeWidth="2"
          />
          {/* Right atrium */}
          <ellipse
            cx="60"
            cy="38"
            rx="8"
            ry="10"
            fill="#FF8A94"
            stroke="#DC143C"
            strokeWidth="2"
          />
          {/* Aorta */}
          <path
            d="M 50 30 Q 48 20 52 15"
            stroke="#DC143C"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Ventricle details */}
          <path
            d="M 45 55 Q 50 60 55 55"
            stroke="#DC143C"
            strokeWidth="2"
            fill="none"
          />
          {/* Highlight */}
          <ellipse cx="42" cy="45" rx="6" ry="8" fill="white" opacity="0.3" />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-heart"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
    lungs: (
      <svg
        width={size * 1.2}
        height={size}
        viewBox="0 0 140 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-lungs)" : ""}>
          {/* Trachea */}
          <rect
            x="67"
            y="5"
            width="6"
            height="25"
            rx="3"
            fill="#B0C4DE"
            stroke="#6B8BA8"
            strokeWidth="2"
          />
          {/* Left lung */}
          <path
            d="M 68 30 Q 45 35 35 45 Q 25 55 30 70 Q 35 85 50 88 Q 60 85 65 75 Q 68 60 68 30 Z"
            fill="#FFC0CB"
            stroke="#E75480"
            strokeWidth="2.5"
          />
          {/* Right lung */}
          <path
            d="M 72 30 Q 95 35 105 45 Q 115 55 110 70 Q 105 85 90 88 Q 80 85 75 75 Q 72 60 72 30 Z"
            fill="#FFC0CB"
            stroke="#E75480"
            strokeWidth="2.5"
          />
          {/* Bronchi */}
          <path
            d="M 68 30 Q 60 35 55 40"
            stroke="#6B8BA8"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M 72 30 Q 80 35 85 40"
            stroke="#6B8BA8"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Lung lobes detail */}
          <path
            d="M 40 50 Q 45 55 40 60"
            stroke="#E75480"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 50 55 Q 55 60 50 65"
            stroke="#E75480"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 90 55 Q 95 60 90 65"
            stroke="#E75480"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 100 50 Q 95 55 100 60"
            stroke="#E75480"
            strokeWidth="1.5"
            fill="none"
          />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-lungs"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
    liver: (
      <svg
        width={size * 1.3}
        height={size * 0.8}
        viewBox="0 0 130 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-liver)" : ""}>
          {/* Main liver shape */}
          <path
            d="M 20 25 Q 15 15 30 12 Q 50 10 70 15 Q 90 12 110 15 Q 120 20 118 30 Q 115 45 105 55 Q 95 65 80 68 Q 70 70 60 68 Q 45 70 35 65 Q 25 55 22 40 Q 20 30 20 25 Z"
            fill="#A0522D"
            stroke="#654321"
            strokeWidth="2.5"
          />
          {/* Right lobe detail */}
          <path
            d="M 70 20 Q 85 18 100 22 Q 108 28 105 40"
            stroke="#654321"
            strokeWidth="2"
            fill="none"
          />
          {/* Left lobe detail */}
          <path
            d="M 35 22 Q 45 20 55 22"
            stroke="#654321"
            strokeWidth="2"
            fill="none"
          />
          {/* Gallbladder */}
          <ellipse
            cx="75"
            cy="60"
            rx="8"
            ry="12"
            fill="#8B7355"
            stroke="#654321"
            strokeWidth="2"
          />
          {/* Highlight */}
          <ellipse cx="50" cy="30" rx="15" ry="10" fill="white" opacity="0.2" />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-liver"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
    stomach: (
      <svg
        width={size * 0.9}
        height={size}
        viewBox="0 0 90 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-stomach)" : ""}>
          {/* Esophagus */}
          <rect
            x="42"
            y="5"
            width="6"
            height="15"
            rx="3"
            fill="#FFB6A8"
            stroke="#E8956E"
            strokeWidth="2"
          />
          {/* Stomach body */}
          <path
            d="M 45 20 Q 30 22 25 35 Q 20 50 25 65 Q 30 78 45 82 Q 55 85 65 78 Q 75 65 72 50 Q 70 35 60 25 Q 50 20 45 20 Z"
            fill="#FFB6A8"
            stroke="#E8956E"
            strokeWidth="2.5"
          />
          {/* Pylorus (exit to intestine) */}
          <ellipse
            cx="68"
            cy="70"
            rx="8"
            ry="6"
            fill="#FFA590"
            stroke="#E8956E"
            strokeWidth="2"
          />
          <rect
            x="75"
            y="68"
            width="10"
            height="4"
            rx="2"
            fill="#FFA590"
            stroke="#E8956E"
            strokeWidth="2"
          />
          {/* Stomach folds (rugae) */}
          <path
            d="M 35 40 Q 40 42 35 45"
            stroke="#E8956E"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 40 50 Q 45 52 40 55"
            stroke="#E8956E"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 50 55 Q 55 57 50 60"
            stroke="#E8956E"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Highlight */}
          <ellipse cx="38" cy="35" rx="8" ry="12" fill="white" opacity="0.25" />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-stomach"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
    intestines: (
      <svg
        width={size}
        height={size * 1.2}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-intestines)" : ""}>
          {/* Small intestine coils */}
          <path
            d="M 50 10 Q 30 15 25 25 Q 20 35 30 40 Q 40 42 45 35 Q 48 30 45 25 Q 42 20 50 18 Z"
            fill="#FFD4A3"
            stroke="#E8A865"
            strokeWidth="2.5"
          />
          <path
            d="M 50 18 Q 58 20 62 25 Q 65 30 62 35 Q 58 42 70 40 Q 80 35 75 25 Q 70 15 50 10 Z"
            fill="#FFD4A3"
            stroke="#E8A865"
            strokeWidth="2.5"
          />
          <path
            d="M 45 35 Q 40 45 35 55 Q 32 65 40 70 Q 48 72 52 65 Q 55 58 50 50 Q 47 42 45 35 Z"
            fill="#FFD4A3"
            stroke="#E8A865"
            strokeWidth="2.5"
          />
          <path
            d="M 70 40 Q 78 45 78 55 Q 78 65 70 70 Q 62 72 58 65 Q 55 58 60 50 Q 65 42 70 40 Z"
            fill="#FFD4A3"
            stroke="#E8A865"
            strokeWidth="2.5"
          />
          {/* Large intestine frame */}
          <path
            d="M 15 75 Q 12 80 15 90 Q 20 100 30 102 Q 40 103 50 100 Q 60 103 70 102 Q 80 100 85 90 Q 88 80 85 75 Q 82 72 78 75"
            fill="#FFBE8A"
            stroke="#E8A865"
            strokeWidth="2.5"
          />
          <rect
            x="12"
            y="70"
            width="8"
            height="15"
            rx="4"
            fill="#FFBE8A"
            stroke="#E8A865"
            strokeWidth="2"
          />
          <rect
            x="80"
            y="70"
            width="8"
            height="15"
            rx="4"
            fill="#FFBE8A"
            stroke="#E8A865"
            strokeWidth="2"
          />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-intestines"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
    kidneys: (
      <svg
        width={size * 1.2}
        height={size * 0.8}
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-kidneys)" : ""}>
          {/* Left kidney */}
          <path
            d="M 35 15 Q 25 20 22 30 Q 20 45 25 58 Q 30 68 40 70 Q 48 68 50 58 Q 52 50 48 40 Q 45 30 40 20 Q 37 15 35 15 Z"
            fill="#8B4513"
            stroke="#5C2E0A"
            strokeWidth="2.5"
          />
          {/* Left kidney indentation (hilum) */}
          <path
            d="M 48 40 Q 45 45 48 50"
            stroke="#5C2E0A"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Right kidney */}
          <path
            d="M 85 15 Q 95 20 98 30 Q 100 45 95 58 Q 90 68 80 70 Q 72 68 70 58 Q 68 50 72 40 Q 75 30 80 20 Q 83 15 85 15 Z"
            fill="#8B4513"
            stroke="#5C2E0A"
            strokeWidth="2.5"
          />
          {/* Right kidney indentation (hilum) */}
          <path
            d="M 72 40 Q 75 45 72 50"
            stroke="#5C2E0A"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Ureters */}
          <path
            d="M 48 58 Q 50 65 52 75"
            stroke="#5C2E0A"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 72 58 Q 70 65 68 75"
            stroke="#5C2E0A"
            strokeWidth="2"
            fill="none"
          />

          {/* Kidney texture */}
          <ellipse cx="38" cy="35" rx="6" ry="8" fill="white" opacity="0.2" />
          <ellipse cx="82" cy="35" rx="6" ry="8" fill="white" opacity="0.2" />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-kidneys"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
    bladder: (
      <svg
        width={size * 0.7}
        height={size * 0.7}
        viewBox="0 0 70 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-bladder)" : ""}>
          {/* Bladder body */}
          <ellipse
            cx="35"
            cy="40"
            rx="22"
            ry="25"
            fill="#F4D8A8"
            stroke="#D4A574"
            strokeWidth="2.5"
          />
          {/* Ureters entry */}
          <line
            x1="25"
            y1="20"
            x2="28"
            y2="25"
            stroke="#D4A574"
            strokeWidth="2"
          />
          <line
            x1="45"
            y1="20"
            x2="42"
            y2="25"
            stroke="#D4A574"
            strokeWidth="2"
          />
          {/* Urethra */}
          <rect
            x="32"
            y="63"
            width="6"
            height="5"
            rx="3"
            fill="#F4D8A8"
            stroke="#D4A574"
            strokeWidth="2"
          />
          {/* Highlight */}
          <ellipse cx="30" cy="35" rx="8" ry="10" fill="white" opacity="0.25" />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-bladder"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
    pancreas: (
      <svg
        width={size}
        height={size * 0.5}
        viewBox="0 0 100 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-pancreas)" : ""}>
          {/* Pancreas head */}
          <ellipse
            cx="20"
            cy="25"
            rx="15"
            ry="18"
            fill="#FFD2A8"
            stroke="#E8A865"
            strokeWidth="2.5"
          />
          {/* Pancreas body */}
          <rect
            x="32"
            y="18"
            width="40"
            height="14"
            rx="7"
            fill="#FFD2A8"
            stroke="#E8A865"
            strokeWidth="2.5"
          />
          {/* Pancreas tail */}
          <ellipse
            cx="75"
            cy="25"
            rx="12"
            ry="10"
            fill="#FFD2A8"
            stroke="#E8A865"
            strokeWidth="2.5"
          />
          {/* Pancreatic duct */}
          <path
            d="M 25 25 L 70 25"
            stroke="#E8A865"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="2 2"
          />
          {/* Texture */}
          <circle cx="22" cy="22" r="3" fill="white" opacity="0.3" />
          <circle cx="50" cy="25" r="3" fill="white" opacity="0.3" />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-pancreas"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
    spleen: (
      <svg
        width={size * 0.7}
        height={size * 0.9}
        viewBox="0 0 70 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={isPlaced ? "url(#shadow-spleen)" : ""}>
          {/* Spleen body */}
          <path
            d="M 35 10 Q 25 15 22 25 Q 20 40 24 55 Q 28 70 35 78 Q 42 82 48 75 Q 52 65 50 50 Q 48 35 45 22 Q 42 12 35 10 Z"
            fill="#8B3A62"
            stroke="#5C1E3E"
            strokeWidth="2.5"
          />
          {/* Hilum (indentation) */}
          <path
            d="M 45 35 Q 42 45 45 55"
            stroke="#5C1E3E"
            strokeWidth="2"
            fill="none"
          />
          {/* Highlight */}
          <ellipse cx="32" cy="30" rx="6" ry="10" fill="white" opacity="0.25" />
        </g>
        {isPlaced && (
          <defs>
            <filter
              id="shadow-spleen"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
        )}
      </svg>
    ),
  };

  return organs[type] || null;
}

export const organInfo = {
  brain: {
    name: "Brain",
    nameMn: "Тархи",
    description: "Controls thinking, memory, and body functions",
    descriptionMn: "Сэтгэх, санах ой, биеийн үйл ажиллагааг удирддаг",
  },
  heart: {
    name: "Heart",
    nameMn: "Зүрх",
    description: "Pumps blood throughout the body",
    descriptionMn: "Бүх биед цус урсгадаг",
  },
  lungs: {
    name: "Lungs",
    nameMn: "Уушиг",
    description: "Help you breathe oxygen",
    descriptionMn: "Хүчилтөрөгч авахад тусалдаг",
  },
  liver: {
    name: "Liver",
    nameMn: "Элэг",
    description: "Filters blood and helps digestion",
    descriptionMn: "Цусыг шүүж, хоол боловсруулахад тусалдаг",
  },
  stomach: {
    name: "Stomach",
    nameMn: "Ходоод",
    description: "Breaks down food",
    descriptionMn: "Хоол задалдаг",
  },
  intestines: {
    name: "Intestines",
    nameMn: "Гэдэс",
    description: "Absorbs nutrients from food",
    descriptionMn: "Хоолноос шим тэжээл шингээдэг",
  },
  kidneys: {
    name: "Kidneys",
    nameMn: "Бөөр",
    description: "Filter waste from blood",
    descriptionMn: "Цуснаас хог хаягдлыг шүүдэг",
  },
  bladder: {
    name: "Bladder",
    nameMn: "Давсаг",
    description: "Stores urine",
    descriptionMn: "Шээс хадгалдаг",
  },
  pancreas: {
    name: "Pancreas",
    nameMn: "Нойр булчирхай",
    description: "Produces insulin and digestive enzymes",
    descriptionMn: "Инсулин ба боловсруулах ферментүүд үйлдвэрлэдэг",
  },
  spleen: {
    name: "Spleen",
    nameMn: "Дэлүү",
    description: "Filters blood and fights infection",
    descriptionMn: "Цус шүүж, халдвараас хамгаалдаг",
  },
};
