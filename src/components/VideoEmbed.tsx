"use client";

import { VodInfo } from "@/lib/notionPageToVodInfo";
import { DiscussionEmbed } from "disqus-react";
import Link from "next/link";
import { useEffect, type IframeHTMLAttributes } from "react";

const allowProps: IframeHTMLAttributes<HTMLIFrameElement> = {
  allow:
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  allowFullScreen: true,
};

export default function VideoEmbed({
  vod,
  hosting = vod.embedURLs[0]?.name,
}: {
  vod: VodInfo;
  hosting?: string;
}) {
  if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME) {
    throw "Missing DISQUS_SHORTNAME env variable";
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("password") !== null) {
      url.searchParams.delete("password");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 max-w-screen-lg w-full">
      <h2 className="text-4xl font-bold p-4 bg-black rounded-lg">{vod.title}</h2>
      {!vod.isCorrectPassword ? (
        <div className="bg-black rounded-lg p-4 self-center flex flex-col gap-2 items-center max-w-full">
          <h2 className="text-center text-4xl font-bold mb-4">
            Pass&shy;wort&shy;ge&shy;schützt&shy;es Video
          </h2>
          <form action="" method="GET" className="flex flex-col gap-2">
            <label htmlFor="password">Passwort eingeben:</label>
            <div className="flex gap-2 flex-wrap">
              <input
                type="password"
                id="password"
                placeholder="Passwort"
                name="password"
                className="bg-black border border-white rounded-md p-1 min-w-0 grow"
              />
              <button
                type="submit"
                className="shrink-0 hover:text-primary px-3 py-1 bg-primary hover:bg-transparent border border-primary rounded-md transition-colors"
              >
                fertig
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex gap-2 p-4 bg-black rounded-lg overflow-x-scroll">
            <p>Hoster:</p>
            {vod.embedURLs.map(v => (
              <Link
                href={`?hosting=${v.name}`}
                key={v.name}
                replace
                className="hover:underline aria-selected:underline"
                aria-selected={v.name === hosting}
              >
                {v.name}
              </Link>
            ))}
          </div>
          <div className="shrink-0" style={{ aspectRatio: `16/9` }}>
            <iframe
              width="1080"
              height="607"
              className="w-full h-full"
              src={vod.embedURLs.find(v => v.name === hosting)?.url}
              {...allowProps}
            ></iframe>
          </div>
          <div className="bg-black rounded-lg p-4">
            <DiscussionEmbed
              shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}
              config={{
                identifier: vod.id,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
