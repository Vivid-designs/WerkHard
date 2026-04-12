import type { Metadata } from "next";
import SocialLinks from "@/components/contact/SocialLinks";
import AuthSection from "@/components/contact/AuthSection";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Kontak Lario — WhatsApp, Spotify, X, of skep 'n rekening op die webwerf.",
};

export default function ContactPage() {
  return (
    <>
      <section aria-label="Kontak bladsy opskrif" className="border-b border-ink-700 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 70% at 90% 50%, rgba(201,160,160,0.05) 0%, transparent 65%)",
          }}
        />

        <div className="container-narrow section-spacing">
          <div className="max-w-prose-wide">
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-5 animate-fade-in">
              Kontak
            </p>
            <h1 className="font-serif text-display-lg text-parchment-100 mb-7 animate-fade-up opacity-0 delay-100">
              Kom in <em className="text-rose">kontak.</em>
            </h1>
            <p className="font-body text-parchment-400 text-base md:text-lg leading-relaxed max-w-reading animate-fade-up opacity-0 delay-200">
              Of jy &#39;n gedagte wil deel, wil saamwerk, of net wil volg wat ek doen — hier is waar jy my
              kan kry.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="social-heading" className="border-b border-ink-700">
        <div className="container-narrow section-spacing">
          <div className="mb-10">
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2">Volg en kontak</p>
            <h2 id="social-heading" className="font-serif text-display-md text-parchment-100">
              Vind my elders.
            </h2>
          </div>

          <SocialLinks />
        </div>
      </section>

      <section aria-labelledby="auth-heading" className="border-b border-ink-700">
        <div className="container-narrow section-spacing">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-2 animate-fade-up opacity-0 delay-100">
                Gemeenskap
              </p>
              <h2
                id="auth-heading"
                className="font-serif text-display-md text-parchment-100 mb-6 animate-fade-up opacity-0 delay-200"
              >
                Sluit aan.
              </h2>
              <div className="space-y-4 font-body text-parchment-400 text-base leading-relaxed animate-fade-up opacity-0 delay-300 max-w-reading">
                <p>Skep &#39;n gratis rekening om deel te word van die gemeenskap rondom hierdie ruimte.</p>
                <p>
                  Geen spaaspos. Geen algoritme. Net &#39;n plek waar mense met dieselfde soort nuuskierigheid
                  bymekaarkom.
                </p>
              </div>

              <div
                className="ornament text-parchment-600 text-sm mt-10 max-w-xs animate-fade-up opacity-0 delay-400"
                aria-hidden="true"
              >
                ✦
              </div>
            </div>

            <div className="lg:col-span-7 animate-fade-up opacity-0 delay-300">
              <AuthSection />
            </div>
          </div>
        </div>
      </section>

      <div className="container-narrow py-12">
        <p className="font-body italic text-parchment-600 text-sm text-center max-w-sm mx-auto leading-relaxed">
          &quot;Die beste gesprekke begin met &#39;n eenvoudige hallo.&quot;
        </p>
      </div>
    </>
  );
}
