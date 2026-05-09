"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CurriculumBootstrap } from "@/lib/curriculumApi";
import { API_URL } from "@/lib/api-url";
import { useAuthContext } from "@/lib/auth-context";
import { CURRICULUM_RELOAD_EVENT } from "@/lib/curriculum-reload";

const CurriculumContext = createContext<CurriculumBootstrap | null>(null);

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const { token, isHydrated } = useAuthContext();
  const [data, setData] = useState<CurriculumBootstrap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const bump = () => setReloadTick((n) => n + 1);
    window.addEventListener(CURRICULUM_RELOAD_EVENT, bump);
    return () => window.removeEventListener(CURRICULUM_RELOAD_EVENT, bump);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let cancelled = false;

    async function load() {
      try {
        const headers: HeadersInit = { Accept: "application/json" };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/curriculum/bootstrap`, {
          headers,
        });
        if (!res.ok) {
          throw new Error(`API ${res.status}: curriculum/bootstrap`);
        }
        const json = (await res.json()) as CurriculumBootstrap;
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setData(null);
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token, isHydrated, reloadTick]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Бэлдэж байна…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center text-sm text-red-700">
        <p className="font-semibold mb-2">Агуулга ачаалагдаагүй байна</p>
        <p>{error}</p>
        <p className="mt-4 text-gray-600">
          Backend-ийг асааж (<code className="text-xs">npm run dev</code>{" "}
          Bio-Puzzle-Backend), хаягийг{" "}
          <code className="text-xs">NEXT_PUBLIC_API_URL</code> эсвэл анхны{" "}
          <code className="text-xs">{API_URL}</code> руу зааж байгаа эсэхийг
          шалгана уу.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Агуулгыг ачаалж байна…
      </div>
    );
  }

  return (
    <CurriculumContext.Provider value={data}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum(): CurriculumBootstrap {
  const ctx = useContext(CurriculumContext);
  if (!ctx) {
    throw new Error("useCurriculum нь CurriculumProvider дотор ашиглана.");
  }
  return ctx;
}
