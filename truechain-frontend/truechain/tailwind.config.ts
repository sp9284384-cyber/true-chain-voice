import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070A12",
          900: "#0B0F1A",
          800: "#111827",
          700: "#161F32",
          600: "#1F2A44",
          500: "#2A3752",
        },
        line: {
          DEFAULT: "#1E2740",
          soft: "#161E33",
        },
        signal: {
          teal: "#2DD9C4",
          tealDim: "#1B8F80",
          blue: "#4C8DFF",
        },
        text: {
          primary: "#E9EDF5",
          muted: "#8B96AB",
          faint: "#5B6478",
        },
        status: {
          high: "#F1626B",
          medium: "#E8AF4D",
          low: "#7C8AA3",
          good: "#2DD9C4",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(45, 217, 196, 0.35)",
        glowSm: "0 0 16px -4px rgba(45, 217, 196, 0.45)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, #070A12 90%), linear-gradient(#161E33 1px, transparent 1px), linear-gradient(90deg, #161E33 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "100% 100%, 48px 48px, 48px 48px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 2.8s ease-in-out infinite",
        "chain-rotate": "chainRotate 24s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.35)" },
        },
        chainRotate: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
