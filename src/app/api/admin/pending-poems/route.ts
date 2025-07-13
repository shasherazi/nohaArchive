import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const deep = searchParams.get("deep") === "true";

  const where = {
    status: "pending",
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
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(poems);
}
