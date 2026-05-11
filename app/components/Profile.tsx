import { Award, Flame, Edit3, Clock, Check, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterAvatar from "./CharacterAvatar";

interface Badge {
  id: string;
  name: string;
  nameMn: string;
  description: string;
  descriptionMn: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface CharacterCustomization {
  gender: "boy" | "girl";
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  shirtType: "classic" | "hoodie";
  accessory: "none" | "glasses" | "hat" | "bow" | "headphones" | "scarf";
}

interface UserProfile {
  name: string;
  nameMn: string;
  streak: number;
  badges: Badge[];
  character?: CharacterCustomization;
  bestTime?: number;
  totalGames?: number;
  lessonsCompleted?: number;
}

interface ProfileScreenProps {
  userProfile: UserProfile;
  onCharacterUpdate?: (character: CharacterCustomization) => void;
}

export default function ProfileScreen({
  userProfile,
  onCharacterUpdate,
}: ProfileScreenProps) {
  const [showCustomization, setShowCustomization] = useState(false);

  const [character, setCharacter] = useState<CharacterCustomization>(
    () =>
      userProfile.character ?? {
        gender: "boy",
        skinTone: "#FFFFFF",
        hairColor: "#58CC02",
        shirtColor: "#4A90E2",
        shirtType: "classic",
        accessory: "none",
      },
  );

  const shirtColors = [
    "#58CC02",
    "#1CB0F6",
    "#FF9600",
    "#FF4B4B",
    "#CE82FF",
    "#2ECC71",
    "#FF69B4",
    "#9B59B6",
  ];

  // Дагалдах хэрэгслийн орчуулга
  const accessoryNames: Record<string, string> = {
    none: "Байхгүй",
    glasses: "Нүдний шил",
    hat: "Малгай",
    bow: "Тууз",
    headphones: "Чихэвч",
    scarf: "Ороолт",
  };

  const accessories: Array<CharacterCustomization["accessory"]> = [
    "none",
    "glasses",
    "hat",
    "bow",
    "headphones",
    "scarf",
  ];

  const unlockedBadges = userProfile.badges.filter((b) => b.unlocked);
  const lockedBadges = userProfile.badges.filter((b) => !b.unlocked);

  const handleSaveCharacter = () => {
    onCharacterUpdate?.(character);
    setShowCustomization(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="font-game-black min-h-screen bg-[#fcf9f4] pb-24 font-sans">
      <div className="bg-[#fff4ea] border-b px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="bg-amber-400 rounded-3xl p-3 shadow-inner">
              <CharacterAvatar {...character} size={85} />
            </div>

            <motion.button
              onClick={() => setShowCustomization(!showCustomization)}
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-green-500 rounded-full shadow-lg border-4 border-white flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 size={16} color="white" />
            </motion.button>
          </div>

          <div className="flex-1">
            <h2 className="font-bold text-gray-900 text-2xl">
              {userProfile.nameMn}
            </h2>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              {userProfile.name}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
            <Flame size={24} color="#F97316" className="mx-auto mb-2" />
            <div className="font-black text-gray-900 text-xl">
              {userProfile.streak}
            </div>
            <div className="text-gray-500 text-[10px] font-bold uppercase">
              Streak
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
            <Award size={24} color="#22C55E" className="mx-auto mb-2" />
            <div className="font-black text-gray-900 text-xl">
              {unlockedBadges.length}
            </div>
            <div className="text-gray-500 text-[10px] font-bold uppercase">
              Тэмдэг
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
            <Clock size={24} color="#3B82F6" className="mx-auto mb-2" />
            <div className="font-black text-gray-900 text-lg">
              {userProfile.bestTime ? formatTime(userProfile.bestTime) : "--"}
            </div>
            <div className="text-gray-500 text-[10px] font-bold uppercase">
              Шилдэг цаг
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCustomization && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 mb-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-orange-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-gray-900 uppercase italic text-lg tracking-tight">
                  Дүр засах студи
                </h3>
                <button
                  onClick={() => setShowCustomization(false)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="mb-5">
                <p className="text-[11px] font-black text-gray-400 mb-3 uppercase tracking-widest">
                  Гавлын хэлбэр
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setCharacter({ ...character, gender: "boy" })
                    }
                    className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all border-b-4 ${character.gender === "boy" ? "border-orange-600 bg-orange-400 text-white" : "border-gray-200 bg-gray-50 text-gray-400"}`}
                  >
                    ГАВАЛ А
                  </button>
                  <button
                    onClick={() =>
                      setCharacter({ ...character, gender: "girl" })
                    }
                    className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all border-b-4 ${character.gender === "girl" ? "border-orange-600 bg-orange-400 text-white" : "border-gray-200 bg-gray-50 text-gray-400"}`}
                  >
                    ГАВАЛ Б
                  </button>
                </div>
              </div>

              {/* Shirt Type */}
              <div className="mb-5">
                <p className="text-[11px] font-black text-gray-400 mb-3 uppercase tracking-widest">
                  Хувцасны загвар
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setCharacter({ ...character, shirtType: "classic" })
                    }
                    className={`flex-1 py-3 rounded-2xl text-xs font-black border-b-4 ${character.shirtType === "classic" ? "border-amber-600 bg-amber-500 text-white" : "border-gray-200 bg-gray-50 text-gray-400"}`}
                  >
                    ЭНГИЙН
                  </button>
                  <button
                    onClick={() =>
                      setCharacter({ ...character, shirtType: "hoodie" })
                    }
                    className={`flex-1 py-3 rounded-2xl text-xs font-black border-b-4 ${character.shirtType === "hoodie" ? "border-orange-600 bg-orange-400 text-white" : "border-gray-200 bg-gray-50 text-gray-400"}`}
                  >
                    ӨРГӨН
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[11px] font-black text-gray-400 mb-3 uppercase tracking-widest">
                  Цамцны өнгө
                </p>
                <div className="flex gap-3 flex-wrap">
                  {shirtColors.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setCharacter({ ...character, shirtColor: color })
                      }
                      className={`w-9 h-9 rounded-full border-4 transition-transform shadow-sm ${character.shirtColor === color ? "border-gray-900 scale-110" : "border-white"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[11px] font-black text-gray-400 mb-3 uppercase tracking-widest">
                  Гоёл чимэглэл
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {accessories.map((acc) => (
                    <button
                      key={acc}
                      onClick={() =>
                        setCharacter({ ...character, accessory: acc })
                      }
                      className={`py-3 rounded-xl text-xs font-bold transition-all ${character.accessory === acc ? "bg-yellow-800 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                      {accessoryNames[acc]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveCharacter}
                className="w-full py-4 bg-orange-500 border-orange-600 text-white rounded-2xl font-black shadow-[0_5px_0_0_#ea580c] hover:mt-0.5 hover:shadow-[0_3px_0_0_#ea580c] transition-all flex items-center justify-center gap-2 active:shadow-none active:mt-1.25"
              >
                <Check size={20} strokeWidth={3} /> ХАДГАЛАХ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 mb-8">
        <h3 className="font-black text-gray-900 mb-4 text-lg">
          Миний тэмдгүүд
        </h3>
        {unlockedBadges.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white rounded-2xl p-4 text-center border-b-4 border-gray-200 shadow-sm"
              >
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Award size={28} color="#F59E0B" />
                </div>
                <div className="font-bold text-gray-900 text-xs leading-tight">
                  {badge.nameMn}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center text-gray-400 font-bold">
            Одоогоор тэмдэг аваагүй байна
          </div>
        )}
      </div>

      <div className="px-6">
        <h3 className="font-black text-gray-900 mb-4 text-lg">Сургалтын явц</h3>
        <div className="space-y-4">
          {lockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white rounded-2xl p-5 border-b-4 border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                  <Award size={22} color="#9CA3AF" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-gray-800 text-sm">
                      {badge.nameMn}
                    </span>
                    <span className="text-green-600 text-xs font-black bg-green-50 px-2 py-1 rounded-lg">
                      {badge.progress && badge.maxProgress
                        ? Math.round((badge.progress / badge.maxProgress) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${badge.progress && badge.maxProgress ? (badge.progress / badge.maxProgress) * 100 : 0}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-orange-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
