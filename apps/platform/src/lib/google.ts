import { fetch } from "undici";

export async function refreshGoogleToken(refreshToken: string) {
const res = await fetch("https://oauth2.googleapis.com/token", {
method: "POST",
headers: { "Content-Type": "application/x-www-form-urlencoded" },
body: new URLSearchParams({
client_id: process.env.GOOGLE_CLIENT_ID!,
client_secret: process.env.GOOGLE_CLIENT_SECRET!,
refresh_token: refreshToken,
grant_type: "refresh_token",
}),
});


const data = await res.json() as { access_token: string; expires_in: number };
return {
accessToken: data.access_token,
expiresAt: new Date(Date.now() + data.expires_in * 1000),
};
}