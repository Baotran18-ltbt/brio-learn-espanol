import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        cream: "#FFF9F4",
        ink: { DEFAULT: "#25212A", soft: "#4A4450", muted: "#6E6773" },
        line: { DEFAULT: "#EFE3D8", strong: "#E2D2C4" },
        brand: { DEFAULT: "#B52B38", dark: "#8C1E2A", soft: "#FBE7E9", tint: "#F3C4C9" },
        accent: { DEFAULT: "#FF914D", dark: "#DB6A24", soft: "#FFEDE1", tint: "#FFD0B0" },
        pastel: {
          rose: "#FDE9EB",
          peach: "#FFEEE2",
          butter: "#FFF4D2",
          sage: "#E4F3E7",
          sky: "#E5F1FA",
          lilac: "#EFE8F9",
        },
        tone: {
          rose: "#D9566A",
          peach: "#E57A3C",
          butter: "#C99A1A",
          sage: "#3E9A5C",
          sky: "#3C86C2",
          lilac: "#7E5DC2",
        },
        success: { DEFAULT: "#2F8F57", dark: "#1F6E41", soft: "#E3F4E9" },
        danger: { DEFAULT: "#D2453A", dark: "#A93127", soft: "#FDE8E5" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem", "3xl": "1.5rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(37,33,42,.04), 0 10px 28px -14px rgba(37,33,42,.16)",
        lift: "0 2px 4px rgba(37,33,42,.05), 0 18px 40px -18px rgba(37,33,42,.22)",
      },
      keyframes: {
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%,60%": { transform: "translateX(-6px)" },
          "40%,80%": { transform: "translateX(6px)" },
        },
        pop: { "0%": { transform: "scale(.96)" }, "60%": { transform: "scale(1.03)" }, "100%": { transform: "scale(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: { shake: "shake .4s ease-in-out", pop: "pop .3s ease-out", float: "float 5s ease-in-out infinite" },
    },
  },
  plugins: [animate],
};
export default config;
