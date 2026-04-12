export default function Hero() {
  return (
    <section
      aria-label="Introduction"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "7rem 3rem 5.5rem",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Ghost text — large transparent outlined word behind content */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-2rem",
          right: "1rem",
          fontFamily: "var(--serif)",
          fontSize: "clamp(10rem, 22vw, 20rem)",
          fontWeight: 900,
          fontStyle: "italic",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.025)",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
          zIndex: 0,
          whiteSpace: "nowrap",
        }}
      >
        DRUKKER
      </span>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "72rem", margin: "0 auto" }}>

        {/* Eyebrow */}
        <div
          className="hero-anim hero-anim-1"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}
        >
          <span
            aria-hidden="true"
            style={{ display: "block", width: "2rem", height: "1px", background: "var(--sage)" }}
          />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.64rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Persoonlike joernaal
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="hero-anim hero-anim-2"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(5rem, 12vw, 11rem)",
            fontWeight: 900,
            fontStyle: "italic",
            lineHeight: 0.87,
            color: "var(--text)",
            marginBottom: "2.5rem",
          }}
        >
          Deel soveel
          <br />
          as moontlik,
          <br />
          <span style={{ color: "var(--butter)" }}>en dink hardop.</span>
        </h1>

        {/* Bottom row */}
        <div
          className="hero-anim hero-anim-3"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          {/* Description */}
          <p
            style={{
              fontFamily: "var(--body)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              color: "var(--muted)",
              maxWidth: "38ch",
            }}
          >
            Hierdie is my plek waar ek soveel as moontlik deel, en soms hardop dink
            — oor tegnologie, dissipline, geloof, en die dinge wat my elke dag aanhou skuif.
          </p>

          {/* Scroll indicator */}
          <div
            aria-hidden="true"
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              paddingBottom: "0.25rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--muted)",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Blaai af
            </span>
            <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
