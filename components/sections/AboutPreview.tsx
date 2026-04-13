import Link from "next/link";

export default function AboutPreview() {
  return (
    <section
      aria-labelledby="about-heading"
      className="reveal"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "80rem",
          margin: "0 auto",
        }}
      >
        {/* Left column — oversized display heading */}
        <div
          style={{
            borderRight: "1px solid var(--border)",
            padding: "5rem 3rem 5rem 3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            className="mono-label"
            style={{ marginBottom: "2rem" }}
          >
            Wie ek is
          </p>

          <div
            id="about-heading"
            style={{ lineHeight: 1 }}
            aria-label="Skrywer. Bouer. Denker."
          >
            {/* "Skrywer." — outline text */}
            <div
              aria-hidden="true"
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 900,
                fontSize: "clamp(3rem, 6vw, 5rem)",
                color: "transparent",
                WebkitTextStroke: "1px var(--text)",
                lineHeight: 1.05,
                display: "block",
              }}
            >
              Skrywer.
            </div>
            {/* "Bouer." — solid sage */}
            <div
              aria-hidden="true"
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 900,
                fontSize: "clamp(3rem, 6vw, 5rem)",
                color: "var(--sage)",
                lineHeight: 1.05,
                display: "block",
              }}
            >
              Bouer.
            </div>
            {/* "Denker." — italic lavender */}
            <div
              aria-hidden="true"
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(3rem, 6vw, 5rem)",
                color: "var(--lavender)",
                lineHeight: 1.05,
                display: "block",
              }}
            >
              Denker.
            </div>
          </div>
        </div>

        {/* Right column — copy + link */}
        <div
          style={{
            padding: "5rem 3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
              fontFamily: "var(--body)",
              fontSize: "0.95rem",
              lineHeight: 1.85,
              color: "var(--muted)",
              maxWidth: "42ch",
              marginBottom: "2.5rem",
            }}
          >
            <p>
              Ek is nuuskierig oor hoe dinge werk — hoe idees vorm kry, hoe mense dink,
              en hoe tegnologie die wêreld om ons verander. Hierdie webwerf is waar ek
              deel wat ek doen en wat ek wil doen.
            </p>
            <p>
              Van sagteware en ingenieurswerk tot kreatiewe projekte en persoonlike groei
              — ek hou daarvan om konsepte in iets werkliks te verander.
            </p>
          </div>

          <Link
            href="/about"
            className="about-cta"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.6rem 1.2rem",
              alignSelf: "flex-start",
              display: "inline-block",
            }}
          >
            Meer oor my →
          </Link>
        </div>
      </div>
    </section>
  );
}
