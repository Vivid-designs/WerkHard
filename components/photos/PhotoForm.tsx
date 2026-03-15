"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { DisplayType, PeopleTag, PhotoEntry } from "@/lib/photo-service";
import { useAuth } from "@/context/AuthContext";
import PeopleTagInput from "./PeopleTagInput";

interface ImageDraft {
  url: string;
  alt_text: string;
  caption: string;
  sort_order: number;
}

interface PhotoFormProps {
  initial?: PhotoEntry;
  mode: "create" | "edit";
}

const inputClass = [
  "w-full bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
  "border border-ink-500 rounded-md px-4 py-3 text-sm font-body",
  "transition-colors duration-200",
  "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
].join(" ");

const labelClass = "block font-sans text-xs tracking-wide text-parchment-500 mb-1.5";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function PhotoForm({ initial, mode }: PhotoFormProps) {
  const router = useRouter();
  const { session } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [displayType, setDisplayType] = useState<DisplayType>(initial?.display_type ?? "single");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [images, setImages] = useState<ImageDraft[]>(
    initial?.images.map((image) => ({
      url: image.image_url,
      alt_text: image.alt_text ?? "",
      caption: image.caption ?? "",
      sort_order: image.sort_order,
    })) ?? [],
  );
  const [peopleTags, setPeopleTags] = useState<Omit<PeopleTag, "id">[]>(
    initial?.people_tags.map((tag) => ({ name: tag.name, handle: tag.handle })) ?? [],
  );
  const [slugManual, setSlugManual] = useState(mode === "edit");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManual && mode === "create") {
      setSlug(slugify(value));
    }
  }

  function getAuthHeaders(contentType?: string) {
    const headers: Record<string, string> = {};
    if (contentType) headers["Content-Type"] = contentType;

    const token = session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;

    return headers;
  }

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/photo-image", {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) return null;
    return data.url as string;
  }

  async function handleFiles(files: FileList | File[]) {
    setUploading(true);

    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (!url) continue;

      setImages((previous) => {
        const next = [
          ...previous,
          {
            url,
            alt_text: "",
            caption: "",
            sort_order: previous.length,
          },
        ];

        if (next.length > 1) setDisplayType("gallery");
        return next;
      });
    }

    setUploading(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);

    if (event.dataTransfer.files.length) {
      void handleFiles(event.dataTransfer.files);
    }
  }

  function removeImage(index: number) {
    setImages((previous) => {
      const next = previous
        .filter((_, imageIndex) => imageIndex !== index)
        .map((image, imageIndex) => ({ ...image, sort_order: imageIndex }));

      if (next.length <= 1) setDisplayType("single");
      return next;
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((previous) => {
      const target = index + direction;
      if (target < 0 || target >= previous.length) return previous;

      const next = [...previous];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((image, imageIndex) => ({ ...image, sort_order: imageIndex }));
    });
  }

  function updateImageField(index: number, field: "alt_text" | "caption", value: string) {
    setImages((previous) =>
      previous.map((image, imageIndex) => (imageIndex === index ? { ...image, [field]: value } : image)),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!slug.trim()) {
      setError("Slug is verpligtend.");
      return;
    }

    if (!images.length) {
      setError("Voeg ten minste een foto by.");
      return;
    }

    setError("");
    setSaving(true);

    const payload = {
      title: title.trim() || undefined,
      slug: slug.trim(),
      caption: caption.trim() || undefined,
      display_type: displayType,
      published,
      featured,
      images: images.map((image, index) => ({
        image_url: image.url,
        alt_text: image.alt_text || null,
        caption: image.caption || null,
        sort_order: index,
      })),
      people_tags: peopleTags,
    };

    try {
      const url = mode === "create" ? "/api/photos" : `/api/photos/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders("application/json"),
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error ?? `Fout ${response.status}`);
        setSaving(false);
        return;
      }

      router.push("/dashboard/fotos");
      router.refresh();
    } catch (submitError: any) {
      setError(submitError.message);
      setSaving(false);
    }
  }

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="font-sans text-2xs tracking-widest uppercase text-parchment-600 mb-3 mt-8 first:mt-0">{children}</p>
  );

  const Toggle = ({
    checked,
    onChange,
    label,
    accent,
  }: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    accent: string;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative w-10 h-5 rounded-full border transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30",
          checked ? accent : "bg-ink-700 border-ink-500",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0",
            checked ? "bg-current" : "bg-parchment-600",
          ].join(" ")}
        />
      </button>
      <span className="font-body text-sm text-parchment-400 group-hover:text-parchment-300 transition-colors duration-200">
        {label}
      </span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <SectionLabel>Identiteit</SectionLabel>

      <div>
        <label htmlFor="photo-title" className={labelClass}>
          Titel (opsioneel)
        </label>
        <input
          id="photo-title"
          type="text"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="Naam vir hierdie foto-inskrywing"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="photo-slug" className={labelClass}>
          Slug <span className="text-rose">*</span>
        </label>
        <input
          id="photo-slug"
          type="text"
          required
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value);
            setSlugManual(true);
          }}
          placeholder="url-van-hierdie-inskrywing"
          className={inputClass}
        />
        <p className="font-sans text-xs text-parchment-700 mt-1">spencesa.co.za/fotos/{slug || "…"}</p>
      </div>

      <div>
        <label htmlFor="photo-caption" className={labelClass}>
          Byskrif
        </label>
        <textarea
          id="photo-caption"
          rows={4}
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="Beskrywing, gedagte, of konteks vir hierdie inskrywing…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Tipe</label>
        <div className="flex gap-3">
          {(["single", "gallery"] as DisplayType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setDisplayType(type)}
              className={[
                "font-sans text-xs px-4 py-2 rounded-md border transition-all duration-200",
                displayType === type
                  ? "text-parchment-200 border-parchment-400 bg-ink-700"
                  : "text-parchment-600 border-ink-500 hover:border-ink-400 hover:text-parchment-400",
              ].join(" ")}
            >
              {type === "single" ? "Enkel foto" : "Galery"}
            </button>
          ))}
        </div>
      </div>

      <SectionLabel>Foto&apos;s</SectionLabel>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
          dragOver ? "border-parchment-400 bg-ink-700" : "border-ink-500 bg-ink-800 hover:border-ink-400",
        ].join(" ")}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") fileInputRef.current?.click();
        }}
        aria-label="Laai foto's op"
      >
        <p className="font-sans text-xs text-parchment-600">{uploading ? "Laai op…" : "Sleep foto's hier in, of klik om te blaai"}</p>
        <p className="font-sans text-2xs text-parchment-700 mt-1">JPG, PNG, WebP</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) {
            void handleFiles(event.target.files);
          }
          event.target.value = "";
        }}
      />

      {images.length > 0 ? (
        <div className="flex flex-col gap-4">
          {images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="flex gap-4 bg-ink-800 border border-ink-600 rounded-lg p-4 items-start">
              <img
                src={image.url}
                alt={image.alt_text || `Foto ${index + 1}`}
                className="w-20 h-20 object-cover rounded shrink-0 border border-ink-600"
              />

              <div className="flex-1 flex flex-col gap-2 min-w-0">
                <input
                  type="text"
                  value={image.alt_text}
                  onChange={(event) => updateImageField(index, "alt_text", event.target.value)}
                  placeholder="Alt teks (beskrywing)"
                  className={`${inputClass} py-2 text-xs`}
                />
                <input
                  type="text"
                  value={image.caption}
                  onChange={(event) => updateImageField(index, "caption", event.target.value)}
                  placeholder="Per-foto byskrif (opsioneel)"
                  className={`${inputClass} py-2 text-xs`}
                />
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  className="font-sans text-xs text-parchment-600 hover:text-parchment-300 disabled:opacity-20 px-2 py-1 border border-ink-500 rounded transition-colors duration-150"
                  aria-label="Skuif op"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                  className="font-sans text-xs text-parchment-600 hover:text-parchment-300 disabled:opacity-20 px-2 py-1 border border-ink-500 rounded transition-colors duration-150"
                  aria-label="Skuif af"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="font-sans text-xs text-peach/70 hover:text-peach px-2 py-1 border border-peach/20 hover:border-peach/40 rounded transition-all duration-150"
                  aria-label="Verwyder"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <SectionLabel>Mense</SectionLabel>
      <PeopleTagInput tags={peopleTags} onChange={setPeopleTags} />

      <SectionLabel>Instellings</SectionLabel>
      <div className="flex flex-col gap-3">
        <Toggle
          checked={published}
          onChange={setPublished}
          label={published ? "Gepubliseer — sigbaar op Fotos" : "Konsep — nie publiek nie"}
          accent="bg-sage/20 border-sage/40 text-sage"
        />
        <Toggle
          checked={featured}
          onChange={setFeatured}
          label={featured ? "Uitgelig" : "Nie uitgelig nie"}
          accent="bg-rose/20 border-rose/40 text-rose"
        />
      </div>

      {error ? (
        <p className="font-sans text-xs text-peach" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3 pt-2 border-t border-ink-600 mt-4">
        <button
          type="submit"
          disabled={saving}
          className={[
            "font-sans text-sm tracking-wide",
            "bg-parchment-200 text-ink-900 border border-parchment-200",
            "hover:bg-parchment-100 rounded-md px-8 py-3",
            "transition-all duration-200",
            saving ? "opacity-60 cursor-wait" : "",
          ].join(" ")}
        >
          {saving ? "Stoor…" : mode === "create" ? "Skep inskrywing" : "Stoor veranderinge"}
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
