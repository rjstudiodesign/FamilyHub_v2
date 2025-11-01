// src/feed.js
// KORRIGIERTE IMPORTE

// --- 1. ARCHITEKTUR-IMPORTE ---

// Lokale Service-Module (unser Fundament)
import { 
    db, auth, 
    collection, query, onSnapshot, orderBy, 
    doc, deleteDoc, runTransaction, serverTimestamp, addDoc 
} from './firebase.js'; // <-- ALLE Firebase-Funktionen kommen jetzt von hier
import { getCurrentUser } from './auth.js';
import { 
    showNotification, 
    openModal, 
    closeModal, 
    showButtonSpinner, 
    hideButtonSpinner 
} from './ui.js';

// CDN-Imports (WURDEN ENTFERNT, da sie von firebase.js bereitgestellt werden)

// Lokale Komponenten
import { 
    PostCard, 
    EventCard, 
    EmptyStateCard, 
    SkeletonCard 
} from './components/Card.js';
import { FilterButton } from './components/Button.js';

// Lokale Utils
import { getTimeAgo } from './utils/formatters.js';

// --- 2. MODUL-ZUSTAND ---
let posts = [];
let currentFilter = 'all';
let postsUnsubscribe = null;

// --- 3. KERNFUNKTION (Export an navigation.js) ---
export function renderFeed(listeners) {
    const feedContainer = document.getElementById('feed-posts-container');
    if (!feedContainer) {
        console.error("Architekt: Feed-Container (#feed-posts-container) nicht im DOM gefunden.");
        return;
    }
    showFeedSkeleton(feedContainer);
    setupFilterButtons();
    setupFAB();

    if (listeners.posts) {
        listeners.posts();
    }
    
    const { currentFamilyId } = getCurrentUser();
    if (!currentFamilyId) {
        showNotification("Fehler: Keine Familien-ID gefunden.", "error");
        feedContainer.innerHTML = EmptyStateCard("Keine Familie geladen", "Bitte neu anmelden.", "alert-triangle");
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    const postsQuery = query(
        collection(db, 'families', currentFamilyId, 'posts'), 
        orderBy('createdAt', 'desc')
    );

    listeners.posts = onSnapshot(postsQuery, (snapshot) => {
        posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderFilteredPosts(feedContainer);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, (error) => {
        console.error("Feed-Fehler:", error);
        showNotification("Fehler beim Laden des Feeds.", "error");
        feedContainer.innerHTML = EmptyStateCard("Fehler beim Laden", "Bitte versuchen Sie es später erneut.", "alert-circle");
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
}

// --- 4. RENDER-FUNKTIONEN ---
function showFeedSkeleton(container) {
    const staticFilters = document.querySelector('.page-container > .flex.gap-2.mb-4');
    if (staticFilters) {
        staticFilters.remove();
    }
    container.innerHTML = SkeletonCard() + SkeletonCard();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderFilteredPosts(container) {
    container.innerHTML = ''; 

    const filtered = posts.filter(post => {
        if (currentFilter === 'all') return true;
        return post.type === currentFilter;
    });

    if (filtered.length === 0) {
        container.innerHTML = EmptyStateCard("Keine Beiträge", "Es wurden noch keine Beiträge in dieser Kategorie erstellt.", "inbox");
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    filtered.forEach(post => {
        const timeAgo = post.createdAt ? getTimeAgo(post.createdAt.toDate()) : 'Gerade eben';
        if (post.type === 'event') {
            container.innerHTML += EventCard(post, timeAgo);
        } else {
            container.innerHTML += PostCard(post, timeAgo);
        }
    });
}

// --- 5. EVENT-HANDLER & INTERAKTIONEN ---
function setupFilterButtons() {
    const container = document.querySelector('.page-container');
    const feedContainer = document.getElementById('feed-posts-container');
    
    const filterBar = document.createElement('div');
    filterBar.className = "flex gap-2 mb-4";
    filterBar.innerHTML = `
        ${FilterButton('all', 'Alle', true)}
        ${FilterButton('post', 'Posts')}
        ${FilterButton('event', 'Termine')}
    `;
    
    container.insertBefore(filterBar, feedContainer);

    filterBar.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-filter');
        if (!button) return;
        filterBar.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderFilteredPosts(feedContainer);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
}

function setupFAB() {
    const fab = document.createElement('button');
    fab.className = "fab-create-post";
    fab.innerHTML = '<i data-lucide="plus" class="w-8 h-8"></i>';
    fab.onclick = () => openCreatePostModal();
    document.getElementById('app-content').appendChild(fab);
}

function openCreatePostModal() {
    const modalId = 'modal-create-post';
    const modalContent = `
        <div class="modal-content glass-premium max-w-lg w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Neuer Beitrag</h2>
            <form id="create-post-form" class="space-y-4">
                <textarea id="post-text-input" class="form-input" rows="5" placeholder="Was gibt's Neues, Familie?" required></textarea>
                <div class="flex justify-end gap-3 pt-4 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="create-post-submit" class="btn-premium">
                        <span class="btn-text">Posten</span>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    openModal(modalContent, modalId);

    document.getElementById('create-post-form').onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('create-post-submit');
        showButtonSpinner(submitBtn);

        const text = document.getElementById('post-text-input').value;
        const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();

        try {
            await addDoc(collection(db, 'families', currentFamilyId, 'posts'), {
                text: text,
                type: 'post',
                authorId: currentUser.uid,
                authorName: currentUserData.name,
                authorPhotoURL: currentUserData.photoURL || null,
                createdAt: serverTimestamp(),
                likes: [],
                comments: []
            });
            
            closeModal(modalId);
            showNotification("Beitrag erstellt!", "success");

        } catch (error) {
            console.error("Fehler beim Erstellen des Posts:", error);
            showNotification("Fehler beim Erstellen des Posts.", "error");
        } finally {
            hideButtonSpinner(submitBtn);
        }
    };
}

window.deletePost = async (postId) => {
    if (!confirm("Möchtest du diesen Beitrag wirklich löschen?")) return;
    const { currentFamilyId } = getCurrentUser();
    try {
        await deleteDoc(doc(db, 'families', currentFamilyId, 'posts', postId));
        showNotification("Beitrag gelöscht.", "success");
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
        showNotification("Fehler beim Löschen.", "error");
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