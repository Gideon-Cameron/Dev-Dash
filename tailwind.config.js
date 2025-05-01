/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // ✅ Required for manual class switching
  theme: {
    extend: {},
  },
  plugins: [],
};
