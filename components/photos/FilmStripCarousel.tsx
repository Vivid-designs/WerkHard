"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PhotoImage } from "@/lib/photo-service";

interface FilmStripCarouselProps {
  images: PhotoImage[];
  title?: string | null;
}

export default function FilmStripCarousel({ images, title }: FilmStripCarouselProps) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const count = images.length;

  const go = useCallback(
    (index: number) => {
      if (animating || index === active) return;

      setAnimating(true);
      setTimeout(() => {
        setActive(index);
        setAnimating(false);
      }, 260);
    },
    [active, animating],
  );

  const prev = useCallback(() => go((active - 1 + count) % count), [active, count, go]);
  const next = useCallback(() => go((active + 1) % count), [active, count, go]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const thumb = strip.children[active] as HTMLElement | undefined;
    if (!thumb) return;

    thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  function onTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - event.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX.current = null;
  }

  const current = images[active];
  if (!current) return null;

  return (
    <div className="flex flex-col gap-5">
      <div
        className="relative w-full overflow-hidden rounded-lg bg-ink-950 border border-ink-700"
        style={{ aspectRatio: "16 / 10" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label={`Foto ${active + 1} van ${count}${title ? ` — ${title}` : ""}`}
        role="img"
      >
        <div
          key={active}
          className={["absolute inset-0 transition-opacity duration-300", animating ? "opacity-0" : "opacity-100"].join(
            " ",
          )}
        >
          <Image
            src={current.image_url}
            alt={current.alt_text ?? title ?? "Foto"}
            fill
            className="object-contain"
            priority={active === 0}
            unoptimized
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 55%, rgba(8,8,8,0.45) 100%)",
          }}
          aria-hidden="true"
        />

        {count > 1 ? (
          <>
            <button
              onClick={prev}
              className={[
                "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                "w-9 h-9 flex items-center justify-center",
                "rounded-full border border-parchment-600/20 bg-ink-900/70",
                "text-parchment-400 hover:text-parchment-100 hover:border-parchment-500/40",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/40",
                "backdrop-blur-sm",
              ].join(" ")}
              aria-label="Vorige foto"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M9 11L5 7l4-4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={next}
              className={[
                "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                "w-9 h-9 flex items-center justify-center",
                "rounded-full border border-parchment-600/20 bg-ink-900/70",
                "text-parchment-400 hover:text-parchment-100 hover:border-parchment-500/40",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/40",
                "backdrop-blur-sm",
              ].join(" ")}
              aria-label="Volgende foto"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M5 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        ) : null}

        {count > 1 ? (
          <div
            className="absolute bottom-4 right-4 z-10 font-sans text-2xs tabular-nums text-parchment-500 bg-ink-900/70 backdrop-blur-sm px-2.5 py-1 rounded border border-ink-600/50"
            aria-hidden="true"
          >
            {active + 1} / {count}
          </div>
        ) : null}
      </div>

      {current.caption ? <p className="font-body text-sm text-parchment-500 italic leading-relaxed px-1">{current.caption}</p> : null}

      {count > 1 ? (
        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          role="list"
          aria-label="Foto miniatuurrits"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              role="listitem"
              onClick={() => go(index)}
              aria-label={`Foto ${index + 1}${image.alt_text ? `: ${image.alt_text}` : ""}`}
              aria-pressed={index === active}
              className={[
                "relative shrink-0 rounded overflow-hidden",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/40",
                index === active
                  ? "ring-1 ring-parchment-400/60 opacity-100 scale-100"
                  : "opacity-40 hover:opacity-70 scale-95 hover:scale-100",
              ].join(" ")}
              style={{ width: 60, height: 44 }}
            >
              <Image src={image.image_url} alt={image.alt_text ?? `Foto ${index + 1}`} fill className="object-cover" unoptimized />
              {index === active ? <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
