"use client";

import Link from "next/link";
import { IframeHTMLAttributes, MouseEventHandler, useEffect, useRef, useState } from "react";

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
  const outermostElement = useRef<HTMLDivElement>(null);

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
