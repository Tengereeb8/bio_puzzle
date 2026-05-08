"use client";

import {
  BASE_LEADERBOARD,
  BASE_USER_PROFILE,
} from "@/app/components/data/appData";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useRouter } from "next/navigation";
import LeaderboardTab from "@/app/components/Leaderboard";
import ProfileTab from "@/app/components/Profile";

export default function MoreProfile() {
  const { userPoints } = useProgress();

  const userProfile = {
    ...BASE_USER_PROFILE,
    totalPoints: userPoints,
  };

  return <ProfileTab userProfile={userProfile} />;
}
