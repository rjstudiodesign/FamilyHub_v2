// js/gallery.js

import { db, storage, collection, query, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp, orderBy, ref, getDownloadURL } from './firebase.js';
import { uploadBytesResumable } from 'https://esm.sh/firebase/storage'; // KORRIGIERTER CDN-Import
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showNotification, showButtonSpinner, hideButtonSpinner } from './ui.js';

// Globale Variable für den Unsubscriber, um Memory Leaks zu verhindern
let galleryUnsubscribe = null;
let galleryMedia = [];

export function renderGallery(listeners) {
    if (!listeners || typeof listeners !== 'object') {
        console.error('renderGallery must be called with a listeners object provided by navigation.js');
        return;
    }

    const { currentFamilyId, membersData } = getCurrentUser(); // membersData wird jetzt benötigt
    if (!currentFamilyId || !membersData) {
        showNotification("Fehler: Mitgliedsdaten fehlen für Galerieansicht.", "error");
        return;
    }
    
    // ZEIGE DEN LADE-ZUSTAND AN (Skeleton)
    showGallerySkeleton();

    // Listener beenden, falls vorhanden
    if (listeners.gallery) {
        listeners.gallery();
    }

    const mediaQuery = query(collection(db, 'families', currentFamilyId, 'media'), orderBy('createdAt', 'desc'));

    galleryUnsubscribe = onSnapshot(mediaQuery, (snapshot) => {
        galleryMedia = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderGalleryAlbums();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, (error) => {
        console.error('Error loading media:', error);
        showNotification('Fehler beim Laden der Galerie.', 'error');
        showEmptyState(true); 
    });

    // Register unsubscribe in the central listeners object
    listeners.gallery = galleryUnsubscribe;
}

/**
 * Zeigt den Lade-Zustand (Skeleton) an.
 */
function showGallerySkeleton() { // <--- DIESE FUNKTION FEHLTE
    const container = document.getElementById('gallery-album-container');
    const emptyState = document.getElementById('gallery-empty-state');
    const skeleton = document.getElementById('gallery-skeleton');
    
    if (!container || !skeleton || !emptyState) return;

    emptyState.classList.add('hidden');
    container.innerHTML = '';
    skeleton.innerHTML = `
      <div class="skeleton-album-card">
        <div class="skeleton-album-header animate-pulse"></div>
        <div class="gallery-album-grid">
          <div class="skeleton-media-item animate-pulse"></div>
          <div class="skeleton-media-item animate-pulse"></div>
          <div class="skeleton-media-item animate-pulse"></div>
          <div class="skeleton-media-item animate-pulse"></div>
        </div>
      </div>
    `;
    skeleton.classList.remove('hidden');
}


/**
 * Gruppiert Medien nach Monat und Jahr.
 * @returns {Object} Ein Objekt, z.B. { "Oktober 2025": [media1, media2], ... }
 */
function groupMediaByMonth(mediaItems) {
    const grouped = {};
    const formatter = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' });

    mediaItems.forEach(media => {
        if (media.createdAt && media.createdAt.toDate) {
            const date = media.createdAt.toDate();
            const key = formatter.format(date);
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(media);
        }
    });
    return grouped;
}

function renderGalleryAlbums() {
    const container = document.getElementById('gallery-album-container');
    const skeleton = document.getElementById('gallery-skeleton');
    
    if (!container || !skeleton) return;

    skeleton.classList.add('hidden');

    if (galleryMedia.length === 0) {
        container.innerHTML = '';
        showEmptyState(true);
        return;
    }

    showEmptyState(false);
    container.innerHTML = ''; // Container leeren

    const groupedMedia = groupMediaByMonth(galleryMedia);
    
    for (const monthYear in groupedMedia) {
        const albumCard = document.createElement('div');
        albumCard.className = 'gallery-album-card'; //
        
        const header = document.createElement('h3');
        header.className = 'gallery-album-header'; //
        header.textContent = monthYear;
        albumCard.appendChild(header);
        
        const grid = document.createElement('div');
        grid.className = 'gallery-album-grid'; //
        
        groupedMedia[monthYear].forEach(media => {
            grid.appendChild(createMediaCard(media));
        });
        
        albumCard.appendChild(grid);
        container.appendChild(albumCard);
    }
}

function createMediaCard(media) {
    const card = document.createElement('div');
    card.className = 'gallery-media-item'; //
    card.onclick = () => window.openMediaDetail(media);
    
    const isVideo = !!(media.type && media.type.startsWith && media.type.startsWith('video/'));

    if (isVideo) {
        const video = document.createElement('video');
        video.src = media.url;
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', ''); 
        card.appendChild(video);

        const playBadge = document.createElement('div');
        playBadge.className = 'gallery-video-badge'; //
        playBadge.innerHTML = '<i data-lucide="play" style="fill: var(--text-primary);"></i>';
        card.appendChild(playBadge);
    } else {
        const img = document.createElement('img');
        img.src = media.url;
        img.alt = media.fileName || 'Galeriebild';
        img.loading = 'lazy'; 
        card.appendChild(img);
    }

    return card;
}

/**
 * Steuert die Sichtbarkeit des "Empty State"
 * @param {boolean} show Ob der Empty State angezeigt werden soll
 */
function showEmptyState(show) {
    const emptyState = document.getElementById('gallery-empty-state');
    if (emptyState) {
        if (show) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }
}


// === GLOBALE FUNKTIONEN (werden an window gebunden) ===

window.triggerGalleryUpload = function() {
    document.getElementById('gallery-upload-input')?.click();
}

window.handleGalleryUpload = function(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    window.uploadFiles = files;
    openModal(`
        <div class="modal-content glass-premium max-w-md w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Dateien hochladen</h2>
            <div id="upload-preview-container" class="grid grid-cols-3 gap-2 mb-4"></div>
            <textarea id="upload-description" class="form-input" rows="3" placeholder="Beschreibung (optional)"></textarea>
            <div class="flex justify-end gap-3 pt-4 border-t border-border-glass">
                <button type="button" class="btn-secondary" onclick="window.closeModal()">Abbrechen</button>
                <button type="button" id="upload-submit-btn" class="btn-premium" onclick="window.startUpload()">
                    <span class="btn-text" id="upload-btn-count">Datei(en) hochladen</span>
                </button>
            </div>
        </div>
    `, 'template-upload-modal'); // Nutzt die Modal-Logik von ui.js

    setTimeout(() => {
        const previewContainer = document.getElementById('upload-preview-container');
        previewContainer.innerHTML = '';
        files.forEach(file => {
            const preview = document.createElement('div');
            preview.className = 'relative aspect-square rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center';
            
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = e => {
                    preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith('video/')) {
                 preview.innerHTML = `<i data-lucide="video" class="w-10 h-10 text-gray-500"></i>`;
            } else {
                preview.innerHTML = `<i data-lucide="file" class="w-10 h-10 text-gray-500"></i>`;
            }
            previewContainer.appendChild(preview);
        });
        document.getElementById('upload-btn-count').textContent = `${files.length} Datei(en) hochladen`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 50);
}

window.startUpload = async function() {
    const submitBtn = document.getElementById('upload-submit-btn');
    showButtonSpinner(submitBtn);

    try {
        const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
        if (!window.uploadFiles || window.uploadFiles.length === 0 || !currentFamilyId) {
             throw new Error("Keine Dateien oder keine Familie ausgewählt.");
        }

        const files = window.uploadFiles;
        const description = document.getElementById('upload-description').value.trim();

        const uploadPromises = files.map(async (file) => {
            const storageRef = ref(storage, `media/${currentFamilyId}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytesResumable(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

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

        closeModal('template-upload-modal');
        showNotification(`${files.length} Datei(en) erfolgreich hochgeladen!`, 'success');
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('Fehler beim Upload.', 'error');
    } finally {
        hideButtonSpinner(submitBtn);
        window.uploadFiles = [];
        const input = document.getElementById('gallery-upload-input');
        if (input) input.value = '';
    }
}

window.openMediaDetail = function(media) {
    // Generiert den Modal-Inhalt dynamisch (statt Template-IDs)
    openModal(`
        <div class="modal-content glass-premium max-w-2xl w-full">
            <h2 class="text-xl font-bold text-gradient mb-4">${media.fileName || 'Mediendetail'}</h2>
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1 flex items-center justify-center bg-black/20 rounded-lg">
                    ${media.type.startsWith('video/') 
                        ? `<video src="${media.url}" controls class="max-h-96 rounded-lg object-contain"></video>`
                        : `<img src="${media.url}" alt="${media.fileName}" class="max-h-96 rounded-lg object-contain" />`
                    }
                </div>
                <div class="md:w-60 flex flex-col gap-3">
                    <p class="text-sm text-text-secondary">Hochgeladen von: <span class="font-semibold text-text-main">${media.uploaderName || 'Unbekannt'}</span></p>
                    <p class="text-sm text-text-secondary">Datum: <span class="font-semibold text-text-main">${media.createdAt ? media.createdAt.toDate().toLocaleDateString('de-DE') : 'Unbekannt'}</span></p>
                    ${media.description ? `<p class="text-sm text-text-main mt-2">${media.description}</p>` : ''}
                    <div class="flex gap-2 mt-auto pt-4 border-t border-border-glass">
                        <button class="btn-secondary flex-1" onclick="window.downloadMedia('${media.url}', '${media.fileName}')">
                            <i data-lucide="download" class="w-5 h-5"></i> Download
                        </button>
                        <button class="btn-secondary flex-1 bg-red-500/20 border-red-500/30 text-red-400" onclick="window.deleteMedia('${media.id}')">
                            <i data-lucide="trash-2" class="w-5 h-5"></i> Löschen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `, 'template-media-detail-modal');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.downloadMedia = function(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

window.deleteMedia = async function(mediaId) {
    if (!mediaId || !confirm('Möchtest du diese Datei wirklich endgültig löschen?')) return;
    
    const { currentFamilyId } = getCurrentUser();
    if (!currentFamilyId) return;

    // TODO: Löschen aus Storage implementieren (fortgeschritten)

    try {
        const mediaRef = doc(db, 'families', currentFamilyId, 'media', mediaId);
        await deleteDoc(mediaRef);
        closeModal('template-media-detail-modal');
        showNotification('Datei gelöscht.', 'success');
    } catch (error) {
        console.error("Error deleting media:", error);
        showNotification('Fehler beim Löschen.', 'error');
    }
}