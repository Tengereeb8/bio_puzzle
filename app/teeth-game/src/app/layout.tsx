import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tooth Explorer 🦷",
  description: "Fun teeth anatomy game for kids aged 5–10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
