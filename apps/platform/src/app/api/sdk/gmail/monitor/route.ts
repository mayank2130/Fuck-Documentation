import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { getFreshTokensForUser } from "@/lib/tokenManager";

export async function POST(req: NextRequest) {
  try {
    const { query, maxResults = 10 } = await req.json();

    // Get the demo user (in production, this would come from auth)
    const userEmail = "demo@devflow.local";
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get fresh tokens
    const tokens = await getFreshTokensForUser(user.id, "GMAIL");
    if (!tokens) {
      return NextResponse.json({ error: "Gmail not connected" }, { status: 401 });
    }

    // Initialize Gmail API
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Build query string
    let gmailQuery = "is:unread";
    if (query) {
      gmailQuery += ` ${query}`;
    }

    // List messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: gmailQuery,
      maxResults: maxResults,
    });

    const messages = response.data.messages || [];
    const emailMessages = [];

    // Get full message details
    for (const message of messages) {
      const messageDetails = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
      });

      const headers = messageDetails.data.payload?.headers;
      const subject = headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
      const from = headers?.find(h => h.name === 'From')?.value || 'Unknown';
      const date = headers?.find(h => h.name === 'Date')?.value || '';

      // Extract body
      let body = '';
      if (messageDetails.data.payload?.body?.data) {
        body = Buffer.from(messageDetails.data.payload.body.data, 'base64').toString();
      } else if (messageDetails.data.payload?.parts) {
        const textPart = messageDetails.data.payload.parts.find(part => 
          part.mimeType === 'text/plain'
        );
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString();
        }
      }

      emailMessages.push({
        id: message.id,
        subject,
        from,
        date,
        body,
        snippet: messageDetails.data.snippet || '',
      });
    }

    return NextResponse.json(emailMessages);
  } catch (error) {
    console.error('Gmail monitor error:', error);
    return NextResponse.json({ error: "Failed to monitor Gmail" }, { status: 500 });
  }
}
