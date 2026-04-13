"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { PhotoEntry } from "@/lib/photo-service";
import type { AccessLevel } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";

const ACCESS_BADGE: Record<AccessLevel, { label: string; className: string }> = {
  public:      { label: "Publiek",  className: "text-sage border-sage/20 bg-sage/8" },
  members:     { label: "Lede",     className: "text-parchment-400 border-ink-500 bg-ink-700" },
  super_lario: { label: "SL",       className: "text-amber-400 border-amber-400/20 bg-amber-400/8" },
  admin_only:  { label: "Admin",    className: "text-peach border-peach/20 bg-peach/8" },
};

export default function PhotoManager() {
  const { session } = useAuth();
  const [entries, setEntries] = useState<PhotoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);

  function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const token = session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/photos", { headers: getAuthHeaders() });
    const data = await response.json();
    setEntries(data.entries ?? []);
    setLoading(false);
  }, [session?.access_token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleToggle(entry: PhotoEntry) {
    await fetch(`/api/photos/${entry.id}/toggle-publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ published: !entry.published }),
    });

    void load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/photos/${id}`, { method: "DELETE", headers: getAuthHeaders() });
    setConfirming(null);
    void load();
  }

  const btnBase =
    "font-sans text-xs px-3 py-1.5 rounded border transition-all duration-200 focus-visible:outline-none";

  if (loading) {
    return (
      <div className="divide-y divide-ink-600 border border-ink-600 rounded-lg overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-4 px-5 py-4">
            <div className="w-14 h-14 bg-ink-700 rounded animate-pulse shrink-0" />
            <div className="flex-1 flex flex-col gap-2 justify-center">
              <div className="h-3 bg-ink-700 rounded w-1/2 animate-pulse" />
              <div className="h-3 bg-ink-700 rounded w-1/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-1">Fotos</p>
          <h2 className="font-serif text-display-sm text-parchment-100">Alle inskrywings</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs text-parchment-600 tabular-nums">{entries.length} inskrywings</span>
          <Link
            href="/dashboard/fotos/new"
            className={`${btnBase} text-parchment-200 border-ink-500 hover:border-parchment-400 bg-ink-800 hover:bg-ink-700`}
          >
            + Nuwe foto
          </Link>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="py-16 text-center border border-ink-600 rounded-lg bg-ink-800">
          <p className="font-body text-sm text-parchment-600">Geen foto-inskrywings nie. Skep jou eerste een.</p>
        </div>
      ) : (
        <div className="border border-ink-600 rounded-lg overflow-x-auto">
          <table className="w-full border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-ink-600 bg-ink-800">
                {["Foto", "Titel / Slug", "Tipe", "Toegang", "Status", "Datum", ""].map((heading) => (
                  <th
                    key={heading}
                    className="text-left py-3 px-5 font-sans text-2xs tracking-widest uppercase text-parchment-600"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-ink-900 divide-y divide-ink-600">
              {entries.map((entry) => {
                const cover = entry.images[0]?.image_url;

                return (
                  <tr key={entry.id} className="group hover:bg-ink-800/40 transition-colors duration-150">
                    <td className="py-3 px-5 w-16">
                      {cover ? (
                        <div className="w-12 h-12 rounded overflow-hidden border border-ink-600 shrink-0">
                          <img src={cover} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-ink-700 border border-ink-600" />
                      )}
                    </td>

                    <td className="py-3 px-5 align-middle max-w-[200px]">
                      <p className="font-serif text-sm text-parchment-200 truncate">
                        {entry.title ?? <span className="italic text-parchment-600">(geen titel)</span>}
                      </p>
                      <p className="font-sans text-xs text-parchment-600 truncate mt-0.5">{entry.slug}</p>
                    </td>

                    <td className="py-3 px-5 align-middle">
                      <span
                        className={[
                          "tag border",
                          entry.display_type === "gallery"
                            ? "text-powder bg-powder/10 border-powder/20"
                            : "text-cream bg-cream/10 border-cream/20",
                        ].join(" ")}
                      >
                        {entry.display_type === "gallery" ? `Galery (${entry.images.length})` : "Enkel"}
                      </span>
                    </td>

                    <td className="py-3 px-5 align-middle">
                      {(() => {
                        const badge = ACCESS_BADGE[entry.access_level ?? "public"];
                        return (
                          <span className={`tag border ${badge.className}`}>{badge.label}</span>
                        );
                      })()}
                    </td>

                    <td className="py-3 px-5 align-middle">
                      <button
                        onClick={() => void handleToggle(entry)}
                        className={[
                          btnBase,
                          entry.published
                            ? "text-sage border-sage/30 hover:bg-sage/10"
                            : "text-parchment-600 border-ink-500 hover:border-parchment-500 hover:text-parchment-400",
                        ].join(" ")}
                      >
                        {entry.published ? "Gepubliseer" : "Konsep"}
                      </button>
                    </td>

                    <td className="py-3 px-5 align-middle">
                      <time className="font-sans text-xs text-parchment-600 tabular-nums whitespace-nowrap">
                        {formatDateShort(entry.updated_at)}
                      </time>
                    </td>

                    <td className="py-3 px-5 align-middle">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/fotos/${entry.id}/edit`}
                          className={`${btnBase} text-parchment-400 border-ink-500 hover:border-parchment-500 hover:text-parchment-200`}
                        >
                          Wysig
                        </Link>
                        {confirming === entry.id ? (
                          <>
                            <button
                              onClick={() => void handleDelete(entry.id)}
                              className={`${btnBase} text-peach border-peach/30 hover:bg-peach/10`}
                            >
                              Seker?
                            </button>
                            <button
                              onClick={() => setConfirming(null)}
                              className={`${btnBase} text-parchment-600 border-ink-500`}
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirming(entry.id)}
                            className={`${btnBase} text-parchment-600 border-ink-500 hover:border-peach/30 hover:text-peach`}
                          >
                            Verwyder
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
