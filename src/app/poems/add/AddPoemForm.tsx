"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function AddPoemForm() {
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      type,
      titleUrdu: formData.get("titleUrdu"),
      titleEn: formData.get("titleEn"),
      contentUrdu: formData.get("contentUrdu"),
      contentEn: formData.get("contentEn"),
      poet: formData.get("poet"),
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
    };

    const res = await fetch("/api/poems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      form.reset();
      setType("");
      setTimeout(() => router.push("/"), 1500);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
    }
  }

  return (
    <form
      className="max-w-xl mx-auto bg-background p-6 rounded space-y-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-2">Add a New Poem</h1>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType} required>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="noha">Noha</SelectItem>
            <SelectItem value="qaseeda">Qaseeda</SelectItem>
            <SelectItem value="folk">Folk</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="titleUrdu">Title (Urdu)</Label>
        <Input
          name="titleUrdu"
          id="titleUrdu"
          required
          placeholder="مثال: کربلا کی شام"
        />
      </div>
      <div>
        <Label htmlFor="titleEn">Title (English, optional)</Label>
        <Input
          name="titleEn"
          id="titleEn"
          placeholder="Example: Evening of Karbala"
        />
      </div>
      <div>
        <Label htmlFor="contentUrdu">Poem (Urdu)</Label>
        <Textarea
          name="contentUrdu"
          id="contentUrdu"
          required
          rows={6}
          placeholder="Poem text in Urdu..."
        />
      </div>
      <div>
        <Label htmlFor="contentEn">Poem (English, optional)</Label>
        <Textarea
          name="contentEn"
          id="contentEn"
          rows={6}
          placeholder="Poem text in English (if available)..."
        />
      </div>
      <div>
        <Label htmlFor="poet">Poet (optional)</Label>
        <Input name="poet" id="poet" placeholder="Poet's name" />
      </div>
      <div>
        <Label htmlFor="year">Year (optional)</Label>
        <Input name="year" id="year" type="number" placeholder="Year" />
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm">
          Poem submitted! Redirecting...
        </div>
      )}
      <Button type="submit" disabled={loading || !type}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
