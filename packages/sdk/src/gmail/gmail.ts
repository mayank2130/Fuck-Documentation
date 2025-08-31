import { google } from "googleapis";
import { GmailTokens } from '../types';

function getGmailClient(tokens: GmailTokens) {
  const { accessToken, refreshToken, expiryDate } = tokens;

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  });

  return google.gmail({ version: "v1", auth: oAuth2Client });
}

export async function sendEmail(tokens: GmailTokens, data: { to: string; subject: string; body: string }) {
  const gmail = getGmailClient(tokens);

  const encodedMessage = Buffer.from(
    `To: ${data.to}\r\nSubject: ${data.subject}\r\n\r\n${data.body}`
  ).toString("base64");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });

  return { success: true };
}

export async function listMessages(tokens: GmailTokens, query?: string) {
  const gmail = getGmailClient(tokens);

  const res = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 10,
  });

  return res.data.messages ?? [];
}
