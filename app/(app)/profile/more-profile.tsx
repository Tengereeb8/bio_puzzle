"use client";

import { useCallback, useEffect, useState } from "react";
import ProfileTab from "@/app/components/Profile";
import type { CharacterCustomization } from "@/app/components/Profile";
import { useProgress } from "@/app/components/context/ProgressContext";
import { useAuthContext } from "@/lib/auth-context";
import { API_URL } from "@/lib/api-url";
import { fetchUserProfile, type ProfileApiPayload } from "@/lib/progress-api";

export default function MoreProfile() {
  const { token, refreshUser, isHydrated } = useAuthContext();
  const { userPoints, setUserPoints } = useProgress();
  const [profile, setProfile] = useState<ProfileApiPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!token) {
      setProfile(null);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchUserProfile(token);
      setProfile(data);
      setError(null);
      if (data?.totalPoints != null) setUserPoints(data.totalPoints);
    } catch (e) {
      setProfile(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [token, setUserPoints]);

  useEffect(() => {
    if (!isHydrated) return;
    void loadProfile();
  }, [isHydrated, loadProfile]);

  const handleCharacterUpdate = useCallback(
    async (character: CharacterCustomization) => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profileExtras: { character } }),
        });
        if (!res.ok) return;
        await refreshUser();
        await loadProfile();
      } catch {
        /* ignore */
      }
    },
    [token, refreshUser, loadProfile],
  );

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Ачаалж байна…
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-sm text-gray-600">
        Хувийн мэдээлэл харахын тулд эхлээд{" "}
        <a href="/login" className="text-indigo-600 font-semibold underline">
          нэвтэрнэ үү
        </a>
        .
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500 px-4">
        Профайлыг ачаалж байна…
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-red-700 space-y-2">
        <p className="font-semibold">Ачаалж чадсангүй</p>
        <p className="text-gray-700">{error ?? "Мэдээлэл олдсонгүй"}</p>
      </div>
    );
  }

  const userProfile = {
    name: profile.name,
    nameMn: profile.nameMn,
    streak: profile.streak,
    badges: profile.badges.map((b) => ({
      id: b.id,
      name: b.name,
      nameMn: b.nameMn,
      description: b.description,
      descriptionMn: b.descriptionMn,
      unlocked: b.unlocked,
      progress: b.progress,
      maxProgress: b.maxProgress,
    })),
    character: profile.character as CharacterCustomization | undefined,
    bestTime: profile.bestTime,
    totalGames: profile.totalGames,
    lessonsCompleted: profile.lessonsCompleted,
    totalPoints: profile.totalPoints ?? userPoints,
    level: profile.level ?? 1,
  };

  const profileInstanceKey = [
    profile.name,
    profile.streak,
    profile.totalPoints ?? 0,
    profile.lessonsCompleted ?? 0,
    JSON.stringify(profile.character ?? null),
  ].join("|");

  return (
    <ProfileTab
      key={profileInstanceKey}
      userProfile={userProfile as never}
      onCharacterUpdate={handleCharacterUpdate}
    />
  );
}
