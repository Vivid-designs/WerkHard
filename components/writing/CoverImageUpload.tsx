"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function CoverImageUpload({ value, onChange }: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload/writing-image", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Oplaai het misluk.");
      onChange(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {value && (
        <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden border border-ink-500 bg-ink-800">
          <Image src={value} alt="Voorblad voorskou" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-3 right-3 font-sans text-xs px-3 py-1.5 rounded border text-peach border-peach/30 bg-ink-900/80 hover:bg-peach/10 transition-all duration-200"
          >
            Verwyder
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Voer 'n URL in of laai 'n lêer op…"
          className={[
            "flex-1 bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
            "border border-ink-500 rounded-md px-4 py-2.5 text-sm font-body",
            "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
            "transition-colors duration-200",
          ].join(" ")}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={[
            "font-sans text-xs px-4 py-2.5 rounded-md border",
            "text-parchment-400 border-ink-500 hover:border-parchment-500 hover:text-parchment-200",
            "transition-all duration-200 whitespace-nowrap",
            uploading ? "opacity-50 cursor-wait" : "",
          ].join(" ")}
        >
          {uploading ? "Laai op…" : "Laai op"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="font-sans text-xs text-peach" role="alert">{error}</p>}
    </div>
  );
}
