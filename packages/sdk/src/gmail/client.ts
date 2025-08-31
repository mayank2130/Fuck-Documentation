import { request } from "undici";
import { EmailMessage } from "../types";

const BASE_URL = process.env.DEVFLOW_BASE_URL || "http://localhost:3000";

export const gmail = {
  async sendEmail(data: { to: string; subject: string; body: string }) {
    const res = await request(`${BASE_URL}/api/sdk/gmail/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.body.json();
  },

  async listMessages(query?: string) {
    const res = await request(`${BASE_URL}/api/sdk/gmail/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    return res.body.json();
  },

  async onNewEmail(config: { query?: string; maxResults?: number } = {}) {
    const res = await request(`${BASE_URL}/api/sdk/gmail/monitor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });
    return res.body.json();
  },
};
