"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const publicNavItems = [
  { label: "Tuis",         href: "/" },
  { label: "WerkHard",     href: "/werkhard" },
  { label: "Skrywes",      href: "/skryf" },
  { label: "Fotos",        href: "/fotos" },
  { label: "Oor My",       href: "/about" },
  { label: "Praat Met My", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin, signOut } = useAuth();
  const router = useRouter();

  const navItems = [...publicNavItems, isAdmin
    ? { label: "Dashboard", href: "/dashboard" }
    : { label: "Teken in",  href: "/login" }];

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    router.replace("/");
  };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(8,8,7,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container-wide flex h-16 items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "var(--text)",
            textDecoration: "none",
            letterSpacing: "0.01em",
          }}
        >
          Spencesa.co.za
          <span style={{ color: "var(--lavender)", marginLeft: "0.2em" }}>·</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
            {isAdmin ? (
              <li>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="nav-link"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Meld af
                </button>
              </li>
            ) : null}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          style={{ color: "var(--muted)" }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Maak kieslys toe" : "Maak kieslys oop"}
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-px bg-current transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-current transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg2)" }}
          className="md:hidden px-6 py-4"
        >
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-link"
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
                  className="nav-link"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Meld af
                </button>
              </li>
            ) : null}
          </ul>
        </nav>
      )}
    </header>
  );
}
