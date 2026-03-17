import { type ReactNode } from "react";

// ── Instagram placeholder ──────────────────────────────────────────────
// When you have the real Instagram URL, replace the INSTAGRAM_URL value below.
// Search for "INSTAGRAM_PLACEHOLDER" in this file to find it quickly.
const INSTAGRAM_URL: string | null = null; // INSTAGRAM_PLACEHOLDER — add real URL here

interface SocialEntry {
  label: string;
  handle: string;
  description: string;
  href: string | null;
  accent: string;
  icon: ReactNode;
  disabled?: boolean;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 0C5.374 0 0 5.373 0 12c0 2.116.554 4.103 1.523 5.824L.054 23.447a.75.75 0 0 0 .918.918l5.733-1.493A11.951 11.951 0 0 0 12.004 24C18.63 24 24 18.626 24 12S18.63 0 12.004 0zm0 21.818a9.814 9.814 0 0 1-5.027-1.381l-.36-.214-3.733.972.999-3.64-.236-.374A9.808 9.808 0 0 1 2.182 12c0-5.42 4.403-9.818 9.822-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.415-4.398 9.818-9.818 9.818z" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const socialEntries: SocialEntry[] = [
  {
    label: "WhatsApp",
    handle: "+27 83 603 2921",
    description: "Stuur my 'n boodskap direk.",
    href: "https://wa.me/27836032921",
    accent: "text-sage border-sage/25 bg-sage/8 hover:bg-sage/15 hover:border-sage/40",
    icon: <WhatsAppIcon />,
  },
  {
    label: "Spotify",
    handle: "Volg my op Spotify",
    description: "Kyk wat ek luister.",
    href: process.env.NEXT_PUBLIC_SPOTIFY_PROFILE_URL ?? "https://open.spotify.com",
    accent: "text-powder border-powder/25 bg-powder/8 hover:bg-powder/15 hover:border-powder/40",
    icon: <SpotifyIcon />,
  },
  {
    label: "X (Twitter)",
    handle: "@Werk__Hard",
    description: "Volg my vir gedagtes en opdaterings.",
    href: "https://x.com/Werk__Hard",
    accent: "text-parchment-300 border-ink-500 bg-ink-800 hover:bg-ink-700 hover:border-ink-400",
    icon: <XIcon />,
  },
  {
    label: "Instagram",
    handle: "@spencesa",
    description: "Binnekort beskikbaar.",
    href: INSTAGRAM_URL,
    accent: "text-rose border-rose/25 bg-rose/8 hover:bg-rose/15 hover:border-rose/40",
    icon: <InstagramIcon />,
    disabled: INSTAGRAM_URL === null,
  },
];

export default function SocialLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {socialEntries.map((entry, i) => {
        const delays = ["delay-100", "delay-200", "delay-300", "delay-400"];
        const delay = delays[i % delays.length];

        const inner = (
          <div
            className={[
              "flex items-center gap-4 p-5 rounded-lg border",
              "transition-all duration-200 ease-gentle",
              entry.disabled
                ? "opacity-40 cursor-not-allowed border-ink-600 bg-ink-800"
                : entry.accent,
            ].join(" ")}
          >
            <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-current/20 bg-current/10">
              {entry.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-sans text-2xs tracking-widest uppercase text-current/60 mb-0.5">
                {entry.label}
                {entry.disabled && (
                  <span className="ml-2 italic normal-case tracking-normal">— binnekort</span>
                )}
              </p>
              <p className="font-serif text-sm text-parchment-200 truncate">{entry.handle}</p>
              <p className="sr-only">{entry.description}</p>
            </div>

            {!entry.disabled && (
              <span className="shrink-0 text-current/50 text-sm" aria-hidden="true">
                ↗
              </span>
            )}
          </div>
        );

        return (
          <div key={entry.label} className={`animate-fade-up opacity-0 ${delay}`}>
            {entry.disabled || !entry.href ? (
              <div aria-label={`${entry.label} — binnekort beskikbaar`}>{inner}</div>
            ) : (
              <a
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${entry.label}: ${entry.handle}`}
                className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-parchment-500/30 rounded-lg"
              >
                {inner}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
