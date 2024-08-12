"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PoetryText } from "@/components/PoetryText";

interface Poem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function BrowsePoems() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  useEffect(() => {
    async function fetchPoems() {
      const poemsQuery = query(
        collection(db, "poems"),
        where("status", "==", "approved"),
        orderBy("createdAt", "desc")
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
      setFilteredPoems(fetchedPoems);
      setLoading(false);
    }

    fetchPoems();
  }, []);

  useEffect(() => {
    const filtered = poems.filter((poem) => {
      const matchesSearch =
        poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poem.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        searchCategory === "all" || poem.category === searchCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredPoems(filtered);
  }, [searchTerm, searchCategory, poems]);

  if (loading) {
    return <div>Loading poems...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Browse Poems</h1>
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Search poems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select onValueChange={setSearchCategory} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="noha">Noha</SelectItem>
            <SelectItem value="qaseeda">Qaseeda</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPoems.map((poem) => (
          <Card key={poem.id}>
            <CardHeader>
              <CardTitle>
                <PoetryText>{poem.title}</PoetryText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                Category: {poem.category}
              </p>
              <p className="line-clamp-3 whitespace-break-spaces">
                <PoetryText>{poem.content}</PoetryText>
              </p>
              <Button asChild className="mt-4">
                <Link href={`/poem/${poem.id}`}>Read More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredPoems.length === 0 && (
        <p className="text-center mt-4">
          No poems found matching your search criteria.
        </p>
      )}
    </div>
  );
}
