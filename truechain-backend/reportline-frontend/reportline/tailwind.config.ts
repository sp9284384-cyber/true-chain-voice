import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F8F7",
        surface: "#FFFFFF",
        ink: "#14181C",
        "ink-muted": "#5C6570",
        line: "#E1E4E1",
        trust: "#0F7A6C",
        "trust-soft": "#E7F2EF",
        amber: "#B9791E",
        "amber-soft": "#FBF1E2",
        alert: "#C0392B",
        "alert-soft": "#FBEAE8",
        low: "#8A93A0",
        "low-soft": "#EEF0F2",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
