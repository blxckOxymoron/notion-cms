import { Client, isFullPage } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import "server-only";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getNotionPages() {
  // TODO simpler env check
  if (!process.env.NOTION_DATABASE_ID) throw new Error("Missing NOTION_DATABASE_ID");

  const { has_more, next_cursor, results } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
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
