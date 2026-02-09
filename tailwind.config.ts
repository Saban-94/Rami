// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // חשוב לבורר העיצוב
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fluentGlass: "rgba(255, 255, 255, 0.1)",
        fluentGlassDark: "rgba(15, 23, 42, 0.7)",
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-rtl")],
};
export default config;
