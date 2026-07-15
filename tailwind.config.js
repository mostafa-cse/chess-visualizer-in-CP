/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boardDark: '#4a3728',
        boardLight: '#c8a97e',
        darkTheme: '#0d0f14',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
