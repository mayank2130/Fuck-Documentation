import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/oauth/gmail/callback"
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",    // important to get refresh_token
    prompt: "consent",         // forces refresh token on repeated grants
    scope: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
  });

  return NextResponse.redirect(url);
}
