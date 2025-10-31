// src/ui.js
/**
 * ui.js - Zentrales Service-Modul für UI-Interaktionen
 * Steuert Modals, Benachrichtigungen und Lade-Spinner.
 */

const modalContainer = document.getElementById('modal-container');

/**
 * Öffnet ein Modal und fügt es in den globalen Container ein.
 * @param {string} contentHTML Der HTML-String für den Modal-Inhalt.
 * @param {string} modalId Die ID für das äußere Modal-Element.
 */
export function openModal(contentHTML, modalId) {
    if (!modalContainer) {
        console.error("Architekt: #modal-container nicht im DOM gefunden!");
        return;
    }

    // Modal-Wrapper erstellen
    const modalWrapper = document.createElement('div');
    modalWrapper.id = modalId;
    modalWrapper.className = 'modal'; //
    modalWrapper.innerHTML = contentHTML;

    // Klick-Handler zum Schließen (auf den Hintergrund)
    modalWrapper.addEventListener('click', (e) => {
        if (e.target === modalWrapper) {
            closeModal(modalId);
        }
    });
    
    // Finde alle "Schließen"-Buttons im Inhalt und füge Handler hinzu
    const closeButtons = modalWrapper.querySelectorAll('[data-action="close-modal"], .btn-secondary');
    closeButtons.forEach(btn => {
        // Wir binden das Schließen an 'Abbrechen'-Buttons oder explizite data-actions
        if (btn.textContent.toLowerCase() === 'abbrechen' || btn.dataset.action === 'close-modal') {
            btn.onclick = (e) => {
                e.preventDefault();
                closeModal(modalId);
            };
        }
    });

    modalContainer.appendChild(modalWrapper);
    
    // Für Animation (Fade-in)
    setTimeout(() => modalWrapper.classList.add('modal-open'), 10);
    
    // Lucide-Icons im neuen Modal rendern
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Schließt ein Modal anhand seiner ID.
 * @param {string} modalId Die ID des zu schließenden Modals.
 */
export function closeModal(modalId = null) {
    let modalToClose;
    
    if (modalId) {
        modalToClose = document.getElementById(modalId);
    } else {
        // Schließe das oberste (zuletzt geöffnete) Modal
        modalToClose = modalContainer.querySelector('.modal:last-child');
    }

    if (modalToClose) {
        modalToClose.classList.remove('modal-open');
        // Warten, bis die CSS-Transition (Fade-out) abgeschlossen ist
        modalToClose.addEventListener('transitionend', () => {
            if (modalToClose) modalToClose.remove();
        }, { once: true });
    }
}

// Globale Funktion zuweisen (wird von altem/HTML-Code noch benötigt)
window.closeModal = closeModal;

/**
 * Zeigt eine globale Benachrichtigung an.
 *
 */
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`; //
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation für das Hineinschieben
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Animation für das Hinausschieben und Entfernen
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('fade-out');
        notification.addEventListener('transitionend', () => notification.remove());
    }, 3000);
}

/**
 * Zeigt einen Spinner in einem Button an.
 *
 */
export function showButtonSpinner(button) {
    button.disabled = true;
    button.classList.add('btn-loading'); //
    
    // Text ausblenden
    const btnText = button.querySelector('.btn-text');
    if (btnText) btnText.style.opacity = '0';
    
    // Spinner einfügen
    const spinner = document.createElement('div');
    spinner.className = 'spinner'; //
    button.appendChild(spinner);
}

/**
 * Versteckt den Spinner und reaktiviert den Button.
 *
 */
export function hideButtonSpinner(button) {
    button.disabled = false;
    button.classList.remove('btn-loading');
    
    // Text einblenden
    const btnText = button.querySelector('.btn-text');
    if (btnText) btnText.style.opacity = '1';
    
    // Spinner entfernen
    const spinner = button.querySelector('.spinner');
    if (spinner) spinner.remove();
}