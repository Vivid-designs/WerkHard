"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { NowPlayingResult } from "@/lib/spotify";
import { formatArtists, getBestImage } from "@/lib/spotify";

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingResult | null>(null);
  const [loading, setLoading] = useState(true);

  async function poll() {
    try {
      const res = await fetch("/api/spotify/now-playing");
      const json = (await res.json()) as NowPlayingResult;
      setData(json);
    } catch {
      setData({ isPlaying: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    poll();
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500">
          Nou aan die luister
        </p>
        {data?.isPlaying && (
          <span className="flex h-3 items-end gap-0.5" aria-hidden="true">
            <Equaliser />
          </span>
        )}
      </div>

      <div
        className={[
          "flex items-center gap-5",
          "bg-ink-800 border border-ink-600 rounded-lg p-5",
          "transition-all duration-300",
          data?.isPlaying ? "hover:border-ink-500 hover:shadow-card-hover" : "",
        ].join(" ")}
      >
        {loading ? (
          <LoadingSkeleton />
        ) : !data?.isPlaying || !data.track ? (
          <EmptyState />
        ) : (
          <TrackDisplay track={data.track} />
        )}
      </div>
    </div>
  );
}

function TrackDisplay({ track }: { track: NonNullable<NowPlayingResult["track"]> }) {
  const artworkUrl = getBestImage(track.album.images, 80);
  const artists = formatArtists(track.artists);

  return (
    <>
      {artworkUrl && (
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="group block shrink-0 overflow-hidden rounded"
          aria-label={`Open ${track.name} in Spotify`}
          tabIndex={-1}
        >
          <Image
            src={artworkUrl}
            alt={`${track.album.name} album artwork`}
            width={56}
            height={56}
            className="rounded transition-opacity duration-200 group-hover:opacity-80"
            unoptimized
          />
        </a>
      )}

      <div className="min-w-0 flex-1">
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1 block truncate font-serif leading-snug text-parchment-100 transition-colors duration-200 hover:text-white"
        >
          {track.name}
        </a>
        <p className="truncate font-sans text-xs text-parchment-500">{artists}</p>
        <p className="mt-0.5 truncate font-sans text-xs text-parchment-600">
          {track.album.name}
        </p>
      </div>

      <a
        href={track.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-sm text-parchment-600 transition-colors duration-200 hover:text-sage"
        aria-label="Open in Spotify"
      >
        ↗
      </a>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center gap-4 text-parchment-600">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-ink-500 bg-ink-700">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <div>
        <p className="font-body text-sm text-parchment-500">
          Niks speel op die oomblik nie.
        </p>
        <p className="mt-0.5 font-sans text-xs text-parchment-600">Kyk later weer.</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <div className="h-14 w-14 shrink-0 animate-pulse rounded bg-ink-700" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-ink-700" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink-700" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-ink-700" />
      </div>
    </>
  );
}

function Equaliser() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-0.5 animate-pulse rounded-full bg-sage"
          style={{
            height: `${6 + i * 3}px`,
            animationDelay: `${i * 150}ms`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </>
  );
}
