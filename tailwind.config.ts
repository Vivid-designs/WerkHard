import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy palette — kept for admin/dashboard compatibility
        ink: {
          950: "#0c0c0b",
          900: "#111110",
          800: "#1a1a18",
          700: "#222220",
          600: "#2e2e2b",
          500: "#3c3c38",
        },
        parchment: {
          100: "#f0ece2",
          200: "#e4dfd4",
          300: "#cbc5b8",
          400: "#9a948a",
          500: "#6a6460",
        },
        rose:     { DEFAULT: "#c9a0a0", dark: "#b08888", light: "#dbbcbc" },
        lavender: { DEFAULT: "#c0b2e4", dark: "#9888ae", light: "#c8bbdc" },
        sage:     { DEFAULT: "#9dc6b0", dark: "#87a08d", light: "#b8cebe" },
        peach:    { DEFAULT: "#c8b09c", dark: "#b09880", light: "#dcc8b4" },
        powder:   { DEFAULT: "#9cb0c8", dark: "#8498b0", light: "#b4c8dc" },
        cream:    { DEFAULT: "#d4c8a8", dark: "#bcb090", light: "#e4dac0" },
        // Design system tokens
        butter:   "#e4d186",
        sky:      "#8dbad6",
        blush:    "#e6a698",
      },
      fontFamily: {
        serif: ["var(--serif)", "Georgia", "serif"],
        body:  ["var(--body)",  "Georgia", "serif"],
        sans:  ["var(--mono)",  "Courier", "monospace"],
        mono:  ["var(--mono)",  "Courier", "monospace"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
        "display-xl": ["clamp(5rem, 12vw, 11rem)", { lineHeight: "0.87" }],
        "display-lg": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        "prose-wide": "75ch",
        reading: "65ch",
      },
      // All corners are sharp — no rounded elements
      borderRadius: {
        none:    "0",
        sm:      "0",
        DEFAULT: "0",
        md:      "0",
        lg:      "0",
        xl:      "0",
        "2xl":   "0",
        "3xl":   "0",
        full:    "9999px", // keep for true circles only
      },
      // No box shadows — borders create all structure
      boxShadow: {},
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-up":  "fadeUp 0.6s ease forwards",
        "fade-in":  "fadeIn 0.4s ease forwards",
        "ticker":   "ticker 32s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
