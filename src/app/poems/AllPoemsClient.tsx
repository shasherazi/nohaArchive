"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";

const PAGE_SIZE = 12;

export default function AllPoemsClient() {
  const [poems, setPoems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [deep, setDeep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function fetchPoems(pageNum = 1, qVal = q, deepVal = deep) {
    setLoading(true);
    const params = new URLSearchParams();
    if (qVal) params.set("q", qVal);
    if (deepVal) params.set("deep", "true");
    params.set("page", pageNum.toString());
    params.set("limit", PAGE_SIZE.toString());
    const res = await fetch(`/api/poems?${params.toString()}`);
    const data = await res.json();
    setPoems(data.poems);
    setTotal(data.total);
    setLoading(false);
  }

  useEffect(() => {
    fetchPoems(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearch(qVal: string, deepVal: boolean) {
    setQ(qVal);
    setDeep(deepVal);
    setPage(1);
    fetchPoems(1, qVal, deepVal);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search by title or content..."
        showDeepSearch={true}
        initialQ={q}
        initialDeep={deep}
      />
      {loading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : poems.length === 0 ? (
        <div className="text-center text-muted-foreground">No poems found.</div>
      ) : (
        <>
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
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
