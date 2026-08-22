import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark, serious trust/security palette. One accent (teal), used sparingly.
        paper: "#0B0F14",       // page background — deep navy/charcoal
        surface: "#121821",     // card/panel background, one step up from paper
        "surface-raised": "#1A222D", // hover/raised state for surface
        ink: "#EDEFF2",         // primary text — off-white, not pure white
        "ink-muted": "#8B95A3", // secondary text
        line: "#232C38",        // hairline borders on dark surfaces
        trust: "#2FE0C6",       // electric teal accent — the ONE accent color
        "trust-soft": "#0F2A28",
        amber: "#F2A93C",
        "amber-soft": "#2B2214",
        alert: "#FF6259",
        "alert-soft": "#2B1616",
        low: "#8B95A3",
        "low-soft": "#171E27",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      // Single consistent spacing/type scale reused across every page —
      // no page invents its own sizing (Prompt 4 polish requirement).
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.1rem" }],
        sm: ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["1rem", { lineHeight: "1.6rem" }],
        lg: ["1.125rem", { lineHeight: "1.7rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.5rem", { lineHeight: "2.75rem" }],
        "5xl": ["3.25rem", { lineHeight: "3.5rem" }],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(47, 224, 198, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
