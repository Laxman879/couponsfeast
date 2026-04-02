/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:    'rgb(var(--color-primary) / <alpha-value>)',
        secondary:  'rgb(var(--color-secondary) / <alpha-value>)',
        accent:     'rgb(var(--color-accent) / <alpha-value>)',
        'site-bg':  'rgb(var(--color-bg) / <alpha-value>)',
        'site-text':'rgb(var(--color-text) / <alpha-value>)',
        success:    'rgb(var(--color-success) / <alpha-value>)',
        error:      'rgb(var(--color-error) / <alpha-value>)',
        warning:    'rgb(var(--color-warning) / <alpha-value>)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  corePlugins: {
    preflight: false,
  },
}
