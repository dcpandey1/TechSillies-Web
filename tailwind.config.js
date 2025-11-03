import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 2.5s infinite linear",
      },
      colors: {
        primary: "#0f2e0e",
        secondary: "#7c9e3f",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },

  plugins: [daisyui],
  daisyui: {
    themes: ["dark"], // Forces dark theme
  },
};
