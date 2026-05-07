"use client";

import { CurriculumProvider } from "@/app/components/context/CurriculumContext";
import { ProgressProvider } from "@/app/components/context/ProgressContext";
import FooterNav from "@/app/components/FooterNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <CurriculumProvider>
        <div className="min-h-[calc(100dvh-env(safe-area-inset-bottom))] w-full bg-white text-black flex justify-center">
          <div className="w-full max-w-lg min-h-full relative pb-[calc(5rem+env(safe-area-inset-bottom))]">
            {children}
          </div>
          <FooterNav />
        </div>
      </CurriculumProvider>
    </ProgressProvider>
  );
}
