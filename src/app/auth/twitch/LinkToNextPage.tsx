"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LinkToNextPage() {
  return (
    <Link href={useSearchParams().get("to") ?? "/"} className="text-blue-500 underline">
      To preveous page
    </Link>
  );
}
