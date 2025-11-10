// rezepte.js - Modul für Familien-Rezepte
import { 
    db, storage,
    collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDoc,
    serverTimestamp, ref, uploadBytesResumable, getDownloadURL 
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showButtonSpinner, hideButtonSpinner, showNotification } from './ui.js';
import { Card } from './components/Card.js';

export function renderRezepte(listeners) {
    const { currentFamilyId } = getCurrentUser();
    if (!currentFamilyId) {
        console.error("Keine Familien-ID gefunden.");
        return;
    }

    const container = document.getElementById('rezepte-grid-container');
    if (!container) {
        console.error("Rezepte-Container nicht gefunden.");
        return;
    }

    // Button für neues Rezept binden
    const createBtn = document.getElementById('btn-create-rezept');
    if (createBtn) {
        createBtn.onclick = () => openCreateRezeptModal();
    }

    // Echtzeit-Listener für Rezepte einrichten
    const rezepteQuery = query(collection(db, 'families', currentFamilyId, 'recipes'));
    
    listeners.rezepte = onSnapshot(rezepteQuery, (snapshot) => {
        const rezepte = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (rezepte.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center text-secondary p-8 border-2 border-dashed border-border-glass rounded-lg">
                    <i data-lucide="chef-hat" class="w-12 h-12 mx-auto mb-4"></i>
                    <h3 class="font-bold text-lg">Noch keine Rezepte</h3>
                    <p class="text-sm">Erstelle dein erstes Familien-Rezept!</p>
                </div>
            `;
        } else {
            container.innerHTML = rezepte.map(rezept => renderRezeptCard(rezept)).join('');
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, (error) => {
        console.error("Fehler beim Laden der Rezepte:", error);
        container.innerHTML = `<p class="text-red-500 col-span-full">Rezepte konnten nicht geladen werden.</p>`;
    });
}

function renderRezeptCard(rezept) {
    return `
        <div class="rezept-card glass-list-item rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
             onclick="window.openRezeptDetailModal('${rezept.id}')">
            <div class="aspect-video relative overflow-hidden bg-background-glass">
                ${rezept.coverImageURL ? 
                    `<img src="${rezept.coverImageURL}" 
                          alt="${rezept.title}" 
                          class="w-full h-full object-cover"
                          loading="lazy">` 
                    : `<div class="flex items-center justify-center h-full">
                         <i data-lucide="chef-hat" class="w-16 h-16 text-secondary opacity-30"></i>
                       </div>`
                }
            </div>
            <div class="p-4">
                <h3 class="font-bold text-white truncate mb-1">${rezept.title}</h3>
                <p class="text-xs text-secondary">${rezept.authorName || 'Unbekannt'}</p>
            </div>
        </div>
    `;
}

function openCreateRezeptModal() {
    const modalId = 'modal-create-rezept';
    
    const modalContent = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gradient">Neues Rezept</h2>
            <button type="button" class="icon-button-ghost" data-action="close-modal">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>
        <form id="rezept-form" class="space-y-4">
            <div>
                <label for="rezept-title" class="form-label">Titel</label>
                <input type="text" 
                       id="rezept-title" 
                       class="form-input" 
                       required 
                       placeholder="z.B. Omas Apfelkuchen">
            </div>
            <div>
                <label for="rezept-image" class="form-label">Titelbild</label>
                <input type="file" 
                       id="rezept-image" 
                       class="form-input" 
                       accept="image/*">
                <p class="text-xs text-secondary mt-1">Optional - füge ein appetitliches Foto hinzu</p>
            </div>
            <div>
                <label for="rezept-ingredients" class="form-label">Zutaten</label>
                <textarea id="rezept-ingredients" 
                          class="form-input" 
                          rows="6" 
                          required
                          placeholder="Eine Zutat pro Zeile, z.B.&#10;500g Mehl&#10;250g Zucker&#10;3 Eier"></textarea>
            </div>
            <div>
                <label for="rezept-instructions" class="form-label">Anleitung</label>
                <textarea id="rezept-instructions" 
                          class="form-input" 
                          rows="8" 
                          required
                          placeholder="Schritt für Schritt Anleitung..."></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="rezept-submit-btn" class="cta-primary-glow">
                    <span class="btn-text">Rezept speichern</span>
                </button>
            </div>
        </form>
    `;
    
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-2xl w-full max-h-[90vh] overflow-y-auto' }), modalId);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    document.getElementById('rezept-form').onsubmit = handleSaveRezept;
}

async function handleSaveRezept(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('rezept-submit-btn');
    showButtonSpinner(submitBtn);

    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    const title = document.getElementById('rezept-title').value.trim();
    const ingredients = document.getElementById('rezept-ingredients').value.trim();
    const instructions = document.getElementById('rezept-instructions').value.trim();
    const imageFile = document.getElementById('rezept-image').files[0];

    if (!title || !ingredients || !instructions) {
        showNotification("Bitte fülle alle Pflichtfelder aus.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }

    try {
        let coverImageURL = '';

        // Bild hochladen (falls vorhanden)
        if (imageFile) {
            const storageRef = ref(storage, `recipes/${currentFamilyId}/${Date.now()}_${imageFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    null,
                    (error) => reject(error),
                    async () => {
                        coverImageURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve();
                    }
                );
            });
        }

        // Rezept-Dokument erstellen
        const rezeptData = {
            title: title,
            coverImageURL: coverImageURL,
            ingredients: ingredients,
            instructions: instructions,
            authorId: currentUser.uid,
            authorName: currentUserData.name || 'Unbekannt',
            createdAt: serverTimestamp()
        };

        const rezepteRef = collection(db, 'families', currentFamilyId, 'recipes');
        await addDoc(rezepteRef, rezeptData);

        showNotification("Rezept gespeichert!", "success");
        closeModal('modal-create-rezept');

    } catch (error) {
        console.error("Fehler beim Speichern des Rezepts:", error);
        showNotification("Fehler beim Speichern.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

window.openRezeptDetailModal = async (rezeptId) => {
    const { currentFamilyId } = getCurrentUser();
    const modalId = 'modal-rezept-detail';

    try {
        // Lade Rezept-Daten
        const rezeptRef = doc(db, 'families', currentFamilyId, 'recipes', rezeptId);
        const rezeptDoc = await getDoc(rezeptRef);
        
        if (!rezeptDoc.exists()) {
            showNotification("Rezept nicht gefunden.", "error");
            return;
        }

        const rezept = { id: rezeptDoc.id, ...rezeptDoc.data() };
        
        // Formatiere Zutaten als Liste
        const ingredientsList = rezept.ingredients
            .split('\n')
            .filter(line => line.trim())
            .map(ingredient => `<li class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-accent-glow mt-1 flex-shrink-0"></i>
                <span>${ingredient}</span>
            </li>`)
            .join('');

        // Formatiere Anleitung mit Absätzen
        const instructionsHTML = rezept.instructions
            .split('\n')
            .filter(line => line.trim())
            .map(para => `<p class="mb-2">${para}</p>`)
            .join('');

        const modalContent = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gradient">${rezept.title}</h2>
                <div class="flex items-center gap-2">
                    <button type="button" 
                            class="icon-button-ghost text-red-500" 
                            onclick="window.deleteRezept('${rezept.id}')">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                    <button type="button" class="icon-button-ghost" data-action="close-modal">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>

            ${rezept.coverImageURL ? `
                <div class="aspect-video rounded-lg overflow-hidden mb-6 border border-border-glass">
                    <img src="${rezept.coverImageURL}" 
                         alt="${rezept.title}" 
                         class="w-full h-full object-cover">
                </div>
            ` : ''}

            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <i data-lucide="shopping-basket" class="w-5 h-5 text-accent-glow"></i>
                        Zutaten
                    </h3>
                    <ul class="space-y-2 text-white">
                        ${ingredientsList}
                    </ul>
                </div>

                <div class="border-t border-border-glass pt-6">
                    <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <i data-lucide="book-open" class="w-5 h-5 text-accent-glow"></i>
                        Anleitung
                    </h3>
                    <div class="text-white whitespace-pre-wrap">
                        ${instructionsHTML}
                    </div>
                </div>

                <div class="border-t border-border-glass pt-4 text-sm text-secondary">
                    <p>Von ${rezept.authorName} hinzugefügt</p>
                </div>
            </div>
        `;
        
        openModal(Card(modalContent, { variant: 'premium', className: 'max-w-3xl w-full max-h-[90vh] overflow-y-auto' }), modalId);
        if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (error) {
        console.error("Fehler beim Laden des Rezepts:", error);
        showNotification("Fehler beim Laden des Rezepts.", "error");
    }
};

window.deleteRezept = async (rezeptId) => {
    if (!confirm("Möchtest du dieses Rezept wirklich löschen?")) return;

    const { currentFamilyId } = getCurrentUser();
    
    try {
        const rezeptRef = doc(db, 'families', currentFamilyId, 'recipes', rezeptId);
        await deleteDoc(rezeptRef);
        
        showNotification("Rezept gelöscht.", "success");
        closeModal('modal-rezept-detail');

    } catch (error) {
        console.error("Fehler beim Löschen des Rezepts:", error);
        showNotification("Fehler beim Löschen.", "error");
    }
};
