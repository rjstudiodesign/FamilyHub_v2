// settings.js – Modul für die Einstellungen
import { db, auth, setDoc, doc, getDoc, collection, query, where, getDocs, writeBatch } from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification } from './ui.js';

let settingsUnsubscribe = null;

export function renderSettings(listeners) {
    if (listeners && listeners.settings) {
        listeners.settings();
    }

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
            if (panel.id === `settings-${tabName}`) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        });
        // Desktop-Tabs-Zustand
        desktopTabs.querySelectorAll('button').forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active'); // Sie benötigen eine .active-Klasse für Tabs
            } else {
                btn.classList.remove('active');
            }
        });
        // Mobile-Select-Zustand
        mobileTabs.value = tabName;
    };

    desktopTabs.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            switchTab(e.target.dataset.tab);
        }
    });

    mobileTabs.addEventListener('change', (e) => {
        switchTab(e.target.value);
    });

    // Initialer Zustand
    switchTab('profile');
}

function renderProfileTab(user, userData) {
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    if (nameInput) nameInput.value = userData.name || '';
    if (emailInput) emailInput.value = user.email || '';
}

async function renderFamilyTab(familyId) {
    const listContainer = document.getElementById('family-members-list');
    if (!listContainer) return;

    listContainer.innerHTML = `<div class="spinner"></div>`; // Ladeanzeige

    try {
        const membersRef = collection(db, 'families', familyId, 'members');
        const snapshot = await getDocs(membersRef);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (members.length === 0) {
            listContainer.innerHTML = `<p class="text-text-secondary">Keine Familienmitglieder gefunden.</p>`;
            return;
        }

        listContainer.innerHTML = members.map(member => `
            <div class="flex items-center justify-between p-3 bg-background-glass rounded-lg">
                <div class="flex items-center gap-3">
                    <img src="${member.photoURL || 'https://i.pravatar.cc/40?u=' + member.id}" alt="${member.name}" class="w-10 h-10 rounded-full">
                    <div>
                        <p class="font-semibold">${member.name}</p>
                        <p class="text-sm text-text-secondary">${member.role || 'Mitglied'}</p>
                    </div>
                </div>
                <!-- Hier könnten Aktionen wie "Entfernen" hin -->
            </div>
        `).join('');

    } catch (error) {
        console.error("Fehler beim Laden der Familienmitglieder:", error);
        listContainer.innerHTML = `<p class="text-red-400">Fehler beim Laden der Mitglieder.</p>`;
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const { currentUser, currentFamilyId } = getCurrentUser();
    const newName = document.getElementById('profile-name').value;

    if (!currentUser || !currentFamilyId) {
        showNotification("Nicht angemeldet.", "error");
        return;
    }

    try {
        // Update in /users/{uid}
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, { name: newName });

        // Update in /families/{fid}/members/{uid}
        const memberDocRef = doc(db, 'families', currentFamilyId, 'members', currentUser.uid);
        await updateDoc(memberDocRef, { name: newName });

        showNotification("Profil aktualisiert!", "success");
        // Optional: Lokale Daten aktualisieren
        getCurrentUser().currentUserData.name = newName;

    } catch (error) {
        console.error("Fehler beim Profil-Update:", error);
        showNotification("Fehler beim Speichern.", "error");
    }
}

async function handleInvite(e) {
    e.preventDefault();
    const email = document.getElementById('invite-email').value;
    const { currentFamilyId } = getCurrentUser();

    if (!email || !currentFamilyId) {
        showNotification("E-Mail und Familien-ID benötigt.", "error");
        return;
    }

    try {
        // Dies ist eine vereinfachte Logik.
        // In einer echten App würde man hier eine Cloud Function aufrufen,
        // die eine E-Mail sendet und die Einladung sicher verwaltet.
        const invitesRef = collection(db, 'invites');
        await addDoc(invitesRef, {
            familyId: currentFamilyId,
            email: email,
            status: 'pending',
            createdAt: serverTimestamp()
        });

        showNotification(`Einladung an ${email} gesendet!`, "success");
        document.getElementById('invite-form').reset();

    } catch (error) {
        console.error("Fehler beim Senden der Einladung:", error);
        showNotification("Fehler beim Senden der Einladung.", "error");
    }
}
