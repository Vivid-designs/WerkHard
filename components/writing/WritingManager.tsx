"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { WritingPiece } from "@/lib/writing-service";
import { formatDateShort } from "@/lib/utils";

export default function WritingManager() {
  const [pieces, setPieces] = useState<WritingPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/writing");
      const data = await res.json();
      setPieces(data.pieces ?? []);
    } catch {
      setError("Kon nie laai nie.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(piece: WritingPiece) {
    const res = await fetch(`/api/writing/${piece.id}/toggle-publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !piece.published }),
    });
    if (res.ok) load();
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/writing/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  const btnBase =
    "font-sans text-xs px-3 py-1.5 rounded border transition-all duration-200 focus-visible:outline-none";

  if (loading) return <ManagerSkeleton />;
  if (error) return <p className="font-sans text-xs text-peach py-8">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-1">Inhoud</p>
          <h2 className="font-serif text-display-sm text-parchment-100">Alle stukke</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs text-parchment-600 tabular-nums">{pieces.length} stukke</span>
          <Link
            href="/dashboard/writing/new"
            className={[
              btnBase,
              "text-parchment-200 border-ink-500 hover:border-parchment-400",
              "bg-ink-800 hover:bg-ink-700",
            ].join(" ")}
          >
            + Nuwe stuk
          </Link>
        </div>
      </div>

      {pieces.length === 0 ? (
        <div className="py-16 text-center border border-ink-600 rounded-lg bg-ink-800">
          <p className="font-body text-sm text-parchment-600">Geen stukke nie. Skep jou eerste een.</p>
        </div>
      ) : (
        <div className="border border-ink-600 rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-ink-600 bg-ink-800">
                {["Titel", "Kategorieë", "Status", "Datum", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-5 font-sans text-2xs tracking-widest uppercase text-parchment-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-ink-900 divide-y divide-ink-600">
              {pieces.map((piece) => (
                <tr key={piece.id} className="group hover:bg-ink-800/40 transition-colors duration-150">
                  <td className="py-4 px-5 align-top max-w-[240px]">
                    <p className="font-serif text-sm text-parchment-200 group-hover:text-parchment-100 transition-colors duration-150 truncate">
                      {piece.title}
                    </p>
                    {piece.subtitle && (
                      <p className="font-body text-xs text-parchment-600 truncate mt-0.5">{piece.subtitle}</p>
                    )}
                  </td>

                  <td className="py-4 px-5 align-top">
                    <div className="flex flex-wrap gap-1">
                      {piece.categories.length ? (
                        piece.categories.map((c) => (
                          <span key={c.id} className={`tag border text-2xs ${c.accent}`}>
                            {c.name}
                          </span>
                        ))
                      ) : (
                        <span className="font-sans text-xs text-parchment-700 italic">—</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-5 align-top">
                    <button
                      onClick={() => handleToggle(piece)}
                      className={[
                        btnBase,
                        piece.published
                          ? "text-sage border-sage/30 hover:bg-sage/10"
                          : "text-parchment-600 border-ink-500 hover:border-parchment-500 hover:text-parchment-400",
                      ].join(" ")}
                      title={piece.published ? "Klik om konsep te maak" : "Klik om te publiseer"}
                    >
                      {piece.published ? "Gepubliseer" : "Konsep"}
                    </button>
                  </td>

                  <td className="py-4 px-5 align-top">
                    <time className="font-sans text-xs text-parchment-600 tabular-nums whitespace-nowrap">
                      {formatDateShort(piece.updated_at.split("T")[0])}
                    </time>
                  </td>

                  <td className="py-4 px-5 align-top">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/writing/${piece.id}/edit`}
                        className={`${btnBase} text-parchment-400 border-ink-500 hover:border-parchment-500 hover:text-parchment-200`}
                      >
                        Wysig
                      </Link>

                      {confirming === piece.id ? (
                        <>
                          <button
                            onClick={() => {
                              handleDelete(piece.id);
                              setConfirming(null);
                            }}
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
                          onClick={() => setConfirming(piece.id)}
                          className={`${btnBase} text-parchment-600 border-ink-500 hover:border-peach/30 hover:text-peach`}
                        >
                          Verwyder
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ManagerSkeleton() {
  return (
    <div className="border border-ink-600 rounded-lg overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-4 border-b border-ink-600 last:border-0">
          <div className="h-3 bg-ink-700 rounded w-2/5 animate-pulse" />
          <div className="h-3 bg-ink-700 rounded w-1/5 animate-pulse" />
          <div className="h-3 bg-ink-700 rounded w-1/6 animate-pulse" />
          <div className="h-3 bg-ink-700 rounded w-1/6 ml-auto animate-pulse" />
        </div>
      ))}
    </div>
  );
}
