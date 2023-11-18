"use client";

export default function LoadMoreButton({ nextCursor }: { nextCursor: string }) {
  return (
    <button className="hover:text-blue-500 px-3 py-1 bg-blue-500 hover:bg-transparent border border-blue-500 rounded-md transition-colors self-center">
      load more
    </button>
  );
}
