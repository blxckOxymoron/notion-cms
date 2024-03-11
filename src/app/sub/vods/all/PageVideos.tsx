"use client";

import React, { useCallback, useRef, useState } from "react";
import VODWindow from "./VODWindow";

import { getNotionPages } from "@/data/notionPages";

export default function PageVideos({
  query,
  initialPages,
}: {
  query?: string;
  initialPages: Awaited<ReturnType<typeof getNotionPages>>;
}) {
  const fetching = useRef(false);

  const [pages, setPages] = useState(initialPages);

  const loadMore = useCallback(
    async (cursor: string | null) => {
      if (fetching.current) return;

      try {
        fetching.current = true;

        const data = await getNotionPages({
          query,
          start_cursor: cursor,
        });
        setPages(prev => ({
          ...data,
          results: [...prev.results, ...data.results],
        }));
      } finally {
        fetching.current = false;
      }
    },
    [query]
  );

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {pages.results.map(page => {
          return <VODWindow key={page.id} vod={page} />;
        })}
      </div>
      {pages.has_more && (
        <button
          className="hover:text-primary px-3 py-1 bg-primary hover:bg-transparent border border-primary rounded-md transition-colors self-center"
          onClick={() => loadMore(pages.next_cursor)}
        >
          mehr laden
        </button>
      )}
    </>
  );
}
