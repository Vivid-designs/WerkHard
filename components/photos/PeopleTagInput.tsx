"use client";

import { useState } from "react";
import type { PeopleTag } from "@/lib/photo-service";

interface PeopleTagInputProps {
  tags: Omit<PeopleTag, "id">[];
  onChange: (tags: Omit<PeopleTag, "id">[]) => void;
}

export default function PeopleTagInput({ tags, onChange }: PeopleTagInputProps) {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");

  function addTag() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onChange([...tags, { name: trimmedName, handle: handle.trim() || null }]);
    setName("");
    setHandle("");
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, idx) => idx !== index));
  }

  const inputBase = [
    "bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
    "border border-ink-500 rounded-md px-3 py-2 text-sm font-body",
    "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
    "transition-colors duration-200",
  ].join(" ");

  return (
    <div className="flex flex-col gap-3">
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={`${tag.name}-${index}`}
              className="inline-flex items-center gap-2 font-sans text-xs text-lavender border border-lavender/25 bg-lavender/8 px-3 py-1.5 rounded-sm"
            >
              {tag.name}
              {tag.handle ? <span className="text-lavender/60">@{tag.handle}</span> : null}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-lavender/50 hover:text-peach transition-colors duration-150 ml-1"
                aria-label={`Remove ${tag.name}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Naam"
          className={`${inputBase} flex-1 min-w-[140px]`}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
        />
        <input
          type="text"
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
          placeholder="@handle (opsioneel)"
          className={`${inputBase} flex-1 min-w-[140px]`}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
        />
        <button
          type="button"
          onClick={addTag}
          disabled={!name.trim()}
          className="font-sans text-xs px-4 py-2 rounded-md border text-lavender border-lavender/30 hover:bg-lavender/10 transition-all duration-200 disabled:opacity-40"
        >
          Voeg by
        </button>
      </div>
    </div>
  );
}
