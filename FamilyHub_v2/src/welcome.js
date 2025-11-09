// src/welcome.js
import { createLogger } from './utils/logger.js';
import { db, doc, writeBatch, collection } from './firebase.js';
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showButtonSpinner, hideButtonSpinner, showNotification } from './ui.js';
import { navigateTo } from './navigation.js';

const logger = createLogger('Welcome');

/**
 * Öffnet das Modal zur Erstellung einer neuen Familie.
 */
function openCreateFamilyModal() {
    const modalId = 'create-family-modal';
    const modalContent = `
        <form id="create-family-form">
            <h2 class="text-2xl font-bold text-gradient mb-6">Neue Familie gründen</h2>
            <div class="space-y-4">
                <div>
                    <label for="family-name" class="text-sm text-secondary mb-1 block">Name eurer Familie</label>
                    <input type="text" id="family-name" class="form-input" placeholder="z.B. Die Müllers" required />
                </div>
            </div>
            <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="create-family-submit-btn" class="cta-primary-glow">
                  <span class="btn-text">Gründen</span>
                </button>
            </div>
        </form>
    `;
    
    openModal(modalContent, modalId);

    document.getElementById('create-family-form').addEventListener('submit', handleCreateFamilySubmit);
}

/**
 * Verarbeitet die Erstellung der Familie in Firestore.
 */
async function handleCreateFamilySubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('create-family-submit-btn');
    const familyName = document.getElementById('family-name').value.trim();
    const { currentUser, currentUserData } = getCurrentUser();

    if (!familyName) {
        showNotification('Bitte gib einen Familiennamen ein.', 'warning');
        return;
    }
    if (!currentUser || !currentUserData) {
        showNotification('Fehler: Benutzer nicht gefunden.', 'error');
        return;
    }

    showButtonSpinner(submitBtn);

    try {
        const batch = writeBatch(db);

        // 1. Neues Familien-Dokument erstellen
        const newFamilyRef = doc(collection(db, 'families'));
        batch.set(newFamilyRef, {
            name: familyName,
            createdAt: new Date(),
            ownerId: currentUser.uid
        });

        // 2. Benutzer-Dokument mit der neuen familyId aktualisieren
        const userRef = doc(db, 'users', currentUser.uid);
        batch.update(userRef, { familyId: newFamilyRef.id });

        // 3. Benutzer als erstes Mitglied in der Familie anlegen
        const memberRef = doc(db, 'families', newFamilyRef.id, 'membersData', currentUser.uid);
        batch.set(memberRef, {
            name: currentUserData.name,
            role: 'owner',
            joinedAt: new Date()
        });

        await batch.commit();

        showNotification(`Familie "${familyName}" erfolgreich gegründet!`, 'success');
        closeModal('create-family-modal');
        
        // Wichtig: App neu laden, damit die initAuth-Funktion die neue Familie erkennt
        window.location.reload();

    } catch (error) {
        logger.error('Failed to create family', error);
        showNotification('Familie konnte nicht gegründet werden.', 'error');
        hideButtonSpinner(submitBtn);
    }
}


export function renderWelcome() {
    logger.info('Rendering welcome page');
    
    const appContent = document.getElementById('app-content');
    if (appContent) {
        appContent.innerHTML = `
            <div class="page-container text-center py-16">
                <h1 class="text-3xl font-bold text-gradient mb-4">Willkommen bei FamilyHub!</h1>
                <p class="text-secondary mb-8">Du bist noch keiner Familie beigetreten.</p>
                
                <div class="max-w-md mx-auto space-y-4">
                    <button id="create-family-btn" class="cta-primary-glow w-full">Eine neue Familie gründen</button>
                    <button id="join-family-btn" class="btn-secondary w-full">Einer bestehenden Familie beitreten</button>
                </div>
            </div>
        `;

        document.getElementById('create-family-btn').addEventListener('click', openCreateFamilyModal);
        document.getElementById('join-family-btn').addEventListener('click', () => {
            showNotification('Diese Funktion wird bald verfügbar sein!', 'info');
        });
    }
}
