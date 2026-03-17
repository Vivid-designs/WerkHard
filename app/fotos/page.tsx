import type { Metadata } from "next";
import PhotoEntryCard from "@/components/photos/PhotoEntryCard";
import { getPublishedPhotoEntries } from "@/lib/photo-service";

export const metadata: Metadata = {
  title: "Fotos",
  description: "Visuele argief — foto's, gallerye en oomblikke.",
};

export const dynamic = "force-dynamic";

export default async function FotosPage() {
  const entries = await getPublishedPhotoEntries();
  const featured = entries.filter((entry) => entry.featured);
  const rest = entries.filter((entry) => !entry.featured);

  return (
    <>
      <section className="border-b border-ink-700 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: "radial-gradient(ellipse 60% 70% at 80% 50%, rgba(201,160,160,0.05) 0%, transparent 65%)",
          }}
        />
        <div className="container-narrow section-spacing">
          <div className="max-w-prose-wide">
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-5 animate-fade-in">Fotos</p>
            <h1 className="font-serif text-display-lg text-parchment-100 mb-7 animate-fade-up opacity-0 delay-100">
              Visuele <em className="text-rose">argief.</em>
            </h1>
            <p className="font-body text-parchment-400 text-base md:text-lg leading-relaxed max-w-reading animate-fade-up opacity-0 delay-200">
              Geselekteerde oomblikke. Nie &apos;n stroom nie — &apos;n argief.
            </p>
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section aria-labelledby="featured-photos-heading" className="border-b border-ink-700">
          <div className="container-narrow section-spacing">
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Uitgelig</p>
            <h2 id="featured-photos-heading" className="font-serif text-display-md text-parchment-100 mb-12">
              Geselekteerde beelde
            </h2>
            <div className={["grid gap-6", featured.length === 1 ? "grid-cols-1 max-w-lg" : "grid-cols-1 md:grid-cols-2"].join(" ")}>
              {featured.map((entry) => (
                <PhotoEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="photo-archive-heading" className="border-b border-ink-700">
        <div className="container-narrow section-spacing">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Argief</p>
              <h2 id="photo-archive-heading" className="font-serif text-display-md text-parchment-100">
                Alle inskrywings
              </h2>
            </div>
            <span className="font-sans text-xs text-parchment-600 tabular-nums">
              {entries.length} {entries.length === 1 ? "inskrywing" : "inskrywings"}
            </span>
          </div>

          {entries.length === 0 ? (
            <p className="font-body text-parchment-600 text-sm py-16 text-center">Nog niks gepubliseer nie.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {(featured.length > 0 ? rest : entries).map((entry) => (
                <PhotoEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container-narrow py-12">
        <p className="font-body italic text-parchment-600 text-sm text-center max-w-sm mx-auto leading-relaxed">
          Elke foto is &apos;n besluit om te onthou.
        </p>
      </div>
    </>
  );
}
