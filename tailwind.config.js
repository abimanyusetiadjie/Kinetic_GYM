/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        elevated: 'var(--surface-elevated)',
        'surface-elevated': 'var(--surface-elevated)',
        volt: 'var(--volt)',
        orange: 'var(--orange)',
        cyan: 'var(--cyan)',
        textPrimary: 'var(--text)',
        textMuted: 'var(--muted)',
        border: 'var(--border)',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['var(--font-plus-jakarta)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        volt: '0 0 24px var(--glow-volt, rgba(202, 255, 51, 0.25))',
        cyan: '0 0 24px var(--glow-cyan, rgba(0, 229, 255, 0.25))',
        orange: '0 0 24px var(--glow-orange, rgba(255, 94, 30, 0.25))',
      },
    },
  },
  plugins: [],
};
