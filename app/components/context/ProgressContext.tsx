"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuthContext } from "@/lib/auth-context";

type ProgressContextValue = {
  userPoints: number;
  setUserPoints: (n: number) => void;
  /** Зөвхөн локал туршилтад — серверийн эцсийн утгыг нөхөж ашиглана. */
  addPoints: (n: number) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, isHydrated } = useAuthContext();
  const [userPoints, setUserPointsState] = useState(0);

  useEffect(() => {
    if (!isHydrated) return;
    if (user?.totalPoints != null) setUserPointsState(user.totalPoints);
    else if (!user) setUserPointsState(0);
  }, [isHydrated, user?.id, user?.totalPoints]);

  const setUserPoints = useCallback((n: number) => {
    setUserPointsState(Math.max(0, n));
  }, []);

  const addPoints = useCallback((n: number) => {
    setUserPointsState((p) => Math.max(0, p + n));
  }, []);

  return (
    <ProgressContext.Provider
      value={{ userPoints, setUserPoints, addPoints }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress мөн ProgressProvider-д байх ёстой.");
  return ctx;
}
