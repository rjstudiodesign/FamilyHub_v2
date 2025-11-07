// feed.js – Hauptlogik für den Feed

import { 
    db, auth, onSnapshot, collection, query, orderBy, doc, updateDoc, 
    arrayUnion, arrayRemove, serverTimestamp, addDoc, getDocs, where, 
    getDoc, increment 
} from './firebase.js';
import { showNotification, showButtonSpinner, hideButtonSpinner } from './ui.js'; // Spinner importiert
import { render, append } from './components/index.js';
import {
    PostCard, EmptyStateCard, SkeletonCard, Card, InfoCard
} from './components/Card.js';
import { PollCard } from './components/PollCard.js';
import { GalleryPostCard } from './components/GalleryPostCard.js';
import { ExpenseCard } from './components/ExpenseCard.js';
import * as Wishlist from './components/Wishlist.js';
import * as Gratitude from './components/Gratitude.js';
import * as Memory from './components/Memory.js';
import * as Goals from './components/Goals.js';
import * as Forecast from './components/Forecast.js';
import { getCurrentUser } from './auth.js';

// --- Globale Variablen ---
let unsubscribePosts = null;

// --- "Beitrag erstellen"-Modal (Platzhalter) ---
function openCreatePostModal() {
    console.log("Öffne 'Neuer Beitrag'-Modal...");
    
    // Platzhalter-HTML für das Modal
    const modalHTML = `
        <div class="modal show" id="create-post-modal" style="display: flex;">
            <div class="modal-dialog-wrapper">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>Neuer Beitrag</h3>
                        <button data-action="close-modal-button" class="btn-icon-ghost">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p class="text-sm text-secondary mb-2">Hier kommt das Formular zum Erstellen eines Beitrags hin.</p>
                        <textarea id="create-post-textarea" class="form-input" placeholder="Was gibt's Neues?" rows="4"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" data-action="close-modal-button">Abbrechen</button>
                        <button id="save-post-button" class="btn-primary">
                            <span class="btn-text">Posten</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        render(modalHTML, modalContainer);
        
        const modal = modalContainer.querySelector('#create-post-modal');
        const closeButtons = modal.querySelectorAll('[data-action="close-modal-button"]');
        const saveButton = modal.querySelector('#save-post-button');

        // Schließ-Logik
        const closeModal = () => {
            modal.remove();
        };
        closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
        
        // --- NEU: Speicher-Logik an "Posten"-Button binden ---
        saveButton.addEventListener('click', async () => {
            const textarea = modal.querySelector('#create-post-textarea');
            const text = textarea.value.trim();
            
            if (!text) {
                showNotification("Bitte gib einen Text ein.", "error");
                return;
            }
            
            showButtonSpinner(saveButton);
            
            try {
                // Rufe die neue Speicherfunktion auf
                await savePost(text);
                showNotification("Beitrag erfolgreich erstellt!", "success");
                closeModal(); // Modal nach Erfolg schließen
            } catch (error) {
                console.error("Fehler beim Speichern des Beitrags:", error);
                showNotification("Fehler beim Speichern des Beitrags.", "error");
                hideButtonSpinner(saveButton);
            }
        });
        
    } else {
         showNotification("Modal-Container nicht gefunden.", "error");
    }
}

/**
 * --- NEU: Speichert einen neuen Text-Beitrag in Firestore ---
 */
async function savePost(text) {
    const { currentFamilyId, currentUser, currentUserData } = getCurrentUser();
    if (!currentFamilyId || !currentUser) {
        throw new Error("Benutzer ist nicht oder nicht korrekt angemeldet.");
    }

    const postsRef = collection(db, 'families', currentFamilyId, 'posts');
    
    // Neues Post-Objekt erstellen
    const newPost = {
        type: 'default', // Standard-Text-Beitrag
        text: text,
        authorId: currentUser.uid,
        authorName: currentUserData.name || 'Benutzer',
        authorAvatar: currentUserData.avatarUrl || '', // Annahme, dass Sie avatarUrl im Profil haben
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0
    };
    
    // Dokument zur 'posts'-Sammlung hinzufügen
    await addDoc(postsRef, newPost);
}


// --- Haupt-Rendering-Funktion ---
export function renderFeed(pageListeners) {
    const feedContainer = document.getElementById('feed-posts-container');
    if (!feedContainer) {
        console.error("Entwickler-Fehler: Das #feed-container Element wurde nicht auf der Feed-Seite gefunden.");
        return;
    }

    const { currentFamilyId } = getCurrentUser(); 
    if (!currentFamilyId) {
        feedContainer.innerHTML = '<p>Keine Familie ausgewählt. Bitte gehe zu den Einstellungen.</p>';
        return;
    }
    
    // --- Event-Listener für FAB (Create Post) ---
    try {
        const createPostButton = document.getElementById('fab-create-post');
        if (createPostButton) {
            if (!createPostButton.dataset.listenerAttached) {
                createPostButton.addEventListener('click', openCreatePostModal);
                createPostButton.dataset.listenerAttached = 'true';
            }
        } else {
            console.warn("Konnte den 'Neuer Beitrag'-Button (fab-create-post) nicht finden.");
        }
    } catch (e) {
        console.error("Fehler beim Binden des createPost-Buttons:", e);
    }
    
    // Initialen Ladezustand anzeigen
    feedContainer.innerHTML = SkeletonCard();

    // Listener für Posts
    const postsRef = collection(db, 'families', currentFamilyId, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    
    if (pageListeners.posts) pageListeners.posts(); // Alten Listener bereinigen
    
    let isInitialLoad = true;

    pageListeners.posts = onSnapshot(q, snapshot => {
        if (isInitialLoad && snapshot.empty) {
            feedContainer.innerHTML = EmptyStateCard('Noch keine Beiträge', 'Erstelle den ersten Beitrag im Feed!');
            isInitialLoad = false;
            return;
        }
        
        if (isInitialLoad) {
             const skeleton = feedContainer.querySelector('.skeleton-card');
             if (skeleton) skeleton.parentElement.innerHTML = '';
        }

        snapshot.docChanges().forEach(change => {
            const post = { id: change.doc.id, ...change.doc.data() };
            const postElementId = `post-${post.id}`;
            const existingElement = document.getElementById(postElementId);

            if (change.type === "added") {
                const newPostElement = createPostElement(post);
                if (newPostElement) {
                    if (isInitialLoad) {
                        feedContainer.appendChild(newPostElement);
                    } else {
                        // Neue Posts (nach dem ersten Laden) oben anzeigen
                        feedContainer.prepend(newPostElement);
                    }
                }
            }
            if (change.type === "modified") {
                if (existingElement) {
                    const updatedPostElement = createPostElement(post);
                    if (updatedPostElement) {
                        existingElement.replaceWith(updatedPostElement);
                    }
                }
            }
            if (change.type === "removed") {
                if (existingElement) {
                    existingElement.remove();
                }
            }
        });
        
        isInitialLoad = false;

        if (feedContainer.childElementCount === 0) {
             feedContainer.innerHTML = EmptyStateCard('Noch keine Beiträge', 'Erstelle den ersten Beitrag im Feed!');
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

// --- Post-Element-Erstellung ---
function createPostElement(post) {
    const div = document.createElement('div');
    div.id = `post-${post.id}`;
    
    // Wähle die richtige Karte basierend auf dem Post-Typ
    switch (post.type) {
        case 'poll':
            div.innerHTML = PollCard(post);
            break;
        case 'gallery':
            div.innerHTML = GalleryPostCard(post);
            break;
        case 'expense':
            div.innerHTML = ExpenseCard(post);
            break;
        case 'wishlist_item':
            div.innerHTML = Wishlist.Card(post);
            break;
        case 'gratitude':
            div.innerHTML = Gratitude.Card(post);
            break;
        case 'memory':
            div.innerHTML = Memory.Card(post);
            break;
        case 'goal_update':
            div.innerHTML = Goals.Card(post);
            break;
        case 'forecast':
            div.innerHTML = Forecast.Card(post);
            break;
        default: // 'default' oder unbekannter Typ
            // ============ KORREKTUR HIER ============
            // PostCard erwartet ein Objekt mit bestimmten Eigenschaften.
            // Wir erstellen dieses Objekt aus dem `post`-Datensatz.
            const cardData = {
                post: post, // Für die interne Logik in PostCard
                postId: post.id,
                authorName: post.authorName,
                authorAvatar: post.authorAvatar,
                timestamp: post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : 'eben gerade',
                content: post.text,
                // Aktionen müssen hier definiert werden, wenn sie für Standard-Posts gelten sollen
                actions: [
                    // Beispiel für Like- und Kommentar-Aktionen
                    {
                        icon: '<i data-lucide="heart" class="w-5 h-5"></i>',
                        count: post.likes?.length || 0,
                        onClick: `window.toggleLike('${post.id}')`,
                        className: 'like-button',
                        active: post.likes?.includes(getCurrentUser().currentUser?.uid)
                    },
                    {
                        icon: '<i data-lucide="message-circle" class="w-5 h-5"></i>',
                        count: post.commentsCount || 0,
                        onClick: `window.openComments('${post.id}')`,
                        className: 'comment-button'
                    }
                ]
            };
            div.innerHTML = PostCard(cardData);
            // ======================================
    }
    
    addEventListeners(div, post);
    return div;
}

// --- Event-Listener ---
function addEventListeners(element, post) {
    // Like-Button
    const likeButton = element.querySelector('.like-button');
    if (likeButton) {
        likeButton.addEventListener('click', () => toggleLike(post.id));
    }
    
    // Kommentar-Button
    const commentButton = element.querySelector('.comment-button');
    if (commentButton) {
        commentButton.addEventListener('click', () => window.openComments(post.id));
    }
    
    // Abstimmungs-Logik
    const pollOptions = element.querySelectorAll('.poll-option');
    if (pollOptions) {
        pollOptions.forEach(option => {
            option.addEventListener('click', () => voteOnPoll(post.id, option.dataset.option));
        });
    }
}

// --- Aktionen (Likes, Kommentare, Abstimmungen) ---
async function toggleLike(postId) {
    const { currentFamilyId, currentUser } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;
    
    const postRef = doc(db, 'families', currentFamilyId, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
        const postData = postDoc.data();
        const likes = postData.likes || [];
        
        if (likes.includes(currentUser.uid)) {
            // Unlike
            await updateDoc(postRef, {
                likes: arrayRemove(currentUser.uid)
            });
        } else {
            // Like
            await updateDoc(postRef, {
                likes: arrayUnion(currentUser.uid)
            });
        }
    }
}

async function voteOnPoll(postId, option) {
    const { currentFamilyId, currentUser } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;

    const postRef = doc(db, 'families', currentFamilyId, 'posts', postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
        const postData = postDoc.data();
        const userVotePath = `votes.${currentUser.uid}`;

        if (postData.votes && postData.votes[currentUser.uid]) {
            showNotification("Du hast bereits abgestimmt.", "info");
            return;
        }

        const updateData = {
            [userVotePath]: option,
            [`options.${option}`]: increment(1)
        };

        await updateDoc(postRef, updateData);
        showNotification("Stimme wurde gezählt!", "success");
    }
}

// --- Kommentar-Logik ---
// (Stellen Sie sicher, dass template-comments-modal in Index.html existiert)
if (!window.openComments) {
    window.openComments = async (postId) => {
        const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
        if (!currentFamilyId) return;
        
        const template = document.getElementById('template-comments-modal');
        if (!template) {
            console.error("DESIGNER-FEHLER: Das 'template-comments-modal' fehlt in Index.html!");
            showNotification("Kommentarfunktion ist derzeit nicht verfügbar.", "error");
            return;
        }
        
        const modalContainer = document.getElementById('modal-container');
        render(template.innerHTML, modalContainer);
        
        const modalWrapper = modalContainer.querySelector('.modal-dialog-wrapper');
        const modalCard = modalContainer.querySelector('.modal-card');
        const modalElement = modalWrapper ? modalWrapper.parentElement : modalContainer.querySelector('.modal');
        
        const closeLogic = () => {
             modalElement?.classList.add('page-fade-out');
             setTimeout(() => modalContainer.innerHTML = '', 300);
        };
        
        modalElement?.addEventListener('click', (e) => {
            if (e.target === modalElement) closeLogic();
        });
        modalContainer.querySelector('button[data-action="close-modal-button"]')?.addEventListener('click', closeLogic);

        const avatarImg = modalContainer.querySelector('#comment-user-avatar');
        if (avatarImg && currentUserData) {
            avatarImg.src = currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserData.name || 'U')}`;
            avatarImg.alt = currentUserData.name || 'Benutzer';
        } else if (avatarImg) {
            avatarImg.src = `https://ui-avatars.com/api/?name=U`;
            avatarImg.alt = 'Benutzer';
        }
        
        const commentForm = modalContainer.querySelector('#comment-form');
        if(commentForm) {
            commentForm.dataset.postId = postId;
            commentForm.onsubmit = async (e) => {
                e.preventDefault();
                await addComment(e.currentTarget.dataset.postId);
            };
        }

        loadComments(postId);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };
}

async function addComment(postId) {
    const { currentFamilyId, currentUser, currentUserData } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;

    const commentInput = document.getElementById('comment-input');
    const text = commentInput.value.trim();

    if (text) {
        const commentsRef = collection(db, 'families', currentFamilyId, 'posts', postId, 'comments');
        await addDoc(commentsRef, {
            text: text,
            authorId: currentUser.uid,
            authorName: currentUserData ? currentUserData.name : 'Anonym',
            authorAvatar: currentUser.photoURL,
            createdAt: serverTimestamp()
        });
        commentInput.value = '';
        loadComments(postId);
    }
}

async function loadComments(postId) {
    const { currentFamilyId } = getCurrentUser();
    if (!currentFamilyId) return;

    const commentsContainer = document.getElementById('comments-list');
    if (!commentsContainer) return;
    
    commentsContainer.innerHTML = '<p>Lade Kommentare...</p>';

    const commentsRef = collection(db, 'families', currentFamilyId, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);

    commentsContainer.innerHTML = '';
    if (snapshot.empty) {
        commentsContainer.innerHTML = '<p class="text-center text-sm text-text-secondary py-4">Noch keine Kommentare. Sei der Erste!</p>';
    } else {
        snapshot.forEach(doc => {
            const comment = doc.data();
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item flex items-start space-x-3 mb-4';
            const authorName = comment.authorName || 'Anonym';
            commentElement.innerHTML = `
                <img src="${comment.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}`}" alt="${authorName}" class="w-8 h-8 rounded-full">
                <div class="flex-1">
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <p class="font-semibold text-sm text-text-main">${authorName}</p>
                        <p class="text-sm text-text-secondary">${comment.text}</p>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">${comment.createdAt ? new Date(comment.createdAt.seconds * 1000).toLocaleString() : ''}</span>
                </div>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }
}
