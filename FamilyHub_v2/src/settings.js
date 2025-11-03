// settings.js – Modul für die Einstellungen
import { 
    db, auth, 
    doc, getDoc, collection, query, where, getDocs, writeBatch,
    addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, orderBy 
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification, openModal, closeModal, showButtonSpinner, hideButtonSpinner } from './ui.js';

let settingsUnsubscribe = null;
let goalsUnsubscribe = null;

export function renderSettings(listeners) {
    // Alte Listener beenden
    if (listeners && listeners.settings) listeners.settings();
    if (listeners && listeners.goals) listeners.goals();

    const settingsContent = document.getElementById('settings-tab-content');
    if (!settingsContent) {
        console.error("Einstellungs-Container nicht gefunden.");
        return;
    }

    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    if (!currentUser || !currentUserData || !currentFamilyId) {
        settingsContent.innerHTML = `<p class="text-text-secondary">Benutzerdaten nicht geladen.</p>`;
        return;
    }

    renderProfileTab(currentUser, currentUserData);
    renderFamilyTab(currentFamilyId);
    setupTabs();
    setupGoalsTab(currentFamilyId, listeners); // NEU

    // Event-Listener für Formulare
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.onsubmit = handleProfileUpdate;
    }

    const inviteForm = document.getElementById('invite-form');
    if(inviteForm) {
        inviteForm.onsubmit = handleInvite;
    }
}

function setupTabs() {
    const desktopTabs = document.getElementById('settings-tabs-desktop');
    const mobileTabs = document.getElementById('settings-tabs-mobile');
    const tabPanels = document.querySelectorAll('.settings-tab-panel');

    const switchTab = (tabName) => {
        tabPanels.forEach(panel => {
            panel.classList.toggle('hidden', panel.id !== `settings-${tabName}`);
        });
        desktopTabs.querySelectorAll('button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        mobileTabs.value = tabName;

        // Wenn der Ziele-Tab aktiv ist, Lucide-Icons neu initialisieren
        if (tabName === 'goals') {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    };

    desktopTabs.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            switchTab(e.target.dataset.tab);
        }
    });

    mobileTabs.addEventListener('change', (e) => {
        switchTab(e.target.value);
    });

    // Initialer Zustand (kann auch ein anderer Tab sein, falls über URL gesteuert)
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || 'profile';
    switchTab(initialTab);
}

// --- ZIELE-VERWALTUNG (NEU) ---

function setupGoalsTab(familyId, listeners) {
    const addGoalBtn = document.getElementById('add-goal-btn');
    if (addGoalBtn) {
        addGoalBtn.onclick = () => openGoalModal(null);
    }

    const goalsQuery = query(collection(db, 'families', familyId, 'familyGoals'), orderBy('createdAt', 'desc'));
    
    listeners.goals = onSnapshot(goalsQuery, (snapshot) => {
        const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderGoalsList(goals);
    }, (error) => {
        console.error("Fehler beim Laden der Ziele:", error);
        const container = document.getElementById('goals-list-container');
        if(container) container.innerHTML = `<p class="text-red-500">Ziele konnten nicht geladen werden.</p>`;
    });
}

function renderGoalsList(goals) {
    const container = document.getElementById('goals-list-container');
    if (!container) return;

    if (goals.length === 0) {
        container.innerHTML = `<div class="text-center text-secondary p-8 border-2 border-dashed border-border-glass rounded-lg">
            <i data-lucide="flag" class="w-12 h-12 mx-auto mb-4"></i>
            <h3 class="font-bold text-lg">Keine Ziele definiert</h3>
            <p class="text-sm">Erstellt euer erstes gemeinsames Familienziel!</p>
        </div>`;
    } else {
        container.innerHTML = goals.map(GoalItemUI).join('');
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function GoalItemUI(goal) {
    const progress = goal.currentValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
    return `
        <div class="glass-list-item p-4 rounded-lg">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-white">${goal.title}</h4>
                    <p class="text-sm text-secondary mb-2">${goal.description || ''}</p>
                </div>
                <div class="flex gap-2">
                    <button class="icon-button-ghost" onclick="window.editGoal('${goal.id}')">
                        <i data-lucide="pencil" class="w-5 h-5"></i>
                    </button>
                    <button class="icon-button-ghost text-red-500" onclick="window.deleteGoal('${goal.id}')">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
            <div class="mt-2">
                <div class="flex justify-between text-sm text-secondary mb-1">
                    <span>${goal.currentValue} ${goal.unit || ''}</span>
                    <span>${goal.targetValue} ${goal.unit || ''}</span>
                </div>
                <div class="goal-progress-bar-bg">
                    <div class="goal-progress-bar-fg" style="width: ${progress}%"></div>
                </div>
            </div>
        </div>
    `;
}

function openGoalModal(goal = null) {
    const modalId = 'modal-goal';
    const isEditing = goal !== null;
    const modalContent = `
        <div class="modal-content glass-premium max-w-lg w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">${isEditing ? 'Ziel bearbeiten' : 'Neues Ziel erstellen'}</h2>
            <form id="goal-form" class="space-y-4">
                <input type="hidden" id="goal-id" value="${isEditing ? goal.id : ''}">
                <div>
                    <label for="goal-title" class="form-label">Titel</label>
                    <input type="text" id="goal-title" class="form-input" required value="${isEditing ? goal.title : ''}">
                </div>
                <div>
                    <label for="goal-description" class="form-label">Beschreibung (optional)</label>
                    <textarea id="goal-description" class="form-input" rows="3">${isEditing ? goal.description || '' : ''}</textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="goal-current" class="form-label">Aktueller Wert</label>
                        <input type="number" id="goal-current" class="form-input" required value="${isEditing ? goal.currentValue : '0'}">
                    </div>
                    <div>
                        <label for="goal-target" class="form-label">Zielwert</label>
                        <input type="number" id="goal-target" class="form-input" required value="${isEditing ? goal.targetValue : ''}">
                    </div>
                </div>
                <div>
                    <label for="goal-unit" class="form-label">Einheit (z.B. €, km, Bücher)</label>
                    <input type="text" id="goal-unit" class="form-input" value="${isEditing ? goal.unit || '' : ''}">
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="goal-submit-btn" class="cta-primary-glow">
                        <span class="btn-text">${isEditing ? 'Speichern' : 'Erstellen'}</span>
                    </button>
                </div>
            </form>
        </div>
    `;
    openModal(modalContent, modalId);

    document.getElementById('goal-form').onsubmit = (e) => {
        e.preventDefault();
        handleSaveGoal();
    };
}

async function handleSaveGoal() {
    const submitBtn = document.getElementById('goal-submit-btn');
    showButtonSpinner(submitBtn);

    const { currentFamilyId } = getCurrentUser();
    const goalId = document.getElementById('goal-id').value;
    const isEditing = !!goalId;

    const goalData = {
        title: document.getElementById('goal-title').value.trim(),
        description: document.getElementById('goal-description').value.trim(),
        currentValue: parseFloat(document.getElementById('goal-current').value) || 0,
        targetValue: parseFloat(document.getElementById('goal-target').value) || 0,
        unit: document.getElementById('goal-unit').value.trim(),
    };

    if (!goalData.title || !goalData.targetValue) {
        showNotification("Titel und Zielwert sind erforderlich.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }

    try {
        if (isEditing) {
            const goalRef = doc(db, 'families', currentFamilyId, 'familyGoals', goalId);
            await updateDoc(goalRef, goalData);
            showNotification("Ziel aktualisiert!", "success");
        } else {
            goalData.createdAt = serverTimestamp();
            const collectionRef = collection(db, 'families', currentFamilyId, 'familyGoals');
            await addDoc(collectionRef, goalData);
            showNotification("Ziel erstellt!", "success");
        }
        closeModal('modal-goal');
    } catch (error) {
        console.error("Fehler beim Speichern des Ziels:", error);
        showNotification("Speichern fehlgeschlagen.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

window.editGoal = async (goalId) => {
    const { currentFamilyId } = getCurrentUser();
    const goalRef = doc(db, 'families', currentFamilyId, 'familyGoals', goalId);
    try {
        const docSnap = await getDoc(goalRef);
        if (docSnap.exists()) {
            openGoalModal({ id: docSnap.id, ...docSnap.data() });
        } else {
            showNotification("Ziel nicht gefunden.", "error");
        }
    } catch (error) {
        showNotification("Fehler beim Laden des Ziels.", "error");
    }
};

window.deleteGoal = async (goalId) => {
    if (!confirm("Möchtest du dieses Ziel wirklich löschen?")) return;
    
    const { currentFamilyId } = getCurrentUser();
    const goalRef = doc(db, 'families', currentFamilyId, 'familyGoals', goalId);
    try {
        await deleteDoc(goalRef);
        showNotification("Ziel gelöscht.", "success");
    } catch (error) {
        console.error("Fehler beim Löschen des Ziels:", error);
        showNotification("Löschen fehlgeschlagen.", "error");
    }
};

// --- BISHERIGE FUNKTIONEN ---

function renderProfileTab(user, userData) {
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    if (nameInput) nameInput.value = userData.name || '';
    if (emailInput) emailInput.value = user.email || '';
}

async function renderFamilyTab(familyId) {
    const listContainer = document.getElementById('family-members-list');
    if (!listContainer) return;

    listContainer.innerHTML = `<div class="flex justify-center items-center p-4"><div class="spinner"></div></div>`;

    try {
        const membersRef = collection(db, 'families', familyId, 'membersData');
        const snapshot = await getDocs(membersRef);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (members.length === 0) {
            listContainer.innerHTML = `<p class="text-text-secondary text-center">Keine Familienmitglieder gefunden.</p>`;
            return;
        }

        listContainer.innerHTML = members.map(member => `
            <div class="flex items-center justify-between p-3 bg-background-glass rounded-lg">
                <div class="flex items-center gap-3">
                    <img src="${member.photoURL || 'img/default_avatar.png'}" alt="${member.name}" class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <p class="font-semibold">${member.name}</p>
                        <p class="text-sm text-text-secondary">${member.email}</p>
                    </div>
                </div>
                <!-- Hier könnten Aktionen wie "Entfernen" hin -->
            </div>
        `).join('');

    } catch (error) {
        console.error("Fehler beim Laden der Familienmitglieder:", error);
        listContainer.innerHTML = `<p class="text-red-400 text-center">Fehler beim Laden der Mitglieder.</p>`;
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonSpinner(submitBtn);

    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    const newName = document.getElementById('profile-name').value.trim();

    if (!currentUser || !currentFamilyId) {
        showNotification("Nicht angemeldet.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }
    if (newName === currentUserData.name) {
        hideButtonSpinner(submitBtn);
        return; // Keine Änderung
    }

    try {
        const batch = writeBatch(db);
        
        // Update in /users/{uid}
        const userDocRef = doc(db, 'users', currentUser.uid);
        batch.update(userDocRef, { name: newName });

        // Update in /families/{fid}/membersData/{uid}
        const memberDataDocRef = doc(db, 'families', currentFamilyId, 'membersData', currentUser.uid);
        batch.update(memberDataDocRef, { name: newName });

        await batch.commit();

        showNotification("Profil aktualisiert!", "success");
        // Lokale Daten aktualisieren
        currentUserData.name = newName;
        renderProfileTab(currentUser, currentUserData); // UI neu rendern

    } catch (error) {
        console.error("Fehler beim Profil-Update:", error);
        showNotification("Fehler beim Speichern.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

async function handleInvite(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonSpinner(submitBtn);

    const email = document.getElementById('invite-email').value.trim();
    const { currentFamilyId, currentUserData } = getCurrentUser();

    if (!email || !currentFamilyId) {
        showNotification("E-Mail und Familien-ID benötigt.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }

    try {
        // Cloud Function würde hier aufgerufen werden
        const invitesRef = collection(db, 'invites');
        await addDoc(invitesRef, {
            familyId: currentFamilyId,
            familyName: currentUserData.familyName, // Annahme, dass dies existiert
            fromName: currentUserData.name,
            toEmail: email,
            status: 'pending',
            createdAt: serverTimestamp()
        });

        showNotification(`Einladung an ${email} gesendet!`, "success");
        document.getElementById('invite-form').reset();

    } catch (error) {
        console.error("Fehler beim Senden der Einladung:", error);
        showNotification("Fehler beim Senden der Einladung.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}
