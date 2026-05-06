"use client";

import { useAuthContext } from "@/lib/auth-context";

/** AuthProvider аль хэдийн `/users/me`-ээр синкласан user-ийг дарж үзүүлнэ */
export default function BackendUserStatus() {
  const { isHydrated, isSignedIn, user } = useAuthContext();

  if (!isHydrated || !isSignedIn || !user) {
    return null;
  }

  return (
    <div className="mr-auto min-w-0 text-xs text-left max-w-[min(220px,45vw)] text-emerald-700 font-medium truncate">
      <span title={`${user.email} · Postgres`}>✓ {user.username}</span>
    </div>
  );
}
