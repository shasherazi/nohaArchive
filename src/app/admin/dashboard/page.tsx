"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

interface Poem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminDashboard() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuth();

  useEffect(() => {
    async function fetchPendingPoems() {
      const poemsQuery = query(
        collection(db, "poems"),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(poemsQuery);
      const fetchedPoems = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Poem)
      );
      setPoems(fetchedPoems);
      setLoading(false);
    }

    fetchPendingPoems();
  }, []);

  const updatePoemStatus = async (
    poemId: string,
    newStatus: "approved" | "rejected"
  ) => {
    await updateDoc(doc(db, "poems", poemId), { status: newStatus });
    setPoems(poems.filter((poem) => poem.id !== poemId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return (
      <div>
        Access denied. You must be an admin or moderator to view this page.
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {user.role === "admin" && (
        <Button asChild className="mb-4">
          <Link href="/admin/users">Manage Users</Link>
        </Button>
      )}
      <div className="space-y-4">
        {poems.length === 0 && <div>No pending poems to review.</div>}
        {poems.map((poem) => (
          <Card key={poem.id}>
            <CardHeader>
              <CardTitle>{poem.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                Category: {poem.category}
              </p>
              <p className="whitespace-pre-wrap">{poem.content}</p>
            </CardContent>
            <CardFooter className="space-x-2">
              <Button
                onClick={() => updatePoemStatus(poem.id, "approved")}
                variant="default"
              >
                Approve
              </Button>
              <Button
                onClick={() => updatePoemStatus(poem.id, "rejected")}
                variant="destructive"
              >
                Reject
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
