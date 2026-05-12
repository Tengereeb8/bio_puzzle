"use client";

import Image from "next/image";

// Map types to asset paths. Ensure these SVG files exist!
const iconPaths = {
  brain: require("./assets/brain.jpeg"),
  heart: require("./assets/heart.jpeg"),
  lungs: require("./assets/lung.png"),
  liver: require("./assets/liver.png"),
  stomach: require("./assets/stomach.png"),
  intestines: require("./assets/intestines.png"),
  kidneys: require("./assets/kidney.png"),
  bladder: require("./assets/bladder.png"),
  pancreas: require("./assets/pancreas.png"),
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
    nameMn: "",
    nameEn: "",
    descriptionMn: "",
  },
  pancreas: {
    nameMn: "",
    nameEn: "",
    descriptionMn: "",
  },
};
