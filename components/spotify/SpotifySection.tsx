import NowPlaying from "./NowPlaying";
import TopTracks from "./TopTracks";
import FollowButton from "./FollowButton";

export default function SpotifySection() {
  return (
    <section aria-labelledby="spotify-heading" className="border-b border-ink-700">
      <div className="container-narrow section-spacing">
        <div className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-sans text-2xs tracking-widest uppercase text-parchment-500">
              Musiek
            </p>
            <h2 id="spotify-heading" className="font-serif text-display-md text-parchment-100">
              Wat ek luister.
            </h2>
            <p className="mt-3 max-w-reading font-body text-sm leading-relaxed text-parchment-500">
              Musiek help my fokus en dryf my aan. Hier is &#39;n venster in my
              luistergeskiedenis.
            </p>
          </div>

          <div className="shrink-0">
            <FollowButton />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <NowPlaying />
          </div>

          <div className="hidden border-r border-ink-600 lg:col-span-1 lg:block" aria-hidden="true" />
          <div className="h-px bg-ink-600 lg:hidden" aria-hidden="true" />

          <div className="lg:col-span-6">
            <TopTracks />
          </div>
        </div>
      </div>
    </section>
  );
}
