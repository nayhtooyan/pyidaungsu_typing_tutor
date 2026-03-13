/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#FDF2F8',
          card: '#FFFFFF',
          primary: '#FBCFE8',
          secondary: '#BAE6FD',
          accent: '#C4B5FD',
          text: '#4B5563',
          success: '#86EFAC',
          error: '#FCA5A5'
        }
      },
      fontFamily: {
        sans: ['Pyidaungsu', 'Padauk', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}