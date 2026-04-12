"use client";

const rawItems = [
  { text: "Skrywes",       color: "var(--lavender)" },
  { text: "BJJ",           color: "var(--blush)" },
  { text: "Surf",          color: "var(--sky)" },
  { text: "Ecclesiastes",  color: "var(--butter)" },
  { text: "Cape Town",     color: "var(--muted)" },
  { text: "Nietzsche",     color: "var(--lavender)" },
  { text: "Die Drukker",   color: "var(--text)" },
  { text: "Werk",          color: "var(--sage)" },
  { text: "Dissipline",    color: "var(--blush)" },
  { text: "Stilte",        color: "var(--muted)" },
  { text: "Filosofie",     color: "var(--lavender)" },
  { text: "Oseaan",        color: "var(--sky)" },
];

// Duplicate for seamless infinite loop
const items = [...rawItems, ...rawItems];

export default function Ticker() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "0.6rem 0",
      }}
    >
      {/* Fade left edge */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "6rem",
          background: "linear-gradient(to right, var(--bg), transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Fade right edge */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "6rem",
          background: "linear-gradient(to left, var(--bg), transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Track */}
      <div
        className="ticker-track"
        style={{
          display: "flex",
          width: "max-content",
          animation: "ticker 32s linear infinite",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
        }}
      >
        {items.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.64rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: item.color,
                padding: "0 1.25rem",
                whiteSpace: "nowrap",
              }}
            >
              {item.text}
            </span>
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.5rem",
                color: "var(--muted)",
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
