"use client";

import { VodInfo } from "@/lib/notionPageToVodInfo";
import { DiscussionEmbed } from "disqus-react";
import Link from "next/link";
import type { IframeHTMLAttributes } from "react";

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

  return (
    <div className="flex flex-col gap-2 max-w-screen-lg w-full">
      <h2 className="text-4xl font-bold p-4 bg-black rounded-lg">{vod.title}</h2>
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
    </div>
  );
}
