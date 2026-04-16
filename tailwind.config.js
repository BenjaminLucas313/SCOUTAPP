/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand palette — dark-first, professional
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#3B5BDB',
          600: '#2F4AC7',
          700: '#2240B5',
          900: '#0A0E1A',
        },
        surface: {
          0:   '#0A0E1A',   // page bg (dark)
          1:   '#111827',   // card
          2:   '#1A2235',   // elevated card
          3:   '#243048',   // hover
        },
        accent: {
          green:  '#22C55E',
          yellow: '#EAB308',
          red:    '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
