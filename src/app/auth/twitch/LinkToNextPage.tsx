"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LinkToNextPage() {
  const to = useSearchParams().get("to");
  const actualTo = to === "null" ? null : to;

  if (!actualTo) return null;

  return (
    <Link
      href={actualTo ?? "/sub/vods"}
      className="hover:text-primary px-3 py-1 bg-primary hover:bg-transparent border border-primary rounded-md transition-colors"
    >
      weiter
    </Link>
  );
}
