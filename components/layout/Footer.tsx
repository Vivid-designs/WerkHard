import Link from "next/link";
import { footerNav, socialLinks } from "@/lib/placeholder-data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-700 bg-ink-950 mt-auto">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-serif text-base text-parchment-100 hover:text-white transition-colors duration-200"
            >
              The Commonplace
            </Link>
            <p className="mt-3 font-body text-sm text-parchment-500 leading-relaxed max-w-xs">
              Essays and reflections on writing, reading, and the art of paying attention.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-4">
              Navigate
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerNav.map((item) => (
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

          <div>
            <h4 className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-4">
              Find me elsewhere
            </h4>
            <ul className="flex flex-col gap-2.5">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-parchment-400 hover:text-rose transition-colors duration-200"
                  >
                    {link.label}
                    <span className="ml-1 text-parchment-600 text-xs" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-parchment-600">
            © {year} The Commonplace. All rights reserved.
          </p>
          <p className="font-sans text-xs text-parchment-600">
            Written and maintained with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
