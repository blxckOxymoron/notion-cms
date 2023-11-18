"use client";

import { IframeHTMLAttributes, MouseEventHandler, useEffect, useRef, useState } from "react";

const allowProps: IframeHTMLAttributes<HTMLIFrameElement> = {
  allow:
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  allowFullScreen: true,
};

/* eslint-disable @next/next/no-img-element */
export default function VODWindow({
  thumbnailUrl,
  title,
  embedURL,
  tags,
}: {
  thumbnailUrl: string;
  title: string;
  embedURL: string;
  tags: string[];
}) {
  const [open, setOpen] = useState(false);

  const embedWidth = typeof window !== "undefined" ? Math.min(1280, window.innerWidth - 64) : 1080;
  const embedHeight = Math.min(720, (embedWidth * 9) / 16);

  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape" && !e.shiftKey) setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";

      window.addEventListener("keydown", escapeHandler);
    }

    return () => {
      document.body.style.removeProperty("overflow");
      window.removeEventListener("keydown", escapeHandler);
    };
  }, [open]);

  const outermostElement = useRef<HTMLDivElement>(null);

  const handleClick: MouseEventHandler<HTMLDivElement> = e => {
    if (e.target === outermostElement.current) setOpen(false);
  };

  return (
    <>
      <div className="rounded-lg overflow-hidden cursor-pointer" onClick={() => setOpen(true)}>
        <img src={thumbnailUrl} width={320} alt={title} />
      </div>
      {open && (
        <div
          className="fixed top-0 left-0 backdrop-blur-md w-screen h-screen flex items-center justify-center overflow-hidden"
          onClick={handleClick}
          ref={outermostElement}
          onKeyDown={e => console.log(e)}
        >
          <div className="flex flex-col gap-2" style={{ width: embedWidth }}>
            <h2 className="text-4xl font-bold p-4 bg-black rounded-lg">{title}</h2>
            <iframe width={embedWidth} height={embedHeight} src={embedURL} {...allowProps}></iframe>
          </div>
        </div>
      )}
    </>
  );
}
