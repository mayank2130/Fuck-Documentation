import { request } from "undici";

const BASE_URL = process.env.DEVFLOW_BASE_URL || "http://localhost:3000";

export const notion = {
  async createPage(data: { title: string; content: string }) {
    const res = await request(`${BASE_URL}/api/sdk/notion/page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.body.json();
  },
};
