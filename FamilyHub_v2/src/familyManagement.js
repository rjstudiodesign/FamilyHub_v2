// familyManagement.js - Eigenständiges Modul für erweiterte Familienverwaltung
// Provides advanced family management capabilities with direct Firebase integration

import { 
    db, auth,
    collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc,
    onSnapshot, serverTimestamp, writeBatch, arrayUnion, arrayRemove, orderBy
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification, openModal, closeModal, showButtonSpinner, hideButtonSpinner } from './ui.js';

/**
 * Renders the advanced family management page
 * This is the main entry point for the standalone family management application
 */
export function renderFamilyManagement(listeners) {
    const container = document.getElementById('app-content');
    if (!container) {
        console.error('App content container not found');
        return;
    }

    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    
    if (!currentUser) {
        container.innerHTML = renderEmptyState('Nicht angemeldet', 'Bitte melde dich an, um Familien zu verwalten.');
        return;
    }

    // Render the family management UI
    container.innerHTML = renderFamilyManagementUI();
    
    // Initialize event listeners and load data
    initializeFamilyManagement(listeners);
}

/**
 * Renders the main UI for family management
 */
function renderFamilyManagementUI() {
    return `
        <div class="max-w-6xl mx-auto space-y-8">
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gradient">Familienverwaltung</h1>
                    <p class="text-secondary mt-2">Verwalte deine Familie mit erweiterten Einstellungen und Bearbeitungsoptionen</p>
                </div>
                <button id="btn-create-family" class="cta-primary-glow">
                    <i data-lucide="users-plus" class="w-5 h-5 mr-2"></i>
                    Neue Familie erstellen
                </button>
            </div>

            <!-- Family Overview Section -->
            <div class="glass-premium p-6 rounded-xl">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <i data-lucide="home" class="w-6 h-6 text-accent-glow"></i>
                        Aktuelle Familie
                    </h2>
                    <button id="btn-edit-family" class="btn-secondary">
                        <i data-lucide="settings" class="w-4 h-4 mr-2"></i>
                        Familie bearbeiten
                    </button>
                </div>
                <div id="current-family-info">
                    <div class="flex justify-center items-center p-8">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>

            <!-- Family Members Section -->
            <div class="glass-premium p-6 rounded-xl">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <i data-lucide="users" class="w-6 h-6 text-accent-glow"></i>
                        Familienmitglieder
                    </h2>
                    <button id="btn-invite-member" class="btn-secondary">
                        <i data-lucide="user-plus" class="w-4 h-4 mr-2"></i>
                        Mitglied einladen
                    </button>
                </div>
                <div id="family-members-list">
                    <div class="flex justify-center items-center p-8">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>

            <!-- Advanced Settings Section -->
            <div class="glass-premium p-6 rounded-xl">
                <h2 class="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <i data-lucide="sliders" class="w-6 h-6 text-accent-glow"></i>
                    Erweiterte Einstellungen
                </h2>
                <div id="advanced-settings-container" class="space-y-4">
                    <!-- Settings will be loaded here -->
                </div>
            </div>

            <!-- Family Statistics Section -->
            <div class="glass-premium p-6 rounded-xl">
                <h2 class="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <i data-lucide="bar-chart-3" class="w-6 h-6 text-accent-glow"></i>
                    Familienstatistiken
                </h2>
                <div id="family-statistics" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Statistics will be loaded here -->
                </div>
            </div>
        </div>
    `;
}

/**
 * Initializes all event listeners and loads data
 */
function initializeFamilyManagement(listeners) {
    const { currentFamilyId } = getCurrentUser();
    
    if (!currentFamilyId) {
        document.getElementById('current-family-info').innerHTML = renderEmptyState(
            'Keine Familie',
            'Du bist noch keiner Familie zugeordnet. Erstelle eine neue Familie oder trete einer bestehenden bei.'
        );
        return;
    }

    // Bind button events
    bindButtonEvents();
    
    // Load current family information
    loadCurrentFamilyInfo(currentFamilyId, listeners);
    
    // Load family members
    loadFamilyMembers(currentFamilyId, listeners);
    
    // Load advanced settings
    loadAdvancedSettings(currentFamilyId);
    
    // Load family statistics
    loadFamilyStatistics(currentFamilyId);
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Binds event listeners to buttons
 */
function bindButtonEvents() {
    const btnCreateFamily = document.getElementById('btn-create-family');
    const btnEditFamily = document.getElementById('btn-edit-family');
    const btnInviteMember = document.getElementById('btn-invite-member');
    
    if (btnCreateFamily) {
        btnCreateFamily.addEventListener('click', openCreateFamilyModal);
    }
    
    if (btnEditFamily) {
        btnEditFamily.addEventListener('click', openEditFamilyModal);
    }
    
    if (btnInviteMember) {
        btnInviteMember.addEventListener('click', openInviteMemberModal);
    }
}

/**
 * Loads current family information with real-time updates
 */
function loadCurrentFamilyInfo(familyId, listeners) {
    const container = document.getElementById('current-family-info');
    
    const familyRef = doc(db, 'families', familyId);
    
    listeners.currentFamily = onSnapshot(familyRef, (docSnap) => {
        if (docSnap.exists()) {
            const familyData = docSnap.data();
            container.innerHTML = renderFamilyInfoCard(familyData, familyId);
            if (typeof lucide !== 'undefined') lucide.createIcons();
        } else {
            container.innerHTML = renderEmptyState('Familie nicht gefunden', 'Die Familie konnte nicht geladen werden.');
        }
    }, (error) => {
        console.error('Error loading family info:', error);
        container.innerHTML = `<p class="text-red-400">Fehler beim Laden der Familieninformationen.</p>`;
    });
}

/**
 * Renders family information card
 */
function renderFamilyInfoCard(familyData, familyId) {
    const createdDate = familyData.createdAt ? new Date(familyData.createdAt.toDate()).toLocaleDateString('de-DE') : 'Unbekannt';
    
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
                <div>
                    <label class="text-sm text-secondary block mb-1">Familienname</label>
                    <p class="text-lg font-semibold text-white">${familyData.name || 'Unbenannt'}</p>
                </div>
                <div>
                    <label class="text-sm text-secondary block mb-1">Erstellt am</label>
                    <p class="text-white">${createdDate}</p>
                </div>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="text-sm text-secondary block mb-1">Familien-ID</label>
                    <div class="flex items-center gap-2">
                        <code class="text-sm text-secondary bg-background-glass px-3 py-1 rounded">${familyId}</code>
                        <button class="btn-icon-ghost" onclick="navigator.clipboard.writeText('${familyId}'); window.showNotification('ID kopiert!', 'success')">
                            <i data-lucide="copy" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="text-sm text-secondary block mb-1">Status</label>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-accent-glow/20 text-accent-glow">
                        <i data-lucide="check-circle" class="w-4 h-4 mr-1"></i>
                        Aktiv
                    </span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Loads family members with real-time updates
 */
function loadFamilyMembers(familyId, listeners) {
    const container = document.getElementById('family-members-list');
    
    const membersRef = collection(db, 'families', familyId, 'membersData');
    const membersQuery = query(membersRef, orderBy('joinedAt', 'asc'));
    
    listeners.familyMembers = onSnapshot(membersQuery, (snapshot) => {
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (members.length === 0) {
            container.innerHTML = renderEmptyState('Keine Mitglieder', 'Lade Mitglieder ein, um deine Familie zu erweitern.');
        } else {
            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${members.map(member => renderMemberCard(member, familyId)).join('')}
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }, (error) => {
        console.error('Error loading family members:', error);
        container.innerHTML = `<p class="text-red-400">Fehler beim Laden der Familienmitglieder.</p>`;
    });
}

/**
 * Renders a member card
 */
function renderMemberCard(member, familyId) {
    const joinedDate = member.joinedAt ? new Date(member.joinedAt.toDate()).toLocaleDateString('de-DE') : 'Unbekannt';
    const avatarUrl = member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'User')}&background=A04668&color=fff`;
    const { currentUser } = getCurrentUser();
    const isCurrentUser = currentUser && currentUser.uid === member.uid;
    const roleClass = member.role === 'Admin' ? 'bg-accent-glow/20 text-accent-glow' : 'bg-gray-500/20 text-gray-400';
    
    return `
        <div class="glass-list-item p-4 rounded-lg hover:scale-[1.02] transition-transform">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                    <img src="${avatarUrl}" alt="${member.name}" class="w-12 h-12 rounded-full object-cover">
                    <div>
                        <p class="font-semibold text-white flex items-center gap-2">
                            ${member.name || 'Unbekannt'}
                            ${isCurrentUser ? '<span class="text-xs text-accent-glow">(Du)</span>' : ''}
                        </p>
                        <p class="text-sm text-secondary">${member.email || ''}</p>
                    </div>
                </div>
                ${!isCurrentUser ? `
                    <button class="btn-icon-ghost" onclick="window.openEditMemberModal('${member.id}', '${familyId}')">
                        <i data-lucide="more-vertical" class="w-4 h-4"></i>
                    </button>
                ` : ''}
            </div>
            <div class="flex items-center justify-between text-sm">
                <span class="inline-flex items-center px-2 py-1 rounded ${roleClass} text-xs font-semibold">
                    ${member.role || 'Mitglied'}
                </span>
                <span class="text-secondary">Beigetreten: ${joinedDate}</span>
            </div>
            ${member.points !== undefined ? `
                <div class="mt-3 pt-3 border-t border-border-glass">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-secondary">Punkte</span>
                        <span class="text-lg font-bold text-accent-glow">${member.points || 0}</span>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Loads advanced settings
 */
function loadAdvancedSettings(familyId) {
    const container = document.getElementById('advanced-settings-container');
    
    container.innerHTML = `
        <div class="space-y-4">
            <!-- Privacy Settings -->
            <div class="toggle-wrapper">
                <div>
                    <p class="font-medium text-white">Familienkalender freigeben</p>
                    <p class="text-sm text-secondary">Erlaubt allen Mitgliedern Termine zu erstellen und zu bearbeiten</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="setting-calendar-sharing" checked>
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="toggle-wrapper">
                <div>
                    <p class="font-medium text-white">Chat-Benachrichtigungen</p>
                    <p class="text-sm text-secondary">Push-Benachrichtigungen für neue Nachrichten</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="setting-chat-notifications" checked>
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="toggle-wrapper">
                <div>
                    <p class="font-medium text-white">Finanz-Tracking aktivieren</p>
                    <p class="text-sm text-secondary">Ermöglicht gemeinsame Ausgabenverwaltung</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="setting-finance-tracking">
                    <span class="slider"></span>
                </label>
            </div>
            
            <!-- Data Management -->
            <div class="pt-4 border-t border-border-glass">
                <h3 class="font-semibold text-white mb-4">Datenverwaltung</h3>
                <div class="flex flex-col sm:flex-row gap-3">
                    <button class="btn-secondary flex-1" onclick="window.exportFamilyData()">
                        <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                        Daten exportieren
                    </button>
                    <button class="btn-secondary flex-1 text-red-400 hover:text-red-300" onclick="window.confirmDeleteFamily()">
                        <i data-lucide="trash-2" class="w-4 h-4 mr-2"></i>
                        Familie löschen
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Bind setting change handlers
    bindSettingsHandlers(familyId);
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Binds handlers for settings changes
 */
function bindSettingsHandlers(familyId) {
    const settings = ['calendar-sharing', 'chat-notifications', 'finance-tracking'];
    
    settings.forEach(settingKey => {
        const checkbox = document.getElementById(`setting-${settingKey}`);
        if (checkbox) {
            checkbox.addEventListener('change', async (e) => {
                await updateFamilySetting(familyId, settingKey, e.target.checked);
            });
        }
    });
}

/**
 * Updates a family setting in Firebase
 */
async function updateFamilySetting(familyId, settingKey, value) {
    try {
        const familyRef = doc(db, 'families', familyId);
        await updateDoc(familyRef, {
            [`settings.${settingKey}`]: value,
            updatedAt: serverTimestamp()
        });
        showNotification('Einstellung gespeichert', 'success');
    } catch (error) {
        console.error('Error updating setting:', error);
        showNotification('Fehler beim Speichern der Einstellung', 'error');
    }
}

/**
 * Loads family statistics
 */
async function loadFamilyStatistics(familyId) {
    const container = document.getElementById('family-statistics');
    
    try {
        // Get member count
        const membersRef = collection(db, 'families', familyId, 'membersData');
        const membersSnap = await getDocs(membersRef);
        const memberCount = membersSnap.size;
        
        // Get post count
        const postsRef = collection(db, 'families', familyId, 'posts');
        const postsSnap = await getDocs(postsRef);
        const postCount = postsSnap.size;
        
        // Get event count
        const eventsRef = collection(db, 'families', familyId, 'events');
        const eventsSnap = await getDocs(eventsRef);
        const eventCount = eventsSnap.size;
        
        container.innerHTML = `
            ${renderStatCard('Mitglieder', memberCount, 'users', 'text-blue-400')}
            ${renderStatCard('Beiträge', postCount, 'message-square', 'text-green-400')}
            ${renderStatCard('Termine', eventCount, 'calendar', 'text-purple-400')}
        `;
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (error) {
        console.error('Error loading statistics:', error);
        container.innerHTML = `<p class="text-red-400">Fehler beim Laden der Statistiken.</p>`;
    }
}

/**
 * Renders a statistics card
 */
function renderStatCard(label, value, icon, colorClass) {
    return `
        <div class="glass-list-item p-4 rounded-lg text-center">
            <i data-lucide="${icon}" class="w-8 h-8 ${colorClass} mx-auto mb-2"></i>
            <p class="text-3xl font-bold text-white mb-1">${value}</p>
            <p class="text-sm text-secondary">${label}</p>
        </div>
    `;
}

/**
 * Opens modal to create a new family
 */
function openCreateFamilyModal() {
    const modalContent = `
        <div class="modal-content glass-premium max-w-md w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Neue Familie erstellen</h2>
            <form id="create-family-form" class="space-y-4">
                <div>
                    <label for="family-name" class="form-label">Familienname</label>
                    <input type="text" id="family-name" class="form-input" required placeholder="z.B. Familie Müller">
                </div>
                <div>
                    <label class="form-label">Information</label>
                    <p class="text-sm text-secondary">Du wirst automatisch als Administrator der neuen Familie hinzugefügt.</p>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="create-family-submit" class="cta-primary-glow">
                        <span class="btn-text">Familie erstellen</span>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    openModal(modalContent, 'modal-create-family');
    
    document.getElementById('create-family-form').addEventListener('submit', handleCreateFamily);
}

/**
 * Handles creating a new family
 */
async function handleCreateFamily(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('create-family-submit');
    showButtonSpinner(submitBtn);
    
    const { currentUser, currentUserData } = getCurrentUser();
    const familyName = document.getElementById('family-name').value.trim();
    
    if (!familyName) {
        showNotification('Bitte gib einen Familiennamen ein', 'error');
        hideButtonSpinner(submitBtn);
        return;
    }
    
    try {
        const batch = writeBatch(db);
        
        // Create new family document
        const familyRef = doc(collection(db, 'families'));
        const familyId = familyRef.id;
        
        batch.set(familyRef, {
            name: familyName,
            createdAt: serverTimestamp(),
            ownerId: currentUser.uid,
            settings: {
                'calendar-sharing': true,
                'chat-notifications': true,
                'finance-tracking': false
            }
        });
        
        // Add current user as admin member
        const memberRef = doc(db, 'families', familyId, 'membersData', currentUser.uid);
        batch.set(memberRef, {
            uid: currentUser.uid,
            name: currentUserData.name || 'Unbekannt',
            email: currentUser.email,
            role: 'Admin',
            joinedAt: serverTimestamp(),
            points: 0,
            photoURL: currentUserData.photoURL || null
        });
        
        // Update user document to reference new family
        const userRef = doc(db, 'users', currentUser.uid);
        batch.update(userRef, {
            familyId: familyId
        });
        
        await batch.commit();
        
        showNotification('Familie erfolgreich erstellt!', 'success');
        closeModal('modal-create-family');
        
        // Reload page to show new family
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
    } catch (error) {
        console.error('Error creating family:', error);
        showNotification('Fehler beim Erstellen der Familie', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Opens modal to edit family
 */
function openEditFamilyModal() {
    const { currentFamilyId } = getCurrentUser();
    
    if (!currentFamilyId) {
        showNotification('Keine Familie geladen', 'error');
        return;
    }
    
    // Load current family data
    const familyRef = doc(db, 'families', currentFamilyId);
    getDoc(familyRef).then(docSnap => {
        if (docSnap.exists()) {
            const familyData = docSnap.data();
            showEditFamilyModal(familyData, currentFamilyId);
        } else {
            showNotification('Familie nicht gefunden', 'error');
        }
    }).catch(error => {
        console.error('Error loading family:', error);
        showNotification('Fehler beim Laden der Familie', 'error');
    });
}

/**
 * Shows the edit family modal with current data
 */
function showEditFamilyModal(familyData, familyId) {
    const modalContent = `
        <div class="modal-content glass-premium max-w-md w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Familie bearbeiten</h2>
            <form id="edit-family-form" class="space-y-4">
                <div>
                    <label for="edit-family-name" class="form-label">Familienname</label>
                    <input type="text" id="edit-family-name" class="form-input" required value="${familyData.name || ''}">
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="edit-family-submit" class="cta-primary-glow">
                        <span class="btn-text">Speichern</span>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    openModal(modalContent, 'modal-edit-family');
    
    document.getElementById('edit-family-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleEditFamily(familyId);
    });
}

/**
 * Handles editing family
 */
async function handleEditFamily(familyId) {
    const submitBtn = document.getElementById('edit-family-submit');
    showButtonSpinner(submitBtn);
    
    const newName = document.getElementById('edit-family-name').value.trim();
    
    if (!newName) {
        showNotification('Bitte gib einen Familiennamen ein', 'error');
        hideButtonSpinner(submitBtn);
        return;
    }
    
    try {
        const familyRef = doc(db, 'families', familyId);
        await updateDoc(familyRef, {
            name: newName,
            updatedAt: serverTimestamp()
        });
        
        showNotification('Familie aktualisiert!', 'success');
        closeModal('modal-edit-family');
    } catch (error) {
        console.error('Error updating family:', error);
        showNotification('Fehler beim Aktualisieren der Familie', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Opens modal to invite a member
 */
function openInviteMemberModal() {
    const modalContent = `
        <div class="modal-content glass-premium max-w-md w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Mitglied einladen</h2>
            <form id="invite-member-form" class="space-y-4">
                <div>
                    <label for="invite-email" class="form-label">E-Mail-Adresse</label>
                    <input type="email" id="invite-email" class="form-input" required placeholder="email@beispiel.de">
                </div>
                <div>
                    <label class="form-label">Information</label>
                    <p class="text-sm text-secondary">Die eingeladene Person erhält eine E-Mail mit einem Link zum Beitritt.</p>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="invite-member-submit" class="cta-primary-glow">
                        <span class="btn-text">Einladung senden</span>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    openModal(modalContent, 'modal-invite-member');
    
    document.getElementById('invite-member-form').addEventListener('submit', handleInviteMember);
}

/**
 * Handles inviting a member
 */
async function handleInviteMember(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('invite-member-submit');
    showButtonSpinner(submitBtn);
    
    const { currentFamilyId, currentUserData } = getCurrentUser();
    const email = document.getElementById('invite-email').value.trim();
    
    if (!email) {
        showNotification('Bitte gib eine E-Mail-Adresse ein', 'error');
        hideButtonSpinner(submitBtn);
        return;
    }
    
    try {
        const invitesRef = collection(db, 'invites');
        await addDoc(invitesRef, {
            familyId: currentFamilyId,
            toEmail: email,
            fromName: currentUserData.name || 'Ein Familienmitglied',
            status: 'pending',
            createdAt: serverTimestamp()
        });
        
        showNotification(`Einladung an ${email} gesendet!`, 'success');
        closeModal('modal-invite-member');
    } catch (error) {
        console.error('Error sending invite:', error);
        showNotification('Fehler beim Senden der Einladung', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Opens modal to edit a member
 */
window.openEditMemberModal = async function(memberId, familyId) {
    try {
        const memberRef = doc(db, 'families', familyId, 'membersData', memberId);
        const memberSnap = await getDoc(memberRef);
        
        if (!memberSnap.exists()) {
            showNotification('Mitglied nicht gefunden', 'error');
            return;
        }
        
        const memberData = memberSnap.data();
        
        const modalContent = `
            <div class="modal-content glass-premium max-w-md w-full">
                <h2 class="text-xl font-bold text-gradient mb-6">Mitglied bearbeiten</h2>
                <form id="edit-member-form" class="space-y-4">
                    <div>
                        <label class="form-label">Name</label>
                        <p class="text-white">${memberData.name || 'Unbekannt'}</p>
                    </div>
                    <div>
                        <label for="member-role" class="form-label">Rolle</label>
                        <select id="member-role" class="form-input">
                            <option value="Mitglied" ${memberData.role !== 'Admin' ? 'selected' : ''}>Mitglied</option>
                            <option value="Admin" ${memberData.role === 'Admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-3 pt-6 border-t border-border-glass">
                        <button type="submit" id="edit-member-submit" class="cta-primary-glow">
                            <span class="btn-text">Speichern</span>
                        </button>
                        <button type="button" class="btn-secondary text-red-400" onclick="window.confirmRemoveMember('${memberId}', '${familyId}')">
                            Aus Familie entfernen
                        </button>
                        <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    </div>
                </form>
            </div>
        `;
        
        openModal(modalContent, 'modal-edit-member');
        
        document.getElementById('edit-member-form').addEventListener('submit', (e) => {
            e.preventDefault();
            handleEditMember(memberId, familyId);
        });
    } catch (error) {
        console.error('Error loading member:', error);
        showNotification('Fehler beim Laden des Mitglieds', 'error');
    }
};

/**
 * Handles editing a member
 */
async function handleEditMember(memberId, familyId) {
    const submitBtn = document.getElementById('edit-member-submit');
    showButtonSpinner(submitBtn);
    
    const newRole = document.getElementById('member-role').value;
    
    try {
        const memberRef = doc(db, 'families', familyId, 'membersData', memberId);
        await updateDoc(memberRef, {
            role: newRole
        });
        
        showNotification('Mitglied aktualisiert!', 'success');
        closeModal('modal-edit-member');
    } catch (error) {
        console.error('Error updating member:', error);
        showNotification('Fehler beim Aktualisieren des Mitglieds', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Confirms and removes a member from the family
 */
window.confirmRemoveMember = async function(memberId, familyId) {
    if (!confirm('Möchtest du dieses Mitglied wirklich aus der Familie entfernen?')) {
        return;
    }
    
    try {
        const memberRef = doc(db, 'families', familyId, 'membersData', memberId);
        await deleteDoc(memberRef);
        
        showNotification('Mitglied entfernt', 'success');
        closeModal('modal-edit-member');
    } catch (error) {
        console.error('Error removing member:', error);
        showNotification('Fehler beim Entfernen des Mitglieds', 'error');
    }
};

/**
 * Exports family data
 */
window.exportFamilyData = async function() {
    const { currentFamilyId } = getCurrentUser();
    
    if (!currentFamilyId) {
        showNotification('Keine Familie geladen', 'error');
        return;
    }
    
    showNotification('Export wird vorbereitet...', 'info');
    
    try {
        // This would typically call a Cloud Function to generate the export
        // For now, we'll show a placeholder
        showNotification('Export-Funktion wird implementiert', 'info');
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Fehler beim Exportieren der Daten', 'error');
    }
};

/**
 * Confirms and deletes the family
 */
window.confirmDeleteFamily = async function() {
    const { currentFamilyId } = getCurrentUser();
    
    if (!currentFamilyId) {
        showNotification('Keine Familie geladen', 'error');
        return;
    }
    
    const confirmation = prompt('Bist du sicher? Gib "LÖSCHEN" ein, um die Familie permanent zu löschen:');
    
    if (confirmation !== 'LÖSCHEN') {
        return;
    }
    
    try {
        // This would typically call a Cloud Function to safely delete all family data
        // For now, we'll show a placeholder
        showNotification('Diese Funktion erfordert Admin-Berechtigung und Cloud Function', 'error');
    } catch (error) {
        console.error('Error deleting family:', error);
        showNotification('Fehler beim Löschen der Familie', 'error');
    }
};

/**
 * Renders an empty state
 */
function renderEmptyState(title, message) {
    return `
        <div class="flex flex-col items-center justify-center p-12 text-center">
            <i data-lucide="info" class="w-16 h-16 text-secondary opacity-30 mb-4"></i>
            <h3 class="text-lg font-semibold text-white mb-2">${title}</h3>
            <p class="text-secondary">${message}</p>
        </div>
    `;
}
