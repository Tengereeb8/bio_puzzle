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

// Import SVG components (assuming Next.js handles SVG imports like this)
import BrainIcon from "./assets/icons/brain.svg";
import HeartIcon from "./assets/icons/heart.svg";
import LungsIcon from "./assets/icons/lungs.svg";
import LiverIcon from "./assets/icons/liver.svg";
import StomachIcon from "./assets/icons/stomach.svg";
import IntestinesIcon from "./assets/icons/intestines.svg";
import KidneysIcon from "./assets/icons/kidneys.svg";
import BladderIcon from "./assets/icons/bladder.svg";
import PancreasIcon from "./assets/icons/pancreas.svg";
import SpleenIcon from "./assets/icons/spleen.svg";

export default function OrganSVG({
  type,
  size = 120,
  isPlaced = false,
}: OrganSVGProps) {
  const IconComponent = {
    brain: BrainIcon,
    heart: HeartIcon,
    lungs: LungsIcon,
    liver: LiverIcon,
    stomach: StomachIcon,
    intestines: IntestinesIcon,
    kidneys: KidneysIcon,
    bladder: BladderIcon,
    pancreas: PancreasIcon,
    spleen: SpleenIcon,
  }[type];

  if (!IconComponent) {
    return null; // Or a placeholder
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: isPlaced ? "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" : "none",
      }}
    >
      <img
        src={IconComponent.src || IconComponent}
        style={{ width: "100%", height: "100%" }}
        alt="organ icon"
      />
    </div>
  );
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
