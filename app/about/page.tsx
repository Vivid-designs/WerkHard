import type { Metadata } from "next";
import Link from "next/link";
import PortraitCard from "@/components/ui/PortraitCard";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Oor My",
  description:
    "Lario — skrywer, bouwe, denker. Oor tegnologie, dissipline, geloof en die lewe wat ek probeer bou.",
};

const themes = [
  { label: "Tegnologie", accent: "text-powder border-powder/25 bg-powder/8" },
  { label: "Kreatiewe werk", accent: "text-sage border-sage/25 bg-sage/8" },
  { label: "Dissipline", accent: "text-rose border-rose/25 bg-rose/8" },
  { label: "Geloof & Groei", accent: "text-lavender border-lavender/25 bg-lavender/8" },
] as const;

const bodyParagraphs = [
  "Ek is nuuskierig oor hoe dinge werk — hoe idees vorm kry, hoe mense dink, en hoe tegnologie die wêreld om ons verander.",
  "Ek geniet dit om te bou, probleme op te los en nuwe idees te toets. Van sagteware en tegnologie tot besigheid en kreatiewe projekte, hou ek daarvan om konsepte in iets werkliks te verander.",
  "Ek werk hoofsaaklik in tegnologie, met 'n fokus op sagteware-ontwikkeling, ingenieurswerk en video-produksie. Wat my die meeste aantrek, is die kombinasie van tegniese en kreatiewe werk — dis gewoonlik waar die interessantste dinge begin gebeur.",
];

const secondaryParagraphs = [
  "Ek glo in dissipline, groei en geloof. Ek probeer my lewe bou op beginsels soos selfbeheersing, verantwoordelikheid en dankbaarheid. Baie van die belangrikste lesse in my lewe het uit uitdagings gekom — tye wat my gedwing het om sterker te word, fisies, geestelik en spiritueel.",
  "Buite werk hou ek daarvan om aktief te wees. Ek surf, doen CrossFit en Brazilian Jiu-Jitsu. Hierdie goed herinner my gereeld dat groei tyd vat, en dat mens dikwels eers moet sukkel voordat daar werklike vordering kom.",
  "Ek dink ook baie oor die toekoms — veral oor die punt waar tegnologie, besigheid en menslike gedrag bymekaarkom. Baie van wat ek hier skryf, gaan oor idees, lesse wat ek leer, projekte waaraan ek werk, en dinge wat my laat stilstaan en dink.",
];

const closingParagraph =
  "Op die lang termyn wil ek 'n lewe bou wat nie net suksesvol is nie, maar ook betekenisvol. 'n Lewe waar ek vir my familie kan voorsien, iets waardevols kan bou, en steeds naby kan bly aan die dinge wat regtig saak maak.";

const closingLine =
  "Hierdie blog is my plek om idees te deel, in die openbaar te dink, en vas te lê wat ek langs die pad leer.";

export default function AboutPage() {
  return (
    <>
      <section
        aria-label="Page header"
        className="border-b border-ink-700 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 80% at 10% 50%, rgba(176,160,196,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="container-narrow section-spacing">
          <div className="max-w-prose-wide">
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-5 animate-fade-in">
              Oor My
            </p>
            <h1 className="font-serif text-display-lg text-parchment-100 animate-fade-up opacity-0 delay-100">
              Skrywer. Bouer. <em className="text-rose">Denker.</em>
            </h1>
          </div>
        </div>
      </section>

      <section aria-label="About Lario" className="border-b border-ink-700">
        <div className="container-narrow section-spacing">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
            <aside className="lg:col-span-4 lg:sticky lg:top-28">
              <PortraitCard
                caption="Kaapstad, Suid-Afrika"
                name="Lario"
              />

              <div
                className="hidden lg:flex flex-col gap-2 mt-8 animate-fade-up opacity-0 delay-300"
                aria-label="Temas"
              >
                <p className="font-sans text-2xs tracking-widest uppercase text-parchment-600 mb-1">
                  Temas
                </p>
                {themes.map((t, index) => (
                  <span
                    key={t.label}
                    className={[
                      "inline-flex items-center self-start",
                      "font-sans text-2xs tracking-widest uppercase",
                      "px-3 py-1.5 rounded-sm border",
                      "animate-fade-up opacity-0",
                      index === 0
                        ? "delay-300"
                        : index === 1
                          ? "delay-400"
                          : "delay-500",
                      t.accent,
                    ].join(" ")}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </aside>

            <div className="lg:col-span-8">
              <p
                className={[
                  "font-serif italic text-parchment-300 text-xl md:text-2xl mb-8",
                  "animate-fade-up opacity-0 delay-200",
                ].join(" ")}
              >
                My naam is Lario.
              </p>

              <div
                className={[
                  "space-y-5 font-body text-parchment-400 text-base leading-relaxed max-w-reading",
                  "animate-fade-up opacity-0 delay-300",
                ].join(" ")}
              >
                {bodyParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>

              <div
                className="ornament text-parchment-600 text-xs my-10 max-w-reading animate-fade-up opacity-0 delay-400"
                aria-hidden="true"
              >
                ✦
              </div>

              <p
                className={[
                  "font-serif italic text-parchment-400 text-base mb-8 max-w-reading",
                  "animate-fade-up opacity-0 delay-400",
                  "border-l-2 border-rose/30 pl-5",
                ].join(" ")}
              >
                Maar werk is net een deel van wie ek is.
              </p>

              <div
                className={[
                  "space-y-5 font-body text-parchment-400 text-base leading-relaxed max-w-reading",
                  "animate-fade-up opacity-0 delay-500",
                ].join(" ")}
              >
                {secondaryParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>

              <div
                className={[
                  "mt-10 p-6 rounded-lg",
                  "bg-ink-800 border border-ink-600",
                  "max-w-reading",
                  "animate-fade-up opacity-0 delay-500",
                ].join(" ")}
              >
                <p className="font-body text-parchment-300 text-base leading-relaxed mb-4">
                  {closingParagraph}
                </p>
                <p className="font-body text-parchment-400 text-sm leading-relaxed">
                  {closingLine}
                </p>
              </div>

              <p
                className={[
                  "mt-8 font-serif italic text-parchment-400 text-lg",
                  "animate-fade-up opacity-0 delay-500",
                ].join(" ")}
              >
                Welkom.
              </p>

              <div
                className="flex lg:hidden flex-wrap gap-2 mt-10 animate-fade-up opacity-0 delay-500"
                aria-label="Temas"
              >
                {themes.map((t) => (
                  <span
                    key={t.label}
                    className={[
                      "inline-flex items-center",
                      "font-sans text-2xs tracking-widest uppercase",
                      "px-3 py-1.5 rounded-sm border",
                      t.accent,
                    ].join(" ")}
                  >
                    {t.label}
                  </span>
                ))}
              </div>

              <div
                className={[
                  "flex flex-col sm:flex-row gap-4 mt-12 pt-10",
                  "border-t border-ink-600",
                  "animate-fade-up opacity-0 delay-500",
                ].join(" ")}
              >
                <Button as="link" href="/essays" variant="primary" size="md">
                  Lees die essays
                </Button>
                <Button as="link" href="/" variant="secondary" size="md">
                  Terug na tuisblad
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-narrow py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-body text-parchment-500 text-sm max-w-sm leading-relaxed">
            Wil jy saam dink? Nuwe essays gaan uit sonder skedule — net wanneer
            iets die moeite werd is.
          </p>
          <Link
            href="/#newsletter"
            className={[
              "font-sans text-xs tracking-wide text-parchment-400",
              "hover:text-rose transition-colors duration-200",
              "underline underline-offset-4 decoration-parchment-600 hover:decoration-rose/40",
              "whitespace-nowrap",
            ].join(" ")}
          >
            Teken in op die nuusbrief →
          </Link>
        </div>
      </div>
    </>
  );
}
