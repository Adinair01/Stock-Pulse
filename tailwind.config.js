/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0A0E1A',
        surface: '#141A2E',
        primary: '#00D09C',
        bullish: '#00D09C',
        bearish: '#FF4757',
        neutral: '#FFA502',
        textPrimary: '#FFFFFF',
        textSecondary: '#8B92A8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
