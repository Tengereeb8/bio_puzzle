import { Footer } from "react-day-picker";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      <main>{children}</main>
    </div>
  );
}
