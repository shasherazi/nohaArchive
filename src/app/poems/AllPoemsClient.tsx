"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AllPoemsClient() {
  const [poems, setPoems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [deep, setDeep] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchPoems() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (deep) params.set("deep", "true");
    const res = await fetch(`/api/poems?${params.toString()}`);
    const data = await res.json();
    setPoems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPoems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchPoems();
  }

  return (
    <div>
      <form
        className="flex flex-col gap-4 md:flex-row md:items-end mb-8"
        onSubmit={handleSearch}
      >
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by title or content..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="deep"
            checked={deep}
            onChange={(e) => setDeep(e.target.checked)}
            className="accent-primary"
          />
          <Label htmlFor="deep" className="text-sm">
            Deep search (search in content)
          </Label>
        </div>
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded w-full md:w-auto"
        >
          Search
        </button>
      </form>
      {loading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : poems.length === 0 ? (
        <div className="text-center text-muted-foreground">No poems found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem) => (
            <Card key={poem.id}>
              <CardHeader>
                <CardTitle>
                  <span className="block text-lg">{poem.titleUrdu}</span>
                  <span className="block text-sm text-muted-foreground">
                    {poem.titleEn}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-xs uppercase text-muted-foreground">
                  {poem.type}
                </p>
                <p className="text-base line-clamp-3">{poem.contentUrdu}</p>
                <Link
                  href={`/poems/${poem.id}`}
                  className="inline-block mt-4 text-primary underline text-sm"
                >
                  Read More
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
