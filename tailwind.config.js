/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#7CFF01",
        "background-dark": "#0F172A",
        "surface-dark": "#1E293B",
        "card-dark": "rgba(30, 41, 59, 0.7)",
      },
      boxShadow: {
        'neon': '0 0 20px rgba(124, 255, 1, 0.3)',
        'neon-strong': '0 0 30px rgba(124, 255, 1, 0.4)',
      }
    },
  },
  plugins: [],
}