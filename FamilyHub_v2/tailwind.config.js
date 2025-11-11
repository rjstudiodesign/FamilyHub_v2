/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      // KORREKTUR:
      // Diese Namen (z.B. 'primary-bg') werden zu Tailwind-Klassen (z.B. bg-primary-bg).
      // Sie müssen auf die CSS-Variablen verweisen, die in input.css definiert sind.
      colors: {
        'primary-bg': 'rgb(var(--primary-bg) / <alpha-value>)',
        'text-main': 'rgb(var(--text-main) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--text-tertiary) / <alpha-value>)',
        'accent-glow': 'rgb(var(--accent-glow) / <alpha-value>)',
        'primary-rose': 'rgb(var(--accent-glow) / <alpha-value>)',
        'accent-primary-rose': 'rgb(var(--accent-glow) / <alpha-value>)',
        'glass-bg': 'rgb(var(--glass-bg) / <alpha-value>)',
        'border-glass': 'rgb(var(--border-glass) / <alpha-value>)',
      },
      boxShadow: {
        'glow': 'var(--shadow-glow)', // Korrigiert von 'glow-rose'
        'glow-hover': 'var(--shadow-glow-hover)',
      },
      borderRadius: {
        'container': 'var(--radius-container)',
        'btn': 'var(--radius-btn)',
      }
    },
  },
  plugins: [],
}