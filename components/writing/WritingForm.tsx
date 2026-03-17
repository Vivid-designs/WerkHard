"use client";

import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { WritingPiece, Category } from "@/lib/writing-service";
import CategorySelector from "./CategorySelector";
import CoverImageUpload from "./CoverImageUpload";
import { useAuth } from "@/context/AuthContext";

interface WritingFormProps {
  initial?: WritingPiece;
  categories: Category[];
  mode: "create" | "edit";
}

const inputClass = [
  "w-full bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
  "border border-ink-500 rounded-md px-4 py-3 text-sm font-body",
  "transition-colors duration-200",
  "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
].join(" ");

const labelClass = "block font-sans text-xs tracking-wide text-parchment-500 mb-1.5";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function WritingForm({ initial, categories, mode }: WritingFormProps) {
  const router = useRouter();
  const { session } = useAuth();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [catIds, setCatIds] = useState<string[]>(initial?.categories.map((c) => c.id) ?? []);
  const [slugManual, setSlugManual] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slugManual && mode === "create") {
      setSlug(slugify(title));
    }
  }, [title, slugManual, mode]);



  function getAuthHeaders() {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Titel is verpligtend.");
      return;
    }
    if (!slug.trim()) {
      setError("Slug is verpligtend.");
      return;
    }

    setError("");
    setSaving(true);

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      tagline: tagline.trim() || undefined,
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      body: body.trim() || undefined,
      cover_image_url: coverUrl.trim() || undefined,
      published,
      featured,
      category_ids: catIds,
    };

    try {
      if (mode === "create") {
        const res = await fetch("/api/writing", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error ?? "Skep het misluk.");
        }
      } else {
        const res = await fetch(`/api/writing/${initial?.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error ?? "Stoor het misluk.");
        }
      }

      router.push("/dashboard/writing");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  }

  const SectionLabel = ({ children }: { children: ReactNode }) => (
    <p className="font-sans text-2xs tracking-widest uppercase text-parchment-600 mb-3 mt-8 first:mt-0">
      {children}
    </p>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <SectionLabel>Hoofinhoud</SectionLabel>

      <div>
        <label htmlFor="wf-title" className={labelClass}>
          Titel <span className="text-rose">*</span>
        </label>
        <input
          id="wf-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Die titel van hierdie stuk"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="wf-subtitle" className={labelClass}>
            Subtitel
          </label>
          <input
            id="wf-subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Opsionele subtitel"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="wf-tagline" className={labelClass}>
            Taglyn
          </label>
          <input
            id="wf-tagline"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="'n Kort aanhaling of taglyn"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="wf-slug" className={labelClass}>
          Slug <span className="text-rose">*</span>
        </label>
        <div className="flex gap-2 items-center">
          <input
            id="wf-slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManual(true);
            }}
            placeholder="url-van-hierdie-stuk"
            className={inputClass}
          />
          {slugManual && mode === "create" && (
            <button
              type="button"
              onClick={() => {
                setSlugManual(false);
                setSlug(slugify(title));
              }}
              className="font-sans text-xs text-parchment-600 hover:text-parchment-300 whitespace-nowrap underline underline-offset-4 transition-colors duration-200"
            >
              Reset
            </button>
          )}
        </div>
        <p className="font-sans text-xs text-parchment-700 mt-1">spencesa.co.za/skryf/{slug || "…"}</p>
      </div>

      <div>
        <label htmlFor="wf-excerpt" className={labelClass}>
          Uittreksel / voorskou
        </label>
        <textarea
          id="wf-excerpt"
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Kort beskrywing wat in lyste en voorskouings verskyn…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <SectionLabel>Inhoud</SectionLabel>

      <div>
        <label htmlFor="wf-body" className={labelClass}>
          Hoofteks
        </label>
        <textarea
          id="wf-body"
          rows={18}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Skryf hier. Nuwe reëls word gerespekteer. Jy kan Markdown gebruik."
          className={`${inputClass} resize-y font-body leading-relaxed`}
        />
        <p className="font-sans text-xs text-parchment-700 mt-1">
          Ondersteun nuwe reëls en basiese Markdown (**, *, ##, etc.)
        </p>
      </div>

      <SectionLabel>Voorblad</SectionLabel>
      <CoverImageUpload value={coverUrl} onChange={setCoverUrl} />

      <SectionLabel>Kategorieë</SectionLabel>
      <CategorySelector categories={categories} selected={catIds} onChange={setCatIds} />

      <SectionLabel>Instellings</SectionLabel>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={() => setPublished((v) => !v)}
            className={[
              "relative w-10 h-5 rounded-full border transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30",
              published ? "bg-sage/20 border-sage/40" : "bg-ink-700 border-ink-500",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200",
                published ? "translate-x-5 bg-sage" : "translate-x-0 bg-parchment-600",
              ].join(" ")}
            />
          </button>
          <span className="font-body text-sm text-parchment-400 group-hover:text-parchment-300 transition-colors duration-200">
            {published ? "Gepubliseer — sigbaar op Skryf" : "Konsep — nie publiek sigbaar nie"}
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <button
            type="button"
            role="switch"
            aria-checked={featured}
            onClick={() => setFeatured((v) => !v)}
            className={[
              "relative w-10 h-5 rounded-full border transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30",
              featured ? "bg-rose/20 border-rose/40" : "bg-ink-700 border-ink-500",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200",
                featured ? "translate-x-5 bg-rose" : "translate-x-0 bg-parchment-600",
              ].join(" ")}
            />
          </button>
          <span className="font-body text-sm text-parchment-400 group-hover:text-parchment-300 transition-colors duration-200">
            {featured ? "Uitgelig — verskyn as aanbevole stuk" : "Nie uitgelig nie"}
          </span>
        </label>
      </div>

      {error && <p className="font-sans text-xs text-peach" role="alert">{error}</p>}

      <div className="flex gap-3 pt-2 border-t border-ink-600 mt-4">
        <button
          type="submit"
          disabled={saving}
          className={[
            "font-sans text-sm tracking-wide",
            "bg-parchment-200 text-ink-900 border border-parchment-200",
            "hover:bg-parchment-100 rounded-md px-8 py-3",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment-400/40",
            saving ? "opacity-60 cursor-wait" : "",
          ].join(" ")}
        >
          {saving ? "Stoor…" : mode === "create" ? "Skep stuk" : "Stoor veranderinge"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="font-sans text-sm text-parchment-500 hover:text-parchment-300 border border-ink-500 hover:border-ink-400 rounded-md px-5 py-3 transition-all duration-200"
        >
          Kanselleer
        </button>
      </div>
    </form>
  );
}
