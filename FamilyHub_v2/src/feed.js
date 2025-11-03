// --- 1. IMPORTE ---
import { 
    db, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, 
    uploadBytesResumable, ref, getDownloadURL, doc, updateDoc, increment, arrayUnion, 
    arrayRemove, runTransaction, where
} from './firebase.js'; // KORRIGIERT: uploadBytesResumable, arrayRemove
import { getCurrentUser } from './auth.js';
import { showNotification, closeModal, showButtonSpinner, hideButtonSpinner } from './ui.js'; // KORRIGIERT: Importiert ui.js
import { render, append } from './components/index.js'; // KORREKTUR: Importiert aus index.js
import {
    PostCard, EmptyStateCard, SkeletonCard, Card, InfoCard
} from './components/Card.js';
// KORREKTUR: Button.js Import-Block komplett entfernt
import { getTimeAgo } from './utils/formatters.js';

// Importiere die neuen Komponenten-Logiken
import { PollCard } from './components/PollCard.js';
import { GratitudeCard, GratitudeTrigger } from './components/Gratitude.js';
import { GoalTrackerWidget } from './components/Goals.js';
import { ExpenseCard } from './components/ExpenseCard.js';

// --- 2. GLOBALE KOMPONENTEN-REFERENZEN ---
if (!window.PollCard) window.PollCard = PollCard;
if (!window.GratitudeCard) window.GratitudeCard = GratitudeCard;
if (!window.ExpenseCard) window.ExpenseCard = ExpenseCard;

// --- 3. MODUL-VARIABLEN (Top-Level Scope) ---
let postImageFile = null;
let selectedParticipants = [];

// --- 4. HAUPT-RENDER-FUNKTION (Wird bei Navigation aufgerufen) ---
export function renderFeed(listeners) {
    const { currentFamilyId, currentUser } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;

    const postsContainer = document.getElementById('feed-posts-container');
    const gratitudeContainer = document.getElementById('gratitude-trigger-container');
    const goalsContainer = document.getElementById('goal-widget-container');

    if (!postsContainer || !gratitudeContainer || !goalsContainer) {
        console.error("Feed-Template-Struktur nicht gefunden.");
        return;
    }

    render(GratitudeTrigger(), gratitudeContainer);
    
    const goalsQuery = query(collection(db, 'families', currentFamilyId, 'familyGoals'), orderBy('title'));
    listeners.goals = onSnapshot(goalsQuery, (snapshot) => {
        const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        render(GoalTrackerWidget(goals), goalsContainer);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, (error) => console.error("Error loading goals:", error));

    showFeedSkeleton(postsContainer);

    let publicPosts = [];
    let privatePosts = [];
    let combinedLoaded = { public: false, private: false };

    const renderCombinedPosts = () => {
        if (!combinedLoaded.public || !combinedLoaded.private) return;

        const allPosts = [...publicPosts, ...privatePosts]
            .sort((a, b) => {
                const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });
            
        const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());

        if (uniquePosts.length === 0) {
            const createButton = `
                <button class="cta-primary-glow inline-flex items-center gap-2 px-8 py-3 text-lg" onclick="window.openCreatePostModal()">
                    <i data-lucide="plus-circle" class="w-6 h-6"></i>
                    <span>Ersten Beitrag erstellen</span>
                </button>
            `;
            const emptyStateHTML = EmptyStateCard(
                'Willkommen bei FamilyHub!',
                'Beginnt jetzt, besondere Momente zu teilen.',
                '<i data-lucide="users" class="w-12 h-12 text-[#A04668]"></i>',
                createButton
            );
            render(emptyStateHTML, postsContainer);
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        postsContainer.innerHTML = '';
        uniquePosts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    const publicPostsQuery = query(
        collection(db, 'families', currentFamilyId, 'posts'),
        where('participants', '==', null),
        orderBy('createdAt', 'desc')
    );
    listeners.publicPosts = onSnapshot(publicPostsQuery, (snapshot) => {
        publicPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        combinedLoaded.public = true;
        renderCombinedPosts();
    }, (error) => console.error("Error public posts:", error));
    
    const privatePostsQuery = query(
        collection(db, 'families', currentFamilyId, 'posts'),
        where('participants', 'array-contains', currentUser.uid),
        orderBy('createdAt', 'desc')
    );
    listeners.privatePosts = onSnapshot(privatePostsQuery, (snapshot) => {
        privatePosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        combinedLoaded.private = true;
        renderCombinedPosts();
    }, (error) => console.error("Error private posts:", error));
}

// --- 5. INTERNE HILFSFUNKTIONEN (Nicht-Global) ---

function createPostElement(post) {
    const { currentUser } = getCurrentUser();
    const author = post.authorName || 'Unbekannt';
    const avatar = post.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=0A0908&color=F2F4F3&bold=true`;
    const timeAgo = post.createdAt ? getTimeAgo(post.createdAt.toDate()) : 'Gerade eben';

    const postCardData = {
        authorName: author,
        authorAvatar: avatar,
        timestamp: timeAgo,
        content: post.text,
        imageUrl: post.imageUrl || '',
        postId: post.id,
        authorId: post.authorId,
        post: post, 
        actions: [
            {
                icon: '<i data-lucide="heart" class="w-5 h-5"></i>',
                count: post.likes || 0,
                onClick: `toggleLike('${post.id}', this)`,
                active: post.likedBy && post.likedBy.includes(currentUser.uid) 
            },
            {
                icon: '<i data-lucide="message-circle" class="w-5 h-5"></i>',
                count: post.commentCount || 0,
                onClick: `openComments('${post.id}')`,
                active: false
            },
            {
                icon: '<i data-lucide="share-2" class="w-5 h-5"></i>',
                count: null,
                onClick: `sharePost('${post.id}')`,
                active: false,
                className: 'ml-auto'
            }
        ]
    };

    if (post.type === 'gratitude' || post.type === 'expense') {
        postCardData.actions = [];
    }

    const postElement = document.createElement('div');
    postElement.className = 'animate-slide-in-up mb-6'; 
    postElement.innerHTML = PostCard(postCardData); 

    if (postCardData.actions.length > 0 && postCardData.actions[0].active) {
        const likeBtn = postElement.querySelector(`button[onclick*="toggleLike"]`);
        if (likeBtn) likeBtn.classList.add('active');
    }
    return postElement;
}

function showFeedSkeleton(container) {
    const skeletonHTML = Array(3).fill(SkeletonCard({ lines: 3, hasImage: true })).join('');
    render(skeletonHTML, container);
}

async function loadComments(postId) {
    const { currentFamilyId } = getCurrentUser();
    const commentsList = document.getElementById('comments-list-container'); 
    if (!commentsList) return;
    
    try {
        const commentsQuery = query(
            collection(db, 'families', currentFamilyId, 'posts', postId, 'comments'),
            orderBy('createdAt', 'desc')
        );
        
        onSnapshot(commentsQuery, (snapshot) => {
            if (snapshot.empty) {
                commentsList.innerHTML = EmptyStateCard('Noch keine Kommentare', 'Sei der Erste!', '💬', '');
                return;
            }
            commentsList.innerHTML = '';
            snapshot.forEach((docSnap) => {
                const comment = docSnap.data();
                append(createCommentElement(comment), commentsList);
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = InfoCard('Fehler', 'Kommentare konnten nicht geladen werden.', '⚠️');
    }
}

function createCommentElement(comment) {
    const avatar = comment.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName || 'U')}`;
    const timestamp = comment.createdAt ? getTimeAgo(comment.createdAt.toDate()) : 'gerade eben';
    
    const content = `
        <div style="display: flex; gap: 12px; align-items: flex-start;">
            <img src="${avatar}" alt="${comment.authorName}" style="width: 40px; height: 40px; border-radius: 50%;">
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-weight: bold; font-size: 0.9rem;">${comment.authorName}</span>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${timestamp}</span>
                </div>
                <p style="color: var(--text-secondary); white-space: pre-wrap;">${comment.text}</p>
            </div>
        </div>
    `;
    return Card(content, { variant: 'default', padding: 'md', className: 'animate-fade-in mb-3' });
}

async function addComment(postId) {
    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    const commentInput = document.getElementById('comment-input');
    const text = commentInput.value.trim();
    if (!text) return;
    
    const submitBtn = document.querySelector('#comment-form button[type="submit"]');
    showButtonSpinner(submitBtn);
    
    try {
        const postRef = doc(db, 'families', currentFamilyId, 'posts', postId);
        await addDoc(collection(db, 'families', currentFamilyId, 'posts', postId, 'comments'), {
            text: text,
            authorId: currentUser.uid,
            authorName: currentUserData.name || 'Unbekannt',
            authorAvatar: currentUser.photoURL || null,
            createdAt: serverTimestamp()
        });
        
        await updateDoc(postRef, { commentCount: increment(1) });
        commentInput.value = '';
        
    } catch (error) {
        console.error('Error adding comment:', error);
        showNotification('Fehler beim Kommentieren', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
        submitBtn.innerHTML = '<i data-lucide="send" class="w-5 h-5"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// --- Creator UI-Logik (Intern) ---
function togglePollCreator() {
    const pollUI = document.getElementById('poll-creator-container');
    const expenseUI = document.getElementById('expense-creator-container');
    const postText = document.getElementById('post-text-input');
    const pollBtn = document.getElementById('poll-creator-btn');

    if (pollUI.style.display === 'none') {
        if (expenseUI.style.display !== 'none') toggleExpenseCreator(); // Schließe Expense
        pollUI.style.display = 'block';
        postText.placeholder = 'Deine Umfrage-Frage...';
        pollBtn.classList.add('active');
        if (document.getElementById('poll-options').childElementCount === 0) {
            addPollOption();
            addPollOption();
        }
    } else {
        pollUI.style.display = 'none';
        postText.placeholder = 'Was möchtest du teilen?';
        pollBtn.classList.remove('active');
    }
}
function addPollOption() {
    const container = document.getElementById('poll-options');
    if (container.childElementCount >= 5) return showNotification("Maximal 5 Optionen", "warning");
    
    const count = container.childElementCount + 1;
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-2';
    
    const label = document.createElement('label');
    label.className = 'sr-only'; // Nur für Screenreader sichtbar
    label.setAttribute('for', `poll_option_${count}`);
    label.textContent = `Option ${count}`;
    
    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.className = 'form-input poll-option-input flex-1';
    optionInput.placeholder = `Option ${count}`;
    optionInput.name = `poll_option_${count}`;
    optionInput.id = `poll_option_${count}`;
    optionInput.required = true;
    
    wrapper.appendChild(label);
    wrapper.appendChild(optionInput);
    container.appendChild(wrapper);
}
function toggleExpenseCreator() {
    const expenseUI = document.getElementById('expense-creator-container');
    const pollUI = document.getElementById('poll-creator-container');
    const postText = document.getElementById('post-text-input');
    const expenseBtn = document.getElementById('expense-creator-btn');

    if (expenseUI.style.display === 'none') {
        if (pollUI.style.display !== 'none') togglePollCreator(); // Schließe Poll
        expenseUI.style.display = 'block';
        postText.placeholder = 'Beschreibung der Ausgabe (z.B. Pizzaessen)';
        expenseBtn.classList.add('active');
        renderParticipantSelector();
    } else {
        expenseUI.style.display = 'none';
        postText.placeholder = 'Was möchtest du teilen?';
        expenseBtn.classList.remove('active');
    }
}
function renderParticipantSelector() {
    const { membersData, currentUser } = getCurrentUser();
    const container = document.getElementById('expense-participants');
    container.innerHTML = '';
    selectedParticipants = [currentUser.uid]; // Ersteller ist immer dabei

    Object.values(membersData).forEach(member => {
        const isSelected = selectedParticipants.includes(member.uid);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `flex items-center gap-2 p-1 pr-2 rounded-full transition-all ${isSelected ? 'bg-primary-rose/80 text-white' : 'bg-white/10'}`;
        btn.dataset.uid = member.uid;
        btn.onclick = () => toggleParticipant(member.uid);
        btn.innerHTML = `
            <img src="${member.photoURL || `https://ui-avatars.com/api/?name=${member.name.charAt(0)}`}" class="w-6 h-6 rounded-full">
            <span class="text-sm">${member.name}</span>
        `;
        container.appendChild(btn);
    });
}
function toggleParticipant(uid) {
    const { currentUser } = getCurrentUser();
    if (uid === currentUser.uid) return; // Ersteller kann nicht abgewählt werden
    
    const index = selectedParticipants.indexOf(uid);
    if (index > -1) {
        selectedParticipants.splice(index, 1);
    } else {
        selectedParticipants.push(uid);
    }
    renderParticipantSelector(); // Neu rendern, um Auswahl zu zeigen
}

// --- Interne Submit-Handler ---
async function handlePollSubmit(event) {
    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    const question = document.getElementById('post-text-input').value.trim();
    if (!question) return showNotification("Bitte eine Frage eingeben", "warning");

    const optionNodes = document.querySelectorAll('.poll-option-input');
    const options = Array.from(optionNodes).map(input => input.value.trim()).filter(text => text.length > 0);
    if (options.length < 2) return showNotification("Mindestens 2 Optionen benötigt", "warning");

    const pollData = {
        type: 'poll',
        text: question,
        options: options.map(optText => ({ text: optText, votes: 0 })),
        votedBy: [],
        votesMap: {},
        authorId: currentUser.uid,
        authorName: currentUserData.name,
        authorAvatar: currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        participants: null // WICHTIG für Query
    };

    const submitBtn = event.target.closest('form').querySelector('button[type="submit"]');
    showButtonSpinner(submitBtn);

    try {
        await addDoc(collection(db, 'families', currentFamilyId, 'posts'), pollData);
        showNotification("✅ Umfrage gestartet!", "success");
        closeModal();
    } catch (error) {
        console.error("Error creating poll:", error);
        hideButtonSpinner(submitBtn);
    }
}

async function handleExpenseSubmit(event) {
    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    const text = document.getElementById('post-text-input').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);

    if (!text || isNaN(amount) || amount <= 0) {
        return showNotification("Bitte Betrag und Beschreibung eingeben", "warning");
    }
    if (selectedParticipants.length === 0) {
        return showNotification("Bitte Teilnehmer auswählen", "warning");
    }

    const expenseData = {
        type: 'expense',
        text: text,
        amount: amount,
        participants: selectedParticipants, // Array von UIDs
        authorId: currentUser.uid,
        authorName: currentUserData.name,
        authorAvatar: currentUser.photoURL || null,
        createdAt: serverTimestamp()
    };

    const submitBtn = event.target.closest('form').querySelector('button[type="submit"]');
    showButtonSpinner(submitBtn);

    try {
        await addDoc(collection(db, 'families', currentFamilyId, 'posts'), expenseData);
        showNotification("✅ Ausgabe erfasst!", "success");
        closeModal();
    } catch (error) {
        console.error("Error creating expense:", error);
        hideButtonSpinner(submitBtn);
    }
}

// --- 6. GLOBALE FUNKTIONEN (Nur EINMAL deklariert) ---

if (!window.handlePostSubmit) {
    window.handlePostSubmit = async (event) => {
        event.preventDefault();
        const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
        if (!currentUser || !currentUserData) return showNotification("Fehler: Nicht angemeldet.", "error");

        const isPoll = document.getElementById('poll-creator-container')?.style.display !== 'none';
        if (isPoll) return handlePollSubmit(event);
        
        const isExpense = document.getElementById('expense-creator-container')?.style.display !== 'none';
        if (isExpense) return handleExpenseSubmit(event);

        const text = document.getElementById('post-text-input').value;
        if (!text.trim() && !postImageFile) {
            return showNotification("Bitte gib einen Text ein oder wähle ein Bild aus.", "warning");
        }

        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        showButtonSpinner(submitBtn);

        try {
            let imageUrl = null;
            if (postImageFile) {
                const { storage } = await import('./firebase.js'); // Importiert Storage
                const storageRef = ref(storage, `posts/${currentFamilyId}/${Date.now()}_${postImageFile.name}`);
                const snapshot = await uploadBytesResumable(storageRef, postImageFile); // KORREKTUR
                imageUrl = await getDownloadURL(snapshot.ref);
            }
            await addDoc(collection(db, 'families', currentFamilyId, 'posts'), {
                type: 'post',
                text: text,
                imageUrl: imageUrl,
                authorId: currentUser.uid,
                authorName: currentUserData.name,
                authorAvatar: currentUser.photoURL || null,
                createdAt: serverTimestamp(),
                likes: 0,
                commentCount: 0,
                likedBy: [],
                participants: null // WICHTIG für die Query
            });
            showNotification("✅ Beitrag erfolgreich geteilt!", "success");
            closeModal();
        } catch (error) {
            console.error("Error creating post:", error);
            showNotification("Fehler beim Erstellen des Beitrags.", "error");
            hideButtonSpinner(submitBtn);
            submitBtn.innerHTML = originalBtnHTML;
        }
    };
}

if (!window.openCreatePostModal) {
    window.openCreatePostModal = () => {
        const modalId = 'modal-create-post';
        const modalFormContent = `
            <form id="create-post-form" class="modal-content-scrollable" onsubmit="window.handlePostSubmit(event)" style="display: flex; flex-direction: column; height: 100%;">
                
                <div class="flex-shrink-0">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gradient">Neuer Beitrag</h2>
                        <button type="button" class="icon-button-ghost p-2 -mr-2 -mt-2" data-action="close-modal">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex-grow overflow-y-auto pr-2 space-y-4">
                    <label for="post-text-input" class="sr-only">Beitragstext</label>
                    <textarea id="post-text-input" class="form-input min-h-[120px] resize-none" placeholder="Was möchtest du deiner Familie mitteilen?" required></textarea>
                    
                    <div id="poll-creator-container" style="display: none;" class="space-y-2">
                        <label class="text-sm text-secondary">Umfrage-Optionen:</label>
                        <div id="poll-options" class="space-y-2"></div>
                        <button type="button" class="btn-secondary text-xs" onclick="addPollOption()">+ Option hinzufügen</button>
                    </div>

                    <div id="expense-creator-container" style="display: none;" class="space-y-4 glass-premium p-4 rounded-lg">
                        <label for="expense-amount" class="text-sm text-secondary">Private Ausgabe erfassen:</label>
                        <input type="number" id="expense-amount" name="expense-amount" class="form-input" placeholder="Betrag (€)" min="0.01" step="0.01">
                        <label class="text-sm text-secondary">Wer war dabei? (Inklusive dir)</label>
                        <div id="expense-participants" class="flex flex-wrap gap-2"></div>
                    </div>

                    <div id="post-image-preview-container" class="hidden relative rounded-xl overflow-hidden border border-border-glass">
                        <img id="post-image-preview" class="w-full max-h-64 object-cover" alt="Vorschau">
                        <div class="absolute top-3 right-3">
                            <button type="button" onclick="removePostImage()" class="w-8 h-8 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center transition-all backdrop-blur-sm group">
                                <i data-lucide="trash-2" class="w-5 h-5 text-white/80 group-hover:text-white"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="flex-shrink-0 pt-4 mt-4 border-t border-border-glass">
                    <div class="flex items-center gap-2" style="justify-content: flex-start;">
                        <label class="btn-secondary cursor-pointer gap-2">
                            <i data-lucide="image" class="w-5 h-5"></i>
                            <span>Foto</span>
                            <input type="file" accept="image/*" onchange="handlePostImageSelect(event)" class="hidden">
                        </label>
                        <button type="button" id="poll-creator-btn" class="btn-secondary gap-2" onclick="togglePollCreator()">
                            <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
                            <span>Umfrage</span>
                        </button>
                        <button type="button" id="expense-creator-btn" class="btn-secondary gap-2" onclick="toggleExpenseCreator()">
                            <i data-lucide="receipt" class="w-5 h-5"></i>
                            <span>Ausgabe</span>
                        </button>
                        <button type="submit" class="cta-primary-glow flex items-center gap-2 ml-auto">
                            <span class="btn-text">Posten</span>
                            <i data-lucide="send" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </form>
        `;
        
        openModal(Card(modalFormContent, { variant: 'premium', className: 'animate-slide-in-up max-w-lg w-full' }), modalId);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => document.getElementById('post-text-input')?.focus(), 100);
    }
}

if (!window.openGratitudeModal) {
    window.openGratitudeModal = () => {
        const { membersData, currentUser } = getCurrentUser();
        const memberOptions = Object.values(membersData)
            .filter(member => member.uid !== currentUser.uid)
            .map(member => `<option value="${member.uid}">${member.name}</option>`)
            .join('');

        const modalId = 'modal-gratitude';
        const modalContent = `
            <form id="gratitude-form" onsubmit="window.handleGratitudeSubmit(event)">
                <h2 class="text-2xl font-bold text-gradient mb-6">Dankbarkeit senden</h2>
                <div class="space-y-4">
                    <div>
                        <label for="gratitude-to-uid" class="text-sm text-secondary mb-1 block">An wen?</label>
                        <select id="gratitude-to-uid" name="gratitude-to-uid" class="form-input" required>
                            ${memberOptions}
                        </select>
                    </div>
                    <div>
                        <label for="gratitude-text" class="text-sm text-secondary mb-1 block">Wofür? (Kurz)</label>
                        <input type="text" id="gratitude-text" name="gratitude-text" class="form-input" placeholder="Danke für..." required>
                    </div>
                </div>
                <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="gratitude-submit-btn" class="cta-primary-glow">
                      <span class="btn-text">Senden</span>
                    </button>
                </div>
            </form>
        `;
        
        openModal(Card(modalContent, { variant: 'premium', className: 'animate-slide-in-up max-w-md w-full' }), modalId);
    };
}

if (!window.handleGratitudeSubmit) {
    window.handleGratitudeSubmit = async (event) => {
        event.preventDefault();
        const submitBtn = document.getElementById('gratitude-submit-btn');
        showButtonSpinner(submitBtn);
        
        const { currentUser, currentUserData, currentFamilyId, membersData } = getCurrentUser();
        const toUid = document.getElementById('gratitude-to-uid').value;
        const text = document.getElementById('gratitude-text').value;
        const toMember = membersData[toUid];
        
        if (!toMember) {
            showNotification("Mitglied nicht gefunden", "error");
            hideButtonSpinner(submitBtn);
            return;
        }

        const postData = {
            type: 'gratitude',
            text: text,
            fromUID: currentUser.uid,
            fromName: currentUserData.name,
            fromAvatar: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserData.name)}`,
            toUID: toUid,
            toName: toMember.name,
            toAvatar: toMember.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(toMember.name)}`,
            createdAt: serverTimestamp(),
            participants: null
        };

        try {
            await addDoc(collection(db, 'families', currentFamilyId, 'posts'), postData);
            showNotification('Dankbarkeit geteilt!', 'success');
            closeModal('modal-gratitude');
        } catch (error) {
            console.error("Fehler beim Senden:", error);
            showNotification('Senden fehlgeschlagen', 'error');
            hideButtonSpinner(submitBtn);
        }
    };
}

if (!window.handlePollVote) {
    window.handlePollVote = async (postId, optionIndex) => {
        const { currentUser, currentFamilyId } = getCurrentUser();
        if (!currentUser) return showNotification('Bitte einloggen', 'error');
        
        const postRef = doc(db, 'families', currentFamilyId, 'posts', postId);
        
        try {
            await runTransaction(db, async (transaction) => {
                const postDoc = await transaction.get(postRef);
                if (!postDoc.exists()) throw "Umfrage nicht gefunden!";
                
                const post = postDoc.data();
                
                if (post.votedBy && post.votedBy.includes(currentUser.uid)) {
                    throw "Bereits abgestimmt!";
                }
                
                const newOptions = [...post.options];
                newOptions[optionIndex].votes = (newOptions[optionIndex].votes || 0) + 1;
                const newVotedBy = [...(post.votedBy || []), currentUser.uid];
                const newVotesMap = { ...(post.votesMap || {}), [currentUser.uid]: optionIndex };
                
                transaction.update(postRef, {
                    options: newOptions,
                    votedBy: newVotedBy,
                    votesMap: newVotesMap
                });
            });
            showNotification('Stimme gezählt!', 'success');
        } catch (error) {
            console.error("Fehler bei Abstimmung:", error);
            showNotification(error === "Bereits abgestimmt!" ? error : 'Abstimmung fehlgeschlagen', 'error');
        }
    };
}

if (!window.toggleLike) {
    window.toggleLike = async (postId, button) => {
        const { currentUser, currentFamilyId } = getCurrentUser();
        if (!currentUser || !currentFamilyId) return;
        
        const isLiked = button.classList.contains('active');
        const likesSpan = button.querySelector('span');
        const heartIcon = button.querySelector('i[data-lucide="heart"]');
        
        try {
            const postRef = doc(db, 'families', currentFamilyId, 'posts', postId);
            
            if (isLiked) {
                await updateDoc(postRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(currentUser.uid)
                });
                button.classList.remove('active');
                if (heartIcon) heartIcon.style.fill = 'none';
                likesSpan.textContent = parseInt(likesSpan.textContent) - 1;
            } else {
                await updateDoc(postRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(currentUser.uid)
                });
                button.classList.add('active');
                if (heartIcon) heartIcon.style.fill = 'currentColor';
                likesSpan.textContent = parseInt(likesSpan.textContent) + 1;
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            showNotification('Fehler beim Liken', 'error');
        }
    };
}

if (!window.openComments) {
    window.openComments = async (postId) => {
        const { currentFamilyId } = getCurrentUser();
        if (!currentFamilyId) return;
        
        const template = document.getElementById('template-comments-modal');
        if (!template) return;
        
        const modalContainer = document.getElementById('modal-container');
        render(template.innerHTML, modalContainer);
        
        modalContainer.querySelector('.modal').addEventListener('click', (e) => {
            if (e.target.dataset.action === 'close-modal-backdrop') closeModal();
        });
        modalContainer.querySelector('button[data-action="close-modal-button"]').addEventListener('click', closeModal);

        const commentForm = modalContainer.querySelector('#comment-form');
        commentForm.dataset.postId = postId;

        loadComments(postId);
        
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            await addComment(e.currentTarget.dataset.postId);
        };
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };
}

if (!window.sharePost) {
    window.sharePost = (postId) => {
        if (navigator.share) {
            navigator.share({
                title: 'FamilyHub Post',
                text: 'Schau dir diesen Post in FamilyHub an!',
                url: window.location.href + '#post-' + postId
            }).catch(err => console.log('Error sharing:', err));
        } else {
            const url = window.location.href + '#post-' + postId;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link wurde kopiert!', 'success');
            });
        }
    };
}

if (!window.openPostMenu) {
    window.openPostMenu = (postId) => {
        console.log('Opening menu for post:', postId);
        showNotification('Menü-Funktion kommt bald!', 'info');
    };
}

if (!window.openImageModal) {
    window.openImageModal = (imageUrl) => {
        console.log('Opening image modal:', imageUrl);
        showNotification('Bild-Modal kommt bald!', 'info');
    };
}

if (!window.handlePostImageSelect) {
    window.handlePostImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { // 10MB
            showNotification('Das Bild ist zu groß (max. 10MB)', 'warning');
            return;
        }
        if (!file.type.startsWith('image/')) {
            showNotification('Bitte wähle eine Bilddatei aus', 'warning');
            return;
        }
        postImageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewContainer = document.getElementById('post-image-preview-container');
            const previewImage = document.getElementById('post-image-preview');
            if (previewImage && previewContainer) {
                previewImage.src = e.target.result;
                previewContainer.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    };
}

if (!window.removePostImage) {
    window.removePostImage = () => {
        postImageFile = null;
        const previewContainer = document.getElementById('post-image-preview-container');
        const fileInput = document.querySelector('input[type="file"]');
        if (previewContainer) previewContainer.classList.add('hidden');
        if(fileInput) fileInput.value = ''; 
    };
}

if (!window.closeModal) {
    window.closeModal = () => {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) modalContainer.innerHTML = '';
        postImageFile = null;
        selectedParticipants = []; // Wichtig: Zurücksetzen
    };
}

// Globale Verweise auf interne Funktionen
if (!window.addPollOption) window.addPollOption = addPollOption;
if (!window.togglePollCreator) window.togglePollCreator = togglePollCreator;
if (!window.toggleExpenseCreator) window.toggleExpenseCreator = toggleExpenseCreator;