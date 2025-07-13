import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to log admin actions
async function logAction(poemId: number, adminId: number, action: string, details?: string) {
  await prisma.moderationLog.create({
    data: {
      poemId,
      adminId,
      action,
      details,
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // For now, use a hardcoded adminId = 1 (replace with real auth later)
  const adminId = 1;
  const { action, data } = await req.json();

  if (action === "approve") {
    const poem = await prisma.poem.update({
      where: { id: Number(params.id) },
      data: { status: "approved" },
    });
    await logAction(poem.id, adminId, "approve");
    return NextResponse.json(poem);
  }

  if (action === "deny") {
    const poem = await prisma.poem.update({
      where: { id: Number(params.id) },
      data: { status: "rejected" },
    });
    await logAction(poem.id, adminId, "reject");
    return NextResponse.json(poem);
  }

  if (action === "edit") {
    const poem = await prisma.poem.update({
      where: { id: Number(params.id) },
      data: {
        ...data, // Only allow certain fields in production!
      },
    });
    await logAction(poem.id, adminId, "edit", "Poem edited before approval");
    return NextResponse.json(poem);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
