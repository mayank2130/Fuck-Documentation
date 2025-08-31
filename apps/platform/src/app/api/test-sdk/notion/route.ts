import { NextRequest, NextResponse } from "next/server";
import { devflow } from "@techno-king/sdk";

export async function POST(req: NextRequest) {
  try {
    const { title, content, parentPageId, databaseId } = await req.json();

    if (!title || (!parentPageId && !databaseId)) {
      return NextResponse.json(
        { error: "Title and either Parent Page ID or Database ID are required" },
        { status: 400 }
      );
    }

    // Use the SDK which will make a request to /api/sdk/notion/page
    const response = await devflow.notion.createPage({
      title,
      content: content || "",
      parentPageId,
      databaseId
    });

    return NextResponse.json({ success: true, page: response });
  } catch (err: any) {
    console.error("SDK test error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
