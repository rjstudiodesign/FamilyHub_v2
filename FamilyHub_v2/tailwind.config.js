/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      // HIER SAGEN WIR TAILWIND, DASS DIESE FARBNAMEN EXISTIEREN.
      // Tailwind wird nun automatisch bg-*, text-*, border-*, 
      // und hover:bg-* Varianten für sie erstellen.
      colors: {
        'primary-bg': 'var(--background-main)',
        'text-main': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'accent-primary-rose': 'var(--accent-primary-rose)',
        'background-glass': 'var(--background-glass)',
        'border-glass': 'var(--border-glass)',
        'hover-glass': 'var(--hover-glass)', // <--- DER FEHLENDE SCHLÜSSEL
      },
      backgroundImage: {
         'gradient-primary': 'var(--gradient-primary)',
      },
      boxShadow: {
        'glow-rose': 'var(--shadow-glow-rose)',
        'card': 'var(--shadow-card)',
      }
    },
  },
  plugins: [],
}