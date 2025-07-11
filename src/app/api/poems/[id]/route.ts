import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const poem = await prisma.poem.findUnique({
    where: { id: Number(params.id), status: "approved" },
  });
  if (!poem) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(poem);
}
