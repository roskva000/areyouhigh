/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A14',
        accent: '#7B61FF',
        background: '#0A0A14',
        surface: '#151520',
        text: '#F0EFF4',
        'text-dark': '#18181B', // Graphite
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        drama: ['"Instrument Serif"', 'serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}

