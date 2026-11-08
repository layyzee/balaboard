/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f8fafc',
        'grid-dot': '#cbd5e1',
        pastel: {
          yellow: '#fef08a',
          'yellow-border': '#facc15',
          pink: '#fbcfe8',
          'pink-border': '#f472b6',
          green: '#bbf7d0',
          'green-border': '#4ade80',
          blue: '#bfdbfe',
          'blue-border': '#60a5fa',
          orange: '#fed7aa',
          'orange-border': '#fb923c',
          purple: '#e9d5ff',
          'purple-border': '#c084fc',
        }
      },
      boxShadow: {
        'sticky': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'sticky-drag': '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}
