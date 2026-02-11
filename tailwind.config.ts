import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // שינוי קטן כאן מ-["class"] ל-"class" ליתר ביטחון
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // הוספנו js, jsx, mdx
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}" // הוספנו גם את lib אם יש שם UI
  ],
  theme: {
    extend: {
      colors: {
        // העלינו את ה-opacity מ-0.1 ל-0.2 כדי שהטקסט לא ייבלע
        fluentGlass: "rgba(255, 255, 255, 0.2)", 
        fluentGlassDark: "rgba(15, 23, 42, 0.8)",
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-rtl")],
};
export default config;
