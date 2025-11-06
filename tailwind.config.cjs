/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#172554',
        accent: '#38bdf8',
        accentSoft: '#bae6fd',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
