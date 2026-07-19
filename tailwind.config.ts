import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#05050A",
          2: "#0A0A14",
          3: "#111120",
        },
        paper: "#F4F1E8",
        magenta: "#FF2E9A",
        violet: "#7B2FF7",
        acidgreen: "#39FF6A",
        amber: "#FFB627",
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "sans-serif"],
        body: ["var(--font-grotesk)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontWeight: {
        "500": "500",
        "700": "700",
        "900": "900",
      },
      backgroundImage: {
        "blotter-wash":
          "radial-gradient(circle at 20% 20%, rgba(255,46,154,0.35), transparent 40%), radial-gradient(circle at 80% 30%, rgba(123,47,247,0.35), transparent 45%), radial-gradient(circle at 50% 80%, rgba(57,255,106,0.25), transparent 40%)",
        "perf-grid":
          "radial-gradient(circle, rgba(244,241,232,0.18) 1px, transparent 1.5px)",
      },
      backgroundSize: {
        "perf-8": "8px 8px",
        "perf-16": "16px 16px",
      },
      boxShadow: {
        neon: "0 0 20px rgba(255,46,154,0.55), 0 0 60px rgba(123,47,247,0.35)",
        "neon-green": "0 0 20px rgba(57,255,106,0.55)",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        tear: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "100%": { transform: "rotate(-6deg) scale(1.05)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        tear: "tear 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
