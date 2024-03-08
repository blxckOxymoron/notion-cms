"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LinkToNextPage() {
  const to = useSearchParams().get("to");
  const actualTo = to === "null" ? null : to;

  if (!actualTo) return null;

  return (
    <Link
      href={actualTo}
      className="hover:text-blue-500 px-4 py-2 bg-blue-500 hover:bg-transparent border border-blue-500 rounded-md transition-colors"
    >
      weiter
    </Link>
  );
}
