import { NextRequest, NextResponse } from "next/server";
import { generateApiKey } from "@/lib/generate-api-key";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    const apiKey = await generateApiKey(user.id, name);

    return NextResponse.json({
      success: true,
      apiKey, // Show only once!
      message: "Save this API key - it will not be shown again",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate API key",
      },
      { status: 500 }
    );
  }
}
