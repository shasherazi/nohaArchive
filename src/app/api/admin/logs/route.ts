import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const logs = await prisma.moderationLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      admin: true,
      poem: true,
    },
    take: 100, // limit to latest 100 logs for performance
  });
  return NextResponse.json(logs);
}
