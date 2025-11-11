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
        'primary-bg': 'var(--primary-bg)',
        'text-main': 'var(--text-main)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'accent-glow': 'rgb(var(--accent-glow-rgb) / <alpha-value>)',
        'accent-primary-rose': 'rgb(var(--primary-rose-rgb) / <alpha-value>)',
        'primary-rose': 'rgb(var(--primary-rose-rgb) / <alpha-value>)',
        'glass-bg': 'var(--glass-bg)',
        'background-glass': 'var(--glass-bg)', // Added for bg-background-glass class
        'border-glass': 'var(--border-glass)',
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