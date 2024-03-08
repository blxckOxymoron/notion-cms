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
      className="hover:text-red-600 px-4 py-2 bg-red-600 hover:bg-transparent border border-red-600 rounded-md transition-colors"
    >
      weiter
    </Link>
  );
}
