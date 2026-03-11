"use client";

import { useId, useState, type FormEvent } from "react";
import {
  mockWritingEntries,
  type AdminWriting,
  type PostStatus,
  writingCategories,
} from "@/lib/admin-mock-data";
import { writingCategoryColors } from "@/lib/skryf-data";
import { formatDateShort } from "@/lib/utils";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">
      {children}
    </p>
  );
}

const inputClass = [
  "w-full bg-ink-800 text-parchment-200 placeholder:text-parchment-600",
  "border border-ink-500 rounded-md px-4 py-2.5 text-sm font-body",
  "transition-colors duration-200",
  "focus:outline-none focus:border-parchment-500 focus:ring-1 focus:ring-parchment-500/30",
].join(" ");

const labelClass = "block font-sans text-xs tracking-wide text-parchment-500 mb-1.5";

function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={[
        "inline-block font-sans text-2xs tracking-widest uppercase px-2 py-1 rounded-sm border",
        status === "published"
          ? "text-sage bg-sage/10 border-sage/20"
          : "text-parchment-600 bg-ink-700 border-ink-500",
      ].join(" ")}
    >
      {status === "published" ? "Gepubliseer" : "Konsep"}
    </span>
  );
}

function WritingComposer({ onSave }: { onSave: (entry: AdminWriting) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AdminWriting["category"]>("Essay");
  const [status, setStatus] = useState<PostStatus>("draft");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const formId = useId();

  function reset() {
    setTitle("");
    setCategory("Essay");
    setStatus("draft");
    setExcerpt("");
    setBody("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

    const newEntry: AdminWriting = {
      id: crypto.randomUUID(),
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      title: title.trim(),
      excerpt: excerpt.trim(),
      body: body.trim(),
      category,
      status,
      publishedAt: new Date().toISOString().split("T")[0],
      readingTime: Math.max(1, Math.ceil(wordCount / 200)),
    };

    onSave(newEntry);
    reset();
    setSaving(false);
    setOpen(false);
  }

  return (
    <div className="border border-ink-600 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={[
          "w-full flex items-center justify-between",
          "px-6 py-4 text-left",
          "bg-ink-800 hover:bg-ink-700 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30",
        ].join(" ")}
        aria-expanded={open}
        aria-controls={formId}
      >
        <span className="font-serif text-parchment-100 text-base">Nuwe stuk skryf</span>
        <span
          className={[
            "font-sans text-xs text-parchment-500 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          ↓
        </span>
      </button>

      {open ? (
        <form
          id={formId}
          onSubmit={handleSubmit}
          className="px-6 py-6 border-t border-ink-600 bg-ink-900 flex flex-col gap-5"
        >
          <div>
            <label htmlFor={`${formId}-title`} className={labelClass}>
              Titel <span className="text-rose">*</span>
            </label>
            <input
              id={`${formId}-title`}
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Titel van die stuk…"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${formId}-category`} className={labelClass}>
                Kategorie
              </label>
              <select
                id={`${formId}-category`}
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as AdminWriting["category"])
                }
                className={inputClass}
              >
                {writingCategories.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${formId}-status`} className={labelClass}>
                Status
              </label>
              <select
                id={`${formId}-status`}
                value={status}
                onChange={(event) => setStatus(event.target.value as PostStatus)}
                className={inputClass}
              >
                <option value="draft">Konsep</option>
                <option value="published">Gepubliseer</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={`${formId}-excerpt`} className={labelClass}>
              Uittreksel
            </label>
            <textarea
              id={`${formId}-excerpt`}
              rows={2}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Kort beskrywing vir lyste en voorskouings…"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label htmlFor={`${formId}-body`} className={labelClass}>
              Inhoud
            </label>
            <textarea
              id={`${formId}-body`}
              rows={10}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Skryf hier…"
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className={[
                "font-sans text-sm tracking-wide",
                "bg-parchment-200 text-ink-900 border border-parchment-200",
                "hover:bg-parchment-100 rounded-md px-6 py-2.5",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment-400/40",
                saving || !title.trim() ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {saving ? "Stoor…" : "Stoor stuk"}
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              className={[
                "font-sans text-sm text-parchment-500 hover:text-parchment-300",
                "border border-ink-500 hover:border-ink-400",
                "rounded-md px-5 py-2.5 transition-all duration-200",
              ].join(" ")}
            >
              Kanselleer
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function WritingRow({
  writing,
  onDelete,
}: {
  writing: AdminWriting;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const accent = writingCategoryColors[writing.category];

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    onDelete(writing.id);
  }

  return (
    <tr className="border-b border-ink-600 last:border-0 group">
      <td className="py-4 pr-4 align-top">
        <span className="font-serif text-parchment-200 text-sm leading-snug group-hover:text-parchment-100 transition-colors duration-200">
          {writing.title}
        </span>
      </td>
      <td className="py-4 pr-4 align-top hidden sm:table-cell">
        <span className={`tag border ${accent}`}>{writing.category}</span>
      </td>
      <td className="py-4 pr-4 align-top hidden md:table-cell">
        <StatusBadge status={writing.status} />
      </td>
      <td className="py-4 pr-4 align-top hidden lg:table-cell">
        <time
          dateTime={writing.publishedAt}
          className="font-sans text-xs text-parchment-600 tabular-nums whitespace-nowrap"
        >
          {formatDateShort(writing.publishedAt)}
        </time>
      </td>
      <td className="py-4 align-top text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            disabled
            title="Redigeer (binnekort)"
            className="font-sans text-xs text-parchment-600 opacity-40 cursor-not-allowed px-2 py-1"
          >
            Wysig
          </button>
          <button
            type="button"
            onClick={handleDelete}
            onBlur={() => setConfirming(false)}
            className={[
              "font-sans text-xs px-3 py-1.5 rounded border transition-all duration-200",
              "focus-visible:outline-none",
              confirming
                ? "text-peach border-peach/40 bg-peach/10 hover:bg-peach/20"
                : "text-parchment-600 border-ink-500 hover:border-parchment-500 hover:text-parchment-300",
            ].join(" ")}
          >
            {confirming ? "Seker?" : "Verwyder"}
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-ink-800 border border-ink-600 rounded-lg px-5 py-4">
      <p className="font-sans text-2xs tracking-widest uppercase text-parchment-600 mb-1">
        {label}
      </p>
      <p className="font-serif text-2xl text-parchment-100 tabular-nums">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [writings, setWritings] = useState<AdminWriting[]>(mockWritingEntries);

  function handleSave(entry: AdminWriting) {
    setWritings((previous) => [entry, ...previous]);
  }

  function handleDelete(id: string) {
    setWritings((previous) => previous.filter((writing) => writing.id !== id));
  }

  const totalCount = writings.length;
  const publishedCount = writings.filter((writing) => writing.status === "published").length;
  const draftCount = writings.filter((writing) => writing.status === "draft").length;

  return (
    <div className="container-narrow py-12 md:py-16 flex flex-col gap-12">
      <div className="animate-fade-up opacity-0 delay-100">
        <SectionLabel>Admin</SectionLabel>
        <h1 className="font-serif text-display-md text-parchment-100">Dashboard</h1>
        <p className="font-body text-parchment-500 text-sm mt-2">
          Bestuur jou skryfwerk en inhoud.
        </p>
      </div>

      <div
        className="grid grid-cols-3 gap-3 md:gap-4 animate-fade-up opacity-0 delay-200"
        aria-label="Oorsig"
      >
        <StatChip label="Totaal" value={totalCount} />
        <StatChip label="Gepubliseer" value={publishedCount} />
        <StatChip label="Konsepte" value={draftCount} />
      </div>

      <section aria-labelledby="composer-heading" className="animate-fade-up opacity-0 delay-300">
        <SectionLabel>Nuwe stuk</SectionLabel>
        <WritingComposer onSave={handleSave} />
      </section>

      <section aria-labelledby="list-heading" className="animate-fade-up opacity-0 delay-400">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <SectionLabel>Argief</SectionLabel>
            <h2 id="list-heading" className="font-serif text-display-sm text-parchment-100">
              Bestaande skryfwerk
            </h2>
          </div>
          <span className="font-sans text-xs text-parchment-600 tabular-nums">
            {writings.length} {writings.length === 1 ? "stuk" : "stukke"}
          </span>
        </div>

        {writings.length === 0 ? (
          <div className="py-16 text-center border border-ink-600 rounded-lg bg-ink-800">
            <p className="font-body text-parchment-600 text-sm">
              Geen stukke nie. Skryf jou eerste een hierbo.
            </p>
          </div>
        ) : (
          <div className="border border-ink-600 rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-ink-600 bg-ink-800">
                  <th className="text-left py-3 px-4 font-sans text-2xs tracking-widest uppercase text-parchment-600">
                    Titel
                  </th>
                  <th className="text-left py-3 px-4 font-sans text-2xs tracking-widest uppercase text-parchment-600 hidden sm:table-cell">
                    Kategorie
                  </th>
                  <th className="text-left py-3 px-4 font-sans text-2xs tracking-widest uppercase text-parchment-600 hidden md:table-cell">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-sans text-2xs tracking-widest uppercase text-parchment-600 hidden lg:table-cell">
                    Datum
                  </th>
                  <th className="py-3 px-4">
                    <span className="sr-only">Aksies</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-ink-900 divide-y divide-ink-600">
                {writings.map((writing) => (
                  <WritingRow key={writing.id} writing={writing} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
