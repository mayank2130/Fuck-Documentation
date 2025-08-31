// apps/platform/app/api/sdk/gmail/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-devflow-key");
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

    // 1. Get user from API key
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });
    if (!keyRecord) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    // 2. Get Gmail integration
    const integration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId: keyRecord.userId,
          provider: "GMAIL",
        },
      },
    });
    if (!integration) {
      return NextResponse.json({ error: "No Gmail integration found" }, { status: 400 });
    }

    // 3. Prepare Gmail client
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({
      access_token: integration.accessToken,
      refresh_token: integration.refreshToken || undefined,
      expiry_date: integration.expiresAt ? integration.expiresAt.getTime() : null,
    });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const { to, subject, body } = await req.json();

    // 4. Encode email
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      body,
    ];
    const email = Buffer.from(emailLines.join("\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    // 5. Send
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: email },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Gmail send error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
