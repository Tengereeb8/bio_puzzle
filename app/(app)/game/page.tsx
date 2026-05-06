import type { Metadata } from "next";
import GameView from "@/app/components/GameView";

export const metadata: Metadata = {
  title: "Тоглоом",
};

export default function GamePage() {
  return <GameView />;
}
