import { Routes } from "@/data/routes";
import searchIcon from "./search.svg";
import homeIcon from "./home.svg";
import twitchIcon from "./twitch.svg";
import Image from "next/image";
import Link from "next/link";

export default function VODLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <header className="flex gap-2 justify-center">
        <Link
          href={Routes.vods.all}
          className="p-2 leading-snug rounded-full shrink-0 border border-white hover:bg-white/30 transition-colors"
        >
          <Image src={homeIcon} alt="Home Icon" />
        </Link>
        <form
          className="flex gap-1 rounded-full px-3 py-1 border border-white flex-1"
          action={Routes.vods.all}
        >
          <Image src={searchIcon} alt="Search Icon" />
          <input
            type="search"
            name="q"
            className="bg-transparent rounded-sm px-2 w-full min-w-0 focus:outline-none"
            placeholder="Suche ..."
          />
        </form>
        <Link
          href={Routes.auth.info}
          className="p-2 leading-snug rounded-full shrink-0 border border-white hover:bg-white/30 transition-colors"
        >
          <Image src={twitchIcon} alt="Twitch Icon" />
        </Link>
      </header>
      {children}
    </div>
  );
}
