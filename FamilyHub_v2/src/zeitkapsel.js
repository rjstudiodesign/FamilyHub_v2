// src/zeitkapsel.js
// Zeitkapsel-Modul für zeitversetzte Nachrichten

import { 
    db, storage,
    collection, query, orderBy, onSnapshot, addDoc, 
    doc, serverTimestamp, Timestamp, deleteDoc,
    ref, uploadBytesResumable, getDownloadURL
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showButtonSpinner, hideButtonSpinner, showNotification } from './ui.js';
import { Card, EmptyStateCard } from './components/Card.js';

/**
 * Initialisiert die Zeitkapsel-Seite
 */
export function renderZeitkapsel(listeners) {
    // Alte Listener bereinigen
    if (listeners.timeCapsules) listeners.timeCapsules();
    
    const { currentFamilyId, currentUser } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;

    // Event-Listener für Button
    setupEventListeners();
    
    // Zeitkapseln Listener
    const capsulesQuery = query(
        collection(db, 'families', currentFamilyId, 'timeCapsules'),
        orderBy('unlockDate', 'asc')
    );
    
    listeners.timeCapsules = onSnapshot(capsulesQuery, (snapshot) => {
        const container = document.getElementById('zeitkapsel-container');
        if (!container) return;
        
        if (snapshot.empty) {
            container.innerHTML = EmptyStateCard(
                'Noch keine Zeitkapseln',
                'Erstelle deine erste Zeitkapsel mit Nachrichten für die Zukunft!',
                'clock',
                ''
            );
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }
        
        const { membersData } = getCurrentUser();
        if (!membersData) {
            container.innerHTML = '<div class="spinner mx-auto col-span-full"></div>';
            return;
        }
        
        const capsulesHTML = snapshot.docs.map(doc => {
            const capsule = { id: doc.id, ...doc.data() };
            return renderCapsuleCard(capsule, membersData);
        }).join('');
        
        container.innerHTML = capsulesHTML;
        
        // Event-Listener für Lösch-Buttons
        snapshot.docs.forEach(doc => {
            const deleteBtn = document.getElementById(`delete-capsule-${doc.id}`);
            if (deleteBtn) {
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteCapsule(doc.id);
                };
            }
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
    }, (error) => {
        console.error("Fehler beim Laden der Zeitkapseln:", error);
        const container = document.getElementById('zeitkapsel-container');
        if (container) {
            container.innerHTML = '<p class="text-red-500 p-4 col-span-full">Fehler beim Laden der Zeitkapseln.</p>';
        }
    });
}

/**
 * Event-Listener für Buttons einrichten
 */
function setupEventListeners() {
    setTimeout(() => {
        const btnCreate = document.getElementById('btn-create-capsule');
        if (btnCreate) btnCreate.onclick = openCreateCapsuleModal;
    }, 100);
}

/**
 * Rendert eine Zeitkapsel-Karte
 */
function renderCapsuleCard(capsule, membersData) {
    const now = new Date();
    const unlockDate = capsule.unlockDate?.toDate ? capsule.unlockDate.toDate() : new Date(capsule.unlockDate);
    const isLocked = unlockDate > now;
    
    const author = membersData[capsule.authorId];
    const authorName = author?.name || capsule.authorName || 'Unbekannt';
    
    const unlockDateStr = unlockDate.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    if (isLocked) {
        // GESPERRTE KAPSEL
        return renderLockedCapsule(capsule.id, authorName, unlockDateStr, unlockDate);
    } else {
        // OFFENE KAPSEL
        return renderUnlockedCapsule(capsule, authorName, unlockDateStr);
    }
}

/**
 * Rendert eine gesperrte Zeitkapsel
 */
function renderLockedCapsule(capsuleId, authorName, unlockDateStr, unlockDate) {
    const now = new Date();
    const daysUntil = Math.ceil((unlockDate - now) / (1000 * 60 * 60 * 24));
    
    return `
        <div class="glass-premium p-6 rounded-xl relative overflow-hidden group">
            <!-- Locked Icon Overlay -->
            <div class="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div class="text-center">
                    <i data-lucide="lock" class="w-16 h-16 text-primary-rose mx-auto mb-4"></i>
                    <p class="text-white font-bold text-lg mb-2">Versiegelt</p>
                </div>
            </div>
            
            <!-- Content (blurred) -->
            <div class="filter blur-sm pointer-events-none">
                <div class="aspect-video bg-gradient-to-br from-primary-rose/20 to-purple-500/20 rounded-lg mb-4"></div>
                <div class="space-y-2">
                    <div class="h-4 bg-white/10 rounded w-3/4"></div>
                    <div class="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
            </div>
            
            <!-- Info Badge -->
            <div class="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="user" class="w-4 h-4 text-text-secondary"></i>
                    <p class="text-sm text-white font-semibold">${authorName}</p>
                </div>
                <div class="flex items-center gap-2 mb-1">
                    <i data-lucide="calendar" class="w-4 h-4 text-primary-rose"></i>
                    <p class="text-sm text-white">Wird am <span class="font-bold">${unlockDateStr}</span> freigeschaltet</p>
                </div>
                <p class="text-xs text-text-secondary mt-2">
                    Noch ${daysUntil} ${daysUntil === 1 ? 'Tag' : 'Tage'}
                </p>
            </div>
        </div>
    `;
}

/**
 * Rendert eine freigeschaltete Zeitkapsel
 */
function renderUnlockedCapsule(capsule, authorName, unlockDateStr) {
    const createdDate = capsule.createdAt?.toDate ? 
        capsule.createdAt.toDate().toLocaleDateString('de-DE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) : 'Unbekannt';
    
    const imageHTML = capsule.imageURL ? `
        <img src="${capsule.imageURL}" alt="Kapsel Bild" 
             class="w-full aspect-video object-cover rounded-lg mb-4">
    ` : '';
    
    const textHTML = capsule.text ? `
        <p class="text-white whitespace-pre-wrap mb-4">${escapeHTML(capsule.text)}</p>
    ` : '';
    
    return `
        <div class="glass-premium p-6 rounded-xl relative group hover:scale-[1.02] transition-transform">
            <!-- Unlocked Badge -->
            <div class="absolute top-4 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-2">
                <i data-lucide="unlock" class="w-4 h-4"></i>
                <span class="text-xs font-semibold">Geöffnet</span>
            </div>
            
            ${imageHTML}
            ${textHTML}
            
            <!-- Metadata -->
            <div class="border-t border-border-glass pt-4 mt-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <i data-lucide="user" class="w-4 h-4 text-text-secondary"></i>
                        <p class="text-sm text-white font-semibold">${authorName}</p>
                    </div>
                    <button id="delete-capsule-${capsule.id}" 
                            class="icon-button-ghost text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Kapsel löschen">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="flex items-center gap-2 text-xs text-text-secondary">
                    <i data-lucide="clock" class="w-3 h-3"></i>
                    <p>Erstellt am ${createdDate}</p>
                </div>
                <div class="flex items-center gap-2 text-xs text-text-secondary mt-1">
                    <i data-lucide="calendar-check" class="w-3 h-3"></i>
                    <p>Freigeschaltet am ${unlockDateStr}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * HTML escapen
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Modal zum Erstellen einer Zeitkapsel öffnen
 */
function openCreateCapsuleModal() {
    const modalId = 'modal-create-capsule';
    
    // Mindestdatum: morgen
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    const modalContent = `
        <form id="create-capsule-form">
            <h2 class="text-2xl font-bold text-gradient mb-4">Neue Zeitkapsel erstellen</h2>
            <p class="text-sm text-text-secondary mb-6">
                Erstelle eine Nachricht, die erst in der Zukunft sichtbar wird.
            </p>
            
            <div class="space-y-4">
                <div>
                    <label for="capsule-text" class="form-label text-sm text-secondary mb-1 block">
                        Nachricht
                    </label>
                    <textarea id="capsule-text" class="form-input" rows="5" required
                              placeholder="Was möchtest du der Zukunft mitteilen?"></textarea>
                </div>
                
                <div>
                    <label for="capsule-image" class="form-label text-sm text-secondary mb-1 block">
                        Bild (optional)
                    </label>
                    <input type="file" id="capsule-image" class="form-input" 
                           accept="image/*">
                    <p class="text-xs text-text-secondary mt-1">
                        Füge ein Foto oder Bild hinzu, das mit deiner Nachricht freigeschaltet wird
                    </p>
                </div>
                
                <div>
                    <label for="capsule-unlock-date" class="form-label text-sm text-secondary mb-1 block">
                        Freischaltdatum
                    </label>
                    <input type="date" id="capsule-unlock-date" class="form-input" required
                           min="${minDate}">
                    <p class="text-xs text-text-secondary mt-1">
                        Wann soll diese Kapsel geöffnet werden? (Mindestens morgen)
                    </p>
                </div>
                
                <div id="upload-progress-container" class="hidden">
                    <div class="w-full bg-background-glass rounded-full h-2">
                        <div id="upload-progress-bar" class="bg-primary-rose h-2 rounded-full transition-all" style="width: 0%"></div>
                    </div>
                    <p id="upload-progress-text" class="text-sm text-text-secondary mt-2 text-center">0%</p>
                </div>
            </div>
            
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass mt-6">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="capsule-submit-btn" class="cta-primary-glow">
                    <span class="btn-text">Zeitkapsel erstellen</span>
                </button>
            </div>
        </form>
    `;
    
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-lg w-full', padding: 'lg' }), modalId);
    
    document.getElementById('create-capsule-form').onsubmit = handleCapsuleSubmit;
}

/**
 * Zeitkapsel erstellen und speichern
 */
async function handleCapsuleSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('capsule-submit-btn');
    showButtonSpinner(submitBtn);
    
    const text = document.getElementById('capsule-text').value.trim();
    const unlockDateStr = document.getElementById('capsule-unlock-date').value;
    const imageInput = document.getElementById('capsule-image');
    const imageFile = imageInput.files[0];
    
    if (!text || !unlockDateStr) {
        showNotification("Bitte Nachricht und Datum eingeben.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }
    
    // Validierung: Datum muss in der Zukunft liegen
    const unlockDate = new Date(unlockDateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (unlockDate <= now) {
        showNotification("Das Freischaltdatum muss in der Zukunft liegen.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }
    
    try {
        const { currentFamilyId, currentUser, currentUserData } = getCurrentUser();
        
        let imageURL = null;
        
        // Optional: Bild hochladen
        if (imageFile) {
            const progressContainer = document.getElementById('upload-progress-container');
            const progressBar = document.getElementById('upload-progress-bar');
            const progressText = document.getElementById('upload-progress-text');
            progressContainer.classList.remove('hidden');
            
            const timestamp = Date.now();
            const sanitizedFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const storagePath = `timeCapsules/${currentFamilyId}/${timestamp}_${sanitizedFileName}`;
            const storageRef = ref(storage, storagePath);
            
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            
            // Upload mit Progress
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        progressBar.style.width = `${progress}%`;
                        progressText.textContent = `${Math.round(progress)}%`;
                    },
                    (error) => reject(error),
                    async () => {
                        imageURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve();
                    }
                );
            });
        }
        
        // Zeitkapsel in Firestore speichern
        const capsulesCol = collection(db, 'families', currentFamilyId, 'timeCapsules');
        await addDoc(capsulesCol, {
            text: text,
            imageURL: imageURL,
            unlockDate: Timestamp.fromDate(unlockDate),
            authorId: currentUser.uid,
            authorName: currentUserData.name,
            createdAt: serverTimestamp()
        });
        
        showNotification("Zeitkapsel erfolgreich erstellt!", "success");
        closeModal('modal-create-capsule');
        
    } catch (error) {
        console.error("Fehler beim Erstellen der Zeitkapsel:", error);
        showNotification("Fehler beim Speichern der Zeitkapsel.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Zeitkapsel löschen
 */
async function handleDeleteCapsule(capsuleId) {
    if (!confirm("Möchtest du diese Zeitkapsel wirklich löschen?")) return;
    
    try {
        const { currentFamilyId } = getCurrentUser();
        const capsuleRef = doc(db, 'families', currentFamilyId, 'timeCapsules', capsuleId);
        
        await deleteDoc(capsuleRef);
        showNotification("Zeitkapsel gelöscht.", "success");
        
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
        showNotification("Fehler beim Löschen der Zeitkapsel.", "error");
    }
}
