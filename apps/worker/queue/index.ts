import redis from "@platform/lib/redis";
import { fetch } from "undici";
import { refreshGoogleToken } from "@platform/lib/google";

async function processQueue() {
  while (true) {
    const job = await redis.brpop("gmail:send", 0);
    if (!job) continue;

    // brpop returns [listName, element]
    const [, value] = job;
    const data = JSON.parse(value);

    let { accessToken, refreshToken, expiresAt, payload } = data;

    // Refresh token if expired
    if (expiresAt && new Date(expiresAt) < new Date()) {
      const refreshed = await refreshGoogleToken(refreshToken);
      accessToken = refreshed.accessToken;
      expiresAt = refreshed.expiresAt;
    }

    // Send Gmail API call
    await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: Buffer.from(
          `To: ${payload.to}\nSubject: ${payload.subject}\n\n${payload.body}`
        ).toString("base64"),
      }),
    });
  }
}

processQueue();
