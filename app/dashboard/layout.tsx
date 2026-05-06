import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import BackendUserStatus from "@/app/components/BackendUserStatus";
import { isClerkFullyConfigured } from "@/lib/clerkConfigured";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkOk = isClerkFullyConfigured();

  return (
    <div className="flex flex-col w-full">
      <header className="w-full flex items-center justify-between gap-2 px-4 py-2 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        {clerkOk ? (
          <>
            <BackendUserStatus />
            <div className="flex items-center shrink-0 gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 text-sm font-medium rounded-lg text-indigo-600 hover:bg-indigo-50">
                    Нэвтрэх
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                    Бүртгүүлэх
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </>
        ) : (
          <span className="text-xs text-amber-600 w-full text-right">
            Clerk: .env.local дээр NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ба CLERK_SECRET_KEY
            тавина уу
          </span>
        )}
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
