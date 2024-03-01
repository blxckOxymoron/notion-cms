"use server";

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
    results: pages,
  };
}

export async function getNotionPage(id: string) {
  if (!process.env.NOTION_DATABASE_ID) throw new Error("Missing NOTION_DATABASE_ID");

  const page = await notion.pages.retrieve({
    page_id: id,
  });

  return isFullPage(page) ? page : null;
}
