import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const deep = searchParams.get("deep") === "true";
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  const page = parseInt(searchParams.get("page") || "1", 10);

  const where = {
    status: "approved",
    ...(q
      ? deep
        ? {
          OR: [
            { titleUrdu: { contains: q } },
            { titleEn: { contains: q } },
            { contentUrdu: { contains: q } },
            { contentEn: { contains: q } },
          ],
        }
        : {
          OR: [
            { titleUrdu: { contains: q } },
            { titleEn: { contains: q } },
          ],
        }
      : {}),
  };

  const poems = await prisma.poem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  // For pagination: get total count
  const total = await prisma.poem.count({ where });

  return NextResponse.json({ poems, total });
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Basic validation
  if (
    !data.type ||
    !data.titleUrdu ||
    !data.contentUrdu ||
    !["noha", "qaseeda", "folk"].includes(data.type)
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const poem = await prisma.poem.create({
    data: {
      type: data.type,
      titleUrdu: data.titleUrdu,
      titleEn: data.titleEn,
      contentUrdu: data.contentUrdu,
      contentEn: data.contentEn,
      poet: data.poet,
      year: data.year,
      status: "pending", // All new poems are pending by default
      submittedById: null, // No user tracking for now
    },
  });

  return NextResponse.json(poem, { status: 201 });
}
