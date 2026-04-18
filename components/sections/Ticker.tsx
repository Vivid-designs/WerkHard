"use client";

const rawItems = [
  { text: "Skrywes",       color: "#b0a0c4" }, // lavender
  { text: "BJJ",           color: "#c9a0a0" }, // rose
  { text: "Surf",          color: "#9cb0c8" }, // powder
  { text: "Ecclesiastes",  color: "#d4c8a8" }, // cream
  { text: "Cape Town",     color: "#6a6460" }, // parchment-500
  { text: "Nietzsche",     color: "#b0a0c4" }, // lavender
  { text: "Die Drukker",   color: "#e4dfd4" }, // parchment-200
  { text: "Werk",          color: "#9eb8a4" }, // sage
  { text: "Dissipline",    color: "#c9a0a0" }, // rose
  { text: "Stilte",        color: "#6a6460" }, // parchment-500
  { text: "Filosofie",     color: "#b0a0c4" }, // lavender
  { text: "Oseaan",        color: "#9cb0c8" }, // powder
];

// Duplicate for seamless infinite loop
const items = [...rawItems, ...rawItems];

export default function Ticker() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid #222220",
        borderBottom: "1px solid #222220",
        padding: "0.65rem 0",
        background: "#111110",
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
          background: "linear-gradient(to right, #111110, transparent)",
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
          background: "linear-gradient(to left, #111110, transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Track */}
      <div
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
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "0.6rem",
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
                fontSize: "0.5rem",
                color: "#3c3c38",
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
