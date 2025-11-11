/**
 * @module UI
 * @description Zentrales Service-Modul für UI-Interaktionen
 */

const modalContainer = document.getElementById('modal-container');

/**
 * Öffnet ein Modal und fügt es in den globalen Container ein
 * @param {string} contentHTML - Der HTML-String für den Modal-Inhalt
 * @param {string} modalId - Die ID für das äußere Modal-Element
 * @throws {Error} Wenn modal-container nicht im DOM gefunden wird
 * @example
 * openModal('<div>Content</div>', 'my-modal-id');
 */
export function openModal(contentHTML, modalId) {
    if (!modalContainer) {
        console.error("Modal-Container nicht im DOM gefunden!");
        return;
    }

    const modalWrapper = document.createElement('div');
    modalWrapper.id = modalId;
    modalWrapper.className = 'modal';
    modalWrapper.innerHTML = contentHTML;

    modalWrapper.addEventListener('click', (e) => {
        if (e.target === modalWrapper) {
            closeModal(modalId);
        }
    });
    
    const closeButtons = modalWrapper.querySelectorAll('[data-action="close-modal"], .btn-secondary');
    closeButtons.forEach(btn => {
        if (btn.textContent.toLowerCase() === 'abbrechen' || btn.dataset.action === 'close-modal') {
            btn.onclick = (e) => {
                e.preventDefault();
                closeModal(modalId);
            };
        }
    });

    modalContainer.appendChild(modalWrapper);
    setTimeout(() => modalWrapper.classList.add('modal-open'), 10);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Schließt ein Modal anhand seiner ID
 * @param {string|null} modalId - Die ID des zu schließenden Modals (null = oberstes Modal)
 * @example
 * closeModal('my-modal-id'); // Schließt spezifisches Modal
 * closeModal(); // Schließt oberstes Modal
 */
export function closeModal(modalId = null) {
    let modalToClose;
    
    if (modalId) {
        modalToClose = document.getElementById(modalId);
    } else {
        modalToClose = modalContainer.querySelector('.modal:last-child');
    }

    if (modalToClose) {
        modalToClose.classList.remove('modal-open');
        modalToClose.addEventListener('transitionend', () => {
            if (modalToClose) modalToClose.remove();
        }, { once: true });
    }
}

window.closeModal = closeModal;

/**
 * Zeigt eine globale Benachrichtigung an
 * @param {string} message - Die anzuzeigende Nachricht
 * @param {'info'|'success'|'error'|'warning'} type - Der Typ der Benachrichtigung
 * @example
 * showNotification('Erfolgreich gespeichert', 'success');
 * showNotification('Fehler aufgetreten', 'error');
 */
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('fade-out');
        notification.addEventListener('transitionend', () => notification.remove());
    }, 3000);
}

/**
 * Zeigt einen Spinner in einem Button an und deaktiviert ihn
 * @param {HTMLButtonElement} button - Der Button-Element
 * @example
 * const btn = document.querySelector('#save-btn');
 * showButtonSpinner(btn);
 */
export function showButtonSpinner(button) {
    button.disabled = true;
    button.classList.add('btn-loading');
    
    const btnText = button.querySelector('.btn-text');
    if (btnText) btnText.style.opacity = '0';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    button.appendChild(spinner);
}

/**
 * Versteckt den Spinner und reaktiviert den Button
 * @param {HTMLButtonElement} button - Der Button-Element
 * @example
 * const btn = document.querySelector('#save-btn');
 * hideButtonSpinner(btn);
 */
export function hideButtonSpinner(button) {
    button.disabled = false;
    button.classList.remove('btn-loading');
    
    const btnText = button.querySelector('.btn-text');
    if (btnText) btnText.style.opacity = '1';
    
    const spinner = button.querySelector('.spinner');
    if (spinner) spinner.remove();
}
