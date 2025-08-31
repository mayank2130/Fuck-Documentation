import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Client as NotionClient } from "@notionhq/client";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-devflow-key");
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

    // 1. Get user
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
    });
    if (!keyRecord) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    // 2. Get Notion integration
    const integration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId: keyRecord.userId,
          provider: "NOTION",
        },
      },
    });
    if (!integration) {
      return NextResponse.json({ error: "No Notion integration found" }, { status: 400 });
    }

    // 3. Init Notion client
    const notion = new NotionClient({ auth: integration.accessToken });

    const { parentPageId, title, content } = await req.json();

    // 4. Create page
    const response = await notion.pages.create({
      parent: { page_id: parentPageId },
      properties: {
        title: {
          title: [
            {
              text: { content: title },
            },
          ],
        },
      },
      children: content
        ? [
            {
              object: "block",
              type: "paragraph",
              paragraph: { rich_text: [{ text: { content } }] },
            },
          ]
        : [],
    });

    return NextResponse.json({ success: true, pageId: response.id });
  } catch (err: any) {
    console.error("Notion create page error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}