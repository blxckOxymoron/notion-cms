"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LinkToNextPage() {
  const to = useSearchParams().get("to");
  const actualTo = to === "null" ? null : to;

  return (
    <Link
      href={actualTo ?? "/sub/vods"}
      className="hover:text-blue-500 px-3 py-1 bg-blue-500 hover:bg-transparent border border-blue-500 rounded-md transition-colors"
    >
      {actualTo ? "weiter" : "vods anschauen"}
    </Link>
  );
}
