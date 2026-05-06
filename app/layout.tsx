import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { isClerkFullyConfigured } from "@/lib/clerkConfigured";
import "./globals.css";
import DashboardLayout from "./dashboard/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bio Puzzle",
  description: "Бие махбодын бүтцийг тоглоомоор сурах апп",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tree = (
    <html
      lang="mn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col w-full">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );

  return isClerkFullyConfigured() ? (
    <ClerkProvider>{tree}</ClerkProvider>
  ) : (
    tree
  );
}
