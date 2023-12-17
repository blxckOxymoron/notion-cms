import { getNotionPages } from "@/data/notionPages";
import searchIcon from "./search.svg";
import Image from "next/image";
import PageVideos from "./PageVideos";

export default async function VODPage() {
  const pages = await getNotionPages();

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <header>
        <form className="flex gap-1 rounded-full px-3 py-1 border border-white">
          <Image
            src={searchIcon}
            alt="Search Icon"
            className="text-white"
            style={{ color: "inherit" }}
          />{" "}
          <input
            type="search"
            name="q"
            className="bg-transparent rounded-sm px-2 focus:outline-none"
          />
        </form>
      </header>
      <main className="flex flex-col gap-4 items max-w-[1700px] ">
        <h1 className="text-7xl">WELCOME TO THE VODS</h1>
        <PageVideos initialPages={pages} />
      </main>
    </div>
  );
}
