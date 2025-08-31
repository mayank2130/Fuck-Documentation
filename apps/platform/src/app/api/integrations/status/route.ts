// apps/platform/app/api/integrations/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const mockUserId = "user_123";

export async function GET(_req: NextRequest) {
  const integrations = await prisma.integration.findMany({
    where: { userId: mockUserId },
  });

  return NextResponse.json([
    { provider: "GMAIL", connected: !!integrations.find((i: { provider: string }) => i.provider === "GMAIL") },
    { provider: "NOTION", connected: !!integrations.find((i: { provider: string }) => i.provider === "NOTION") },
  ]);
}