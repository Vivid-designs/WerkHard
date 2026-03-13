import type { Metadata } from "next";
import SpotifySection from "@/components/spotify/SpotifySection";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "WerkHard",
  description: "Fokus, dissipline en die musiek wat my aanhou beweeg.",
};

const pillars = [
  {
    label: "Tegnologie",
    accent: "text-powder border-powder/25 bg-powder/8",
    summary:
      "Sagteware, ingenieurswerk, video — tegniese werk is waar ek elke dag meeste van my tyd spandeer.",
  },
  {
    label: "Fisies",
    accent: "text-sage border-sage/25 bg-sage/8",
    summary:
      "CrossFit, Brazilian Jiu-Jitsu, surf. Fisiese dissipline bou die grondslag vir alles anders.",
  },
  {
    label: "Geestelik",
    accent: "text-lavender border-lavender/25 bg-lavender/8",
    summary:
      "Geloof, selfbeheersing en bewustelike groei — die raamwerk waarbinne alles sin maak.",
  },
  {
    label: "Kreatief",
    accent: "text-peach border-peach/25 bg-peach/8",
    summary:
      "Skryf, bou, skep — kreatiewe werk is die plek waar tegniese en artistieke denke bymekaar kom.",
  },
];

export default function WerkHardPage() {
  return (
    <>
      <section
        aria-label="WerkHard page header"
        className="relative overflow-hidden border-b border-ink-700"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 70% at 80% 50%, rgba(158,184,164,0.05) 0%, transparent 65%)",
          }}
        />

        <div className="container-narrow section-spacing">
          <div className="max-w-prose-wide">
            <p className="mb-5 animate-fade-in font-sans text-2xs tracking-widest uppercase text-parchment-500">
              WerkHard
            </p>
            <h1 className="mb-7 animate-fade-up font-serif text-display-lg text-parchment-100 opacity-0 delay-100">
              Dissipline is <em className="text-sage">vryheid.</em>
            </h1>
            <p className="mb-10 max-w-reading animate-fade-up font-body text-base leading-relaxed text-parchment-400 opacity-0 delay-200 md:text-lg">
              Hierdie bladsy is &#39;n venster in hoe ek werk, dink en beweeg.
              Fokus, musiek, en die dinge wat my elke dag aanhou skuif.
            </p>

            <div className="flex flex-wrap gap-2 animate-fade-up opacity-0 delay-300">
              {pillars.map((p) => (
                <span key={p.label} className={`tag border ${p.accent}`} title={p.summary}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="pillars-heading" className="border-b border-ink-700">
        <div className="container-narrow section-spacing">
          <p className="mb-2 font-sans text-2xs tracking-widest uppercase text-parchment-500">
            Fokusareas
          </p>
          <h2 id="pillars-heading" className="mb-12 font-serif text-display-md text-parchment-100">
            Hoe ek my tyd bou.
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <article
                key={p.label}
                className={[
                  "bg-ink-800 border border-ink-600 rounded-lg p-6",
                  "hover:border-ink-500 transition-all duration-300",
                  "animate-fade-up opacity-0",
                  i === 0
                    ? "delay-100"
                    : i === 1
                      ? "delay-200"
                      : i === 2
                        ? "delay-300"
                        : "delay-400",
                ].join(" ")}
              >
                <span className={`tag border mb-4 inline-block ${p.accent}`}>{p.label}</span>
                <p className="font-body text-sm leading-relaxed text-parchment-400">{p.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SpotifySection />

      <div className="container-narrow py-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-sm font-body text-sm leading-relaxed text-parchment-500">
            Lees meer oor my benadering tot lewe en werk.
          </p>
          <Button as="link" href="/about" variant="ghost" size="sm">
            Oor my →
          </Button>
        </div>
      </div>
    </>
  );
}
