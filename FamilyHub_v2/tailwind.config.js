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
        'accent-glow': 'var(--accent-glow)',
        'accent-primary-rose': 'var(--accent-primary-rose)', // HINZUGEFÜGT
        'glass-bg': 'var(--glass-bg)',
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