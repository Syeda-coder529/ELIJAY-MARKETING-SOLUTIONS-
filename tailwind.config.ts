import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      colors: {
        background: "#05070d",
        surface: "#0b0f1a",
        panel: "#0d1220",
        border: "#1b2338",
        muted: "#8b93a7",
        foreground: "#e9ecf5",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#05070d",
        },
        accent: {
          DEFAULT: "#22d3ee",
          foreground: "#05070d",
        },
        gold: {
          DEFAULT: "#eab308",
        },
        success: "#22c55e",
        danger: "#ef4444",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.25), transparent), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(34,211,238,0.12), transparent)",
        "brand-gradient": "linear-gradient(90deg, #3b82f6 0%, #22d3ee 100%)",
        "card-glow":
          "linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(13,18,32,0) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(34,211,238,0.35)",
        "glow-blue": "0 0 40px -10px rgba(59,130,246,0.45)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-live": "pulse-live 1.6s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
