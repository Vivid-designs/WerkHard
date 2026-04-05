import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section aria-label="Introduction" className="relative overflow-hidden border-b border-ink-700">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,160,160,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container-narrow section-spacing">
        <div className="max-w-prose-wide mx-auto text-center">
          <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-8 animate-fade-in">
            Persoonlike joernaal
          </p>

          <h1 className="font-serif text-display-lg text-parchment-100 mb-7 animate-fade-up opacity-0 delay-100">
            Deel soveel as moontlik,
            <br />
            <em className="text-rose">en dink hardop.</em>
          </h1>

          <p className="font-body text-parchment-400 text-base md:text-lg leading-relaxed max-w-reading mx-auto mb-10 animate-fade-up opacity-0 delay-200">
            Hierdie is my plek waar ek soveel as moontlik deel, en soms hardop dink
            — oor tegnologie, dissipline, geloof, en die dinge wat my elke dag aanhou skuif.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-up opacity-0 delay-300">
            <Button as="link" href="/skryf" size="lg" variant="primary">
              Lees die essays
            </Button>
            <Button as="link" href="/about" size="lg" variant="secondary">
              Oor hierdie webwerf
            </Button>
          </div>

          <div className="animate-fade-up opacity-0 delay-400">
            <div className="ornament text-parchment-600 text-xs font-sans tracking-widest uppercase mb-6">
              &amp;
            </div>
            <blockquote className="font-serif italic text-parchment-500 text-sm md:text-base leading-relaxed">
              &ldquo;Dissipline is die brug tussen doelwitte en prestasie.&rdquo;
              <cite className="block not-italic font-sans text-2xs tracking-widest uppercase text-parchment-600 mt-3">
                — Jim Rohn
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
