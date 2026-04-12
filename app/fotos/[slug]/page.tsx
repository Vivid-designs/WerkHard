import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FilmStripCarousel from "@/components/photos/FilmStripCarousel";
import { getPhotoEntryBySlug, getPublishedPhotoEntries } from "@/lib/photo-service";
import { formatDate } from "@/lib/utils";

export const revalidate = 10;

export async function generateStaticParams() {
  try {
    const entries = await getPublishedPhotoEntries();
    return entries.map((entry) => ({ slug: entry.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const entry = await getPhotoEntryBySlug(params.slug);
  if (!entry) return { title: "Nie gevind nie" };

  return {
    title: entry.title ?? "Foto",
    description: entry.caption ?? undefined,
    openGraph: {
      title: entry.title ?? "Foto",
      images: entry.images[0]?.image_url ? [entry.images[0].image_url] : undefined,
    },
  };
}

export default async function PhotoDetailPage({ params }: { params: { slug: string } }) {
  const entry = await getPhotoEntryBySlug(params.slug);
  if (!entry) notFound();

  return (
    <>
      <header className="border-b border-ink-700 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: "radial-gradient(ellipse 50% 60% at 15% 50%, rgba(201,160,160,0.04) 0%, transparent 60%)",
          }}
        />
        <div className="container-narrow section-spacing">
          <div className="max-w-reading">
            {entry.title ? (
              <h1 className="font-serif text-display-lg text-parchment-100 mb-4 animate-fade-up opacity-0 delay-100">{entry.title}</h1>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 animate-fade-up opacity-0 delay-200">
              <time dateTime={entry.published_at ?? entry.created_at} className="font-sans text-xs text-parchment-600 tabular-nums">
                {formatDate(entry.published_at ?? entry.created_at)}
              </time>

              {entry.images.length > 1 ? (
                <>
                  <span className="text-parchment-700" aria-hidden="true">
                    ·
                  </span>
                  <span className="font-sans text-xs text-parchment-600">{entry.images.length} foto&apos;s</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-ink-700">
        <div className="container-narrow py-10 md:py-14">
          <FilmStripCarousel images={entry.images} title={entry.title} />
        </div>
      </section>

      {entry.caption || entry.people_tags.length > 0 ? (
        <section className="border-b border-ink-700">
          <div className="container-narrow py-10 md:py-12">
            <div className="max-w-reading mx-auto flex flex-col gap-8">
              {entry.caption ? (
                <div>
                  <p className="font-sans text-2xs tracking-widest uppercase text-parchment-600 mb-4">Byskrif</p>
                  <p className="font-body text-parchment-300 text-base md:text-lg leading-[1.85]">{entry.caption}</p>
                </div>
              ) : null}

              {entry.people_tags.length > 0 ? (
                <div>
                  <p className="font-sans text-2xs tracking-widest uppercase text-parchment-600 mb-4">Mense</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.people_tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-2 font-sans text-xs text-lavender border border-lavender/25 bg-lavender/8 px-3 py-1.5 rounded-sm"
                      >
                        {tag.name}
                        {tag.handle ? <span className="text-lavender/50">@{tag.handle}</span> : null}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <div className="container-narrow py-12">
        <div className="flex items-center justify-between max-w-reading mx-auto">
          <Link
            href="/fotos"
            className="font-sans text-xs tracking-wide text-parchment-500 hover:text-parchment-200 transition-colors duration-200 underline underline-offset-4 decoration-parchment-600"
          >
            ← Terug na Fotos
          </Link>
        </div>
      </div>
    </>
  );
}
