import { prisma } from "./prisma";
import { fetch } from "undici"; // or global fetch on Node 18+
import { OAuth2Client } from "google-auth-library"; // lighter google oauth client

type Provider = "GMAIL" | "NOTION";

/**
 * Get fresh tokens for a given user & provider.
 * - If token expired (expiresAt in DB), we refresh and persist.
 * - Returns { accessToken, refreshToken?, expiresAt? }
 */
export async function getFreshTokensForUser(userId: string, provider: Provider) {
  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider } } as any,
  });

  if (!integration) throw new Error("No integration found");

  // if no expiry stored or expiry in future -> return as-is
  if (!integration.expiresAt || new Date(integration.expiresAt) > new Date(Date.now() + 5 * 1000)) {
    // still valid (give 5s buffer)
    return {
      accessToken: integration.accessToken,
      refreshToken: integration.refreshToken ?? undefined,
      expiresAt: integration.expiresAt ?? undefined,
    };
  }

  // expired -> refresh depending on provider
  if (provider === "GMAIL") {
    const refreshed = await refreshGoogleToken(integration.refreshToken!);
    // persist
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        accessToken: refreshed.accessToken,
        expiresAt: refreshed.expiresAt,
        refreshToken: refreshed.refreshToken ?? integration.refreshToken,
      },
    });
    return {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      expiresAt: refreshed.expiresAt,
    };
  } else if (provider === "NOTION") {
    // Notion supports refresh tokens in newer flows. We'll call token endpoint.
    const refreshed = await refreshNotionToken(integration.refreshToken!);
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        accessToken: refreshed.accessToken,
        expiresAt: refreshed.expiresAt,
        refreshToken: refreshed.refreshToken ?? integration.refreshToken,
      },
    });
    return {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      expiresAt: refreshed.expiresAt,
    };
  }

  throw new Error("Unsupported provider");
}

/** refresh using Google OAuth2 token endpoint */
async function refreshGoogleToken(refreshToken: string) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  // google-auth-library supports refresh via getAccessToken with setCredentials
  client.setCredentials({ refresh_token: refreshToken });
  const res = await client.getAccessToken(); // returns access token and expiry
  // The returned object might be string or { token, res }
  const accessToken = res?.token;
  // We can't always get expires_in from getAccessToken, so request explicit token endpoint as fallback:
  // Do explicit HTTP POST to oauth2.googleapis.com/token
  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  const tok = await tokenResp.json() as { access_token: string; expires_in: number; refresh_token: string };
  if (!tokenResp.ok) throw new Error("Failed to refresh Google token: " + JSON.stringify(tok));
  const expiresAt = tok.expires_in ? new Date(Date.now() + tok.expires_in * 1000) : undefined;
  return { accessToken: tok.access_token, refreshToken: tok.refresh_token ?? refreshToken, expiresAt };
}

/** refresh Notion token (if available) */
async function refreshNotionToken(refreshToken: string) {
  const res = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: "Basic " + Buffer.from("25fd872b-594c-80c0-80ac-0037e08afdfa:secret_Yom7haMvOCDmrE39D150XNPaGTnMuXMZAH4tRb4LrFx").toString("base64") },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  const body = await res.json() as { access_token: string; expires_in: number; refresh_token: string };
  if (!res.ok) throw new Error("Failed refresh Notion token: " + JSON.stringify(body));
  const expiresAt = body.expires_in ? new Date(Date.now() + body.expires_in * 1000) : undefined;
  return { accessToken: body.access_token, refreshToken: body.refresh_token ?? refreshToken, expiresAt };
}
