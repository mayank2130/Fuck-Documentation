import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

  const resp = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Basic " + Buffer.from("25fd872b-594c-80c0-80ac-0037e08afdfa:secret_Yom7haMvOCDmrE39D150XNPaGTnMuXMZAH4tRb4LrFx").toString("base64"),
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.NOTION_REDIRECT_URI,
    }),
  });

  const tokens = await resp.json();
  if (!resp.ok) return NextResponse.json(tokens, { status: 400 });

  // attach to demo user for MVP
  const userEmail = "demo@devflow.local";
  let user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) return;

  // Notion response contains access_token and refresh_token (depending on API version)
  await prisma.integration.upsert({
    where: { userId_provider: { userId: user.id, provider: "NOTION" } } as any,
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
      scope: tokens.scope ?? undefined,
    },
    create: {
      userId: user.id,
      provider: "NOTION",
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
      scope: tokens.scope ?? undefined,
    },
  });

  return NextResponse.redirect(process.env.PLATFORM_ORIGIN + "/dashboard");
}
