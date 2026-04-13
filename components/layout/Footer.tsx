import type React from "react";
import Link from "next/link";
import { footerNavLinks, footerContentNav } from "@/lib/placeholder-data";

const socialLinks = [
  { label: "X (Twitter)", href: "https://x.com/Werk__Hard",        accent: "var(--blush)" },
  { label: "Instagram",   href: "https://instagram.com/spencesa",   accent: "var(--blush)" },
  { label: "Spotify",     href: "https://open.spotify.com",         accent: "var(--sage)" },
  { label: "Substack",    href: "https://substack.com",             accent: "var(--lavender)" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg2)",
        marginTop: "auto",
      }}
    >
      <div className="container-wide" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>

        {/* CTA strip */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--body)",
              fontStyle: "italic",
              fontSize: "0.9rem",
              color: "var(--muted)",
              lineHeight: 1.7,
            }}
          >
            Volg nuwe skryfwerk op{" "}
            <a
              href="https://substack.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--lavender)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Substack
            </a>{" "}
            — nuwe stukke elke paar weke.
          </p>
          <Link href="/skryf" className="archive-link" style={{ flexShrink: 0 }}>
            Alle skryfwerk →
          </Link>
        </div>

        {/* Divider */}
        <div
          className="ornament"
          aria-hidden="true"
          style={{ margin: "2.5rem 0", fontSize: "0.7rem" }}
        >
          &mdash;
        </div>

        {/* 4-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {/* Col 1 — Brand */}
          <div>
            <Link
              href="/"
              className="hover-lift"
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "var(--text)",
              }}
            >
              Spencesa
            </Link>
            <p
              style={{
                marginTop: "0.75rem",
                fontFamily: "var(--body)",
                fontSize: "0.87rem",
                color: "var(--muted)",
                lineHeight: 1.7,
              }}
            >
              Gedagtes, projekte en lesse — van tegnologie tot persoonlike groei.
            </p>
            <p
              className="mono-label"
              style={{ marginTop: "1rem" }}
            >
              Geskryf in Afrikaans.
            </p>
          </div>

          {/* Col 2 — Navigeer */}
          <div>
            <h4 className="mono-label" style={{ marginBottom: "1rem" }}>Navigeer</h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem", listStyle: "none", padding: 0, margin: 0 }}>
              {footerNavLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover-lift"
                    style={{
                      fontFamily: "var(--body)",
                      fontSize: "0.87rem",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Inhoud */}
          <div>
            <h4 className="mono-label" style={{ marginBottom: "1rem" }}>Inhoud</h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.9rem", listStyle: "none", padding: 0, margin: 0 }}>
              {footerContentNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover-lift"
                    style={{
                      fontFamily: "var(--body)",
                      fontSize: "0.87rem",
                      color: "var(--text)",
                      display: "block",
                    }}
                  >
                    {item.label}
                  </Link>
                  {item.description && (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "0.58rem",
                        letterSpacing: "0.1em",
                        color: "var(--muted)",
                        marginTop: "0.2rem",
                        display: "block",
                      }}
                    >
                      {item.description}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Sosiaal — uses --hover-color CSS var set per-item */}
          <div>
            <h4 className="mono-label" style={{ marginBottom: "1rem" }}>Vind my elders</h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem", listStyle: "none", padding: 0, margin: 0 }}>
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    style={
                      { "--hover-color": link.accent } as React.CSSProperties
                    }
                  >
                    <span style={{ fontFamily: "var(--body)", fontSize: "0.87rem" }}>
                      {link.label}
                    </span>
                    <span aria-hidden="true" style={{ marginLeft: "0.3rem", opacity: 0.4, fontSize: "0.8rem" }}>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <p className="mono-label">© {year} Spencesa. Alle regte voorbehou.</p>
          <p className="mono-label">Geskryf en onderhou met sorg.</p>
        </div>

      </div>
    </footer>
  );
}
