import Link from "next/link";
import Map from "./components/Map";

export default function Home() {
  return (
    <div className="bg-white text-black h-fit flex justify-center items-center">
      <Map />
      <Link href={"/game/match"}>
        <button>Match</button>
      </Link>
    </div>
  );
}
