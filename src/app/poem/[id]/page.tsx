"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { PoetryText } from "@/components/PoetryText";

interface Poem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function PoemPage() {
  const { id } = useParams();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPoem() {
      if (typeof id !== "string") return;
      const poemDoc = doc(db, "poems", id);
      const poemSnapshot = await getDoc(poemDoc);
      if (poemSnapshot.exists()) {
        setPoem({ id: poemSnapshot.id, ...poemSnapshot.data() } as Poem);
      }
      setLoading(false);
    }

    fetchPoem();
  }, [id]);

  const copyToClipboard = () => {
    if (poem) {
      navigator.clipboard
        .writeText(poem.content)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Failed to copy text: ", err));
    }
  };

  if (loading) {
    return <div>Loading noha/qaseeda...</div>;
  }

  if (!poem) {
    return <div>Noha or Qaseeda not found</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <PoetryText>{poem.title}</PoetryText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Category: {poem.category}
          </p>
          <p className="whitespace-pre-wrap">
            <PoetryText>{poem.content}</PoetryText>
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Submitted on: {new Date(poem.createdAt).toLocaleDateString()}
          </p>
          <Button onClick={copyToClipboard} className="mt-4" variant="outline">
            <Clipboard className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
