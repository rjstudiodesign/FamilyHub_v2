import { 
    db, collection, query, onSnapshot, doc, 
    updateDoc, arrayUnion, addDoc, serverTimestamp 
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { EmptyStateCard, Card } from './components/Card.js';
import { showNotification, closeModal } from './ui.js'; 
import { render } from './components/index.js'; 

/**
 * Initialisiert die 'Challenges'-Seite.
 */
export function renderChallenges(listeners) {
    const { currentFamilyId, membersData } = getCurrentUser();
    const leaderboardContainer = document.getElementById('leaderboard-container');
    const challengesContainer = document.getElementById('challenges-container');

    if (!leaderboardContainer || !challengesContainer) {
        console.error("Challenges-DOM-Struktur nicht gefunden. `index.html` ist veraltet.");
        return; 
    }
    
    if (!currentFamilyId) {
        leaderboardContainer.innerHTML = EmptyStateCard('Keine Familien-ID', 'Bitte melde dich an, um das Leaderboard zu sehen.', 'award');
        challengesContainer.innerHTML = EmptyStateCard('Keine Familien-ID', 'Bitte melde dich an, um Challenges zu sehen.', 'award');
        return;
    }

    if (!membersData || Object.keys(membersData).length === 0) {
        leaderboardContainer.innerHTML = EmptyStateCard('Keine Familien-Daten', 'Bitte melde dich an oder warte, bis Familieninformationen geladen sind.', 'award');
    } else {
        renderLeaderboard();
    }
    
    renderActiveChallenges(listeners);
}

/**
 * Lädt und rendert die Familien-Rangliste.
 */
function renderLeaderboard() {
    const { membersData } = getCurrentUser();
    const container = document.getElementById('leaderboard-container');
    if (!container) return;

    if (!membersData || Object.keys(membersData).length === 0) {
        container.innerHTML = EmptyStateCard('Keine Familien-Daten', 'Warte, bis die Mitglieder geladen sind.', 'users');
        return;
    }

    const sortedMembers = Object.values(membersData)
        .sort((a, b) => (b.points || 0) - (a.points || 0));

    const leaderboardHTML = sortedMembers.map((member, index) => {
        return `
        <div class="leaderboard-item">
            <span class="leaderboard-rank">${index + 1}</span>
            <img src="${member.photoURL || `https://ui-avatars.com/api/?name=${member.name.charAt(0)}`}" alt="${member.name}" class="leaderboard-avatar">
            <p class="font-semibold text-white">${member.name}</p>
            <div class="leaderboard-points">
                ${member.points || 0} <i data-lucide="sparkles"></i>
            </div>
        </div>
        `;
    }).join('');
    
    render(leaderboardHTML, container); // Nutzt jetzt den echten Renderer
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Lädt aktive Challenges aus Firestore.
 */
function renderActiveChallenges(listeners) {
    const { currentFamilyId } = getCurrentUser();
    const container = document.getElementById('challenges-container');
    if (!container) return; // Sollte durch die Prüfung oben abgedeckt sein

    container.innerHTML = '<div class="spinner mx-auto"></div>'; 

    const challengesQuery = query(
        collection(db, 'families', currentFamilyId, 'familyChallenges')
    );

    listeners.challenges = onSnapshot(challengesQuery, (snapshot) => {
        if (snapshot.empty) {
            const emptyHTML = EmptyStateCard(
                'Keine Challenges aktiv',
                'Erstelle die erste Challenge für deine Familie!',
                'award', // Gültiges Icon
                `<button class="cta-primary-glow" onclick="window.openCreateChallengeModal()">
                    <i data-lucide="plus" class="w-5 h-5 mr-2"></i> Challenge erstellen
                 </button>`
            );
            render(emptyHTML, container); // Nutzt jetzt den echten Renderer
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }
        
        const challengesHTML = snapshot.docs.map(doc => {
            const challenge = { id: doc.id, ...doc.data() };
            return renderChallengeCard(challenge);
        }).join('');
        
        render(challengesHTML, container); // Nutzt jetzt den echten Renderer
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, (error) => {
        console.error("Error loading challenges:", error);
        render("<p class='text-red-500 p-4'>Fehler beim Laden der Challenges.</p>", container);
    });
}

/**
 * NEU: Whitelist für Lucide-Icons, um Datenfehler abzufangen.
 */
const VALID_ICONS = ['award', 'walk', 'run', 'flag', 'trophy', 'star', 'heart', 'check-circle'];
function getValidIcon(iconName) {
    if (iconName && VALID_ICONS.includes(iconName)) {
        return iconName;
    }
    return 'award'; // Standard-Fallback
}

/**
 * Erstellt das HTML für eine einzelne Challenge-Karte.
 */
function renderChallengeCard(challenge) {
    const { currentUser } = getCurrentUser();
    
    let progress = 0;
    let progressText = "0/N.N.";
    let hasJoined = false;

    if (challenge.participants && challenge.participants[currentUser.uid]) {
        hasJoined = true;
        const userData = challenge.participants[currentUser.uid];
        
        if (challenge.target && challenge.target > 0) {
            progress = (userData.current / challenge.target) * 100;
            progressText = `${userData.current} / ${challenge.target} ${challenge.unit || ''}`;
        }
    }

    // NEU: Verwendet die getValidIcon-Funktion
    const icon = getValidIcon(challenge.icon);

    return `
    <div class="challenge-card">
        <div class="challenge-icon">
            <i data-lucide="${icon}"></i>
        </div>
        <div class="flex-1">
            <h4 class="font-semibold text-white">${challenge.title}</h4>
            <p class="text-sm text-secondary">${challenge.description}</p>
            ${hasJoined ? `
                <div class="challenge-progress-bar-bg">
                    <div class="challenge-progress-bar-fg" style="width: ${Math.min(100, progress)}%;"></div>
                </div>
                <p class="text-xs text-secondary mt-1">${progressText}</p>
            ` : ''}
        </div>
        ${!hasJoined ? `
            <button class="cta-primary-glow" onclick="window.joinChallenge('${challenge.id}')">
                Mitmachen
            </button>
        ` : `
            <button class="btn-secondary" onclick="window.updateChallengeProgress('${challenge.id}')">
                Update
            </button>
        `}
    </div>
    `;
}

/**
 * Logik, um einer Challenge beizutreten.
 */
if (!window.joinChallenge) {
    window.joinChallenge = async (challengeId) => {
        const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
        const challengeRef = doc(db, 'families', currentFamilyId, 'familyChallenges', challengeId);
        const userField = `participants.${currentUser.uid}`;

        try {
            await updateDoc(challengeRef, {
                [userField]: {
                    current: 0,
                    name: currentUserData.name
                }
            });
            showNotification("Challenge beigetreten!", "success");
        } catch (error) {
            console.error("Error joining challenge:", error);
            showNotification("Beitritt fehlgeschlagen", "error");
        }
    };
}

/**
 * Logik zum Aktualisieren des Fortschritts.
 */
if (!window.updateChallengeProgress) {
    window.updateChallengeProgress = (challengeId) => {
        const modalContent = `
            <form id="update-progress-form">
                <h2 class="text-2xl font-bold text-gradient mb-4">Fortschritt eintragen</h2>
                <input type="number" id="progress-value" class="form-input" placeholder="Neuer Wert (z.B. 5000)" required>
                <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-border-glass">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Abbrechen</button>
                    <button type="submit" class="cta-primary-glow">Speichern</button>
                </div>
            </form>
        `;
        
        const modalHTML = `
            <div class="modal animate-fade-in" onclick="if(event.target === this) closeModal()">
                ${Card(modalContent, { variant: 'premium', className: 'animate-slide-in-up max-w-md w-full', padding: 'lg' })}
            </div>
        `;
        // HINWEIS: Nutzt das globale modal-container, nicht 'app-content'
        render(modalHTML, document.getElementById('modal-container'));
        if (typeof lucide !== 'undefined') lucide.createIcons();

        document.getElementById('update-progress-form').onsubmit = async (e) => {
            e.preventDefault();
            const value = parseFloat(document.getElementById('progress-value').value);
            if (isNaN(value)) return showNotification("Ungültiger Wert", "warning");

            const { currentUser, currentFamilyId } = getCurrentUser();
            const challengeRef = doc(db, 'families', currentFamilyId, 'familyChallenges', challengeId);
            const userField = `participants.${currentUser.uid}.current`;

            try {
                await updateDoc(challengeRef, {
                    [userField]: value // Setzt den Wert (oder 'increment(value)')
                });
                showNotification("Fortschritt gespeichert!", "success");
                closeModal(); 
            } catch (error) {
                console.error("Error updating progress:", error);
                showNotification("Fehler beim Speichern", "error");
            }
        };
    };
}

/**
 * Logik zum Erstellen einer neuen Challenge.
 */
if (!window.openCreateChallengeModal) {
    window.openCreateChallengeModal = () => {
        const modalContent = `
            <form id="create-challenge-form" class="space-y-4">
                <h2 class="text-2xl font-bold text-gradient mb-6">Neue Challenge erstellen</h2>
                
                <div>
                    <label class="text-sm text-secondary mb-1 block" for="challenge-title">Titel der Challenge</label>
                    <input type="text" id="challenge-title" name="challenge-title" class="form-input" required>
                </div>
                <div>
                    <label class="text-sm text-secondary mb-1 block" for="challenge-desc">Beschreibung</label>
                    <input type="text" id="challenge-desc" name="challenge-desc" class="form-input">
                </div>
                <div>
                    <label class="text-sm text-secondary mb-1 block" for="challenge-icon">Icon (z.B. 'walk', 'star', 'trophy')</label>
                    <input type="text" id="challenge-icon" name="challenge-icon" class="form-input" value="award">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm text-secondary mb-1 block" for="challenge-target">Zielwert (z.B. 10000)</label>
                        <input type="number" id="challenge-target" name="challenge-target" class="form-input" required>
                    </div>
                    <div>
                        <label class="text-sm text-secondary mb-1 block" for="challenge-unit">Einheit (z.B. 'Schritte')</label>
                        <input type="text" id="challenge-unit" name="challenge-unit" class="form-input">
                    </div>
                </div>

                <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-border-glass">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Abbrechen</button>
                    <button type="submit" class="cta-primary-glow">Challenge starten</button>
                </div>
            </form>
        `;
        
        const modalHTML = `
            <div class="modal animate-fade-in" onclick="if(event.target === this) closeModal()">
                ${Card(modalContent, { variant: 'premium', className: 'animate-slide-in-up max-w-lg w-full', padding: 'lg' })}
            </div>
        `;
        render(modalHTML, document.getElementById('modal-container'));
        if (typeof lucide !== 'undefined') lucide.createIcons();

        document.getElementById('create-challenge-form').onsubmit = window.handleCreateChallenge;
    };
}

if (!window.handleCreateChallenge) {
    window.handleCreateChallenge = async (event) => {
        event.preventDefault();
        const { currentFamilyId } = getCurrentUser();

        const newChallenge = {
            title: document.getElementById('challenge-title').value,
            description: document.getElementById('challenge-desc').value,
            icon: document.getElementById('challenge-icon').value || 'award',
            target: parseFloat(document.getElementById('challenge-target').value),
            unit: document.getElementById('challenge-unit').value,
            createdAt: serverTimestamp(),
            status: 'active',
            participants: {} // Leere Map für Teilnehmer
        };

        if (!newChallenge.title || isNaN(newChallenge.target)) {
            return showNotification("Titel und Zielwert sind erforderlich", "warning");
        }
        
        // Prüfen, ob das Icon gültig ist (optional, aber guter Stil)
        if (!VALID_ICONS.includes(newChallenge.icon)) {
            showNotification(`Ungültiges Icon. Wähle eines: ${VALID_ICONS.join(', ')}`, "warning");
            newChallenge.icon = 'award'; // Setze auf Standard
            document.getElementById('challenge-icon').value = 'award';
            return; // Stoppe den Submit, damit der Nutzer korrigieren kann (oder auch nicht, je nach UX-Wunsch)
        }

        try {
            await addDoc(collection(db, 'families', currentFamilyId, 'familyChallenges'), newChallenge);
            showNotification("Challenge erstellt!", "success");
            closeModal(); 
        } catch (error) {
            console.error("Error creating challenge:", error);
            showNotification("Fehler beim Erstellen", "error");
        }
    };
}