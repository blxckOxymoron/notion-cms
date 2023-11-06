import { Client } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const dbId = "73440b3b6f314afeb46a6a56b7add8f0";

export async function GET(request: NextRequest) {
  return NextResponse.json(await notion.databases.retrieve({ database_id: dbId }));
}
