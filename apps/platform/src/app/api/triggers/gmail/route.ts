import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
const body = await req.json();
await redis.lpush("events:gmail", JSON.stringify(body));
return NextResponse.json({ status: "received" });
}