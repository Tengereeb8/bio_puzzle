"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ProgressContextValue = {
  userPoints: number;
  addPoints: (n: number) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [userPoints, setUserPoints] = useState(850);

  const addPoints = useCallback((n: number) => {
    setUserPoints((p) => p + n);
  }, []);

  return (
    <ProgressContext.Provider value={{ userPoints, addPoints }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress мөн ProgressProvider-д байх ёстой.");
  return ctx;
}
