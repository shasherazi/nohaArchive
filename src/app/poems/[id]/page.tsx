import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EnglishToggle from "./EnglishToggle";

export default async function PoemPage({ params }: { params: { id: string } }) {
  const poem = await prisma.poem.findUnique({
    where: { id: Number(params.id), status: "approved" },
  });

  if (!poem) return notFound();

  return (
    <div className="container mx-auto max-w-2xl py-8 px-2">
      <h1 className="text-2xl font-bold mb-2">{poem.titleUrdu}</h1>
      {poem.titleEn && (
        <div className="text-muted-foreground mb-4">{poem.titleEn}</div>
      )}
      <div className="mb-4">
        <span className="inline-block bg-muted px-2 py-1 rounded text-xs uppercase">
          {poem.type}
        </span>
        {poem.poet && (
          <span className="ml-2 text-sm text-muted-foreground">
            {poem.poet}
          </span>
        )}
        {poem.year && (
          <span className="ml-2 text-sm text-muted-foreground">
            ({poem.year})
          </span>
        )}
      </div>
      <div className="mb-6 whitespace-pre-line text-lg">{poem.contentUrdu}</div>
      {/* English content toggle */}
      {poem.contentEn && <EnglishToggle contentEn={poem.contentEn} />}
    </div>
  );
}
