"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useApi } from "@/lib/api";
import type { User } from "@/lib/types";

/**
 * `/users/me` дуудах — effect дотор синхрон setState үл ашиглана (үнэхээр асинхрон дуудагдахад л шинэчилнэ).
 */
function BackendUserStatusInner() {
  const api = useApi();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [err, setErr] = useState<string | null>(null);
  const attemptRef = useRef(0);

  useEffect(() => {
    attemptRef.current += 1;
    const myAttempt = attemptRef.current;
    let cancelled = false;

    (async () => {
      try {
        const me = await api.get<User>("/users/me");
        if (cancelled || myAttempt !== attemptRef.current) return;
        setUser(me);
        setErr(null);
      } catch (e) {
        if (cancelled || myAttempt !== attemptRef.current) return;
        setUser(null);
        setErr(e instanceof Error ? e.message : "API алдаа");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [api]);

  return (
    <div
      className="mr-auto min-w-0 text-left text-xs max-w-[min(220px,45vw)]"
      aria-live="polite"
    >
      {user === undefined && (
        <span className="text-gray-400 truncate block">Backend…</span>
      )}
      {user && (
        <span
          className="text-emerald-700 font-medium truncate block"
          title={user.email}
        >
          ✓ {user.username}
        </span>
      )}
      {user === null && err != null && (
        <span
          className="text-red-600 truncate block cursor-help"
          title={err}
        >
          {err.replace(/^Error:\s*/i, "")}
        </span>
      )}
    </div>
  );
}

/** Нэвтрээгүй бол дотоод компонент unmount болж state цэвэр үлдэнэ — effect-д reset шаардлагагүй */
export default function BackendUserStatus() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  if (!isLoaded || !isSignedIn || !userId) {
    return null;
  }
  return <BackendUserStatusInner key={userId} />;
}
