"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import WritingCard from "@/components/ui/WritingCard";
import WritingListItem from "@/components/ui/WritingListItem";
import type { WritingCategory } from "@/lib/skryf-data";
import {
  allWriting,
  availableCategories,
  featuredWriting,
  writingCategoryColors,
} from "@/lib/skryf-data";

function FilterChip({
  label,
  active,
  accent,
  onClick,
}: {
  label: string;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "tag border transition-all duration-200 ease-gentle cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30",
        active
          ? accent
          : "text-parchment-500 bg-transparent border-ink-500 hover:border-parchment-500 hover:text-parchment-300",
      ].join(" ")}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default function SkryfPage() {
  const [activeCategory, setActiveCategory] =
    useState<WritingCategory | "Alles">("Alles");

  const filteredWriting = useMemo(() => {
    const nonFeatured = allWriting.filter((w) => !w.featured);
    if (activeCategory === "Alles") return nonFeatured;
    return nonFeatured.filter((w) => w.category === activeCategory);
  }, [activeCategory]);

  const allCategories: (WritingCategory | "Alles")[] = [
    "Alles",
    ...availableCategories,
  ];

  return (
    <>
      <section
        aria-label="Skryf page header"
        className="border-b border-ink-700 relative overflow-hidden"
      >
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
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-5 animate-fade-in">
              Skryf
            </p>
            <h1 className="font-serif text-display-lg text-parchment-100 mb-7 animate-fade-up opacity-0 delay-100">
              Woorde op <em className="text-sage">papier.</em>
            </h1>
            <p className="font-body text-parchment-400 text-base md:text-lg leading-relaxed max-w-reading animate-fade-up opacity-0 delay-200">
              Hierdie is waar my skryfwerk woon — essays, aantekeninge,
              nadenkings en idees. Nie alles is afgerond nie. Nie alles is seker
              nie. Maar alles hier is eerlik bedoel.
            </p>
          </div>
        </div>
      </section>

      {featuredWriting.length > 0 && (
        <section
          aria-labelledby="featured-writing-heading"
          className="border-b border-ink-700"
        >
          <div className="container-narrow section-spacing">
            <header className="flex items-end justify-between mb-12">
              <div>
                <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">
                  Uitgesoekte stukke
                </p>
                <h2
                  id="featured-writing-heading"
                  className="font-serif text-display-md text-parchment-100"
                >
                  Aanbevole leesstof
                </h2>
              </div>
            </header>

            <div
              className={[
                "grid gap-5 md:gap-6",
                featuredWriting.length === 1
                  ? "grid-cols-1 max-w-xl"
                  : "grid-cols-1 md:grid-cols-2",
              ].join(" ")}
            >
              {featuredWriting.map((w, i) => (
                <WritingCard key={w.id} writing={w} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="archive-heading" className="border-b border-ink-700">
        <div className="container-narrow section-spacing">
          <header className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
              <div>
                <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">
                  Argief
                </p>
                <h2
                  id="archive-heading"
                  className="font-serif text-display-md text-parchment-100"
                >
                  Alle skryfwerk
                </h2>
              </div>

              <p className="font-sans text-xs text-parchment-600 tabular-nums">
                {filteredWriting.length}{" "}
                {filteredWriting.length === 1 ? "stuk" : "stukke"}
              </p>
            </div>

            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter op kategorie"
            >
              {allCategories.map((cat) => (
                <FilterChip
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  accent={
                    cat === "Alles"
                      ? "text-parchment-200 bg-ink-700 border-ink-500"
                      : writingCategoryColors[cat as WritingCategory]
                  }
                  onClick={() =>
                    setActiveCategory(cat as WritingCategory | "Alles")
                  }
                />
              ))}
            </div>
          </header>

          {filteredWriting.length > 0 ? (
            <div className="divide-y divide-ink-600">
              {filteredWriting.map((w, i) => (
                <WritingListItem key={w.id} writing={w} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="font-body text-parchment-500 text-sm">
                Geen stukke in hierdie kategorie nie.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="container-narrow py-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div
            className="ornament text-parchment-600 text-sm max-w-xs"
            aria-hidden="true"
          >
            ✦
          </div>
          <p className="font-body italic text-parchment-500 text-sm max-w-sm leading-relaxed">
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
