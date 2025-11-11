// src/hobbys.js
// Hobbys & Interessen Modul

import { 
    db,
    collection, query, orderBy, onSnapshot, addDoc, 
    doc, updateDoc, serverTimestamp, arrayUnion, arrayRemove, deleteDoc
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showButtonSpinner, hideButtonSpinner, showNotification } from './ui.js';
import { Card, EmptyStateCard } from './components/Card.js';
import { ParticipantCard, ActionButton, escapeHTML } from './components/CommonCards.js';

/**
 * Initialisiert die Hobbys-Seite
 */
export function renderHobbys(listeners) {
    // Alte Listener bereinigen
    if (listeners.hobbies) listeners.hobbies();
    
    const { currentFamilyId, currentUser } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;

    // Event-Listener für Button
    setupEventListeners();
    
    // Hobbys Listener
    const hobbiesQuery = query(
        collection(db, 'families', currentFamilyId, 'hobbies'),
        orderBy('title', 'asc')
    );
    
    listeners.hobbies = onSnapshot(hobbiesQuery, (snapshot) => {
        const container = document.getElementById('hobbys-list-container');
        if (!container) return;
        
        if (snapshot.empty) {
            container.innerHTML = EmptyStateCard(
                'Noch keine Hobbys',
                'Schlage ein gemeinsames Hobby vor und finde Gleichgesinnte in deiner Familie!',
                'gamepad-2',
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
        
        const hobbiesHTML = snapshot.docs.map(doc => {
            const hobby = { id: doc.id, ...doc.data() };
            return renderHobbyCard(hobby, membersData);
        }).join('');
        
        container.innerHTML = hobbiesHTML;
        
        // Event-Listener für Join/Leave-Buttons
        snapshot.docs.forEach(doc => {
            const hobby = { id: doc.id, ...doc.data() };
            const toggleBtn = document.getElementById(`toggle-hobby-${doc.id}`);
            if (toggleBtn) {
                toggleBtn.onclick = () => handleToggleHobbyJoin(doc.id, hobby.participants || []);
            }
            
            // Event-Listener für Lösch-Button (nur für Ersteller)
            const deleteBtn = document.getElementById(`delete-hobby-${doc.id}`);
            if (deleteBtn) {
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    handleDeleteHobby(doc.id);
                };
            }
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
    }, (error) => {
        console.error("Fehler beim Laden der Hobbys:", error);
        const container = document.getElementById('hobbys-list-container');
        if (container) {
            container.innerHTML = '<p class="text-red-500 p-4 col-span-full">Fehler beim Laden der Hobbys.</p>';
        }
    });
}

/**
 * Event-Listener für Buttons einrichten
 */
function setupEventListeners() {
    setTimeout(() => {
        const btnCreate = document.getElementById('btn-create-hobby');
        if (btnCreate) btnCreate.onclick = openCreateHobbyModal;
    }, 100);
}

/**
 * Rendert eine Hobby-Karte
 */
function renderHobbyCard(hobby, membersData) {
    const { currentUser } = getCurrentUser();
    const participants = hobby.participants || [];
    const isParticipant = participants.includes(currentUser.uid);
    const isAuthor = hobby.authorId === currentUser.uid;
    
    // Nutze ParticipantCard Component
    const participantsHTML = ParticipantCard({ participants, membersData });
    
    // Beschreibung
    const descriptionHTML = hobby.description ? `
        <p class="text-sm text-text-secondary mb-4">${escapeHTML(hobby.description)}</p>
    ` : '';
    
    // Button-Text und -Stil
    const buttonVariant = isParticipant ? 'secondary' : 'primary';
    const buttonIcon = isParticipant ? 'log-out' : 'user-plus';
    const buttonText = isParticipant ? 'Verlassen' : 'Beitreten';
    
    // Nutze ActionButton Component
    const actionButton = ActionButton({
        id: `toggle-hobby-${hobby.id}`,
        text: buttonText,
        icon: buttonIcon,
        variant: buttonVariant,
        fullWidth: true
    });
    
    // Lösch-Button (nur für Ersteller)
    const deleteButtonHTML = isAuthor ? `
        <button id="delete-hobby-${hobby.id}" 
                class="icon-button-ghost text-red-500 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hobby löschen">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
    ` : '';
    
    // Hobby-Icon basierend auf Titel
    const hobbyIcon = getHobbyIcon(hobby.title);
    
    return `
        <div class="glass-premium p-6 rounded-xl relative group hover:scale-[1.02] transition-transform">
            ${deleteButtonHTML}
            
            <!-- Icon und Titel -->
            <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-rose/20 to-purple-500/20 flex items-center justify-center">
                    <i data-lucide="${hobbyIcon}" class="w-6 h-6 text-primary-rose"></i>
                </div>
                <h3 class="font-bold text-xl text-white flex-1">${escapeHTML(hobby.title)}</h3>
            </div>
            
            ${descriptionHTML}
            ${participantsHTML}
            
            ${actionButton}
        </div>
    `;
}

/**
 * Gibt ein passendes Icon basierend auf dem Hobby-Titel zurück
 */
function getHobbyIcon(title) {
    const lowerTitle = title.toLowerCase();
    
    // Sport & Bewegung
    if (lowerTitle.includes('sport') || lowerTitle.includes('fitness')) return 'dumbbell';
    if (lowerTitle.includes('lauf') || lowerTitle.includes('joggen')) return 'person-standing';
    if (lowerTitle.includes('wander') || lowerTitle.includes('hiking')) return 'mountain';
    if (lowerTitle.includes('rad') || lowerTitle.includes('bike')) return 'bike';
    if (lowerTitle.includes('schwimm')) return 'waves';
    if (lowerTitle.includes('yoga')) return 'heart';
    
    // Kreatives
    if (lowerTitle.includes('mal') || lowerTitle.includes('zeich')) return 'palette';
    if (lowerTitle.includes('musik') || lowerTitle.includes('gitarre') || lowerTitle.includes('klavier')) return 'music';
    if (lowerTitle.includes('foto')) return 'camera';
    if (lowerTitle.includes('koch') || lowerTitle.includes('back')) return 'chef-hat';
    
    // Spiele & Unterhaltung
    if (lowerTitle.includes('spiel') || lowerTitle.includes('game')) return 'gamepad-2';
    if (lowerTitle.includes('lesen') || lowerTitle.includes('buch')) return 'book';
    if (lowerTitle.includes('film') || lowerTitle.includes('kino')) return 'film';
    
    // Handwerk & Technik
    if (lowerTitle.includes('basteln') || lowerTitle.includes('diy')) return 'wrench';
    if (lowerTitle.includes('garten')) return 'flower-2';
    if (lowerTitle.includes('programmier') || lowerTitle.includes('code')) return 'code';
    
    // Natur & Outdoor
    if (lowerTitle.includes('camping')) return 'tent';
    if (lowerTitle.includes('angel')) return 'fish';
    
    // Standard
    return 'heart';
}

/**
 * Modal zum Erstellen eines Hobbys öffnen
 */
function openCreateHobbyModal() {
    const modalId = 'modal-create-hobby';
    
    const modalContent = `
        <form id="create-hobby-form">
            <h2 class="text-2xl font-bold text-gradient mb-4">Neues Hobby vorschlagen</h2>
            <p class="text-sm text-text-secondary mb-6">
                Schlage ein Hobby oder eine Aktivität vor, die du mit deiner Familie teilen möchtest.
            </p>
            
            <div class="space-y-4">
                <div>
                    <label for="hobby-title" class="form-label text-sm text-secondary mb-1 block">
                        Titel
                    </label>
                    <input type="text" id="hobby-title" class="form-input" required
                           placeholder="z.B. Wandern, Kochen, Gaming">
                </div>
                
                <div>
                    <label for="hobby-description" class="form-label text-sm text-secondary mb-1 block">
                        Beschreibung (optional)
                    </label>
                    <textarea id="hobby-description" class="form-input" rows="3"
                              placeholder="Erzähle mehr über dieses Hobby..."></textarea>
                </div>
            </div>
            
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass mt-6">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="hobby-submit-btn" class="cta-primary-glow">
                    <span class="btn-text">Hobby erstellen</span>
                </button>
            </div>
        </form>
    `;
    
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-lg w-full', padding: 'lg' }), modalId);
    
    document.getElementById('create-hobby-form').onsubmit = handleHobbySubmit;
}

/**
 * Hobby erstellen und speichern
 */
async function handleHobbySubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('hobby-submit-btn');
    showButtonSpinner(submitBtn);
    
    const title = document.getElementById('hobby-title').value.trim();
    const description = document.getElementById('hobby-description').value.trim();
    
    if (!title) {
        showNotification("Bitte einen Titel eingeben.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }
    
    try {
        const { currentFamilyId, currentUser, currentUserData } = getCurrentUser();
        
        // Hobby in Firestore speichern
        const hobbiesCol = collection(db, 'families', currentFamilyId, 'hobbies');
        await addDoc(hobbiesCol, {
            title: title,
            description: description || '',
            authorId: currentUser.uid,
            authorName: currentUserData.name,
            participants: [currentUser.uid], // Ersteller ist automatisch Teilnehmer
            createdAt: serverTimestamp()
        });
        
        showNotification("Hobby erfolgreich erstellt!", "success");
        closeModal('modal-create-hobby');
        
    } catch (error) {
        console.error("Fehler beim Erstellen des Hobbys:", error);
        showNotification("Fehler beim Speichern des Hobbys.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Hobby beitreten oder verlassen
 */
async function handleToggleHobbyJoin(hobbyId, participants) {
    const { currentFamilyId, currentUser } = getCurrentUser();
    const isParticipant = participants.includes(currentUser.uid);
    
    try {
        const hobbyRef = doc(db, 'families', currentFamilyId, 'hobbies', hobbyId);
        
        if (isParticipant) {
            // Verlassen
            await updateDoc(hobbyRef, {
                participants: arrayRemove(currentUser.uid)
            });
            showNotification("Du hast das Hobby verlassen.", "success");
        } else {
            // Beitreten
            await updateDoc(hobbyRef, {
                participants: arrayUnion(currentUser.uid)
            });
            showNotification("Du bist dem Hobby beigetreten!", "success");
        }
        
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Hobbys:", error);
        showNotification("Fehler beim Speichern.", "error");
    }
}

/**
 * Hobby löschen (nur Ersteller)
 */
async function handleDeleteHobby(hobbyId) {
    if (!confirm("Möchtest du dieses Hobby wirklich löschen?")) return;
    
    try {
        const { currentFamilyId } = getCurrentUser();
        const hobbyRef = doc(db, 'families', currentFamilyId, 'hobbies', hobbyId);
        
        await deleteDoc(hobbyRef);
        showNotification("Hobby gelöscht.", "success");
        
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
        showNotification("Fehler beim Löschen des Hobbys.", "error");
    }
}
