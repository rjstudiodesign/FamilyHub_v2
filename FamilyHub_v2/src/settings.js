// settings.js – Modul für die Einstellungen
import { 
    db, auth, 
    doc, getDoc, collection, query, where, getDocs, writeBatch,
    addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, orderBy, Timestamp 
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
    setupTabs(); // Diese Funktion wird jetzt überarbeitet
    setupGoalsTab(currentFamilyId, listeners);
    setupFamilyTab(currentFamilyId);
    setupChildControlsTab(currentFamilyId); // NEU 

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

// === NEUE, VEREINFACHTE TAB-LOGIK ===
function setupTabs() {
    const navContainer = document.getElementById('settings-nav'); // Ziel: Das neue <nav> Element
    const tabPanels = document.querySelectorAll('.settings-tab-panel');

    if (!navContainer || tabPanels.length === 0) {
        console.error("Architekt: Das neue Einstellungs-Layout (#settings-nav) wurde nicht gefunden.");
        return;
    }

    const switchTab = (tabName) => {
        // 1. Alle Panels ausblenden
        tabPanels.forEach(panel => {
            panel.classList.toggle('hidden', panel.id !== `settings-${tabName}`);
        });
        
        // 2. Alle Buttons de-aktivieren
        navContainer.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });

        // 3. Ziel-Button aktivieren
        const activeButton = navContainer.querySelector(`button[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Lucide-Icons neu initialisieren (wichtig für Ziele-Tab)
        if (tabName === 'goals') {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    };

    // Globaler Klick-Listener für die neue Navigation
    navContainer.addEventListener('click', (e) => {
        const targetButton = e.target.closest('button[data-tab]');
        if (targetButton && !targetButton.disabled) {
            switchTab(targetButton.dataset.tab);
        }
    });

    // Initialer Zustand (Profil als Standard)
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || 'profile';
    switchTab(initialTab);
}
// === ENDE DER NEUEN TAB-LOGIK ===


// --- ZIELE-VERWALTUNG (Unverändert) ---

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

// --- KIND-PROFILE VERWALTUNG ---

function setupFamilyTab(familyId) {
    const addChildBtn = document.getElementById('add-child-profile-btn');
    if (addChildBtn) {
        addChildBtn.onclick = () => openChildProfileModal(familyId);
    }
}

async function openChildProfileModal(familyId) {
    const modalId = 'modal-child-profile';
    
    // Lade alle echten Mitglieder für Eltern-Dropdown
    const membersRef = collection(db, 'families', familyId, 'membersData');
    const snapshot = await getDocs(membersRef);
    const members = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(m => !m.isChildProfile); // Nur echte Mitglieder
    
    const memberOptions = members.map(m => 
        `<option value="${m.id}">${m.name}</option>`
    ).join('');
    
    const modalContent = `
        <div class="modal-content glass-premium max-w-lg w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Neues Kind-Profil erstellen</h2>
            <form id="child-profile-form" class="space-y-4">
                <div>
                    <label for="child-name" class="form-label">Name des Kindes</label>
                    <input type="text" id="child-name" class="form-input" required placeholder="z.B. Max">
                </div>
                <div>
                    <label for="child-birthday" class="form-label">Geburtstag</label>
                    <input type="date" id="child-birthday" class="form-input" required>
                </div>
                <div>
                    <label for="child-parent1" class="form-label">Elternteil 1</label>
                    <select id="child-parent1" class="form-input" required>
                        <option value="">Bitte wählen...</option>
                        ${memberOptions}
                    </select>
                </div>
                <div>
                    <label for="child-parent2" class="form-label">Elternteil 2 (optional)</label>
                    <select id="child-parent2" class="form-input">
                        <option value="">Kein zweiter Elternteil</option>
                        ${memberOptions}
                    </select>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="child-submit-btn" class="cta-primary-glow">
                        <span class="btn-text">Erstellen</span>
                    </button>
                </div>
            </form>
        </div>
    `;
    openModal(modalContent, modalId);

    document.getElementById('child-profile-form').onsubmit = (e) => {
        e.preventDefault();
        handleSaveChildProfile(familyId);
    };
}

async function handleSaveChildProfile(familyId) {
    const submitBtn = document.getElementById('child-submit-btn');
    showButtonSpinner(submitBtn);

    const name = document.getElementById('child-name').value.trim();
    const birthdayStr = document.getElementById('child-birthday').value;
    const parent1 = document.getElementById('child-parent1').value;
    const parent2 = document.getElementById('child-parent2').value;

    if (!name || !birthdayStr || !parent1) {
        showNotification("Name, Geburtstag und Elternteil 1 sind erforderlich.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }

    try {
        // Konvertiere Datum zu Firebase Timestamp
        const birthday = Timestamp.fromDate(new Date(birthdayStr));
        
        const parents = [parent1];
        if (parent2) parents.push(parent2);

        const childData = {
            name: name,
            birthday: birthday,
            parents: parents,
            isChildProfile: true,
            photoURL: 'img/default_avatar.png',
            createdAt: serverTimestamp()
        };

        const membersRef = collection(db, 'families', familyId, 'membersData');
        await addDoc(membersRef, childData);

        showNotification(`Kind-Profil für ${name} erstellt!`, "success");
        closeModal('modal-child-profile');
        renderFamilyTab(familyId); // Liste aktualisieren

    } catch (error) {
        console.error("Fehler beim Erstellen des Kind-Profils:", error);
        showNotification("Fehler beim Erstellen.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

window.deleteChildProfile = async (childId) => {
    if (!confirm("Möchtest du dieses Kind-Profil wirklich löschen?")) return;
    
    const { currentFamilyId } = getCurrentUser();
    const childRef = doc(db, 'families', currentFamilyId, 'membersData', childId);
    
    try {
        await deleteDoc(childRef);
        showNotification("Kind-Profil gelöscht.", "success");
        renderFamilyTab(currentFamilyId);
    } catch (error) {
        console.error("Fehler beim Löschen des Kind-Profils:", error);
        showNotification("Löschen fehlgeschlagen.", "error");
    }
};

// --- BISHERIGE FUNKTIONEN (Unverändert) ---

function renderProfileTab(user, userData) {
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const birthdayInput = document.getElementById('profile-birthday');
    
    if (nameInput) nameInput.value = userData.name || '';
    if (emailInput) emailInput.value = user.email || '';
    
    // Geburtstag von Timestamp zu YYYY-MM-DD konvertieren
    if (birthdayInput && userData.birthday) {
        const date = userData.birthday.toDate ? userData.birthday.toDate() : new Date(userData.birthday);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        birthdayInput.value = `${year}-${month}-${day}`;
    } else if (birthdayInput) {
        birthdayInput.value = '';
    }
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

        // Sortiere: echte Mitglieder zuerst, dann Kind-Profile
        members.sort((a, b) => {
            if (a.isChildProfile && !b.isChildProfile) return 1;
            if (!a.isChildProfile && b.isChildProfile) return -1;
            return 0;
        });

        listContainer.innerHTML = members.map(member => {
            const isChild = member.isChildProfile === true;
            const birthday = member.birthday ? formatBirthday(member.birthday) : null;
            
            return `
                <div class="flex items-center justify-between p-3 bg-background-glass rounded-lg">
                    <div class="flex items-center gap-3">
                        <img src="${member.photoURL || 'img/default_avatar.png'}" alt="${member.name}" class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <div class="flex items-center gap-2">
                                <p class="font-semibold">${member.name}</p>
                                ${isChild ? '<span class="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">Kind</span>' : ''}
                            </div>
                            <p class="text-sm text-text-secondary">${isChild && birthday ? birthday : member.email || ''}</p>
                        </div>
                    </div>
                    ${isChild ? `<button class="icon-button-ghost text-red-500" onclick="window.deleteChildProfile('${member.id}')">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>` : ''}
                </div>
            `;
        }).join('');

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

    } catch (error) {
        console.error("Fehler beim Laden der Familienmitglieder:", error);
        listContainer.innerHTML = `<p class="text-red-400 text-center">Fehler beim Laden der Mitglieder.</p>`;
    }
}

function formatBirthday(birthday) {
    if (!birthday) return '';
    const date = birthday.toDate ? birthday.toDate() : new Date(birthday);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonSpinner(submitBtn);

    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    const newName = document.getElementById('profile-name').value.trim();
    const birthdayStr = document.getElementById('profile-birthday').value;

    if (!currentUser || !currentFamilyId) {
        showNotification("Nicht angemeldet.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }

    // Prüfen ob es Änderungen gibt
    const oldBirthdayStr = currentUserData.birthday 
        ? (() => {
            const date = currentUserData.birthday.toDate ? currentUserData.birthday.toDate() : new Date(currentUserData.birthday);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        })()
        : '';
    
    if (newName === currentUserData.name && birthdayStr === oldBirthdayStr) {
        hideButtonSpinner(submitBtn);
        return; // Keine Änderung
    }

    try {
        const batch = writeBatch(db);
        const updateData = { name: newName };
        
        // Geburtstag zu Firebase Timestamp konvertieren
        if (birthdayStr) {
            updateData.birthday = Timestamp.fromDate(new Date(birthdayStr));
        }
        
        // Update in /users/{uid}
        const userDocRef = doc(db, 'users', currentUser.uid);
        batch.set(userDocRef, updateData, { merge: true });

        // Update in /families/{fid}/membersData/{uid}
        const memberDataDocRef = doc(db, 'families', currentFamilyId, 'membersData', currentUser.uid);
        batch.update(memberDataDocRef, updateData);

        await batch.commit();

        showNotification("Profil aktualisiert!", "success");
        // Lokale Daten aktualisieren
        currentUserData.name = newName;
        if (birthdayStr) {
            currentUserData.birthday = updateData.birthday;
        }
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

// --- KINDERSICHERUNGS-TAB ---

async function setupChildControlsTab(familyId) {
    const container = document.getElementById('child-controls-container');
    if (!container) return;

    try {
        const membersRef = collection(db, 'families', familyId, 'membersData');
        const snapshot = await getDocs(membersRef);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const children = members.filter(m => m.isChildProfile === true);
        const adults = members.filter(m => !m.isChildProfile);

        if (children.length === 0) {
            container.innerHTML = `
                <div class="text-center text-secondary p-8 border-2 border-dashed border-border-glass rounded-lg">
                    <i data-lucide="users" class="w-12 h-12 mx-auto mb-4"></i>
                    <h3 class="font-bold text-lg">Keine Kind-Profile</h3>
                    <p class="text-sm">Erstelle Kind-Profile im Familie-Tab.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        container.innerHTML = children.map(child => {
            const permissions = child.permissions || {};
            
            const adultsHTML = adults.map(adult => {
                const hasPermission = permissions[adult.id]?.canPostAs === true;
                
                return `
                    <label class="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
                        <div class="flex items-center gap-3">
                            <img src="${adult.photoURL || 'img/default_avatar.png'}" 
                                 alt="${adult.name}" 
                                 class="w-10 h-10 rounded-full object-cover">
                            <span class="text-white">${adult.name}</span>
                        </div>
                        <input type="checkbox" 
                               ${hasPermission ? 'checked' : ''}
                               onchange="window.toggleChildPermission('${child.id}', '${adult.id}', this.checked)"
                               class="form-checkbox w-5 h-5 rounded border-border-glass bg-background-glass text-accent-glow focus:ring-accent-glow">
                    </label>
                `;
            }).join('');

            return `
                <div class="glass-list-item p-6 rounded-lg">
                    <div class="flex items-center gap-3 mb-4">
                        <img src="${child.photoURL || 'img/default_avatar.png'}" 
                             alt="${child.name}" 
                             class="w-12 h-12 rounded-full object-cover">
                        <div>
                            <h3 class="font-bold text-white">${child.name}</h3>
                            <p class="text-sm text-secondary">Kind-Profil</p>
                        </div>
                    </div>
                    <div class="border-t border-border-glass pt-4">
                        <p class="text-sm font-semibold text-white mb-3">Darf im Namen von ${child.name} posten:</p>
                        <div class="space-y-2">
                            ${adultsHTML}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (error) {
        console.error("Fehler beim Laden der Kindersicherungs-Einstellungen:", error);
        container.innerHTML = `<p class="text-red-400">Fehler beim Laden.</p>`;
    }
}

window.toggleChildPermission = async (childId, adultId, allowed) => {
    const { currentFamilyId } = getCurrentUser();
    
    try {
        const childRef = doc(db, 'families', currentFamilyId, 'membersData', childId);
        
        await updateDoc(childRef, {
            [`permissions.${adultId}.canPostAs`]: allowed
        });

        showNotification(
            allowed ? "Berechtigung erteilt" : "Berechtigung entzogen", 
            "success"
        );

    } catch (error) {
        console.error("Fehler beim Aktualisieren der Berechtigung:", error);
        showNotification("Fehler beim Speichern.", "error");
    }
};
