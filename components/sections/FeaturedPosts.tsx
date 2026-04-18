import Link from "next/link";
import type { WritingPiece } from "@/lib/writing-service";
import { formatDateShort } from "@/lib/utils";

interface FeaturedPostsProps {
  posts: WritingPiece[];
}

function FeaturedWritingCard({ piece, index }: { piece: WritingPiece; index: number }) {
  const delays = ["delay-100", "delay-200", "delay-300"];
  const delayClass = delays[index % delays.length];

  return (
    <article
      className={[
        "group relative flex flex-col",
        "bg-ink-800 border border-ink-600 rounded-lg p-7 md:p-8",
        "transition-all duration-300",
        "hover:border-ink-500 hover:shadow-card-hover",
        "animate-fade-up opacity-0",
        delayClass,
      ].join(" ")}
    >
      {piece.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {piece.categories.map((c) => (
            <span key={c.id} className={`tag border ${c.accent}`}>
              {c.name}
            </span>
          ))}
        </div>
      )}

      <h3 className="font-serif text-display-sm text-parchment-100 mb-3 leading-snug group-hover:text-white transition-colors duration-200">
        <Link href={`/skryf/${piece.slug}`} className="hover:no-underline focus-visible:outline-none">
          <span className="absolute inset-0 rounded-lg" aria-hidden="true" />
          {piece.title}
        </Link>
      </h3>

      {piece.excerpt && (
        <p className="font-body text-parchment-400 text-sm leading-relaxed mb-6 flex-1">
          {piece.excerpt}
        </p>
      )}

      <footer className="flex items-center gap-4 text-parchment-500 text-xs font-sans mt-auto">
        <time dateTime={piece.created_at}>{formatDateShort(piece.created_at.split("T")[0])}</time>
      </footer>

      {piece.categories[0] && (
        <div
          className={[
            "absolute bottom-0 left-7 right-7 h-px",
            "scale-x-0 group-hover:scale-x-100",
            "transition-transform duration-300 origin-left opacity-60",
            `bg-current ${piece.categories[0].accent.split(" ")[0]}`,
          ].join(" ")}
          aria-hidden="true"
        />
      )}
    </article>
  );
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <section aria-labelledby="featured-heading" className="border-b border-ink-700">
      <div className="container-narrow section-spacing">
        <header className="flex items-end justify-between mb-12">
          <div>
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">
              Uitgesoekte skryfwerk
            </p>
            <h2
              id="featured-heading"
              className="font-serif text-display-md text-parchment-100"
            >
              Onlangse essays
            </h2>
          </div>
          <Link
            href="/skryf"
            className="hidden sm:inline-flex font-sans text-xs tracking-wide text-parchment-500 hover:text-parchment-200 transition-colors duration-200 items-center gap-2"
          >
            Alle essays <span aria-hidden="true" className="text-parchment-600">→</span>
          </Link>
        </header>

        {posts.length === 0 ? (
          <p className="font-body text-parchment-600 text-sm py-12 text-center">
            Kyk later weer vir nuwe essays.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {posts.map((piece, i) => (
              <FeaturedWritingCard key={piece.id} piece={piece} index={i} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/skryf"
            className="font-sans text-xs tracking-wide text-parchment-500 hover:text-parchment-200 transition-colors duration-200 underline underline-offset-4 decoration-parchment-600"
          >
            Blaai deur alle essays →
          </Link>
        </div>
      </div>
    </section>
  );
}
