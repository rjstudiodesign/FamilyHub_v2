// feed.js – Hauptlogik für den Feed

import { db, auth, onSnapshot, collection, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, addDoc, getDocs, where } from './firebase.js';
import { showNotification } from './ui.js';
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

// --- Haupt-Rendering-Funktion ---
export function renderFeed(pageListeners) {
    const feedContainer = document.getElementById('feed-posts-container');
    if (!feedContainer) {
        console.error("Entwickler-Fehler: Das #feed-container Element wurde nicht auf der Feed-Seite gefunden.");
        return;
    }

    const familyId = localStorage.getItem('familyId');
    if (!familyId) {
        feedContainer.innerHTML = '<p>Keine Familie ausgewählt. Bitte gehe zu den Einstellungen.</p>';
        return;
    }
    
    // Initialen Ladezustand anzeigen
    feedContainer.innerHTML = SkeletonCard();

    // Listener für Posts
    const postsRef = collection(db, 'families', familyId, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    
    if (pageListeners.posts) pageListeners.posts(); // Alten Listener bereinigen
    
    let isInitialLoad = true;

    pageListeners.posts = onSnapshot(q, snapshot => {
        if (isInitialLoad && snapshot.empty) {
            feedContainer.innerHTML = EmptyStateCard('Noch keine Beiträge', 'Erstelle den ersten Beitrag im Feed!');
            isInitialLoad = false;
            return;
        }

        snapshot.docChanges().forEach(change => {
            const post = { id: change.doc.id, ...change.doc.data() };
            const postElementId = `post-${post.id}`;
            const existingElement = document.getElementById(postElementId);

            if (change.type === "added") {
                if (isInitialLoad) {
                    // Beim ersten Laden den Skeleton-Loader entfernen
                    const skeleton = feedContainer.querySelector('#feed-skeleton');
                    if (skeleton) skeleton.remove();
                }
                const newPostElement = createPostElement(post);
                if (newPostElement) {
                    // Da die Abfrage absteigend sortiert ist, fügen wir neue Elemente oben ein.
                    // Bei der initialen Befüllung kommen die Dokumente in der richtigen Reihenfolge.
                    // Wir verwenden append, um die Reihenfolge beizubehalten. Für neue einzelne Dokumente wäre prepend besser.
                    // Für die Konsistenz hier: append für den initialen Load, prepend für spätere Adds.
                    if (isInitialLoad) {
                        feedContainer.appendChild(newPostElement);
                    } else {
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

        // Überprüfen, ob der Container nach allen Änderungen leer ist
        if (!feedContainer.hasChildNodes()) {
             feedContainer.innerHTML = EmptyStateCard('Noch keine Beiträge', 'Erstelle den ersten Beitrag im Feed!');
        }

        // Lucide-Icons nach dem Rendern initialisieren
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

// --- Post-Element-Erstellung ---
function createPostElement(post) {
    const div = document.createElement('div');
    div.id = `post-${post.id}`; // Eindeutige ID für das Element
    
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
        default:
            div.innerHTML = Card(post);
    }
    
    // Event-Listener für das erstellte Element hinzufügen
    addEventListeners(div, post);
    
    // Das Element selbst zurückgeben, nicht nur seinen Inhalt
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

        // Prüfen, ob der Benutzer bereits abgestimmt hat
        if (postData.votes && postData.votes[currentUser.uid]) {
            showNotification("Du hast bereits abgestimmt.", "info");
            return;
        }

        // Update-Objekt erstellen
        const updateData = {
            [userVotePath]: option,
            [`options.${option}`]: increment(1)
        };

        await updateDoc(postRef, updateData);
        showNotification("Stimme wurde gezählt!", "success");
    }
}

// --- Kommentar-Logik ---
if (!window.openComments) {
    window.openComments = async (postId) => {
        const { currentUser, currentUserData, currentFamilyId } = getCurrentUser(); // Lade Benutzerdaten
        if (!currentFamilyId) return;
        
        const template = document.getElementById('template-comments-modal');
        if (!template) {
            console.error("DESIGNER-FEHLER: Das 'template-comments-modal' fehlt in Index.html!");
            showNotification("Kommentarfunktion ist derzeit nicht verfügbar.", "error");
            return;
        }
        
        const modalContainer = document.getElementById('modal-container');
        render(template.innerHTML, modalContainer); // Nutzt render() aus components/index.js
        
        // Finde das Modal (angenommen, es hat die Klasse .modal-dialog-wrapper oder .modal-card)
        const modalWrapper = modalContainer.querySelector('.modal-dialog-wrapper');
        const modalCard = modalContainer.querySelector('.modal-card');
        const modalElement = modalWrapper ? modalWrapper.parentElement : modalContainer.querySelector('.modal');
        
        // Schließen-Logik (KORREKTUR: Nutzt ui.js-Logik nicht voll, da es kein openModal() ist. Manuelle Handhabung)
        const closeLogic = () => {
             modalElement?.classList.add('page-fade-out'); // Annahme einer Fade-Out-Klasse
             setTimeout(() => modalContainer.innerHTML = '', 300);
        };
        
        modalElement?.addEventListener('click', (e) => {
            if (e.target === modalElement) closeLogic();
        });
        modalContainer.querySelector('button[data-action="close-modal-button"]')?.addEventListener('click', closeLogic);

        // --- VEREDELUNG: Avatar des Benutzers im Formular setzen ---
        const avatarImg = modalContainer.querySelector('#comment-user-avatar');
        if (avatarImg) {
            avatarImg.src = currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserData.name || 'U')}`;
            avatarImg.alt = currentUserData.name || 'Benutzer';
        }
        // --- ENDE VEREDELUNG ---

        const commentForm = modalContainer.querySelector('#comment-form');
        commentForm.dataset.postId = postId;

        loadComments(postId); // (Diese Funktion existiert bereits in feed.js)
        
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            await addComment(e.currentTarget.dataset.postId); // (Diese Funktion existiert bereits in feed.js)
        };
        
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
            authorName: currentUserData.name,
            authorAvatar: currentUser.photoURL,
            createdAt: serverTimestamp()
        });
        commentInput.value = '';
        // Lade Kommentare neu, um den neuen anzuzeigen
        loadComments(postId);
    }
}

async function loadComments(postId) {
    const { currentFamilyId } = getCurrentUser();
    if (!currentFamilyId) return;

    const commentsContainer = document.getElementById('comments-list');
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
            commentElement.innerHTML = `
                <img src="${comment.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName)}`}" alt="${comment.authorName}" class="w-8 h-8 rounded-full">
                <div class="flex-1">
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <p class="font-semibold text-sm text-text-main">${comment.authorName}</p>
                        <p class="text-sm text-text-secondary">${comment.text}</p>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">${comment.createdAt ? new Date(comment.createdAt.seconds * 1000).toLocaleString() : ''}</span>
                </div>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }
}