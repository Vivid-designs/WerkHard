"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "WerkHard", href: "/werkhard" },
  { label: "Skryf", href: "/skryf" },
  { label: "Fotos", href: "/fotos" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin, signOut } = useAuth();
  const router = useRouter();

  const navItems = [...publicNavItems, isAdmin
    ? { label: "Dashboard", href: "/dashboard" }
    : { label: "Login", href: "/login" }];

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-700 bg-ink-900/90 backdrop-blur-sm">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg tracking-wide text-parchment-100 hover:text-white transition-colors duration-200"
        >
          Spencesa.co.za
        </Link>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-sans text-xs tracking-widest uppercase text-parchment-400 hover:text-parchment-100 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isAdmin ? (
              <li>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="font-sans text-xs tracking-widest uppercase text-parchment-400 hover:text-parchment-100 transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            ) : null}
          </ul>
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2 text-parchment-400 hover:text-parchment-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-px bg-current transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-current transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-ink-700 bg-ink-800 px-6 py-4"
        >
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-sans text-xs tracking-widest uppercase text-parchment-300 hover:text-parchment-100 transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isAdmin ? (
              <li>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="font-sans text-xs tracking-widest uppercase text-parchment-300 hover:text-parchment-100 transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            ) : null}
          </ul>
        </nav>
      )}
    </header>
  );
}
