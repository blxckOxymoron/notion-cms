import extractEmbedURLs from "@/lib/extractEmbedURLs";
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
  hosting = urls[0]?.name,
}: {
  urls: URLs;
  title: string;
  hosting?: string;
}) {
  const embedWidth = typeof window !== "undefined" ? Math.min(1280, window.innerWidth - 64) : 1080;
  const embedHeight = Math.min(720, (embedWidth * 9) / 16);

  return (
    <div className="flex flex-col gap-2" style={{ width: embedWidth }}>
      <h2 className="text-4xl font-bold p-4 bg-black rounded-lg">{title}</h2>
      <iframe
        width={embedWidth}
        height={embedHeight}
        src={urls.find(v => v.name === hosting)?.url}
        {...allowProps}
      ></iframe>
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
    </div>
  );
}
