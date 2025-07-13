"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (q: string, deep: boolean) => void;
  placeholder?: string;
  showDeepSearch?: boolean;
  initialQ?: string;
  initialDeep?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  showDeepSearch = true,
  initialQ = "",
  initialDeep = false,
}: SearchBarProps) {
  const [q, setQ] = useState(initialQ);
  const [deep, setDeep] = useState(initialDeep);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(q, deep);
  }

  return (
    <form
      className="flex flex-col gap-4 md:flex-row md:items-end mb-8"
      onSubmit={handleSubmit}
    >
      <div className="flex-1">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder={placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full"
        />
      </div>
      {showDeepSearch && (
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
      )}
      <Button type="submit" className="w-full md:w-auto">
        Search
      </Button>
    </form>
  );
}
