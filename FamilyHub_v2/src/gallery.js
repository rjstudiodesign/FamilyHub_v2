// js/gallery.js
// KORRIGIERTE IMPORTE

import { 
    db, storage, 
    collection, query, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp, orderBy, 
    ref, getDownloadURL, uploadBytesResumable,
    where, getDocs // NEU: Nötig für die Feed-Post-Logik
} from './firebase.js'; // <-- ALLE Firebase-Funktionen kommen jetzt von hier
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showNotification, showButtonSpinner, hideButtonSpinner } from './ui.js';

let galleryUnsubscribe = null;
let galleryMedia = [];

export function renderGallery(listeners) {
    if (!listeners || typeof listeners !== 'object') {
        console.error('renderGallery must be called with a listeners object provided by navigation.js');
        return;
    }

    const { currentFamilyId, membersData } = getCurrentUser();
    if (!currentFamilyId || !membersData) {
        showNotification("Fehler: Mitgliedsdaten fehlen für Galerieansicht.", "error");
        return;
    }
    
    showGallerySkeleton();

    if (listeners.gallery) {
        listeners.gallery();
    }

    const mediaQuery = query(collection(db, 'families', currentFamilyId, 'media'), orderBy('createdAt', 'desc'));

    galleryUnsubscribe = onSnapshot(mediaQuery, (snapshot) => {
        if (snapshot.empty) {
            showEmptyState(true);
            const skeleton = document.getElementById('gallery-skeleton');
            if(skeleton) skeleton.classList.add('hidden');
            return;
        }

        snapshot.docChanges().forEach(change => {
            const media = { id: change.doc.id, ...change.doc.data() };
            
            if (change.type === "added") {
                galleryMedia.unshift(media); // Hinzufügen am Anfang, da nach 'desc' sortiert
            }
            if (change.type === "modified") {
                const index = galleryMedia.findIndex(m => m.id === media.id);
                if (index > -1) galleryMedia[index] = media;
            }
            if (change.type === "removed") {
                const index = galleryMedia.findIndex(m => m.id === media.id);
                if (index > -1) galleryMedia.splice(index, 1);
            }
        });

        renderGalleryAlbums();
        if (typeof lucide !== 'undefined') lucide.createIcons();

    }, (error) => {
        console.error('Error loading media:', error);
        showNotification('Fehler beim Laden der Galerie.', 'error');
        showEmptyState(true); 
    });

    listeners.gallery = galleryUnsubscribe;

    // --- NEU: Event-Listener für die Upload-Buttons ---
    const uploadFab = document.getElementById('gallery-upload-fab');
    if (uploadFab) {
        uploadFab.addEventListener('click', () => window.triggerGalleryUpload());
    }

    const uploadInput = document.getElementById('gallery-upload-input');
    if (uploadInput) {
        uploadInput.addEventListener('change', (event) => window.handleGalleryUpload(event));
    }
}

function showGallerySkeleton() {
    const container = document.getElementById('gallery-album-container');
    const emptyState = document.getElementById('gallery-empty-state');
    const skeleton = document.getElementById('gallery-skeleton');
    
    if (!container || !skeleton || !emptyState) {
        console.error("Architekt: Galerie-DOM-Struktur in index.html ist fehlerhaft.");
        return;
    }

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
    container.innerHTML = ''; 

    const groupedMedia = groupMediaByMonth(galleryMedia);
    
    for (const monthYear in groupedMedia) {
        const albumCard = document.createElement('div');
        albumCard.className = 'gallery-album-card';
        
        const header = document.createElement('h3');
        header.className = 'gallery-album-header';
        header.textContent = monthYear;
        albumCard.appendChild(header);
        
        const grid = document.createElement('div');
        grid.className = 'gallery-album-grid';
        
        groupedMedia[monthYear].forEach(media => {
            grid.appendChild(createMediaCard(media));
        });
        
        albumCard.appendChild(grid);
        container.appendChild(albumCard);
    }
}

function createMediaCard(media) {
    const card = document.createElement('div');
    card.className = 'gallery-media-item';
    card.onclick = () => window.openMediaDetail(media);
    
    const isVideo = !!(media.type && media.type.startsWith && media.type.startsWith('video/'));

    if (isVideo) {
        const video = document.createElement('video');
        video.src = media.url;
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', ''); 
        card.appendChild(video);

        const playBadge = document.createElement('div');
        playBadge.className = 'gallery-video-badge';
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

// === GLOBALE FUNKTIONEN ===
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
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="button" id="upload-submit-btn" class="btn-premium" onclick="window.startUpload()">
                    <span class="btn-text" id="upload-btn-count">Datei(en) hochladen</span>
                </button>
            </div>
        </div>
    `, 'template-upload-modal');

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

// === NEU: INTELLIGENTE UPLOAD-LOGIK ===
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
        const uploadedImageUrls = []; // Speichert die URLs der neuen Bilder

        const uploadPromises = files.map(async (file) => {
            const storageRef = ref(storage, `media/${currentFamilyId}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytesResumable(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Nur Bild-URLs für die Feed-Vorschau sammeln
            if (file.type.startsWith('image/')) {
                uploadedImageUrls.push(downloadURL);
            }

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

        // --- NEU: Feed-Post erstellen ---
        if (uploadedImageUrls.length > 0) {
            await createGalleryFeedPost(uploadedImageUrls, currentUser, currentFamilyId);
        }
        // --- ENDE ---

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

/**
 * Erstellt einen Feed-Post, wenn dies der erste Upload in einem neuen Monat ist.
 */
async function createGalleryFeedPost(uploadedImageUrls, currentUser, currentFamilyId) {
    try {
        const formatter = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' });
        const albumTitle = `Neue Fotos im ${formatter.format(new Date())}`;

        // 1. Prüfen, ob für diesen Titel bereits ein Post existiert
        const postsRef = collection(db, 'families', currentFamilyId, 'posts');
        const q = query(postsRef, 
            where('type', '==', 'gallery'),
            where('galleryTitle', '==', albumTitle)
        );
        
        const existingPosts = await getDocs(q);
        
        if (existingPosts.empty) {
            // 2. Keiner existiert -> Neuen Post erstellen
            await addDoc(postsRef, {
                type: 'gallery',
                galleryTitle: albumTitle,
                thumbnailUrls: uploadedImageUrls.slice(0, 4), // Nimm die ersten 4 Bilder
                authorName: "FamilyHub Galerie",
                authorId: 'system',
                authorAvatar: 'https://ui-avatars.com/api/?name=Hub&background=A04668&color=F2F4F3&bold=true',
                createdAt: serverTimestamp(),
                participants: null // Öffentlich für alle
            });
            showNotification("Neues Album im Feed geteilt!", "success");
        } else {
            // 3. Post existiert bereits -> Thumbnails aktualisieren (optional, für später)
            console.log(`Galerie-Post für '${albumTitle}' existiert bereits. Überspringe Erstellung.`);
        }
    } catch (error) {
        console.error("Fehler beim Erstellen des Galerie-Feed-Posts:", error);
        // Dies ist ein Non-Blocking-Error, der Upload war trotzdem erfolgreich.
    }
}
// === ENDE DER INTELLIGENTEN LOGIK ===


window.openMediaDetail = function(media) {
    openModal(`
        <div class="modal-content glass-premium max-w-2xl w-full">
            <button class="icon-button-ghost absolute top-4 right-4" data-action="close-modal">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
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
                            <i data-lucide="download" class="w-5 h-5"></i>
                        </button>
                        <button class="btn-secondary flex-1 bg-red-500/20 border-red-500/30 text-red-400" onclick="window.deleteMedia('${media.id}')">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
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
    
    try {
        // TODO: Löschen aus Storage implementieren (fortgeschritten)
        const mediaRef = doc(db, 'families', currentFamilyId, 'media', mediaId);
        await deleteDoc(mediaRef);
        closeModal('template-media-detail-modal');
        showNotification('Datei gelöscht.', 'success');
    } catch (error) {
        console.error("Error deleting media:", error);
        showNotification('Fehler beim Löschen.', 'error');
    }
}