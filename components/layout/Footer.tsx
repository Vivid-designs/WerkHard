import Link from "next/link";
import { footerNavLinks, footerContentNav } from "@/lib/placeholder-data";

const socialLinks = [
  { label: "X (Twitter)", href: "https://x.com/Werk__Hard",        accent: "hover:text-rose" },
  { label: "Instagram",   href: "https://instagram.com/spencesa",   accent: "hover:text-rose" },
  { label: "Spotify",     href: "https://open.spotify.com",         accent: "hover:text-sage" },
  { label: "Substack",    href: "https://substack.com",             accent: "hover:text-lavender" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-700 bg-ink-950 mt-auto">
      <div className="container-wide py-12 md:py-16">

        {/* CTA strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <p className="font-serif italic text-sm text-parchment-400 leading-relaxed">
            Volg nuwe skryfwerk op{" "}
            <a
              href="https://substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-parchment-300 hover:text-parchment-100 underline underline-offset-2 transition-colors duration-200"
            >
              Substack
            </a>{" "}
            — nuwe stukke elke paar weke.
          </p>
          <Link
            href="/skryf"
            className="font-sans text-2xs tracking-widest uppercase text-parchment-500 hover:text-parchment-300 transition-colors duration-200 shrink-0"
          >
            Alle skryfwerk →
          </Link>
        </div>

        {/* Ornament divider */}
        <div className="ornament text-parchment-700 text-xs my-10" aria-hidden="true">
          &mdash;
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1 — Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-lg text-parchment-100 hover:text-white transition-colors duration-200"
            >
              Spencesa
            </Link>
            <p className="mt-3 font-body text-sm text-parchment-500 leading-relaxed">
              Gedagtes, projekte en lesse — van tegnologie tot persoonlike groei.
            </p>
            <p className="mt-4 font-sans text-2xs text-parchment-700 tracking-wide">
              Geskryf en onderhou in Afrikaans.
            </p>
          </div>

          {/* Col 2 — Navigeer */}
          <div>
            <h4 className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-4">
              Navigeer
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerNavLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-parchment-400 hover:text-parchment-200 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Inhoud */}
          <div>
            <h4 className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-4">
              Inhoud
            </h4>
            <ul className="flex flex-col gap-4">
              {footerContentNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-parchment-300 hover:text-sage transition-colors duration-200 block"
                  >
                    {item.label}
                  </Link>
                  {item.description && (
                    <span className="font-sans text-xs text-parchment-600 mt-0.5 block">
                      {item.description}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Sosiaal */}
          <div>
            <h4 className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-4">
              Vind my elders
            </h4>
            <ul className="flex flex-col gap-2.5">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-body text-sm text-parchment-400 transition-colors duration-200 ${link.accent}`}
                  >
                    {link.label}
                    <span className="ml-1 text-parchment-600 text-xs" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="mt-12 pt-6 border-t border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-parchment-600">
            © {year} Spencesa. Alle regte voorbehou.
          </p>
          <p className="font-sans text-xs text-parchment-600">
            Geskryf en onderhou met sorg.
          </p>
        </div>

      </div>
    </footer>
  );
}
