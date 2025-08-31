import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // optional, can carry info like intended userId

  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/oauth/gmail/callback"
  );

  const { tokens } = await oauth2Client.getToken(code);

  // TODO: decide which user to attach to — for MVP we attach to demo user or state userId
  const userEmail = "demo@devflow.local";
  let user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    // Create demo user with required fields
    user = await prisma.user.create({ 
      data: { 
        email: userEmail,
        clerkId: "demo_user_clerk_id" // Demo clerk ID for testing
      } 
    });
  }

  // Upsert Integration record (unique on user+provider)
  await prisma.integration.upsert({
    where: { userId_provider: { userId: user.id, provider: "GMAIL" } } as any,
    update: {
      accessToken: tokens.access_token ?? undefined,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      scope: tokens.scope ?? undefined,
    },
    create: {
      userId: user.id,
      provider: "GMAIL",
      accessToken: tokens.access_token ?? "",
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      scope: tokens.scope ?? undefined,
    },
  });

  return NextResponse.redirect(process.env.PLATFORM_ORIGIN + "/dashboard");
}
