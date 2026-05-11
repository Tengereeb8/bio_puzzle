"use client";

import Image from "next/image";

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

// Import SVG components as static assets
import brainIcon from "./assets/icons/brain.svg";
import heartIcon from "./assets/icons/heart.svg";
import lungsIcon from "./assets/icons/lungs.svg";
import liverIcon from "./assets/icons/liver.svg";
import stomachIcon from "./assets/icons/stomach.svg";
import intestinesIcon from "./assets/icons/intestines.svg";
import kidneysIcon from "./assets/icons/kidneys.svg";
import bladderIcon from "./assets/icons/bladder.svg";
import pancreasIcon from "./assets/icons/pancreas.svg";
import spleenIcon from "./assets/icons/spleen.svg";

export default function OrganSVG({
  type,
  size = 120,
  isPlaced = false,
}: OrganSVGProps) {
  const IconMap = {
    brain: brainIcon,
    heart: heartIcon,
    lungs: lungsIcon,
    liver: liverIcon,
    stomach: stomachIcon,
    intestines: intestinesIcon,
    kidneys: kidneysIcon,
    bladder: bladderIcon,
    pancreas: pancreasIcon,
    spleen: spleenIcon,
  };

  const iconSrc = IconMap[type];

  if (!iconSrc) {
    return null;
  }

  return (
    <Image
      src={iconSrc}
      alt={`${type} organ icon`}
      width={size}
      height={size}
      style={{
        filter: isPlaced ? "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" : "none",
      }}
    />
  );
}

export const organInfo = {
  // ... your existing organInfo object

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
