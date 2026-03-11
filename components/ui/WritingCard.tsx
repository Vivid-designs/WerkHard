import Link from "next/link";
import type { Writing } from "@/lib/skryf-data";
import { writingCategoryColors } from "@/lib/skryf-data";
import { formatDateShort } from "@/lib/utils";

interface WritingCardProps {
  writing: Writing;
  index?: number;
}

const delays = ["delay-100", "delay-200", "delay-300"];

export default function WritingCard({ writing, index = 0 }: WritingCardProps) {
  const accent = writingCategoryColors[writing.category];
  const delayClass = delays[index % delays.length];

  return (
    <article
      className={[
        "group relative flex flex-col",
        "bg-ink-800 border border-ink-600 rounded-lg",
        "p-7 md:p-8",
        "transition-all duration-300 ease-gentle",
        "hover:border-ink-500 hover:shadow-card-hover",
        "animate-fade-up opacity-0",
        delayClass,
      ].join(" ")}
    >
      <span className={`tag border self-start mb-5 ${accent}`}>
        {writing.category}
      </span>

      <h3 className="font-serif text-display-sm text-parchment-100 mb-3 leading-snug group-hover:text-white transition-colors duration-200">
        <Link
          href={`/skryf/${writing.slug}`}
          className="hover:no-underline focus-visible:outline-none"
        >
          <span className="absolute inset-0 rounded-lg" aria-hidden="true" />
          {writing.title}
        </Link>
      </h3>

      <p className="font-body text-parchment-400 text-sm leading-relaxed mb-6 flex-1">
        {writing.excerpt}
      </p>

      <footer className="flex items-center gap-4 text-parchment-500 text-xs font-sans">
        <time dateTime={writing.publishedAt}>
          {formatDateShort(writing.publishedAt)}
        </time>
        <span aria-hidden="true">·</span>
        <span>{writing.readingTime} min lees</span>
        {writing.lang === "en" && (
          <>
            <span aria-hidden="true">·</span>
            <span className="italic text-parchment-600">EN</span>
          </>
        )}
      </footer>

      <div
        className={[
          "absolute bottom-0 left-7 right-7 h-px",
          "scale-x-0 group-hover:scale-x-100",
          "transition-transform duration-300 ease-gentle origin-left opacity-60",
          `bg-current ${accent.split(" ")[0]}`,
        ].join(" ")}
        aria-hidden="true"
      />
    </article>
  );
}
