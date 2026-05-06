import type { Metadata } from "next";
import MoreView from "./more-view";

export const metadata: Metadata = {
  title: "Цэс",
};

export default function MorePage() {
  return <MoreView />;
}
