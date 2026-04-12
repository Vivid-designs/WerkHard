import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getWritingBySlug, getPublishedWriting } from "@/lib/writing-service";
import WritingBodyRenderer from "@/components/writing/WritingBodyRenderer";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const pieces = await getPublishedWriting();
    return pieces.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const piece = await getWritingBySlug(params.slug);
  if (!piece) return { title: "Nie gevind nie" };

  return {
    title: piece.title,
    description: piece.excerpt ?? piece.tagline ?? undefined,
    openGraph: {
      title: piece.title,
      description: piece.excerpt ?? undefined,
      images: piece.cover_image_url ? [piece.cover_image_url] : undefined,
    },
  };
}

export default async function WritingPiecePage({ params }: { params: { slug: string } }) {
  const piece = await getWritingBySlug(params.slug);

  if (!piece) notFound();

  return (
    <>
      <header className="border-b border-ink-700 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 70% at 20% 50%, rgba(176,160,196,0.05) 0%, transparent 65%)",
          }}
        />

        <div className="container-narrow section-spacing">
          <div className="max-w-reading mx-auto">
            {piece.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-7 animate-fade-in">
                {piece.categories.map((c) => (
                  <span key={c.id} className={`tag border ${c.accent}`}>
                    {c.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-serif text-display-lg text-parchment-100 mb-5 animate-fade-up opacity-0 delay-100">
              {piece.title}
            </h1>

            {piece.subtitle && (
              <p className="font-serif italic text-parchment-400 text-xl mb-4 animate-fade-up opacity-0 delay-200">
                {piece.subtitle}
              </p>
            )}

            {piece.tagline && !piece.subtitle && (
              <p className="font-body text-parchment-500 text-base mb-4 animate-fade-up opacity-0 delay-200">
                {piece.tagline}
              </p>
            )}

            <div className="flex items-center gap-4 animate-fade-up opacity-0 delay-300">
              <time dateTime={piece.created_at} className="font-sans text-xs text-parchment-600 tabular-nums">
                {formatDate(piece.created_at.split("T")[0])}
              </time>
            </div>
          </div>
        </div>
      </header>

      {piece.cover_image_url && (
        <div className="border-b border-ink-700">
          <div className="container-narrow py-8">
            <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden border border-ink-600">
              <Image src={piece.cover_image_url} alt={piece.title} fill className="object-cover" unoptimized priority />
            </div>
          </div>
        </div>
      )}

      <article className="border-b border-ink-700">
        <div className="container-narrow section-spacing">
          <div className="max-w-reading mx-auto">
            {piece.body ? (
              <WritingBodyRenderer body={piece.body} />
            ) : (
              <p className="font-body italic text-parchment-600 text-sm">Inhoud kom binnekort.</p>
            )}
          </div>
        </div>
      </article>

      <div className="container-narrow py-12">
        <div className="flex items-center justify-between max-w-reading mx-auto">
          <Link
            href="/skryf"
            className={[
              "font-sans text-xs tracking-wide text-parchment-500",
              "hover:text-parchment-200 transition-colors duration-200",
              "underline underline-offset-4 decoration-parchment-600",
            ].join(" ")}
          >
            ← Terug na Skryf
          </Link>

          {piece.categories.length > 0 && (
            <div className="flex gap-2">
              {piece.categories.map((c) => (
                <span key={c.id} className={`tag border ${c.accent}`}>
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
