import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getPublishedWriting } from "@/lib/writing-service";
import type { WritingPiece, Category } from "@/lib/writing-service";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Skryf",
  description: "Essays, aantekeninge en nadenkings van Lario.",
};

export const revalidate = 60;

function CategoryTag({ category }: { category: Category }) {
  return <span className={`tag border ${category.accent}`}>{category.name}</span>;
}

function WritingCard({ piece, featured = false }: { piece: WritingPiece; featured?: boolean }) {
  return (
    <article
      className={[
        "group relative flex flex-col",
        "bg-ink-800 border border-ink-600 rounded-lg",
        featured ? "p-8 md:p-9" : "p-6 md:p-7",
        "transition-all duration-300",
        "hover:border-ink-500 hover:shadow-card-hover",
      ].join(" ")}
    >
      {piece.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {piece.categories.map((c) => (
            <CategoryTag key={c.id} category={c} />
          ))}
        </div>
      )}

      <h3
        className={[
          "font-serif text-parchment-100 mb-2 leading-snug",
          "group-hover:text-white transition-colors duration-200",
          featured ? "text-display-sm" : "text-lg",
        ].join(" ")}
      >
        <Link href={`/skryf/${piece.slug}`} className="hover:no-underline focus-visible:outline-none">
          <span className="absolute inset-0 rounded-lg" aria-hidden="true" />
          {piece.title}
        </Link>
      </h3>

      {(piece.subtitle || piece.tagline) && (
        <p className="font-body text-parchment-500 text-sm mb-3 italic">{piece.subtitle ?? piece.tagline}</p>
      )}

      {piece.excerpt && <p className="font-body text-parchment-400 text-sm leading-relaxed mb-5 flex-1">{piece.excerpt}</p>}

      <footer className="flex items-center gap-3 text-parchment-600 text-xs font-sans mt-auto">
        <time dateTime={piece.created_at}>{formatDateShort(piece.created_at.split("T")[0])}</time>
      </footer>

      {piece.categories[0] && (
        <div
          className={[
            "absolute bottom-0 left-6 right-6 h-px",
            "scale-x-0 group-hover:scale-x-100",
            "transition-transform duration-300 origin-left opacity-50",
            `bg-current ${piece.categories[0].accent.split(" ")[0]}`,
          ].join(" ")}
          aria-hidden="true"
        />
      )}
    </article>
  );
}

function WritingListItem({ piece }: { piece: WritingPiece }) {
  return (
    <article className="group border-b border-ink-600 last:border-0">
      <Link
        href={`/skryf/${piece.slug}`}
        className={[
          "flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6",
          "py-6 px-1 hover:px-3 transition-all duration-200",
          "focus-visible:outline-none rounded",
        ].join(" ")}
      >
        <time
          dateTime={piece.created_at}
          className="font-sans text-xs text-parchment-600 sm:w-28 shrink-0 tabular-nums"
        >
          {formatDateShort(piece.created_at.split("T")[0])}
        </time>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-parchment-200 group-hover:text-parchment-100 transition-colors duration-200 leading-snug mb-1.5">
            {piece.title}
          </h3>
          {piece.excerpt && <p className="font-body text-parchment-500 text-sm leading-relaxed line-clamp-2">{piece.excerpt}</p>}
        </div>

        <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:w-36 shrink-0 flex-wrap">
          {piece.categories.map((c) => (
            <CategoryTag key={c.id} category={c} />
          ))}
        </div>
      </Link>
    </article>
  );
}

export default async function SkryfPage() {
  const pieces = await getPublishedWriting();
  const featured = pieces.filter((p) => p.featured).slice(0, 2);
  const archive = pieces.filter((p) => !p.featured);

  return (
    <>
      <section className="border-b border-ink-700 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 60% at 15% 50%, rgba(158,184,164,0.05) 0%, transparent 65%)",
          }}
        />
        <div className="container-narrow section-spacing">
          <div className="max-w-prose-wide">
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-5 animate-fade-in">Skryf</p>
            <h1 className="font-serif text-display-lg text-parchment-100 mb-7 animate-fade-up opacity-0 delay-100">
              Woorde op <em className="text-sage">papier.</em>
            </h1>
            <p className="font-body text-parchment-400 text-base md:text-lg leading-relaxed max-w-reading animate-fade-up opacity-0 delay-200">
              Essays, aantekeninge, nadenkings en idees. Nie alles is afgerond nie. Maar alles hier is eerlik bedoel.
            </p>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="border-b border-ink-700">
          <div className="container-narrow section-spacing">
            <header className="flex items-end justify-between mb-12">
              <div>
                <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Uitgesoek</p>
                <h2 id="featured-heading" className="font-serif text-display-md text-parchment-100">
                  Aanbevole leesstof
                </h2>
              </div>
            </header>

            <div
              className={[
                "grid gap-5 md:gap-6",
                featured.length === 1 ? "grid-cols-1 max-w-xl" : "grid-cols-1 md:grid-cols-2",
              ].join(" ")}
            >
              {featured.map((p) => (
                <WritingCard key={p.id} piece={p} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="archive-heading" className="border-b border-ink-700">
        <div className="container-narrow section-spacing">
          <header className="flex items-end justify-between mb-10">
            <div>
              <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Argief</p>
              <h2 id="archive-heading" className="font-serif text-display-md text-parchment-100">
                Alle skryfwerk
              </h2>
            </div>
            <span className="font-sans text-xs text-parchment-600 tabular-nums">
              {pieces.length} {pieces.length === 1 ? "stuk" : "stukke"}
            </span>
          </header>

          {pieces.length === 0 ? (
            <p className="font-body text-parchment-600 text-sm py-12 text-center">Nog niks gepubliseer nie. Kyk later weer.</p>
          ) : (
            <div className="divide-y divide-ink-600">
              {archive.map((p) => (
                <WritingListItem key={p.id} piece={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container-narrow py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-body italic text-parchment-500 text-sm leading-relaxed max-w-sm">
            Skryf is 'n manier om te dink. Hierdie is my openbare dagboek.
          </p>
          <Button as="link" href="/about" variant="ghost" size="sm">
            Oor die skrywer →
          </Button>
        </div>
      </div>
    </>
  );
}
