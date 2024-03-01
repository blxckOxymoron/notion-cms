import { Routes } from "@/data/routes";
import searchIcon from "./search.svg";
import homeIcon from "./home.svg";
import twitchIcon from "./twitch.svg";
import Image from "next/image";

export default function VODLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <header className="flex gap-2 justify-center">
        <a
          href={Routes.vods.all}
          className="p-2 leading-snug rounded-full border border-white hover:bg-zinc-600 transition-colors"
        >
          <Image src={homeIcon} alt="Home Icon" />
        </a>
        <form
          className="flex gap-1 rounded-full px-3 py-1 border border-white"
          action={Routes.vods.all}
        >
          <Image src={searchIcon} alt="Search Icon" />
          <input
            type="search"
            name="q"
            className="bg-transparent rounded-sm px-2 focus:outline-none"
            placeholder="Suche ..."
          />
        </form>
        <a
          href={Routes.auth.info}
          className="p-2 leading-snug rounded-full border border-white hover:bg-zinc-600 transition-colors"
        >
          <Image src={twitchIcon} alt="Twitch Icon" />
        </a>
      </header>
      {children}
    </div>
  );
}
