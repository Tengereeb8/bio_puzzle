"use client";

import Link from "next/link";
import BackendUserStatus from "@/app/components/BackendUserStatus";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/lib/auth-context";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSignedIn, isHydrated, logout, user } = useAuthContext();

  return (
    <div className="flex flex-col w-full min-h-[100dvh]">
      <header className="w-full flex items-center justify-between gap-3 px-4 py-2 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <BackendUserStatus />
        <nav className="flex items-center shrink-0 gap-2">
          {!isHydrated ? (
            <span className="text-xs text-muted-foreground">...</span>
          ) : !isSignedIn ? (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="h-9">
                  Нэвтрэх
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-9">
                  Бүртгэл
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline max-w-[140px] truncate text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" className="h-9" onClick={logout}>
                Гарах
              </Button>
            </div>
          )}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
