"use client";

import { VodInfo } from "@/lib/notionPageToVodInfo";
import Link from "next/link";
import lockIcon from "./lock.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* eslint-disable @next/next/no-img-element */
export default function VODWindow({
  vod: { id, thubnailURL, title, passwordProtected },
}: {
  vod: VodInfo;
}) {
  return (
    <>
      <Link
        href={`/sub/vods/video/${id}`}
        title={passwordProtected ? "Passwortgeschützt" : undefined}
      >
        <div className="rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform group relative">
          <img src={thubnailURL} width={320} alt={title} />
          {passwordProtected && (
            <div className="absolute top-2 bg-zinc-900/60 p-2 rounded-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Image src={lockIcon} alt="Passwortgeschützt" width={32} height={32} />
            </div>
          )}
          <p className="absolute opacity-0 group-hover:opacity-100 bg-gradient-to-t from-zinc-900/80 via-zinc-900/60 transition-opacity  bottom-0 break-keep overflow-ellipsis w-full left-0 p-2 pt-4">
            {title}
          </p>
        </div>
      </Link>
    </>
  );
}
