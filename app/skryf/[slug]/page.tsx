import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import { allWriting, writingCategoryColors } from "@/lib/skryf-data";
import { formatDateShort } from "@/lib/utils";

interface WritingDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return allWriting.map((writing) => ({ slug: writing.slug }));
}

export function generateMetadata({ params }: WritingDetailPageProps): Metadata {
  const writing = allWriting.find((entry) => entry.slug === params.slug);

  if (!writing) {
    return {
      title: "Stuk nie gevind nie | Skryf",
    };
  }

  return {
    title: `${writing.title} | Skryf`,
    description: writing.excerpt,
  };
}

export default function WritingDetailPage({ params }: WritingDetailPageProps) {
  const writing = allWriting.find((entry) => entry.slug === params.slug);

  if (!writing) {
    notFound();
  }

  const accent = writingCategoryColors[writing.category];

  return (
    <section className="border-b border-ink-700">
      <div className="container-narrow section-spacing">
        <div className="max-w-prose-wide">
          <Link
            href="/skryf"
            className="inline-flex mb-8 font-sans text-xs tracking-wide uppercase text-parchment-500 hover:text-parchment-300 transition-colors"
          >
            ← Terug na Skryf
          </Link>

          <span className={`tag border mb-6 ${accent}`}>{writing.category}</span>

          <h1 className="font-serif text-display-lg text-parchment-100 mb-5 leading-tight">
            {writing.title}
          </h1>

          <div className="flex items-center gap-4 text-parchment-500 text-xs font-sans mb-10">
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
          </div>

          <div className="bg-ink-800 border border-ink-600 rounded-lg p-7 md:p-8">
            <p className="font-body text-parchment-300 leading-relaxed mb-5">
              {writing.excerpt}
            </p>
            <p className="font-body text-parchment-500 leading-relaxed">
              Volledige inhoud vir hierdie stuk sal hier verskyn sodra die
              langvorm-detailinhoud aan die databron gekoppel is.
            </p>
          </div>

          <div className="mt-10">
            <Button as="link" href="/skryf" variant="ghost" size="sm">
              Verken meer skryfwerk →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
