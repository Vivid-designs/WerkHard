"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { SpotifyTrack } from "@/lib/spotify";
import { formatArtists, getBestImage } from "@/lib/spotify";

interface TopTracksData {
  tracks: SpotifyTrack[];
}

export default function TopTracks() {
  const [data, setData] = useState<TopTracksData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spotify/top-tracks")
      .then((r) => r.json())
      .then((json) => setData(json as TopTracksData))
      .catch(() => setData({ tracks: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 font-sans text-2xs tracking-widest uppercase text-parchment-500">
          Top luisterstukke
        </p>
        <h3 className="font-serif text-display-sm text-parchment-100">Hierdie maand</h3>
      </div>

      <div className="overflow-hidden rounded-lg border border-ink-600">
        {loading ? (
          <LoadingSkeleton />
        ) : !data?.tracks.length ? (
          <EmptyState />
        ) : (
          <ol className="divide-y divide-ink-600" aria-label="Top tracks">
            {data.tracks.map((track, i) => (
              <TrackRow key={track.id} track={track} rank={i + 1} />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function TrackRow({ track, rank }: { track: SpotifyTrack; rank: number }) {
  const artworkUrl = getBestImage(track.album.images, 60);
  const artists = formatArtists(track.artists);

  return (
    <li className="group">
      <a
        href={track.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "flex items-center gap-4",
          "px-5 py-4",
          "transition-colors duration-200 hover:bg-ink-800",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30",
        ].join(" ")}
        aria-label={`${rank}. ${track.name} deur ${artists} — open in Spotify`}
      >
        <span
          className={[
            "w-5 shrink-0 text-right font-sans text-xs tabular-nums",
            rank <= 3 ? "text-parchment-400" : "text-parchment-600",
          ].join(" ")}
          aria-hidden="true"
        >
          {rank}
        </span>

        {artworkUrl ? (
          <Image
            src={artworkUrl}
            alt=""
            width={40}
            height={40}
            className="shrink-0 rounded transition-opacity duration-200 group-hover:opacity-80"
            unoptimized
            aria-hidden="true"
          />
        ) : (
          <div
            className="h-10 w-10 shrink-0 rounded border border-ink-600 bg-ink-700"
            aria-hidden="true"
          />
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-body text-sm leading-snug text-parchment-200 transition-colors duration-200 group-hover:text-parchment-100">
            {track.name}
          </p>
          <p className="mt-0.5 truncate font-sans text-xs text-parchment-500">{artists}</p>
        </div>

        <p className="hidden max-w-[160px] truncate text-right font-sans text-xs text-parchment-600 md:block">
          {track.album.name}
        </p>

        <span
          className="ml-1 shrink-0 text-sm text-parchment-700 transition-colors duration-200 group-hover:text-sage"
          aria-hidden="true"
        >
          ↗
        </span>
      </a>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <p className="font-body text-sm text-parchment-600">
        Geen data beskikbaar nie. Probeer later.
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="divide-y divide-ink-600">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-3 w-5 shrink-0 animate-pulse rounded bg-ink-700" />
          <div className="h-10 w-10 shrink-0 animate-pulse rounded bg-ink-700" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-3/5 animate-pulse rounded bg-ink-700" />
            <div className="h-2.5 w-2/5 animate-pulse rounded bg-ink-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
