// src/feed.js
// KONSOLIDIERTE VERSION (Vollständiger Ersatz)

// --- 1. IMPORTE ---
import {
    db, auth,
    collection, query, onSnapshot, orderBy, getDocs, where,
    doc, deleteDoc, runTransaction, serverTimestamp, addDoc,
    ref, uploadBytesResumable, getDownloadURL
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import {
    showNotification,
    openModal,
    closeModal,
    showButtonSpinner,
    hideButtonSpinner
} from './ui.js';

// Komponenten-Importe
import { PostCard, EmptyStateCard, SkeletonCard } from './components/Card.js';
import { GratitudeTrigger, GratitudeCard } from './components/Gratitude.js';
import { PollCard } from './components/PollCard.js'; // NEU
import { GoalTrackerWidget } from './components/Goals.js'; // NEU
import { ExpenseCard } from './components/ExpenseCard.js'; // NEU

// Util-Importe
import { getTimeAgo } from './utils/formatters.js';

// --- 2. GLOBALE VARIABLEN & ZUSTAND ---
let posts = [];
let membersMap = {};
let currentFilter = 'all';
let postsUnsubscribe = null; // Um den Listener zu verwalten
let goalsUnsubscribe = null; // Listener für Ziele

// --- 3. INITIALISIERUNG & KERNLOGIK ---

/**
 * Hauptfunktion zum Rendern des Feeds.
 * Wird von navigation.js aufgerufen.
 * @param {object} listeners - Ein Objekt zur Verwaltung von Firestore-Listenern.
 */
export function renderFeed(listeners) {
    const feedContainer = document.getElementById('feed-posts-container');
    if (!feedContainer) {
        console.error("Feed-Container nicht gefunden.");
        return;
    }

    showFeedSkeleton(feedContainer);
    setupEventListeners();

    // Alte Listener beenden, da wir sie neu aufsetzen
    if (listeners.publicPosts) listeners.publicPosts();
    if (listeners.privatePosts) listeners.privatePosts();
    if (listeners.goals) listeners.goals();

    const { currentUser, currentFamilyId } = getCurrentUser();
    if (!currentFamilyId || !currentUser) {
        feedContainer.innerHTML = EmptyStateCard("Keine Familie", "Bitte melde dich neu an.", "alert-triangle");
        return;
    }

    // Mitgliederdaten einmalig laden
    fetchMembersData(currentFamilyId);

    // --- ECHTZEIT-REPARATUR ---
    let publicPosts = [];
    let privatePosts = [];
    let combinedLoaded = { public: false, private: false };

    const renderCombinedPosts = () => {
        if (!combinedLoaded.public || !combinedLoaded.private) {
            // Warte, bis beide Listener mindestens einmal geladen haben, um ein Flackern zu vermeiden
            return;
        }

        const allPosts = [...publicPosts, ...privatePosts];
        
        // Dedupliziere Posts, falls es Überschneidungen gibt
        const uniquePostsMap = new Map();
        allPosts.forEach(post => uniquePostsMap.set(post.id, post));
        const uniquePosts = Array.from(uniquePostsMap.values());

        // Sortiere die zusammengeführten Posts nach Datum
        uniquePosts.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA;
        });
        
        posts = uniquePosts; // Aktualisiere die globale Variable für die Filterung
        renderFilteredPosts(feedContainer);
    };

    const postsCollection = collection(db, 'families', currentFamilyId, 'posts');

    // Listener 1: Öffentliche Posts (alles, was kein 'expense' ist)
    const publicPostsQuery = query(
        postsCollection,
        where('type', '!=', 'expense'),
        orderBy('type'), // Notwendig für den != Filter
        orderBy('createdAt', 'desc')
    );

    listeners.publicPosts = onSnapshot(publicPostsQuery, (snapshot) => {
        publicPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        combinedLoaded.public = true;
        renderCombinedPosts();
    }, (error) => {
        console.error("Fehler beim Laden öffentlicher Posts:", error);
        showNotification("Fehler beim Laden der öffentlichen Posts.", "error");
    });

    // Listener 2: Private Ausgaben, an denen der Nutzer beteiligt ist
    const privatePostsQuery = query(
        postsCollection,
        where('type', '==', 'expense'),
        where('participants', 'array-contains', currentUser.uid),
        orderBy('createdAt', 'desc')
    );

    listeners.privatePosts = onSnapshot(privatePostsQuery, (snapshot) => {
        privatePosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        combinedLoaded.private = true;
        renderCombinedPosts();
    }, (error) => {
        console.error("Fehler beim Laden privater Posts:", error);
        // Hier wird bewusst kein Fehler angezeigt, da es normal sein kann, keine privaten Posts zu haben.
    });
    // --- ENDE ECHTZEIT-REPARATUR ---

    // Listener für Ziele (bleibt unverändert)
    const goalsQuery = query(
        collection(db, 'families', currentFamilyId, 'familyGoals'),
        orderBy('createdAt', 'desc')
    );

    listeners.goals = onSnapshot(goalsQuery, (snapshot) => {
        const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const goalWidgetContainer = document.getElementById('goal-widget-container');
        if (goalWidgetContainer) {
            goalWidgetContainer.innerHTML = GoalTrackerWidget(goals);
            const createGoalBtn = goalWidgetContainer.querySelector('#create-goal-from-widget');
            if(createGoalBtn) {
                createGoalBtn.onclick = () => window.navigateTo('settings', 'goals');
            }
        }
    }, (error) => {
        console.error("Fehler beim Laden der Ziele:", error);
        const goalWidgetContainer = document.getElementById('goal-widget-container');
        if (goalWidgetContainer) {
            goalWidgetContainer.innerHTML = `<div class="p-4 text-sm text-red-500">Ziele konnten nicht geladen werden.</div>`;
        }
    });
}

/**
 * Zeigt ein Lade-Skelett an, während die Daten abgerufen werden.
 * @param {HTMLElement} container - Das Container-Element für den Feed.
 */
function showFeedSkeleton(container) {
    container.innerHTML = `${SkeletonCard()}${SkeletonCard()}`;
}

/**
 * Filtert und rendert die Beiträge basierend auf dem aktuellen Filter.
 * @param {HTMLElement} container - Das Container-Element für den Feed.
 */
function renderFilteredPosts(container) {
    container.innerHTML = ''; // Leert den Container vor dem Neuzeichnen

    const filtered = posts.filter(post => {
        if (currentFilter === 'all') return true;
        // 'expense' Posts sollen nur im 'all' Filter erscheinen, da sie privat sind
        if (post.type === 'expense') return currentFilter === 'all';
        return post.type === currentFilter;
    });

    if (filtered.length === 0) {
        container.innerHTML = EmptyStateCard("Keine Beiträge", "Hier ist es noch leer. Erstelle den ersten Beitrag!", "inbox");
    } else {
        filtered.forEach(post => {
            const timeAgo = post.createdAt?.toDate ? getTimeAgo(post.createdAt.toDate()) : 'Gerade eben';
            if (post.type === 'expense') {
                container.innerHTML += ExpenseCard(post);
            } else {
                // PostCard rendert jetzt alle anderen Post-Typen
                container.innerHTML += PostCard(post, timeAgo, membersMap);
            }
        });
    }
    // Wichtig: Lucide-Icons nach dem Rendern neu initialisieren
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// --- 4. EVENT-LISTENER & INTERAKTIONS-SETUP ---

/**
 * Richtet alle notwendigen Event-Listener für die Feed-Seite ein.
 * Wird nur einmal aufgerufen, um doppelte Listener zu vermeiden.
 */
function setupEventListeners() {
    // FAB-Button (Neuer Beitrag)
    const fab = document.getElementById('fab-create-post');
    if (fab) {
        fab.onclick = () => openCreatePostModal();
    }

    // Filter-Buttons
    const filterContainer = document.getElementById('feed-filter-buttons');
    if (filterContainer) {
        filterContainer.onclick = (e) => {
            const button = e.target.closest('.btn-filter');
            if (!button) return;

            filterContainer.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderFilteredPosts(document.getElementById('feed-posts-container'));
        };
    }
    
    // Gratitude-Trigger (Dankbarkeit senden)
    const gratitudeTrigger = document.getElementById('gratitude-trigger-container');
    if(gratitudeTrigger) {
        gratitudeTrigger.onclick = (e) => {
            if (e.target.closest('#gratitude-trigger')) {
                openGratitudeModal();
            }
        };
    }
}

// --- 5. POST-ERSTELLUNG (MODAL & LOGIK) ---

/**
 * Öffnet das Modal zur Erstellung eines neuen Beitrags.
 */
function openCreatePostModal() {
    const modalId = 'modal-create-post';
    let selectedFile = null;
    let isPollActive = false;

    const modalContent = `
        <div class="modal-content glass-premium max-w-lg w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Neuer Beitrag</h2>
            <form id="create-post-form" class="space-y-4">
                <div id="post-image-preview" class="hidden w-full aspect-video rounded-lg bg-background-glass border border-border-glass relative mb-4">
                    <img id="post-image-preview-img" src="" alt="Vorschau" class="w-full h-full object-contain rounded-lg">
                    <button type="button" id="post-remove-image" class="icon-button-ghost absolute top-2 right-2 bg-black/50 hover:bg-black/75">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <textarea id="post-text-input" class="form-input" rows="5" placeholder="Was gibt's Neues, Familie?"></textarea>
                <input type="file" id="post-image-input" class="hidden" accept="image/*">
                
                <div id="poll-composer-container"></div>
                <div id="expense-creator-container" style="display: none;" class="space-y-4 glass-premium p-4 rounded-lg">
                    <label class="text-sm text-secondary">Private Ausgabe erfassen:</label>
                    <input type="number" id="expense-amount" class="form-input" placeholder="Betrag (€)" min="0.01" step="0.01" required>
                    <label class="text-sm text-secondary">Wer war dabei? (Inklusive dir)</label>
                    <div id="expense-participants" class="flex flex-wrap gap-2">
                    </div>
                </div>

                <div class="flex justify-between items-center pt-4 border-t border-border-glass">
                    <div class="flex gap-2">
                        <button type="button" id="post-image-trigger" class="icon-button-ghost" title="Bild hinzufügen">
                            <i data-lucide="image" class="w-5 h-5"></i>
                        </button>
                        <button type="button" id="post-poll-trigger" class="icon-button-ghost" title="Umfrage erstellen">
                            <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
                        </button>
                        <button type="button" id="expense-creator-btn" class="icon-button-ghost" title="Ausgabe erfassen" onclick="window.toggleExpenseCreator()">
                            <i data-lucide="receipt" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <div class="flex gap-3">
                        <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                        <button type="submit" id="create-post-submit" class="cta-primary-glow">
                            <span class="btn-text">Posten</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
    
    openModal(modalContent, modalId);

    // Event-Handler für das neue Modal-Inhalt registrieren
    const form = document.getElementById('create-post-form');
    const imageInput = document.getElementById('post-image-input');
    const imageTrigger = document.getElementById('post-image-trigger');
    const pollTrigger = document.getElementById('post-poll-trigger');
    const expenseTrigger = document.getElementById('expense-creator-btn'); // NEU

    imageTrigger.onclick = () => imageInput.click();
    imageInput.onchange = (e) => handleImagePreview(e.target.files[0], selectedFile);
    
    document.getElementById('post-remove-image').onclick = () => {
        selectedFile = null;
        imageInput.value = '';
        document.getElementById('post-image-preview').classList.add('hidden');
        document.getElementById('post-image-preview-img').src = '';
    };

    pollTrigger.onclick = () => {
        isPollActive = !isPollActive;
        pollTrigger.classList.toggle('active', isPollActive);
        document.getElementById('poll-composer-container').innerHTML = isPollActive ? PollComposerUI() : '';
        if (isPollActive) setupPollComposerListeners();
    };

    expenseTrigger.onclick = () => toggleExpenseCreator(); // NEU

    form.onsubmit = (e) => {
        e.preventDefault();
        const text = document.getElementById('post-text-input').value.trim();
        const isExpense = document.getElementById('expense-creator-container')?.style.display !== 'none';
        
        if (isPollActive) {
            handleSavePoll(text);
        } else if (isExpense) {
            handleExpenseSubmit(e); // Leite an separate Funktion weiter
        } else {
            handleSaveStandardPost(text, selectedFile);
        }
    };
}

// --- NEUE FUNKTIONEN FÜR AUSGABEN ---

let selectedParticipants = [];

/**
 * Schaltet die Sichtbarkeit des Ausgaben-Erstellungsbereichs um.
 */
function toggleExpenseCreator() {
    const container = document.getElementById('expense-creator-container');
    const expenseBtn = document.getElementById('expense-creator-btn');
    const isActive = container.style.display !== 'none';

    if (!isActive) {
        // Aktivieren
        container.style.display = 'block';
        expenseBtn.classList.add('active');
        renderParticipantSelector();
    } else {
        // Deaktivieren
        container.style.display = 'none';
        expenseBtn.classList.remove('active');
        selectedParticipants = []; // Auswahl zurücksetzen
    }
}

/**
 * Rendert die Mitgliederauswahl für eine Ausgabe.
 */
function renderParticipantSelector() {
    const { currentUser } = getCurrentUser();
    const container = document.getElementById('expense-participants');
    if (!container) return;

    // Aktuellen Benutzer standardmäßig hinzufügen und auswählen
    selectedParticipants = [currentUser.uid];

    let membersHTML = '';
    for (const memberId in membersMap) {
        const member = membersMap[memberId];
        const isSelected = selectedParticipants.includes(member.uid);
        membersHTML += `
            <div 
                class="participant-chip ${isSelected ? 'selected' : ''}" 
                data-uid="${member.uid}"
                onclick="window.toggleParticipant(this)"
            >
                <img src="${member.photoURL || 'img/default_avatar.png'}" alt="${member.name}" class="w-6 h-6 rounded-full mr-2">
                <span>${member.name}</span>
            </div>
        `;
    }
    container.innerHTML = membersHTML;
}

/**
 * Fügt einen Teilnehmer zur Auswahl hinzu oder entfernt ihn.
 * @param {HTMLElement} element - Das geklickte Chip-Element.
 */
window.toggleParticipant = (element) => {
    const uid = element.dataset.uid;
    const { currentUser } = getCurrentUser();

    // Der Ersteller kann nicht abgewählt werden
    if (uid === currentUser.uid) {
        showNotification("Als Ersteller bist du immer dabei.", "info");
        return;
    }

    const index = selectedParticipants.indexOf(uid);
    if (index > -1) {
        selectedParticipants.splice(index, 1);
        element.classList.remove('selected');
    } else {
        selectedParticipants.push(uid);
        element.classList.add('selected');
    }
};

/**
 * Speichert eine neue private Ausgabe.
 */
async function handleExpenseSubmit() {
    const submitBtn = document.getElementById('create-post-submit');
    const amountInput = document.getElementById('expense-amount');
    const descriptionInput = document.getElementById('post-text-input');
    
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value.trim();

    if (!description) {
        showNotification("Bitte gib eine Beschreibung für die Ausgabe ein.", "error");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        showNotification("Bitte gib einen gültigen Betrag ein.", "error");
        return;
    }
    if (selectedParticipants.length === 0) {
        showNotification("Bitte wähle mindestens einen Teilnehmer aus.", "error");
        return;
    }

    showButtonSpinner(submitBtn);
    const { currentUser, currentFamilyId } = getCurrentUser();

    const expenseData = {
        text: description,
        amount: amount,
        participants: selectedParticipants, // Array der UIDs
        type: 'expense',
        authorId: currentUser.uid,
        createdAt: serverTimestamp(),
        // Keine Likes oder Kommentare für private Ausgaben
    };

    try {
        await addDoc(collection(db, 'families', currentFamilyId, 'posts'), expenseData);
        closeModal('modal-create-post');
        showNotification("Ausgabe erfasst!", "success");
    } catch (error) {
        console.error("Fehler beim Erfassen der Ausgabe:", error);
        showNotification("Fehler: Ausgabe konnte nicht erfasst werden.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
        selectedParticipants = []; // Zustand zurücksetzen
    }
}


function handleImagePreview(file, selectedFileRef) {
    if (file && file.type.startsWith('image/')) {
        selectedFileRef = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('post-image-preview-img').src = e.target.result;
            document.getElementById('post-image-preview').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function PollComposerUI() {
    return `
        <div class="space-y-3 pt-4 border-t border-border-glass">
            <input type="text" id="poll-question" class="form-input" placeholder="Deine Frage...">
            <div id="poll-options-container" class="space-y-2">
                <div class="poll-option-input-group">
                    <input type="text" class="poll-option-input" placeholder="Option 1">
                </div>
                <div class="poll-option-input-group">
                    <input type="text" class="poll-option-input" placeholder="Option 2">
                </div>
            </div>
            <button type="button" id="add-poll-option-btn" class="btn-secondary text-sm">
                <i data-lucide="plus" class="w-4 h-4 mr-2"></i>Option hinzufügen
            </button>
        </div>
    `;
}

function setupPollComposerListeners() {
    document.getElementById('add-poll-option-btn').onclick = () => {
        const container = document.getElementById('poll-options-container');
        if (container.children.length >= 5) {
            showNotification("Maximal 5 Optionen erlaubt.", "error");
            return;
        }
        const newOption = document.createElement('div');
        newOption.className = 'poll-option-input-group';
        newOption.innerHTML = `
            <input type="text" class="poll-option-input" placeholder="Option ${container.children.length + 1}">
            <button type="button" class="remove-option-btn icon-button-ghost">
                <i data-lucide="x-circle" class="w-5 h-5"></i>
            </button>
        `;
        container.appendChild(newOption);
        newOption.querySelector('.remove-option-btn').onclick = () => newOption.remove();
    };
}

async function handleSaveStandardPost(text, file) {
    const submitBtn = document.getElementById('create-post-submit');
    if (!text && !file) {
        showNotification("Bitte Text eingeben oder Bild wählen.", "error");
        return;
    }
    showButtonSpinner(submitBtn);

    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    let imageUrl = null;

    try {
        if (file) {
            const storageRef = ref(storage, `media/${currentFamilyId}/posts/${Date.now()}_${file.name}`);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            imageUrl = await getDownloadURL(uploadTask.ref);
        }

        await addDoc(collection(db, 'families', currentFamilyId, 'posts'), {
            text: text || null,
            imageUrl: imageUrl,
            type: 'post',
            authorId: currentUser.uid,
            createdAt: serverTimestamp(),
            likes: [],
            comments: []
        });
        
        closeModal('modal-create-post');
        showNotification("Beitrag erstellt!", "success");
    } catch (error) {
        console.error("Fehler beim Posten:", error);
        showNotification("Fehler: Beitrag konnte nicht erstellt werden.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

async function handleSavePoll(description) {
    const submitBtn = document.getElementById('create-post-submit');
    const question = document.getElementById('poll-question').value.trim();
    const options = Array.from(document.querySelectorAll('.poll-option-input'))
        .map(input => input.value.trim())
        .filter(Boolean);

    if (!question || options.length < 2) {
        showNotification("Eine Umfrage braucht eine Frage und mind. 2 Optionen.", "error");
        return;
    }
    showButtonSpinner(submitBtn);

    const { currentUser, currentFamilyId } = getCurrentUser();
    const pollData = {
        text: description || question,
        question: question,
        options: options.map(opt => ({ text: opt, votes: 0 })),
        type: 'poll',
        authorId: currentUser.uid,
        createdAt: serverTimestamp(),
        userVotes: {},
        likes: [],
        comments: []
    };

    try {
        await addDoc(collection(db, 'families', currentFamilyId, 'posts'), pollData);
        closeModal('modal-create-post');
        showNotification("Umfrage erstellt!", "success");
    } catch (error) {
        console.error("Fehler beim Erstellen der Umfrage:", error);
        showNotification("Fehler: Umfrage konnte nicht erstellt werden.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

// --- 6. DANKBARKEITS-MODAL & LOGIK ---

async function openGratitudeModal() {
    const { currentUser, currentFamilyId } = getCurrentUser();
    const members = Object.values(membersMap).filter(m => m.uid !== currentUser.uid);

    if (members.length === 0) {
        showNotification("Keine anderen Mitglieder zum Danken da.", "info");
        return;
    }

    const modalId = 'modal-gratitude';
    const modalContent = `
        <div class="modal-content glass-premium max-w-md w-full">
            <h2 class="text-xl font-bold text-gradient mb-4">Dankbarkeit senden</h2>
            <p class="text-secondary mb-6">Wähle eine Person aus, der du danken möchtest.</p>
            <div id="gratitude-members-grid" class="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
                ${members.map(member => `
                    <div class="gratitude-member-item" data-uid="${member.uid}">
                        <img src="${member.photoURL || 'img/default_avatar.png'}" alt="${member.name}" class="w-16 h-16 rounded-full object-cover mx-auto mb-2">
                        <span class="text-sm font-medium text-center block">${member.name}</span>
                    </div>
                `).join('')}
            </div>
            <div id="gratitude-message-section" class="hidden space-y-4">
                <textarea id="gratitude-message" class="form-input" rows="3" placeholder="Deine Nachricht (optional)"></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="button" id="gratitude-modal-send" class="cta-primary-glow" disabled>Senden</button>
            </div>
        </div>
    `;
    
    openModal(modalContent, modalId);

    const membersGrid = document.getElementById('gratitude-members-grid');
    const messageSection = document.getElementById('gratitude-message-section');
    const sendBtn = document.getElementById('gratitude-modal-send');
    let selectedMemberUid = null;

    membersGrid.onclick = (e) => {
        const item = e.target.closest('.gratitude-member-item');
        if (!item) return;
        
        selectedMemberUid = item.dataset.uid;
        membersGrid.querySelectorAll('.gratitude-member-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        messageSection.classList.remove('hidden');
        sendBtn.disabled = false;
    };

    sendBtn.onclick = async () => {
        const text = document.getElementById('gratitude-message').value.trim();
        await handleSaveGratitude(sendBtn, selectedMemberUid, text);
        closeModal(modalId);
    };
}

async function handleSaveGratitude(submitBtn, toUID, text) {
    showButtonSpinner(submitBtn);
    const { currentUser, currentFamilyId } = getCurrentUser();

    const gratitudeData = {
        fromUID: currentUser.uid,
        toUID: toUID,
        text: text || null,
        type: 'gratitude',
        authorId: currentUser.uid,
        createdAt: serverTimestamp(),
        likes: [],
        comments: []
    };

    try {
        await addDoc(collection(db, 'families', currentFamilyId, 'posts'), gratitudeData);
        showNotification("Dankbarkeit gesendet!", "success");
    } catch (error) {
        console.error("Fehler beim Senden der Dankbarkeit:", error);
        showNotification("Senden fehlgeschlagen.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

// --- 7. GLOBALE AKTIONEN (auf window-Objekt) ---

/**
 * Behandelt die Abstimmung bei einer Umfrage.
 * @param {string} postId - Die ID des Beitrags (der Umfrage).
 * @param {number} optionIndex - Der Index der gewählten Option.
 */
window.handleVote = async (postId, optionIndex) => {
    const { currentUser, currentFamilyId } = getCurrentUser();
    const postRef = doc(db, 'families', currentFamilyId, 'posts', postId);

    try {
        await runTransaction(db, async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists()) {
                throw "Umfrage nicht gefunden!";
            }

            const postData = postDoc.data();

            // 1. Prüfen, ob der Benutzer bereits abgestimmt hat.
            if (postData.userVotes && postData.userVotes[currentUser.uid] !== undefined) {
                showNotification("Du hast bereits abgestimmt.", "info");
                return; // Transaktion sicher beenden
            }

            // 2. Update-Objekt vorbereiten
            const newOptions = [...postData.options];
            newOptions[optionIndex].votes = (newOptions[optionIndex].votes || 0) + 1;

            const newUserVotes = { ...postData.userVotes, [currentUser.uid]: optionIndex };

            // 3. Transaktion ausführen
            transaction.update(postRef, {
                options: newOptions,
                userVotes: newUserVotes
            });
        });
    } catch (error) {
        console.error("Fehler bei der Abstimmung:", error);
        showNotification("Fehler bei der Abstimmung.", "error");
    }
};

window.toggleLike = async (postId) => {
    const { currentUser, currentFamilyId } = getCurrentUser();
    const postRef = doc(db, 'families', currentFamilyId, 'posts', postId);

    try {
        await runTransaction(db, async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists()) throw "Post nicht gefunden!";

            const postData = postDoc.data();
            const likes = postData.likes || [];
            
            if (likes.includes(currentUser.uid)) {
                transaction.update(postRef, { 
                    likes: likes.filter(uid => uid !== currentUser.uid)
                });
            } else {
                transaction.update(postRef, { 
                    likes: [...likes, currentUser.uid]
                });
            }
        });
    } catch (error) {
        console.error("Fehler beim Liken:", error);
        showNotification("Fehler beim Liken.", "error");
    }
};

// --- 6. DANKBARKEITS-MODUL LOGIK ---

function setupGratitudeTrigger() {
    // Der Trigger wird jetzt in setupFilterButtons() gerendert.
    // Wir müssen hier nur den Event-Listener hinzufügen.
    document.body.addEventListener('click', e => {
        const trigger = e.target.closest('#gratitude-trigger');
        if (trigger) {
            openGratitudeModal();
        }
    });
}

async function openGratitudeModal() {
    const { currentUser, currentFamilyId } = getCurrentUser();
    const membersCollectionRef = collection(db, 'families', currentFamilyId, 'membersData');
    
    try {
        const snapshot = await getDocs(membersCollectionRef);
        const members = snapshot.docs
            .map(doc => ({ uid: doc.id, ...doc.data() }))
            .filter(member => member.uid !== currentUser.uid); // Man kann sich nicht selbst danken

        if (members.length === 0) {
            showNotification("Es sind keine anderen Familienmitglieder da, denen du danken könntest.", "info");
            return;
        }

        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = GratitudeModal(members);
        if (typeof lucide !== 'undefined') lucide.createIcons();

        const backdrop = document.getElementById('gratitude-modal-backdrop');
        const closeBtn = document.getElementById('gratitude-modal-close');
        const cancelBtn = document.getElementById('gratitude-modal-cancel');
        const sendBtn = document.getElementById('gratitude-modal-send');
        const membersGrid = document.getElementById('gratitude-members-grid');
        const messageSection = document.getElementById('gratitude-message-section');
        
        let selectedMemberUid = null;

        // Modal öffnen
        setTimeout(() => backdrop.classList.add('active'), 10);

        const closeModal = () => {
            backdrop.classList.remove('active');
            setTimeout(() => backdrop.remove(), 300);
        };

        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;
        backdrop.onclick = (e) => {
            if (e.target === backdrop) {
                closeModal();
            }
        };

        membersGrid.addEventListener('click', (e) => {
            const memberItem = e.target.closest('.gratitude-member-item');
            if (!memberItem) return;

            // Auswahl umschalten
            membersGrid.querySelectorAll('.gratitude-member-item').forEach(item => item.classList.remove('selected'));
            memberItem.classList.add('selected');
            
            selectedMemberUid = memberItem.dataset.uid;
            messageSection.classList.remove('hidden');
            sendBtn.disabled = false;
        });

        sendBtn.onclick = async () => {
            if (!selectedMemberUid) {
                showNotification("Bitte wähle eine Person aus.", "error");
                return;
            }
            const message = document.getElementById('gratitude-message').value.trim();
            await saveGratitudePost(sendBtn, selectedMemberUid, message);
            closeModal();
        };

    } catch (error) {
        console.error("Fehler beim Laden der Familienmitglieder:", error);
        showNotification("Konnte Mitgliederliste nicht laden.", "error");
    }
}

async function saveGratitudePost(submitBtn, toUID, text) {
    showButtonSpinner(submitBtn);
    const { currentUser, currentFamilyId } = getCurrentUser();

    const gratitudeData = {
        fromUID: currentUser.uid,
        toUID: toUID,
        text: text || null,
        type: 'gratitude',
        createdAt: serverTimestamp(),
        // author-Felder sind für Kompatibilität mit PostCard etc., falls nötig
        authorId: currentUser.uid, 
        likes: [],
        comments: []
    };

    try {
        await addDoc(collection(db, 'families', currentFamilyId, 'posts'), gratitudeData);
        showNotification("Dankbarkeit gesendet!", "success");
        // Hier könnte man eine Push-Benachrichtigung auslösen
    } catch (error) {
        console.error("Fehler beim Senden der Dankbarkeit:", error);
        showNotification("Senden fehlgeschlagen.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

async function fetchMembersData(familyId) {
    const membersRef = collection(db, 'families', familyId, 'membersData');
    try {
        const snapshot = await getDocs(membersRef);
        snapshot.forEach(doc => {
            membersMap[doc.id] = doc.data();
        });
    } catch (error) {
        console.error("Fehler beim Abrufen der Mitgliederdaten:", error);
    }
}

// --- 7. AUFRÄUMFUNKTION ---