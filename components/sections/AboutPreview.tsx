import Button from "@/components/ui/Button";

export default function AboutPreview() {
  return (
    <section aria-labelledby="about-heading" className="border-b border-ink-700">
      <div className="container-narrow section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          <div
            className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col items-center gap-5"
            aria-hidden="true"
          >
            <div className="w-28 h-28 rounded-full border-2 border-ink-600 bg-ink-800 flex items-center justify-center text-parchment-600">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-ink-600 to-transparent" />
            <span className="font-serif italic text-2xl text-parchment-600 select-none">E.W.</span>
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-4">
              The writer
            </p>
            <h2
              id="about-heading"
              className="font-serif text-display-sm text-parchment-100 mb-6"
            >
              Writing as a way of thinking.
            </h2>
            <div className="space-y-4 font-body text-parchment-400 text-base leading-relaxed mb-8 max-w-reading">
              <p>
                I'm a writer and reader based somewhere with too many unread books and
                not enough time. This site is an ongoing practice — a place to work
                through ideas slowly, to trace the line between what I've read and
                what I've thought.
              </p>
              <p>
                The name <em className="text-parchment-300">The Commonplace</em> comes
                from the old tradition of keeping a commonplace book: a personal
                anthology of passages, observations, and borrowed thoughts.
              </p>
            </div>
            <Button as="link" href="/about" variant="secondary" size="md">
              Read more about this site
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
