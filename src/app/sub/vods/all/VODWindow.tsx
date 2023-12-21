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
        <div className="rounded-lg overflow-hidden cursor-pointer">
          <img src={thumbnailUrl} width={320} alt={title} />
        </div>
      </Link>
    </>
  );
}
