import Link from "next/link";
import Map from "./components/Map";
import App from "./components/App";

export default function Home() {
  return (
    <div className="bg-white text-black h-fit flex justify-center items-center">
      <App />
    </div>
  );
}
