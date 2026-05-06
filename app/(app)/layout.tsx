import type { Metadata } from "next";
import { AppShell } from "./app-shell";

export const metadata: Metadata = {
  title: {
    template: "%s · Bio Puzzle",
    default: "Bio Puzzle · Roadmap",
  },
};

export default function AppSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
