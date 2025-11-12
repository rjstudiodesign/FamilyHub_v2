// family-management.js – Dedicated module for extended family management
import { 
    db, auth, 
    doc, getDoc, collection, query, where, getDocs, writeBatch,
    addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, orderBy, Timestamp 
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification, openModal, closeModal, showButtonSpinner, hideButtonSpinner } from './ui.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('FamilyManagement');

let familiesUnsubscribe = null;
let membersUnsubscribe = null;

/**
 * Main render function for the Family Management page
 */
export function renderFamilyManagement(listeners) {
    logger.info('Rendering Family Management page');
    
    // Cleanup old listeners
    if (listeners && listeners.families) listeners.families();
    if (listeners && listeners.members) listeners.members();

    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    
    if (!currentUser || !currentUserData) {
        document.getElementById('app-content').innerHTML = `
            <div class="text-center p-8">
                <p class="text-text-secondary">Bitte melde dich an, um fortzufahren.</p>
            </div>
        `;
        return;
    }

    // Initialize the page structure
    initializePage(currentFamilyId, listeners);
}

function initializePage(currentFamilyId, listeners) {
    const container = document.getElementById('family-mgmt-container');
    if (!container) {
        logger.error('Family management container not found');
        return;
    }

    // Load families the user belongs to
    loadUserFamilies(currentFamilyId, listeners);
    
    // Load current family details if available
    if (currentFamilyId) {
        loadFamilyDetails(currentFamilyId, listeners);
    } else {
        displayNoFamilyState();
    }
    
    // Setup event handlers
    setupEventHandlers(currentFamilyId);
}

/**
 * Load all families the current user belongs to
 */
async function loadUserFamilies(currentFamilyId, listeners) {
    const { currentUser } = getCurrentUser();
    const familySelector = document.getElementById('family-selector-container');
    
    if (!familySelector) return;

    try {
        // Query all families where user is a member
        const familiesRef = collection(db, 'families');
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(familiesRef, (snapshot) => {
            const families = [];
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                // Check if current user is in memberIds array
                if (data.memberIds && data.memberIds.includes(currentUser.uid)) {
                    families.push({ id: doc.id, ...data });
                }
            });

            renderFamilySelector(families, currentFamilyId);
            logger.debug('Loaded user families', { count: families.length });
        });

        if (listeners) {
            listeners.families = unsubscribe;
        }
    } catch (error) {
        logger.error('Failed to load families', error);
        showNotification('Fehler beim Laden der Familien', 'error');
    }
}

/**
 * Render family selector dropdown
 */
function renderFamilySelector(families, currentFamilyId) {
    const container = document.getElementById('family-selector-container');
    if (!container) return;

    if (families.length === 0) {
        container.innerHTML = `
            <div class="glass-premium p-4 rounded-xl">
                <p class="text-text-secondary text-sm">Du gehörst noch keiner Familie an.</p>
                <button id="btn-create-family" class="cta-primary-glow mt-3 w-full">
                    <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
                    Neue Familie erstellen
                </button>
            </div>
        `;
        return;
    }

    const options = families.map(fam => 
        `<option value="${fam.id}" ${fam.id === currentFamilyId ? 'selected' : ''}>
            ${fam.name || 'Unbenannte Familie'}
        </option>`
    ).join('');

    container.innerHTML = `
        <div class="glass-premium p-4 rounded-xl">
            <div class="flex items-center gap-3">
                <div class="flex-1">
                    <label for="family-select" class="text-sm text-text-secondary block mb-2">
                        Aktive Familie
                    </label>
                    <select id="family-select" class="form-input">
                        ${options}
                    </select>
                </div>
                <button id="btn-create-family" class="btn-icon-ghost mt-6" title="Neue Familie erstellen">
                    <i data-lucide="plus" class="w-5 h-5"></i>
                </button>
            </div>
            ${families.length > 1 ? `
                <p class="text-xs text-text-secondary mt-2">
                    Du bist Mitglied in ${families.length} Familien
                </p>
            ` : ''}
        </div>
    `;

    // Refresh icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Load and display details for a specific family
 */
function loadFamilyDetails(familyId, listeners) {
    if (!familyId) {
        displayNoFamilyState();
        return;
    }

    const detailsContainer = document.getElementById('family-details-container');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
        <div class="flex justify-center items-center p-8">
            <div class="spinner"></div>
        </div>
    `;

    try {
        // Real-time listener for family document
        const familyRef = doc(db, 'families', familyId);
        const unsubscribe = onSnapshot(familyRef, (docSnap) => {
            if (docSnap.exists()) {
                const familyData = { id: docSnap.id, ...docSnap.data() };
                renderFamilyDetails(familyData);
                loadFamilyMembers(familyId, listeners);
            } else {
                displayNoFamilyState();
            }
        });

        if (listeners) {
            listeners.familyDetails = unsubscribe;
        }
    } catch (error) {
        logger.error('Failed to load family details', error);
        showNotification('Fehler beim Laden der Familiendetails', 'error');
    }
}

/**
 * Render family details section
 */
function renderFamilyDetails(family) {
    const container = document.getElementById('family-details-container');
    if (!container) return;

    const createdDate = family.createdAt ? 
        new Date(family.createdAt.toDate()).toLocaleDateString('de-DE') : 'Unbekannt';

    container.innerHTML = `
        <div class="glass-premium p-6 rounded-xl">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h3 class="text-2xl font-bold text-gradient mb-2">${family.name || 'Unbenannte Familie'}</h3>
                    <p class="text-sm text-text-secondary">Erstellt am ${createdDate}</p>
                </div>
                <button id="btn-edit-family" class="btn-icon-ghost" title="Familie bearbeiten">
                    <i data-lucide="edit" class="w-5 h-5"></i>
                </button>
            </div>

            ${family.description ? `
                <div class="mb-6 p-4 bg-white/5 rounded-lg">
                    <p class="text-text-secondary">${family.description}</p>
                </div>
            ` : ''}

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-4 bg-white/5 rounded-lg">
                    <i data-lucide="users" class="w-6 h-6 text-accent-glow mb-2"></i>
                    <p class="text-2xl font-bold text-white">${family.memberIds?.length || 0}</p>
                    <p class="text-xs text-text-secondary">Mitglieder</p>
                </div>
                <div class="p-4 bg-white/5 rounded-lg">
                    <i data-lucide="user-plus" class="w-6 h-6 text-accent-glow mb-2"></i>
                    <p class="text-2xl font-bold text-white">${family.pendingInvites?.length || 0}</p>
                    <p class="text-xs text-text-secondary">Einladungen</p>
                </div>
                <div class="p-4 bg-white/5 rounded-lg">
                    <i data-lucide="shield-check" class="w-6 h-6 text-accent-glow mb-2"></i>
                    <p class="text-2xl font-bold text-white">${family.adminIds?.length || 0}</p>
                    <p class="text-xs text-text-secondary">Admins</p>
                </div>
                <div class="p-4 bg-white/5 rounded-lg">
                    <i data-lucide="baby" class="w-6 h-6 text-accent-glow mb-2"></i>
                    <p class="text-2xl font-bold text-white" id="child-profiles-count">-</p>
                    <p class="text-xs text-text-secondary">Kind-Profile</p>
                </div>
            </div>

            <div class="mt-6 pt-6 border-t border-border-glass">
                <h4 class="font-semibold text-white mb-3">Erweiterte Einstellungen</h4>
                <div class="space-y-3">
                    <button id="btn-manage-roles" class="btn-secondary w-full justify-start">
                        <i data-lucide="shield" class="w-5 h-5 mr-2"></i>
                        Rollen verwalten
                    </button>
                    <button id="btn-family-settings" class="btn-secondary w-full justify-start">
                        <i data-lucide="settings" class="w-5 h-5 mr-2"></i>
                        Familieneinstellungen
                    </button>
                    <button id="btn-danger-zone" class="btn-secondary w-full justify-start text-red-400 hover:bg-red-500/20">
                        <i data-lucide="alert-triangle" class="w-5 h-5 mr-2"></i>
                        Gefahrenbereich
                    </button>
                </div>
            </div>
        </div>
    `;

    // Refresh icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Load and display family members
 */
function loadFamilyMembers(familyId, listeners) {
    const membersContainer = document.getElementById('family-members-list-container');
    if (!membersContainer) return;

    membersContainer.innerHTML = `
        <div class="flex justify-center items-center p-8">
            <div class="spinner"></div>
        </div>
    `;

    try {
        const membersRef = collection(db, 'families', familyId, 'membersData');
        const q = query(membersRef, orderBy('name', 'asc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const members = [];
            const childProfiles = [];
            
            snapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                if (data.isChildProfile) {
                    childProfiles.push(data);
                } else {
                    members.push(data);
                }
            });

            renderMembersList(members, childProfiles, familyId);
            
            // Update child profiles count
            const countEl = document.getElementById('child-profiles-count');
            if (countEl) {
                countEl.textContent = childProfiles.length;
            }

            logger.debug('Loaded family members', { 
                members: members.length, 
                children: childProfiles.length 
            });
        });

        if (listeners) {
            listeners.members = unsubscribe;
        }
    } catch (error) {
        logger.error('Failed to load family members', error);
        showNotification('Fehler beim Laden der Mitglieder', 'error');
    }
}

/**
 * Render members list
 */
function renderMembersList(members, childProfiles, familyId) {
    const container = document.getElementById('family-members-list-container');
    if (!container) return;

    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    
    // Get admin IDs from family
    let adminIds = [];
    const familyRef = doc(db, 'families', familyId);
    getDoc(familyRef).then(docSnap => {
        if (docSnap.exists()) {
            adminIds = docSnap.data().adminIds || [];
        }
    });

    container.innerHTML = `
        <div class="glass-premium p-6 rounded-xl">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gradient">Familienmitglieder</h3>
                <button id="btn-add-member" class="cta-primary-glow">
                    <i data-lucide="user-plus" class="w-5 h-5 mr-2"></i>
                    Mitglied hinzufügen
                </button>
            </div>

            ${members.length === 0 ? `
                <p class="text-text-secondary text-center py-8">Noch keine Mitglieder vorhanden.</p>
            ` : `
                <div class="space-y-3">
                    ${members.map(member => renderMemberCard(member, adminIds)).join('')}
                </div>
            `}

            ${childProfiles.length > 0 ? `
                <div class="mt-8 pt-8 border-t border-border-glass">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-lg font-semibold text-white">Kind-Profile</h4>
                        <button id="btn-add-child" class="btn-secondary">
                            <i data-lucide="baby" class="w-4 h-4 mr-2"></i>
                            Kind hinzufügen
                        </button>
                    </div>
                    <div class="space-y-3">
                        ${childProfiles.map(child => renderChildProfileCard(child)).join('')}
                    </div>
                </div>
            ` : `
                <div class="mt-6 pt-6 border-t border-border-glass">
                    <button id="btn-add-child" class="btn-secondary w-full">
                        <i data-lucide="baby" class="w-5 h-5 mr-2"></i>
                        Kind-Profil erstellen
                    </button>
                </div>
            `}
        </div>
    `;

    // Refresh icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Render individual member card
 */
function renderMemberCard(member, adminIds) {
    const isAdmin = adminIds.includes(member.id);
    const birthdayStr = member.birthday ? 
        new Date(member.birthday.toDate()).toLocaleDateString('de-DE') : 'Nicht angegeben';

    return `
        <div class="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
            <div class="flex items-center gap-4">
                <img src="${member.photoURL || 'img/default_avatar.png'}" 
                     alt="${member.name}" 
                     class="w-12 h-12 rounded-full object-cover">
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <h5 class="font-semibold text-white">${member.name}</h5>
                        ${isAdmin ? `
                            <span class="px-2 py-0.5 bg-accent-glow/20 text-accent-glow text-xs rounded-full">
                                Admin
                            </span>
                        ` : ''}
                    </div>
                    <p class="text-sm text-text-secondary">Geburtstag: ${birthdayStr}</p>
                    ${member.email ? `
                        <p class="text-xs text-text-secondary mt-1">${member.email}</p>
                    ` : ''}
                </div>
                <button onclick="editMember('${member.id}')" 
                        class="btn-icon-ghost" 
                        title="Mitglied bearbeiten">
                    <i data-lucide="edit" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Render child profile card
 */
function renderChildProfileCard(child) {
    const birthdayStr = child.birthday ? 
        new Date(child.birthday.toDate()).toLocaleDateString('de-DE') : 'Nicht angegeben';
    
    const age = child.birthday ? 
        Math.floor((Date.now() - child.birthday.toDate().getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;

    return `
        <div class="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                    <i data-lucide="baby" class="w-6 h-6 text-white"></i>
                </div>
                <div class="flex-1">
                    <h5 class="font-semibold text-white">${child.name}</h5>
                    <p class="text-sm text-text-secondary">
                        ${age !== null ? `${age} Jahre alt · ` : ''}${birthdayStr}
                    </p>
                    ${child.parents && child.parents.length > 0 ? `
                        <p class="text-xs text-text-secondary mt-1">
                            <i data-lucide="users" class="w-3 h-3 inline"></i>
                            ${child.parents.length} Elternteil(e)
                        </p>
                    ` : ''}
                </div>
                <div class="flex gap-2">
                    <button onclick="editChildProfile('${child.id}')" 
                            class="btn-icon-ghost" 
                            title="Kind bearbeiten">
                        <i data-lucide="edit" class="w-5 h-5"></i>
                    </button>
                    <button onclick="deleteChildProfile('${child.id}')" 
                            class="btn-icon-ghost text-red-400 hover:bg-red-500/20" 
                            title="Kind löschen">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Display state when no family is selected
 */
function displayNoFamilyState() {
    const container = document.getElementById('family-details-container');
    if (!container) return;

    container.innerHTML = `
        <div class="glass-premium p-12 rounded-xl text-center">
            <i data-lucide="users" class="w-16 h-16 text-secondary opacity-30 mx-auto mb-4"></i>
            <h3 class="text-xl font-bold text-white mb-2">Keine Familie ausgewählt</h3>
            <p class="text-text-secondary mb-6">
                Erstelle eine neue Familie oder werde Mitglied einer bestehenden Familie.
            </p>
            <button id="btn-create-family-main" class="cta-primary-glow">
                <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
                Neue Familie erstellen
            </button>
        </div>
    `;

    // Refresh icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Setup event handlers for the page
 */
function setupEventHandlers(currentFamilyId) {
    // Delegate event handling to document
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const { currentFamilyId } = getCurrentUser();

        switch (target.id) {
            case 'btn-create-family':
            case 'btn-create-family-main':
                openCreateFamilyModal();
                break;
            case 'btn-edit-family':
                if (currentFamilyId) openEditFamilyModal(currentFamilyId);
                break;
            case 'btn-add-member':
                if (currentFamilyId) openAddMemberModal(currentFamilyId);
                break;
            case 'btn-add-child':
                if (currentFamilyId) openAddChildModal(currentFamilyId);
                break;
            case 'btn-manage-roles':
                if (currentFamilyId) openManageRolesModal(currentFamilyId);
                break;
            case 'btn-family-settings':
                if (currentFamilyId) openFamilySettingsModal(currentFamilyId);
                break;
            case 'btn-danger-zone':
                if (currentFamilyId) openDangerZoneModal(currentFamilyId);
                break;
        }
    });

    // Family selector change handler
    const familySelect = document.getElementById('family-select');
    if (familySelect) {
        familySelect.addEventListener('change', (e) => {
            switchFamily(e.target.value);
        });
    }
}

/**
 * Open modal to create a new family
 */
function openCreateFamilyModal() {
    const modalContent = `
        <div class="modal-content glass-premium max-w-lg w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Neue Familie erstellen</h2>
            <form id="create-family-form" class="space-y-4">
                <div>
                    <label for="family-name" class="form-label">Familienname</label>
                    <input type="text" id="family-name" class="form-input" required 
                           placeholder="z.B. Familie Müller">
                </div>
                <div>
                    <label for="family-description" class="form-label">Beschreibung (optional)</label>
                    <textarea id="family-description" class="form-input" rows="3"
                              placeholder="Eine kurze Beschreibung deiner Familie..."></textarea>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">
                        Abbrechen
                    </button>
                    <button type="submit" id="create-family-btn" class="cta-primary-glow">
                        <span class="btn-text">Familie erstellen</span>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    openModal(modalContent, 'modal-create-family');
    
    document.getElementById('create-family-form').onsubmit = (e) => {
        e.preventDefault();
        handleCreateFamily();
    };
}

/**
 * Handle family creation
 */
async function handleCreateFamily() {
    const submitBtn = document.getElementById('create-family-btn');
    showButtonSpinner(submitBtn);

    const { currentUser, currentUserData } = getCurrentUser();
    
    const familyName = document.getElementById('family-name').value.trim();
    const familyDescription = document.getElementById('family-description').value.trim();

    if (!familyName) {
        showNotification('Bitte gib einen Familiennamen ein', 'error');
        hideButtonSpinner(submitBtn);
        return;
    }

    try {
        // Create family document
        const familyData = {
            name: familyName,
            description: familyDescription || '',
            createdAt: serverTimestamp(),
            createdBy: currentUser.uid,
            memberIds: [currentUser.uid],
            adminIds: [currentUser.uid],
            pendingInvites: []
        };

        const familyRef = await addDoc(collection(db, 'families'), familyData);
        logger.info('Family created', { familyId: familyRef.id });

        // Create member document for creator
        const memberData = {
            name: currentUserData.name || 'Unbekannt',
            email: currentUser.email,
            photoURL: currentUserData.photoURL || 'img/default_avatar.png',
            birthday: currentUserData.birthday || null,
            isChildProfile: false,
            joinedAt: serverTimestamp()
        };

        await addDoc(collection(db, 'families', familyRef.id, 'membersData'), memberData);

        // Update user's familyId
        await updateDoc(doc(db, 'users', currentUser.uid), {
            familyId: familyRef.id
        });

        showNotification(`Familie "${familyName}" erfolgreich erstellt!`, 'success');
        closeModal('modal-create-family');
        
        // Reload page to reflect changes
        setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
        logger.error('Failed to create family', error);
        showNotification('Fehler beim Erstellen der Familie', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Switch to a different family
 */
async function switchFamily(familyId) {
    const { currentUser } = getCurrentUser();
    
    try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
            familyId: familyId
        });
        
        showNotification('Familie gewechselt', 'success');
        
        // Reload page to reflect changes
        setTimeout(() => window.location.reload(), 500);
    } catch (error) {
        logger.error('Failed to switch family', error);
        showNotification('Fehler beim Wechseln der Familie', 'error');
    }
}

/**
 * Open modal to edit family details
 */
async function openEditFamilyModal(familyId) {
    try {
        const familyDoc = await getDoc(doc(db, 'families', familyId));
        if (!familyDoc.exists()) {
            showNotification('Familie nicht gefunden', 'error');
            return;
        }

        const family = familyDoc.data();

        const modalContent = `
            <div class="modal-content glass-premium max-w-lg w-full">
                <h2 class="text-xl font-bold text-gradient mb-6">Familie bearbeiten</h2>
                <form id="edit-family-form" class="space-y-4">
                    <input type="hidden" id="edit-family-id" value="${familyId}">
                    <div>
                        <label for="edit-family-name" class="form-label">Familienname</label>
                        <input type="text" id="edit-family-name" class="form-input" required
                               value="${family.name || ''}">
                    </div>
                    <div>
                        <label for="edit-family-description" class="form-label">Beschreibung</label>
                        <textarea id="edit-family-description" class="form-input" rows="3">${family.description || ''}</textarea>
                    </div>
                    <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                        <button type="button" class="btn-secondary" data-action="close-modal">
                            Abbrechen
                        </button>
                        <button type="submit" id="save-family-btn" class="cta-primary-glow">
                            <span class="btn-text">Speichern</span>
                        </button>
                    </div>
                </form>
            </div>
        `;

        openModal(modalContent, 'modal-edit-family');

        document.getElementById('edit-family-form').onsubmit = (e) => {
            e.preventDefault();
            handleEditFamily();
        };
    } catch (error) {
        logger.error('Failed to open edit modal', error);
        showNotification('Fehler beim Laden der Familiendetails', 'error');
    }
}

/**
 * Handle family editing
 */
async function handleEditFamily() {
    const submitBtn = document.getElementById('save-family-btn');
    showButtonSpinner(submitBtn);

    const familyId = document.getElementById('edit-family-id').value;
    const name = document.getElementById('edit-family-name').value.trim();
    const description = document.getElementById('edit-family-description').value.trim();

    try {
        await updateDoc(doc(db, 'families', familyId), {
            name,
            description,
            updatedAt: serverTimestamp()
        });

        showNotification('Familie aktualisiert', 'success');
        closeModal('modal-edit-family');
    } catch (error) {
        logger.error('Failed to update family', error);
        showNotification('Fehler beim Aktualisieren der Familie', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Open modal to add a new member
 */
function openAddMemberModal(familyId) {
    const modalContent = `
        <div class="modal-content glass-premium max-w-lg w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Mitglied hinzufügen</h2>
            <p class="text-sm text-text-secondary mb-4">
                Füge ein neues Familienmitglied durch Eingabe ihrer E-Mail-Adresse hinzu.
            </p>
            <form id="add-member-form" class="space-y-4">
                <div>
                    <label for="member-email" class="form-label">E-Mail-Adresse</label>
                    <input type="email" id="member-email" class="form-input" required
                           placeholder="name@example.com">
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">
                        Abbrechen
                    </button>
                    <button type="submit" id="invite-member-btn" class="cta-primary-glow">
                        <span class="btn-text">Einladen</span>
                    </button>
                </div>
            </form>
        </div>
    `;

    openModal(modalContent, 'modal-add-member');

    document.getElementById('add-member-form').onsubmit = (e) => {
        e.preventDefault();
        handleInviteMember(familyId);
    };
}

/**
 * Handle member invitation
 */
async function handleInviteMember(familyId) {
    const submitBtn = document.getElementById('invite-member-btn');
    showButtonSpinner(submitBtn);

    const email = document.getElementById('member-email').value.trim();

    try {
        // Add to pending invites
        const familyRef = doc(db, 'families', familyId);
        const familyDoc = await getDoc(familyRef);
        const pendingInvites = familyDoc.data().pendingInvites || [];

        if (pendingInvites.includes(email)) {
            showNotification('Diese E-Mail wurde bereits eingeladen', 'warning');
            hideButtonSpinner(submitBtn);
            return;
        }

        pendingInvites.push(email);
        
        await updateDoc(familyRef, {
            pendingInvites,
            updatedAt: serverTimestamp()
        });

        showNotification(`Einladung an ${email} gesendet`, 'success');
        closeModal('modal-add-member');
    } catch (error) {
        logger.error('Failed to invite member', error);
        showNotification('Fehler beim Senden der Einladung', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Open modal to add a child profile
 */
async function openAddChildModal(familyId) {
    try {
        // Load family members for parent selection
        const membersRef = collection(db, 'families', familyId, 'membersData');
        const snapshot = await getDocs(membersRef);
        const members = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(m => !m.isChildProfile);

        const memberOptions = members.map(m => 
            `<option value="${m.id}">${m.name}</option>`
        ).join('');

        const modalContent = `
            <div class="modal-content glass-premium max-w-lg w-full">
                <h2 class="text-xl font-bold text-gradient mb-6">Kind-Profil erstellen</h2>
                <form id="add-child-form" class="space-y-4">
                    <div>
                        <label for="child-name" class="form-label">Name des Kindes</label>
                        <input type="text" id="child-name" class="form-input" required
                               placeholder="z.B. Max">
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
                        <button type="button" class="btn-secondary" data-action="close-modal">
                            Abbrechen
                        </button>
                        <button type="submit" id="create-child-btn" class="cta-primary-glow">
                            <span class="btn-text">Erstellen</span>
                        </button>
                    </div>
                </form>
            </div>
        `;

        openModal(modalContent, 'modal-add-child');

        document.getElementById('add-child-form').onsubmit = (e) => {
            e.preventDefault();
            handleCreateChildProfile(familyId);
        };
    } catch (error) {
        logger.error('Failed to open add child modal', error);
        showNotification('Fehler beim Laden der Mitgliederdaten', 'error');
    }
}

/**
 * Handle child profile creation
 */
async function handleCreateChildProfile(familyId) {
    const submitBtn = document.getElementById('create-child-btn');
    showButtonSpinner(submitBtn);

    const name = document.getElementById('child-name').value.trim();
    const birthdayStr = document.getElementById('child-birthday').value;
    const parent1 = document.getElementById('child-parent1').value;
    const parent2 = document.getElementById('child-parent2').value;

    try {
        const birthday = Timestamp.fromDate(new Date(birthdayStr));
        const parents = [parent1];
        if (parent2) parents.push(parent2);

        const childData = {
            name,
            birthday,
            parents,
            isChildProfile: true,
            photoURL: 'img/default_avatar.png',
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, 'families', familyId, 'membersData'), childData);

        showNotification(`Kind-Profil für ${name} erstellt`, 'success');
        closeModal('modal-add-child');
    } catch (error) {
        logger.error('Failed to create child profile', error);
        showNotification('Fehler beim Erstellen des Kind-Profils', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Open manage roles modal
 */
async function openManageRolesModal(familyId) {
    try {
        const familyDoc = await getDoc(doc(db, 'families', familyId));
        const adminIds = familyDoc.data().adminIds || [];

        const membersRef = collection(db, 'families', familyId, 'membersData');
        const snapshot = await getDocs(membersRef);
        const members = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(m => !m.isChildProfile);

        const membersList = members.map(m => `
            <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div class="flex items-center gap-3">
                    <img src="${m.photoURL || 'img/default_avatar.png'}" 
                         alt="${m.name}" 
                         class="w-10 h-10 rounded-full">
                    <span class="text-white">${m.name}</span>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" 
                           class="admin-checkbox" 
                           data-member-id="${m.id}"
                           ${adminIds.includes(m.id) ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        `).join('');

        const modalContent = `
            <div class="modal-content glass-premium max-w-lg w-full">
                <h2 class="text-xl font-bold text-gradient mb-6">Rollen verwalten</h2>
                <p class="text-sm text-text-secondary mb-4">
                    Administratoren haben erweiterte Berechtigungen zur Verwaltung der Familie.
                </p>
                <div class="space-y-2 mb-6">
                    ${membersList}
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">
                        Schließen
                    </button>
                    <button type="button" id="save-roles-btn" class="cta-primary-glow">
                        <span class="btn-text">Speichern</span>
                    </button>
                </div>
            </div>
        `;

        openModal(modalContent, 'modal-manage-roles');

        document.getElementById('save-roles-btn').onclick = () => handleSaveRoles(familyId);
    } catch (error) {
        logger.error('Failed to open manage roles modal', error);
        showNotification('Fehler beim Laden der Rollenverwaltung', 'error');
    }
}

/**
 * Handle saving role changes
 */
async function handleSaveRoles(familyId) {
    const submitBtn = document.getElementById('save-roles-btn');
    showButtonSpinner(submitBtn);

    try {
        const checkboxes = document.querySelectorAll('.admin-checkbox');
        const newAdminIds = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                newAdminIds.push(checkbox.dataset.memberId);
            }
        });

        await updateDoc(doc(db, 'families', familyId), {
            adminIds: newAdminIds,
            updatedAt: serverTimestamp()
        });

        showNotification('Rollen aktualisiert', 'success');
        closeModal('modal-manage-roles');
    } catch (error) {
        logger.error('Failed to save roles', error);
        showNotification('Fehler beim Speichern der Rollen', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Open family settings modal
 */
function openFamilySettingsModal(familyId) {
    const modalContent = `
        <div class="modal-content glass-premium max-w-2xl w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Familieneinstellungen</h2>
            
            <div class="space-y-6">
                <div>
                    <h3 class="font-semibold text-white mb-3">Datenschutz</h3>
                    <div class="space-y-3">
                        <div class="toggle-wrapper">
                            <div>
                                <p class="font-medium text-white">Familienprofil öffentlich</p>
                                <p class="text-sm text-text-secondary">Andere können deine Familie finden</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="setting-public-profile">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="toggle-wrapper">
                            <div>
                                <p class="font-medium text-white">Einladungen erlauben</p>
                                <p class="text-sm text-text-secondary">Mitglieder können andere einladen</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="setting-allow-invites" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-border-glass">
                    <h3 class="font-semibold text-white mb-3">Benachrichtigungen</h3>
                    <div class="space-y-3">
                        <div class="toggle-wrapper">
                            <div>
                                <p class="font-medium text-white">Neue Mitglieder</p>
                                <p class="text-sm text-text-secondary">Bei Beitritt neuer Mitglieder benachrichtigen</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="setting-notify-members" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">
                    Schließen
                </button>
                <button type="button" id="save-settings-btn" class="cta-primary-glow">
                    <span class="btn-text">Speichern</span>
                </button>
            </div>
        </div>
    `;

    openModal(modalContent, 'modal-family-settings');

    document.getElementById('save-settings-btn').onclick = () => handleSaveSettings(familyId);
}

/**
 * Handle saving family settings
 */
async function handleSaveSettings(familyId) {
    const submitBtn = document.getElementById('save-settings-btn');
    showButtonSpinner(submitBtn);

    try {
        const settings = {
            publicProfile: document.getElementById('setting-public-profile').checked,
            allowInvites: document.getElementById('setting-allow-invites').checked,
            notifyNewMembers: document.getElementById('setting-notify-members').checked
        };

        await updateDoc(doc(db, 'families', familyId), {
            settings,
            updatedAt: serverTimestamp()
        });

        showNotification('Einstellungen gespeichert', 'success');
        closeModal('modal-family-settings');
    } catch (error) {
        logger.error('Failed to save settings', error);
        showNotification('Fehler beim Speichern der Einstellungen', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Open danger zone modal
 */
function openDangerZoneModal(familyId) {
    const modalContent = `
        <div class="modal-content glass-premium max-w-lg w-full border-2 border-red-500/30">
            <h2 class="text-xl font-bold text-red-400 mb-6">
                <i data-lucide="alert-triangle" class="w-6 h-6 inline mr-2"></i>
                Gefahrenbereich
            </h2>
            
            <div class="space-y-4">
                <div class="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <h3 class="font-semibold text-white mb-2">Familie löschen</h3>
                    <p class="text-sm text-text-secondary mb-3">
                        Diese Aktion kann nicht rückgängig gemacht werden. Alle Familiendaten, 
                        Beiträge, Bilder und Nachrichten werden permanent gelöscht.
                    </p>
                    <button id="btn-delete-family" class="btn-secondary bg-red-500/20 text-red-400 hover:bg-red-500/30 w-full">
                        <i data-lucide="trash-2" class="w-5 h-5 mr-2"></i>
                        Familie unwiderruflich löschen
                    </button>
                </div>

                <div class="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                    <h3 class="font-semibold text-white mb-2">Familie verlassen</h3>
                    <p class="text-sm text-text-secondary mb-3">
                        Du verlierst den Zugriff auf alle Familieninhalte. 
                        Du musst erneut eingeladen werden, um zurückzukehren.
                    </p>
                    <button id="btn-leave-family" class="btn-secondary bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 w-full">
                        <i data-lucide="log-out" class="w-5 h-5 mr-2"></i>
                        Familie verlassen
                    </button>
                </div>
            </div>

            <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">
                    Abbrechen
                </button>
            </div>
        </div>
    `;

    openModal(modalContent, 'modal-danger-zone');

    // Refresh icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    document.getElementById('btn-delete-family').onclick = () => handleDeleteFamily(familyId);
    document.getElementById('btn-leave-family').onclick = () => handleLeaveFamily(familyId);
}

/**
 * Handle family deletion
 */
async function handleDeleteFamily(familyId) {
    const confirmation = prompt('Bitte gib "LÖSCHEN" ein, um die Familie zu löschen:');
    
    if (confirmation !== 'LÖSCHEN') {
        showNotification('Löschvorgang abgebrochen', 'info');
        return;
    }

    try {
        // This would require a cloud function to properly delete all subcollections
        // For now, just show a message
        showNotification('Diese Funktion erfordert eine Cloud Function', 'warning');
        logger.info('Family deletion requested', { familyId });
    } catch (error) {
        logger.error('Failed to delete family', error);
        showNotification('Fehler beim Löschen der Familie', 'error');
    }
}

/**
 * Handle leaving family
 */
async function handleLeaveFamily(familyId) {
    if (!confirm('Möchtest du diese Familie wirklich verlassen?')) {
        return;
    }

    const { currentUser } = getCurrentUser();

    try {
        const familyRef = doc(db, 'families', familyId);
        const familyDoc = await getDoc(familyRef);
        const memberIds = familyDoc.data().memberIds || [];
        const adminIds = familyDoc.data().adminIds || [];

        // Remove user from memberIds and adminIds
        const newMemberIds = memberIds.filter(id => id !== currentUser.uid);
        const newAdminIds = adminIds.filter(id => id !== currentUser.uid);

        await updateDoc(familyRef, {
            memberIds: newMemberIds,
            adminIds: newAdminIds,
            updatedAt: serverTimestamp()
        });

        // Remove familyId from user
        await updateDoc(doc(db, 'users', currentUser.uid), {
            familyId: null
        });

        showNotification('Du hast die Familie verlassen', 'success');
        closeModal('modal-danger-zone');
        
        // Reload page
        setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
        logger.error('Failed to leave family', error);
        showNotification('Fehler beim Verlassen der Familie', 'error');
    }
}

// Global functions for inline event handlers
window.editMember = async (memberId) => {
    logger.info('Edit member clicked', { memberId });
    showNotification('Mitglieder-Bearbeitung wird implementiert', 'info');
};

window.editChildProfile = async (childId) => {
    logger.info('Edit child profile clicked', { childId });
    showNotification('Kind-Profil-Bearbeitung wird implementiert', 'info');
};

window.deleteChildProfile = async (childId) => {
    if (!confirm('Möchtest du dieses Kind-Profil wirklich löschen?')) {
        return;
    }

    const { currentFamilyId } = getCurrentUser();
    const childRef = doc(db, 'families', currentFamilyId, 'membersData', childId);

    try {
        await deleteDoc(childRef);
        showNotification('Kind-Profil gelöscht', 'success');
    } catch (error) {
        logger.error('Failed to delete child profile', error);
        showNotification('Fehler beim Löschen des Kind-Profils', 'error');
    }
};
