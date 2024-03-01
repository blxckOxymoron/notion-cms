"use client";

import extractEmbedURLs from "@/lib/extractEmbedURLs";
import { DiscussionEmbed } from "disqus-react";
import Link from "next/link";
import type { IframeHTMLAttributes } from "react";

const allowProps: IframeHTMLAttributes<HTMLIFrameElement> = {
  allow:
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  allowFullScreen: true,
};

type URLs = ReturnType<typeof extractEmbedURLs>;

export default function VideoEmbed({
  urls,
  title,
  id,
  hosting = urls[0]?.name,
}: {
  urls: URLs;
  title: string;
  id: string;
  hosting?: string;
}) {
  if (!process.env.NEXT_PUBLIC_DISQUS_SHORTNAME) {
    throw "Missing DISQUS_SHORTNAME env variable";
  }

  return (
    <div className="flex flex-col gap-2 max-w-screen-xl">
      <h2 className="text-4xl font-bold p-4 bg-black rounded-lg">{title}</h2>
      <div className="flex gap-2 p-4 bg-black rounded-lg">
        <p>Hoster:</p>
        {urls
          .filter(v => v.url)
          .map(v => (
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
          src={urls.find(v => v.name === hosting)?.url}
          {...allowProps}
        ></iframe>
      </div>
      <div className="bg-black rounded-lg p-4">
        <DiscussionEmbed
          shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}
          config={{
            identifier: id,
          }}
        />
      </div>
    </div>
  );
}
