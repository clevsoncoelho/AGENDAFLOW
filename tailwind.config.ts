import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f5f7fb",
          100: "#e9edf5",
          200: "#cfd7e5",
          300: "#aab7cc",
          400: "#7587a3",
          500: "#526682",
          600: "#3d506c",
          700: "#304058",
          800: "#273448",
          900: "#202b3d",
        },
        brand: {
          50: "#eef5ff",
          100: "#d9e8ff",
          200: "#bcd7ff",
          300: "#8fbbff",
          400: "#5b95ff",
          500: "#3574ef",
          600: "#2458d3",
          700: "#2047ac",
          800: "#213d89",
          900: "#20366d",
        },
        mint: {
          50: "#edfdf8",
          100: "#d1faee",
          500: "#23b995",
          600: "#159878",
        },
      },
      boxShadow: {
        soft: "0 14px 45px rgba(32, 54, 109, 0.08)",
        card: "0 2px 15px rgba(32, 54, 109, 0.06)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
