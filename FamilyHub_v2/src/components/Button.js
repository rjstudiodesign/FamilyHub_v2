
// src/components/Button.js
// KORRIGIERTE VERSION

/**
 * Erstellt einen Filter-Button im 'Sophisticated Glow'-Stil.
 *
 */
export function FilterButton(filter, label, active = false) {
  // Nutzt die 'btn-filter'-Klasse, die in input.css definiert ist
  //
  return `
    <button 
      class="btn-filter ${active ? 'active' : ''}" 
      data-filter="${filter}">
      ${label}
    </button>
  `;
}

/**
 * Platzhalter für Standard-Buttons (falls benötigt).
 *
 */
export function Button({ label, className = '' }) {
  // Nutzt die 'btn-secondary'-Klasse als Standard
  //
  return `
    <button class="btn-secondary ${className}">
      ${label}
    </button>
  `;
}
