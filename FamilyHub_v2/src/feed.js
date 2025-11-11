// feed.js – Hauptlogik für den Feed

import { 
    db, auth, storage, onSnapshot, collection, query, orderBy, doc, updateDoc, 
    arrayUnion, arrayRemove, serverTimestamp, addDoc, getDocs, where, 
    getDoc, increment, ref, uploadBytesResumable, getDownloadURL
} from './firebase.js';
import { showNotification, showButtonSpinner, hideButtonSpinner, openModal, closeModal } from './ui.js'; // Spinner importiert
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
let membersDataCache = {};

// Lade Mitgliederdaten für die Anzeige von "Gepostet von"
async function loadMembersDataCache(familyId) {
    try {
        const membersRef = collection(db, 'families', familyId, 'membersData');
        const snapshot = await getDocs(membersRef);
        membersDataCache = {};
        snapshot.docs.forEach(doc => {
            membersDataCache[doc.id] = doc.data();
        });
    } catch (error) {
        console.error("Fehler beim Laden der Mitgliederdaten:", error);
    }
}

// --- "Beitrag erstellen"-Modal (Refaktoriert mit ui.js) ---
async function openCreatePostModal() {
    const modalId = 'create-post-modal';
    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    
    // Lade alle Familienmitglieder für "Posten als" Dropdown
    const membersRef = collection(db, 'families', currentFamilyId, 'membersData');
    const snapshot = await getDocs(membersRef);
    const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Erstelle Optionen: aktueller Benutzer + Kind-Profile (mit Berechtigungsprüfung)
    const postAsOptions = [
        { id: currentUser.uid, name: currentUserData.name, avatar: currentUserData.avatarUrl || '' }
    ];
    
    // Füge Kind-Profile hinzu, für die der Benutzer Berechtigung hat
    members.forEach(m => {
        if (m.isChildProfile === true) {
            // Prüfe Berechtigung
            const permissions = m.permissions || {};
            const hasPermission = permissions[currentUser.uid]?.canPostAs === true;
            
            if (hasPermission) {
                postAsOptions.push({
                    id: m.id,
                    name: m.name,
                    avatar: m.photoURL || ''
                });
            }
        }
    });
    
    const optionsHTML = postAsOptions.map(option => 
        `<option value="${option.id}" data-name="${option.name}" data-avatar="${option.avatar}">
            ${option.name}${option.id !== currentUser.uid ? ' (Kind-Profil)' : ' (Du)'}
        </option>`
    ).join('');
    
    const modalContent = `
        <form id="create-post-form" class="space-y-4">
            <h2 class="text-2xl font-bold text-gradient mb-6">Neuer Beitrag</h2>
            <div>
                <label for="post-as-select" class="form-label text-sm text-secondary mb-1 block">Posten als:</label>
                <select id="post-as-select" class="form-input">
                    ${optionsHTML}
                </select>
            </div>
            <div>
                <label for="create-post-textarea" class="form-label text-sm text-secondary mb-1 block">Was gibt's Neues?</label>
                <textarea id="create-post-textarea" class="form-input" placeholder="Teile etwas mit deiner Familie..." rows="4" required></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="save-post-button" class="cta-primary-glow">
                    <span class="btn-text">Posten</span>
                </button>
            </div>
        </form>
    `;

    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-md w-full' }), modalId);

    const form = document.getElementById('create-post-form');
    const saveButton = document.getElementById('save-post-button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const textarea = document.getElementById('create-post-textarea');
        const text = textarea.value.trim();
        
        const postAsSelect = document.getElementById('post-as-select');
        const selectedOption = postAsSelect.options[postAsSelect.selectedIndex];
        const selectedId = selectedOption.value;
        const selectedName = selectedOption.getAttribute('data-name');
        const selectedAvatar = selectedOption.getAttribute('data-avatar');

        if (!text) {
            showNotification("Bitte gib einen Text ein.", "error");
            return;
        }

        showButtonSpinner(saveButton);

        try {
            const { currentFamilyId, currentUser, currentUserData } = getCurrentUser();
            if (!currentFamilyId || !currentUser) {
                throw new Error("Benutzer ist nicht oder nicht korrekt angemeldet.");
            }

            const postsRef = collection(db, 'families', currentFamilyId, 'posts');
            
            const newPost = {
                type: 'default',
                text: text,
                authorId: selectedId,
                authorName: selectedName,
                authorAvatar: selectedAvatar,
                realAuthorId: currentUser.uid, // Der tatsächliche Ersteller
                createdAt: serverTimestamp(),
                likes: [],
                commentsCount: 0
            };
            
            await addDoc(postsRef, newPost);
            
            showNotification("Beitrag erfolgreich erstellt!", "success");
            closeModal(modalId);
        } catch (error) {
            console.error("Fehler beim Speichern des Beitrags:", error);
            showNotification("Fehler beim Speichern des Beitrags.", "error");
        } finally {
            hideButtonSpinner(saveButton);
        }
    });
}


// --- 4. HAUPT-RENDER-FUNKTION (Wird bei Navigation aufgerufen) ---
export function renderFeed(pageListeners) {
    const { currentFamilyId } = getCurrentUser(); 
    const feedContainer = document.getElementById('feed-posts-container');
    const gratitudeContainer = document.getElementById('gratitude-trigger-container');
    const goalContainer = document.getElementById('goal-widget-container');

    if (!feedContainer) {
        console.error("Entwickler-Fehler: Das #feed-container Element wurde nicht auf der Feed-Seite gefunden.");
        return;
    }

    if (!currentFamilyId) {
        feedContainer.innerHTML = EmptyStateCard('Keine Familie geladen', 'Bitte melde dich an oder wähle eine Familie in den Einstellungen.', 'alert-circle');
        if (gratitudeContainer) gratitudeContainer.innerHTML = '';
        if (goalContainer) goalContainer.innerHTML = '';
        return;
    }
    
    // Lade Mitgliederdaten für "Gepostet von" Anzeige
    loadMembersDataCache(currentFamilyId);
    
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
    
    // --- NEU: Drag-and-Drop für Bilder ---
    const appContent = document.getElementById('app-content');
    if (appContent && !appContent.dataset.dropListenerAttached) {
        appContent.dataset.dropListenerAttached = 'true';
        
        appContent.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            appContent.classList.add('drag-over');
        });
        
        appContent.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.target === appContent) {
                appContent.classList.remove('drag-over');
            }
        });
        
        appContent.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            appContent.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files).filter(file => 
                file.type.startsWith('image/')
            );
            
            if (files.length > 0) {
                handleDragAndDropUpload(files);
            } else {
                showNotification('Bitte nur Bilddateien hochladen.', 'info');
            }
        });
    }
    
    // === NEU: Widgets rendern ===
    if (gratitudeContainer) {
        // Ruft die GratitudeTrigger-Funktion aus dem importierten Modul auf
        gratitudeContainer.innerHTML = Gratitude.GratitudeTrigger();
    }

    // === NEU: Goal-Widget-Listener ===
    // (Wir benötigen einen separaten Listener für die Ziele)
    if (goalContainer) {
        const goalsQuery = query(
            collection(db, 'families', currentFamilyId, 'familyGoals'),
            orderBy('createdAt', 'desc')
        );
        pageListeners.feedGoals = onSnapshot(goalsQuery, (snapshot) => {
            const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Ruft die GoalTrackerWidget-Funktion aus dem importierten Modul auf
            goalContainer.innerHTML = Goals.GoalTrackerWidget(goals);
        }, (error) => {
            console.error("Fehler beim Laden der Ziele für das Widget:", error);
            goalContainer.innerHTML = ''; // Bei Fehler ausblenden
        });
    }
    
    // Initialen Ladezustand für Posts anzeigen
    feedContainer.innerHTML = SkeletonCard();

    // Listener für Posts
    const postsRef = collection(db, 'families', currentFamilyId, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    
    if (pageListeners.posts) pageListeners.posts(); // Alten Listener bereinigen
    
    let isInitialLoad = true;

    pageListeners.posts = onSnapshot(q, snapshot => {
        if (isInitialLoad && snapshot.empty) {
            feedContainer.innerHTML = EmptyStateCard('Noch keine Beiträge', 'Erstelle den ersten Beitrag im Feed!', 'message-square'); // NEU: Icon hinzugefügt
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
             feedContainer.innerHTML = EmptyStateCard('Noch keine Beiträge', 'Erstelle den ersten Beitrag im Feed!', 'message-square'); // NEU: Icon hinzugefügt
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

// --- Post-Element-Erstellung ---
function renderEmergencyAlert(post) {
    const timestamp = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : 'eben gerade';
    const locationText = post.location 
        ? `<a href="https://www.google.com/maps?q=${post.location.latitude},${post.location.longitude}" target="_blank" class="text-accent-glow hover:underline flex items-center gap-1 mt-2">
            <i data-lucide="map-pin" class="w-4 h-4"></i>
            Standort anzeigen (±${Math.round(post.location.accuracy)}m)
           </a>`
        : '<p class="text-sm text-secondary mt-2">Kein Standort verfügbar</p>';

    return `
        <div class="post-card emergency-alert-card">
            <div class="flex items-center gap-3 mb-4">
                <div class="emergency-alert-icon">
                    <i data-lucide="alert-triangle" class="w-8 h-8"></i>
                </div>
                <div class="flex-1">
                    <p class="font-bold text-xl text-white">🚨 NOTFALL</p>
                    <p class="text-sm text-secondary">${post.authorName} • ${timestamp}</p>
                </div>
            </div>
            <div class="emergency-alert-content">
                <p class="text-lg text-white font-semibold mb-2">${post.text}</p>
                ${locationText}
            </div>
            <div class="flex items-center gap-4 pt-3 mt-4 border-t border-red-500/30">
                <button class="action-button" onclick="window.openComments('${post.id}')">
                    <i data-lucide="message-circle" class="w-5 h-5"></i>
                    <span>${post.commentsCount || 0}</span>
                </button>
            </div>
        </div>
    `;
}

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
        case 'wishlist_item':
            div.innerHTML = Wishlist.WishlistCard(post); // KORREKTUR: Wishlist.Card -> Wishlist.WishlistCard
            break;
        case 'gratitude':
            div.innerHTML = Gratitude.GratitudeCard(post); // KORREKTUR: Gratitude.Card -> Gratitude.GratitudeCard
            break;
        case 'memory':
            div.innerHTML = Memory.MemoryCard({ post: post }); // KORREKTUR: Memory.Card -> Memory.MemoryCard
            break;
        case 'goal_update':
            div.innerHTML = Goals.GoalCard(post);
            break;
        case 'forecast':
            div.innerHTML = Forecast.ForecastCard({ post: post }); // KORREKTUR: Forecast.Card -> Forecast.ForecastCard
            break;
        case 'emergency_alert':
            div.innerHTML = renderEmergencyAlert(post);
            break;
        default: // 'default' oder unbekannter Typ
            // ============ KORREKTUR HIER ============
            // PostCard erwartet ein Objekt mit bestimmten Eigenschaften.
            // Wir erstellen dieses Objekt aus dem `post`-Datensatz.
            
            // NEU: Reaktionen berechnen
            const reactions = post.reactions || {};
            const totalReactions = Object.values(reactions).reduce((sum, users) => sum + (users?.length || 0), 0);
            const currentUserUid = getCurrentUser().currentUser?.uid;
            let userReacted = false;
            for (const users of Object.values(reactions)) {
                if (users?.includes(currentUserUid)) {
                    userReacted = true;
                    break;
                }
            }
            
            const cardData = {
                post: post, // Für die interne Logik in PostCard
                postId: post.id,
                authorName: post.authorName,
                authorAvatar: post.authorAvatar,
                authorId: post.authorId,
                timestamp: post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : 'eben gerade',
                content: post.text,
                reactions: reactions, // NEU: Reaktionen übergeben
                membersData: membersDataCache, // NEU: Mitgliederdaten für "Gepostet von"
                // Aktionen müssen hier definiert werden, wenn sie für Standard-Posts gelten sollen
                actions: [
                    // NEU: Reaktions-Button statt einfachem Like
                    {
                        icon: '<i data-lucide="smile" class="w-5 h-5"></i>',
                        count: totalReactions,
                        onClick: `window.showReactionPicker('${post.id}', event)`,
                        className: 'reaction-button',
                        active: userReacted
                    },
                    {
                        icon: '<i data-lucide="message-circle" class="w-5 h-5"></i>',
                        count: post.commentsCount || 0,
                        onClick: `window.openComments('${post.id}')`,
                        className: 'comment-button'
                    },
                    // NEU: Teilen-Button
                    {
                        icon: '<i data-lucide="share-2" class="w-5 h-5"></i>',
                        onClick: `window.sharePost('${post.id}')`,
                        className: 'share-button'
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
// NEU: Emoji-Reaktionen (Erweitertes Like-System)
window.toggleReaction = async function(postId, emoji) {
    const { currentFamilyId, currentUser } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;
    
    const postRef = doc(db, 'families', currentFamilyId, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
        const postData = postDoc.data();
        const reactions = postData.reactions || {};
        
        // Prüfen, ob der Benutzer bereits auf diesen Post reagiert hat
        let userCurrentReaction = null;
        for (const [reactionEmoji, users] of Object.entries(reactions)) {
            if (users.includes(currentUser.uid)) {
                userCurrentReaction = reactionEmoji;
                break;
            }
        }
        
        // Wenn die gleiche Reaktion, entfernen (Toggle)
        if (userCurrentReaction === emoji) {
            await updateDoc(postRef, {
                [`reactions.${emoji}`]: arrayRemove(currentUser.uid)
            });
        } else {
            // Alte Reaktion entfernen (falls vorhanden)
            if (userCurrentReaction) {
                await updateDoc(postRef, {
                    [`reactions.${userCurrentReaction}`]: arrayRemove(currentUser.uid)
                });
            }
            // Neue Reaktion hinzufügen
            await updateDoc(postRef, {
                [`reactions.${emoji}`]: arrayUnion(currentUser.uid)
            });
        }
    }
}

// Abwärtskompatibilität: toggleLike ruft toggleReaction mit Herz-Emoji auf
async function toggleLike(postId) {
    await window.toggleReaction(postId, '❤️');
}

// NEU: Zeigt das Emoji-Auswahl-Popup
window.showReactionPicker = function(postId, event) {
    event.stopPropagation();
    
    // Vorhandenes Popup entfernen
    const existingPicker = document.querySelector('.reaction-picker');
    if (existingPicker) existingPicker.remove();
    
    const picker = document.createElement('div');
    picker.className = 'reaction-picker glass-premium';
    picker.innerHTML = `
        <div class="reaction-emoji-list">
            ${['❤️', '👍', '😂', '😮', '😢', '🎉'].map(emoji => `
                <button class="reaction-emoji-btn" onclick="window.toggleReaction('${postId}', '${emoji}'); this.closest('.reaction-picker').remove();">
                    ${emoji}
                </button>
            `).join('')}
        </div>
    `;
    
    // Position relativ zum Klick-Event
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    picker.style.position = 'absolute';
    picker.style.top = `${rect.top - 50}px`;
    picker.style.left = `${rect.left}px`;
    
    document.body.appendChild(picker);
    
    // Entfernen beim Klick außerhalb
    setTimeout(() => {
        const clickOutside = (e) => {
            if (!picker.contains(e.target)) {
                picker.remove();
                document.removeEventListener('click', clickOutside);
            }
        };
        document.addEventListener('click', clickOutside);
    }, 10);
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

// --- NEU: Beitrag teilen (Web Share API mit Fallback) ---
window.sharePost = async function(postId) {
    const { currentFamilyId } = getCurrentUser();
    if (!currentFamilyId) return;
    
    try {
        const postRef = doc(db, 'families', currentFamilyId, 'posts', postId);
        const postDoc = await getDoc(postRef);
        
        if (!postDoc.exists()) return;
        
        const post = postDoc.data();
        const shareText = `${post.authorName}: ${post.text || 'Neuer Beitrag in FamilyHub'}`;
        const shareUrl = window.location.href; // Oder eine spezifische Post-URL
        
        // Prüfen, ob Web Share API verfügbar ist
        if (navigator.share) {
            await navigator.share({
                title: 'FamilyHub Beitrag',
                text: shareText,
                url: shareUrl
            });
            showNotification('Beitrag geteilt!', 'success');
        } else {
            // Fallback: In Zwischenablage kopieren
            await navigator.clipboard.writeText(shareText);
            showNotification('Beitragstext in Zwischenablage kopiert!', 'success');
        }
    } catch (error) {
        // Benutzer hat Teilen abgebrochen oder Fehler
        if (error.name !== 'AbortError') {
            console.error('Fehler beim Teilen:', error);
            showNotification('Fehler beim Teilen des Beitrags.', 'error');
        }
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

// --- NEU: Drag-and-Drop Upload Handler ---
async function handleDragAndDropUpload(files) {
    window.uploadFiles = files;
    
    const modalContent = `
        <div class="space-y-4">
            <h2 class="text-2xl font-bold text-gradient mb-6">Bilder hochladen</h2>
            <div id="drag-upload-preview-container" class="grid grid-cols-3 gap-2 mb-4"></div>
            <textarea id="drag-upload-description" class="form-input" rows="3" placeholder="Beschreibung (optional)"></textarea>
            <div class="flex justify-end gap-3 pt-4 border-t border-border-glass">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="button" id="drag-upload-submit-btn" class="cta-primary-glow" onclick="window.startDragUpload()">
                    <span class="btn-text">Hochladen</span>
                </button>
            </div>
        </div>
    `;
    
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-md w-full' }), 'drag-drop-upload-modal');
    
    setTimeout(() => {
        const previewContainer = document.getElementById('drag-upload-preview-container');
        previewContainer.innerHTML = '';
        files.forEach(file => {
            const preview = document.createElement('div');
            preview.className = 'relative aspect-square rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center';
            const reader = new FileReader();
            reader.onload = e => {
                preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
            };
            reader.readAsDataURL(file);
            previewContainer.appendChild(preview);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 50);
}

// --- NEU: Upload-Funktion für Drag-and-Drop ---
window.startDragUpload = async function() {
    const submitBtn = document.getElementById('drag-upload-submit-btn');
    showButtonSpinner(submitBtn);
    
    try {
        const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
        if (!window.uploadFiles || window.uploadFiles.length === 0 || !currentFamilyId) {
            throw new Error("Keine Dateien oder keine Familie ausgewählt.");
        }
        
        const files = window.uploadFiles;
        const description = document.getElementById('drag-upload-description').value.trim();
        const uploadedImageUrls = [];
        
        const uploadPromises = files.map(async (file) => {
            const storageRef = ref(storage, `media/${currentFamilyId}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytesResumable(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            uploadedImageUrls.push(downloadURL);
            
            await addDoc(collection(db, 'families', currentFamilyId, 'media'), {
                fileName: file.name,
                url: downloadURL,
                type: file.type,
                size: file.size,
                description: description || null,
                uploaderId: currentUser.uid,
                uploaderName: currentUserData.name,
                createdAt: serverTimestamp()
            });
        });
        
        await Promise.all(uploadPromises);
        
        closeModal('drag-drop-upload-modal');
        showNotification(`${files.length} Bild(er) erfolgreich hochgeladen!`, 'success');
        
        window.uploadFiles = [];
    } catch (error) {
        console.error('Upload-Fehler:', error);
        showNotification('Fehler beim Upload.', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
    }
}