/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        // Theme-adaptive tokens (values live in app/globals.css)
        bg: 'rgb(var(--bg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)', // fills, borders, glows
        accent2: 'rgb(var(--accent-2) / <alpha-value>)',
        accent3: 'rgb(var(--accent-3) / <alpha-value>)',
        'accent-ink': 'rgb(var(--accent-ink) / <alpha-value>)', // accent-coloured TEXT (AA contrast)
        'on-accent': 'rgb(var(--on-accent) / <alpha-value>)', // text placed on accent fills
        card: 'var(--card)',
        line: 'var(--card-border)',
        // Fixed pastel palette
        pastel: {
          lavender: '#faf5ff',
          purple: '#a78bfa',
          pink: '#f9a8d4',
          blue: '#93c5fd',
          ink: '#3d3d5c',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: 'var(--glow)',
        'glow-lg': 'var(--glow-strong)',
        soft: 'var(--shadow)',
      },
      transitionDuration: {
        theme: '700ms',
      },
    },
  },
  plugins: [],
};
