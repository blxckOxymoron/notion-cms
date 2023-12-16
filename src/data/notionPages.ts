import "server-only";
import { Client, isFullPage } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getNotionPages() {
  if (!process.env.NOTION_DATABASE_ID) throw new Error("Missing NOTION_DATABASE_ID");

  const { has_more, next_cursor, results } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    page_size: 24,
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
