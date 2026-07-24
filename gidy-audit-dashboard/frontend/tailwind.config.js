/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Clean professional palette: white body, a light lavender
        // wash behind the header + filter zone (marked off from the
        // white table area by a lavender line), and one indigo/violet
        // accent used consistently for anything interactive.
        console: {
          bg: "#fafaff",
          panel: "#ffffff",
          border: "#e7e3f5",
          text: "#241f33",
          muted: "#7a7590",
          lavenderWash: "#f1eefc",
          lavenderLine: "#d6cdf0",
        },
        signal: {
          accent: "#6d5bd0",
          accentDark: "#5a48bd",
          amber: "#d97706",
          red: "#dc2626",
          green: "#16a34a",
        },
      },
      fontFamily: {
        mono: ["'IBM Plex Mono'", "monospace"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
