import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const url = new URL("https://api.notion.com/v1/oauth/authorize");
  url.searchParams.set("client_id", "25fd872b-594c-80c0-80ac-0037e08afdfa");
  url.searchParams.set("redirect_uri", process.env.NOTION_REDIRECT_URI!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("owner", "user");
  // you can add state param
  return NextResponse.redirect(url.toString());
}
