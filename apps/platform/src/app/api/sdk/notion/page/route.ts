import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { prisma } from "@/lib/prisma";
import { getFreshTokensForUser } from "@/lib/tokenManager";

export async function POST(req: NextRequest) {
  try {
    const { title, content, parentPageId, databaseId } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Get the demo user's Notion integration
    const userEmail = "demo@devflow.local";
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get fresh tokens for the user
    const tokens = await getFreshTokensForUser(user.id, "NOTION");

    // Initialize Notion client with the OAuth token
    const notion = new Client({ 
      auth: tokens.accessToken
    });

    // Determine parent (page or database)
    const parent = parentPageId 
      ? { page_id: parentPageId }
      : { database_id: databaseId || process.env.NOTION_DATABASE_ID || "25f3f2eb4b908071907fe4aab90ded63" };

    // Create the page
    const response = await notion.pages.create({
      parent,
      properties: {
        title: {
          title: [{ text: { content: title } }],
        },
      },
      children: content ? [
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: [{ text: { content } }] },
        },
      ] : undefined,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Notion create page error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
