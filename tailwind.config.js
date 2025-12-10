/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-gold': '#FFD700',
        'emerald-deep': '#0C5E4C',
      },
    },
  },
  plugins: [],
}
