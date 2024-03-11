"use server";

import notionPageToVodInfo from "@/lib/notionPageToVodInfo";
import { Client, isFullPage } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getNotionPages({
  start_cursor,
  query,
}: {
  start_cursor?: string | null;
  query?: string;
} = {}) {
  if (!process.env.NOTION_DATABASE_ID) throw new Error("Missing NOTION_DATABASE_ID");

  const { has_more, next_cursor, results } = await notion.databases.query({
    start_cursor: start_cursor ? start_cursor : undefined,
    database_id: process.env.NOTION_DATABASE_ID,
    page_size: 24,
    sorts: [
      {
        property: "index",
        direction: "ascending",
      },
    ],
    filter: query
      ? {
          property: "name",
          title: {
            contains: query,
          },
        }
      : undefined,
  });

  const pages = results.filter(
    page => page.object === "page" && isFullPage(page)
  ) as PageObjectResponse[];

  return {
    has_more,
    next_cursor,
    results: pages.map(page => notionPageToVodInfo(page)),
  };
}

export async function getNotionPage(id: string, password?: string) {
  if (!process.env.NOTION_DATABASE_ID) throw new Error("Missing NOTION_DATABASE_ID");

  const page = await notion.pages.retrieve({
    page_id: id,
  });

  if (!isFullPage(page)) return null;

  const vod = notionPageToVodInfo(page, password);

  return vod;
}
