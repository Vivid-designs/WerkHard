import Link from "next/link";
import Image from "next/image";
import type { PhotoEntry } from "@/lib/photo-service";
import { formatDateShort } from "@/lib/utils";

interface PhotoEntryCardProps {
  entry: PhotoEntry;
}

export default function PhotoEntryCard({ entry }: PhotoEntryCardProps) {
  const images = entry.images;
  const cover = images[0]?.image_url;
  const isMulti = entry.display_type === "gallery" && images.length > 1;

  return (
    <article className="group">
      <Link
        href={`/fotos/${entry.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30 rounded-lg"
      >
        <div className="relative overflow-hidden rounded-lg bg-ink-800 border border-ink-700 transition-all duration-300 group-hover:border-ink-500 group-hover:shadow-card-hover aspect-[4/3]">
          {cover ? (
            <Image
              src={cover}
              alt={images[0]?.alt_text ?? entry.title ?? "Foto"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-parchment-700">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}

          {isMulti ? (
            <div
              className="absolute top-3 right-3 font-sans text-2xs text-parchment-300 bg-ink-900/80 backdrop-blur-sm px-2.5 py-1 rounded border border-ink-600/60 tabular-nums"
              aria-label={`${images.length} foto's`}
            >
              1 / {images.length}
            </div>
          ) : null}

          <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-all duration-300" />
        </div>

        <div className="pt-3 pb-1 px-0.5">
          {entry.title ? (
            <h3 className="font-serif text-parchment-200 group-hover:text-parchment-100 transition-colors duration-200 leading-snug mb-1">
              {entry.title}
            </h3>
          ) : null}

          {entry.caption ? (
            <p className="font-body text-parchment-500 text-sm leading-relaxed line-clamp-2 mb-2">{entry.caption}</p>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <time dateTime={entry.published_at ?? entry.created_at} className="font-sans text-xs text-parchment-700 tabular-nums">
              {formatDateShort(entry.published_at ?? entry.created_at)}
            </time>

            {entry.people_tags.length > 0 ? (
              <span className="font-sans text-2xs text-lavender/70 tracking-wide truncate text-right">
                {entry.people_tags.map((tag) => tag.name).join(", ")}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
