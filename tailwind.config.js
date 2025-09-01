/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#6DB5A6',
        'doc-green': '#e0f2f1',
        'doc-text-primary': '#004d40',
        'doc-text-secondary': '#00796b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"EB Garamond"', 'serif'],
      },
    }
  },
  plugins: [],
}