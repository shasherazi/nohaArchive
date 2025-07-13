"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EditPoemPage({ params }: { params: { id: string } }) {
  const [poem, setPoem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/pending-poems`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: any) => p.id === Number(params.id));
        setPoem(found);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      titleUrdu: formData.get("titleUrdu"),
      titleEn: formData.get("titleEn"),
      contentUrdu: formData.get("contentUrdu"),
      contentEn: formData.get("contentEn"),
      poet: formData.get("poet"),
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
    };

    await fetch(`/api/admin/poem/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "edit", data: payload }),
    });

    setLoading(false);
    router.push("/admin");
  }

  async function handleApprove() {
    setLoading(true);
    await fetch(`/api/admin/poem/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    setLoading(false);
    router.push("/admin");
  }

  if (!poem) return <div>Loading...</div>;

  return (
    <form
      className="max-w-xl mx-auto bg-background p-6 rounded space-y-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-2">Edit Poem</h1>
      <div>
        <label htmlFor="titleUrdu">Title (Urdu)</label>
        <Input
          name="titleUrdu"
          id="titleUrdu"
          required
          defaultValue={poem.titleUrdu}
        />
      </div>
      <div>
        <label htmlFor="titleEn">Title (English, optional)</label>
        <Input name="titleEn" id="titleEn" defaultValue={poem.titleEn || ""} />
      </div>
      <div>
        <label htmlFor="contentUrdu">Poem (Urdu)</label>
        <Textarea
          name="contentUrdu"
          id="contentUrdu"
          required
          rows={6}
          defaultValue={poem.contentUrdu}
        />
      </div>
      <div>
        <label htmlFor="contentEn">Poem (English, optional)</label>
        <Textarea
          name="contentEn"
          id="contentEn"
          rows={6}
          defaultValue={poem.contentEn || ""}
        />
      </div>
      <div>
        <label htmlFor="poet">Poet (optional)</label>
        <Input name="poet" id="poet" defaultValue={poem.poet || ""} />
      </div>
      <div>
        <label htmlFor="year">Year (optional)</label>
        <Input
          name="year"
          id="year"
          type="number"
          defaultValue={poem.year || ""}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="default"
          disabled={loading}
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
