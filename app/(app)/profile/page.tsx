import type { Metadata } from "next";
import MoreProfile from "./more-profile";

export const metadata: Metadata = {
  title: "Цэс",
};

export default function MorePage() {
  return <MoreProfile />;
}
