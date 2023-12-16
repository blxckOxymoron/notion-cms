import { IframeHTMLAttributes } from "react";

const allowProps: IframeHTMLAttributes<HTMLIFrameElement> = {
  allow:
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  allowFullScreen: true,
};

export default function Embed({ embedURL, title }: { embedURL: string; title: string }) {
  const embedWidth = typeof window !== "undefined" ? Math.min(1280, window.innerWidth - 64) : 1080;
  const embedHeight = Math.min(720, (embedWidth * 9) / 16);

  return (
    <div className="flex flex-col gap-2" style={{ width: embedWidth }}>
      <h2 className="text-4xl font-bold p-4 bg-black rounded-lg">{title}</h2>
      <iframe width={embedWidth} height={embedHeight} src={embedURL} {...allowProps}></iframe>
    </div>
  );
}
