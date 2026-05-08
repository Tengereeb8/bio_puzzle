"use client";

import { CurriculumProvider } from "@/app/components/context/CurriculumContext";
import { ProgressProvider } from "@/app/components/context/ProgressContext";
import FooterNav from "@/app/components/FooterNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <div className="w-full h-screen bg-white text-black relative">
        <div className="w-full h-full pb-[calc(5rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <FooterNav />
        <CurriculumProvider children={undefined} />
      </div>
    </ProgressProvider>
  );
}
