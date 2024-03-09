"use client";

import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
export default function VODWindow({
  id,
  thumbnailUrl,
  title,
}: {
  id: string;
  thumbnailUrl: string;
  title: string;
}) {
  return (
    <>
      <Link href={`/sub/vods/video/${id}`}>
        <div className="rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform group relative">
          <img src={thumbnailUrl} width={320} alt={title} />
          <p className="absolute opacity-0 group-hover:opacity-100 bg-gradient-to-t from-zinc-900/80 via-zinc-900/60 transition-opacity  bottom-0 break-keep overflow-ellipsis w-full left-0 p-2 pt-4">
            {title}
          </p>
        </div>
      </Link>
    </>
  );
}
