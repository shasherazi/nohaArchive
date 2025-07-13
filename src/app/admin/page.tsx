"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function AdminDashboard() {
  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [deep, setDeep] = useState(false);

  async function fetchPending(q = "", deep = false) {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (deep) params.set("deep", "true");
    const res = await fetch(`/api/admin/pending-poems?${params.toString()}`);
    const data = await res.json();
    setPoems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPending();
  }, []);

  function handleSearch(q: string, deep: boolean) {
    setQ(q);
    setDeep(deep);
    fetchPending(q, deep);
  }

  async function handleAction(id: number, action: "approve" | "deny") {
    await fetch(`/api/admin/poem/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    fetchPending(q, deep);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/logs">
          <Button variant="outline">View Moderation Logs</Button>
        </Link>
      </div>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search pending poems..."
        showDeepSearch={true}
      />
      {loading ? (
        <div>Loading...</div>
      ) : poems.length === 0 ? (
        <div>No pending poems.</div>
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
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleAction(poem.id, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleAction(poem.id, "deny")}
                  >
                    Deny
                  </Button>
                  <Link href={`/admin/edit/${poem.id}`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
