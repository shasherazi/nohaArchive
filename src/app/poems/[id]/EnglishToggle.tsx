"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function EnglishToggle({ contentEn }: { contentEn: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        className="flex items-center gap-2 text-primary font-medium"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        {open ? "Hide English Translation" : "Show English Translation"}
      </button>
      {open && (
        <div className="mt-3 p-4 bg-muted rounded whitespace-pre-line">
          {contentEn}
        </div>
      )}
    </div>
  );
}
