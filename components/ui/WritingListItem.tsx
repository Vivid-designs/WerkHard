import Link from "next/link";
import type { Writing } from "@/lib/skryf-data";
import { writingCategoryColors } from "@/lib/skryf-data";
import { formatDateShort } from "@/lib/utils";

interface WritingListItemProps {
  writing: Writing;
  index?: number;
}

export default function WritingListItem({
  writing,
  index = 0,
}: WritingListItemProps) {
  const accent = writingCategoryColors[writing.category];

  // Stagger: cap at delay-500 to avoid very long waits on big lists
  const delay = Math.min(index * 75, 400);

  return (
    <article
      className="group border-b border-ink-600 last:border-b-0 animate-fade-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link
        href={`/skryf/${writing.slug}`}
        className={[
          "flex flex-col sm:flex-row sm:items-baseline",
          "gap-3 sm:gap-6",
          "py-6 px-1",
          "hover:px-3 transition-all duration-200 ease-gentle",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30 rounded",
          "group",
        ].join(" ")}
      >
        <time
          dateTime={writing.publishedAt}
          className="font-sans text-xs text-parchment-600 sm:w-28 shrink-0 tabular-nums"
        >
          {formatDateShort(writing.publishedAt)}
        </time>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-parchment-200 group-hover:text-parchment-100 transition-colors duration-200 leading-snug mb-1.5">
            {writing.title}
          </h3>
          <p className="font-body text-parchment-500 text-sm leading-relaxed line-clamp-2">
            {writing.excerpt}
          </p>
        </div>

        <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:w-28 shrink-0">
          <span className={`tag border ${accent}`}>{writing.category}</span>
          <span className="font-sans text-xs text-parchment-600">
            {writing.readingTime} min
          </span>
        </div>
      </Link>
    </article>
  );
}
