/**
 * src/components/index.js
 * Zentrales Modul für UI-Rendering-Hilfsfunktionen.
 */

/**
 * Rendert einen HTML-String in einen Container und ersetzt dessen Inhalt.
 */
export function render(htmlString, container) {
    if (container) {
        container.innerHTML = htmlString;
    }
}

/**
 * Hängt einen HTML-String an das Ende eines Containers an.
 */
export function append(htmlString, container) {
    container.insertAdjacentHTML('beforeend', htmlString);
}

// HINWEIS: Card.js, Button.js etc. werden von den Modulen direkt importiert,
// um zirkuläre Abhängigkeiten zu vermeiden, falls diese 'render' benötigen.
