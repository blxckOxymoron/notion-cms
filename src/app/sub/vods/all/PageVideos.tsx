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
          const props: any = page.properties;
          return (
            <VODWindow
              key={page.id}
              id={page.id}
              thumbnailUrl={props.thumbnail_url.url}
              title={props.name.title.reduce((a: string, e: any) => a + e.plain_text, "")}
            />
          );
        })}
      </div>
      {pages.has_more && (
        <button
          className="hover:text-red-600 px-3 py-1 bg-red-600 hover:bg-transparent border border-red-600 rounded-md transition-colors self-center"
          onClick={() => loadMore(pages.next_cursor)}
        >
          mehr laden
        </button>
      )}
    </>
  );
}
