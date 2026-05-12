"use client";

import Image from "next/image";

// Map types to asset paths. Ensure these SVG files exist!
const iconPaths = {
  brain: require("./assets/brain.svg"),
  heart: require("./assets/heart.svg"),
  lungs: require("./assets/lungs.svg"),
  liver: require("./assets/liver.svg"),
  stomach: require("./assets/stomach.svg"),
  intestines: require("./assets/intestines.svg"),
  kidneys: require("./assets/kidneys.svg"),
  bladder: require("./assets/bladder.svg"),
  pancreas: require("./assets/pancreas.svg"),
};

export type OrganType = keyof typeof iconPaths;

interface OrganSVGProps {
  type: OrganType;
  size?: number;
  className?: string;
  isPlaced?: boolean;
}

export default function OrganSVG({
  type,
  size = 64,
  className = "",
  isPlaced = false,
}: OrganSVGProps) {
  const iconSrc = iconPaths[type];

  return (
    <Image
      src={iconSrc}
      alt={`${type} icon`}
      width={size}
      height={size}
      priority
      className={`transition-all duration-300 ${
        isPlaced ? "drop-shadow-lg scale-100" : "drop-shadow-sm scale-110"
      } ${className}`}
    />
  );
}

// Keeping your organInfo here as it's purely data
export const organInfo: Record<
  OrganType,
  { nameMn: string; nameEn: string; descriptionMn: string }
> = {
  brain: {
    nameMn: "Тархи",
    nameEn: "Brain",
    descriptionMn: "Сэтгэх, санах ой, биеийн үйл ажиллагааг удирддаг",
  },
  heart: {
    nameMn: "Зүрх",
    nameEn: "Heart",
    descriptionMn: "Бүх биед цус урсгадаг",
  },
  lungs: {
    nameMn: "Уушиг",
    nameEn: "Lungs",
    descriptionMn: "Хүчилтөрөгч авахад тусалдаг",
  },
  liver: {
    nameMn: "Элэг",
    nameEn: "Liver",
    descriptionMn: "Цусыг шүүж, хоол боловсруулахад тусалдаг",
  },
  stomach: {
    nameMn: "Ходоод",
    nameEn: "Stomach",
    descriptionMn: "Хоол задалдаг",
  },
  intestines: {
    nameMn: "Гэдэс",
    nameEn: "Intestines",
    descriptionMn: "Хоолноос шим тэжээл шингээдэг",
  },
  kidneys: {
    nameMn: "Бөөр",
    nameEn: "Kidneys",
    descriptionMn: "Цуснаас хог хаягдлыг шүүдэг",
  },
  bladder: {
    nameMn: "Давсаг",
    nameEn: "Bladder",
    descriptionMn: "Шээс хадгалдаг",
  },
  pancreas: {
    nameMn: "Нойр булчирхай",
    nameEn: "Pancreas",
    descriptionMn: "Инсулин ба боловсруулах ферментүүд үйлдвэрлэдэг",
  },
};
