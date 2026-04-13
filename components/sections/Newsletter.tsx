"use client";

import { useState, type FormEvent } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    // Future: POST /api/newsletter → supabase.from('subscribers').insert({ email })
    await new Promise((r) => setTimeout(r, 800));

    setStatus("success");
    setMessage("Jy is op die lys. Dankie.");
    setEmail("");
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="reveal"
      style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "5rem 3rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* Left: heading */}
        <div>
          <p className="mono-label" style={{ marginBottom: "0.75rem" }}>
            No. 04 — Bly in kontak
          </p>
          <h2
            id="newsletter-heading"
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              lineHeight: 1.15,
              color: "var(--text)",
              marginBottom: "1rem",
            }}
          >
            Nuwe essays,
            <br />
            <em>af en toe.</em>
          </h2>
          <p
            style={{
              fontFamily: "var(--body)",
              fontSize: "0.9rem",
              lineHeight: 1.8,
              color: "var(--muted)",
              maxWidth: "36ch",
            }}
          >
            Volg my hier as jy af en toe &apos;n email van my af wil ontvang.
            Geen algoritme. Geen skedule.
          </p>
        </div>

        {/* Right: form */}
        <div>
          {status === "success" ? (
            <p
              style={{
                fontFamily: "var(--body)",
                fontSize: "0.95rem",
                color: "var(--sage)",
              }}
            >
              {message}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <label
                htmlFor="newsletter-email"
                className="mono-label"
                style={{ marginBottom: "0.25rem" }}
              >
                E-posadres
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jou@epos.com"
                  required
                  autoComplete="email"
                  style={{
                    flex: 1,
                    background: "var(--bg)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    padding: "0.65rem 1rem",
                    fontFamily: "var(--body)",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--muted)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--sky)",
                    border: "1px solid var(--sky)",
                    background: "transparent",
                    padding: "0.65rem 1.25rem",
                    cursor: status === "loading" ? "wait" : "pointer",
                    opacity: status === "loading" ? 0.6 : 1,
                    transition: "background 0.2s, color 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading") {
                      e.currentTarget.style.background = "var(--sky)";
                      e.currentTarget.style.color = "var(--bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--sky)";
                  }}
                >
                  {status === "loading" ? "Stuur…" : "Teken in"}
                </button>
              </div>

              {status === "error" && (
                <p
                  role="alert"
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: "var(--blush)",
                  }}
                >
                  {message || "Iets het fout gegaan. Probeer asseblief weer."}
                </p>
              )}

              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                Geen spam. Teken enige tyd af.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
