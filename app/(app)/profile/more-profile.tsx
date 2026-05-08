"use client";

import { BASE_USER_PROFILE } from "@/app/components/data/appData";
import { useCurriculum } from "@/app/components/context/CurriculumContext";
import { useProgress } from "@/app/components/context/ProgressContext";
import ProfileTab from "@/app/components/Profile";

export default function MoreProfile() {
  const { userPoints } = useProgress();
  const { userProfile: fromApi } = useCurriculum();

  const base =
    fromApi && typeof fromApi === "object" && !Array.isArray(fromApi)
      ? (fromApi as Record<string, unknown>)
      : (BASE_USER_PROFILE as Record<string, unknown>);

  const userProfile = {
    ...base,
    totalPoints: userPoints,
  };

  return <ProfileTab userProfile={userProfile as never} />;
}
