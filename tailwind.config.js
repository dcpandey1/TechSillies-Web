import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#af0561",
        secondary: "#004aad",
      },
    },
  },

  plugins: [daisyui],
  daisyui: {
    themes: ["dark"], // Forces dark theme
  },
};
