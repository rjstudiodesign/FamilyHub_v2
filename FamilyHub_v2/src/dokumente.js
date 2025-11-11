// src/dokumente.js
// Dokumentenverwaltung für wichtige Dateien

import { 
    db, storage,
    collection, query, orderBy, onSnapshot, addDoc, 
    doc, serverTimestamp, deleteDoc,
    ref, uploadBytesResumable, getDownloadURL
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showButtonSpinner, hideButtonSpinner, showNotification } from './ui.js';
import { Card, EmptyStateCard } from './components/Card.js';

/**
 * Initialisiert die Dokumentenverwaltungs-Seite
 */
export function renderDokumente(listeners) {
    // Alte Listener bereinigen
    if (listeners.documents) listeners.documents();
    
    const { currentFamilyId, currentUser } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;

    // Event-Listener für Upload-Button
    setupEventListeners();
    
    // Dokumente Listener
    const documentsQuery = query(
        collection(db, 'families', currentFamilyId, 'documents'),
        orderBy('createdAt', 'desc')
    );
    
    listeners.documents = onSnapshot(documentsQuery, (snapshot) => {
        const container = document.getElementById('dokumente-list-container');
        if (!container) return;
        
        if (snapshot.empty) {
            container.innerHTML = EmptyStateCard(
                'Keine Dokumente vorhanden',
                'Lade wichtige Dateien wie Versicherungspolicen, Verträge oder Rechnungen hoch.',
                'file-text',
                ''
            );
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }
        
        const { membersData } = getCurrentUser();
        if (!membersData) {
            container.innerHTML = '<div class="spinner mx-auto"></div>';
            return;
        }
        
        const documentsHTML = snapshot.docs.map(doc => {
            const document = { id: doc.id, ...doc.data() };
            return renderDocumentItem(document, membersData);
        }).join('');
        
        container.innerHTML = documentsHTML;
        
        // Event-Listener für Lösch-Buttons
        snapshot.docs.forEach(doc => {
            const deleteBtn = document.getElementById(`delete-doc-${doc.id}`);
            if (deleteBtn) {
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteDocument(doc.id);
                };
            }
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, (error) => {
        console.error("Fehler beim Laden der Dokumente:", error);
        const container = document.getElementById('dokumente-list-container');
        if (container) {
            container.innerHTML = '<p class="text-red-500 p-4">Fehler beim Laden der Dokumente.</p>';
        }
    });
}

/**
 * Event-Listener für Buttons einrichten
 */
function setupEventListeners() {
    setTimeout(() => {
        const btnUpload = document.getElementById('btn-upload-document');
        if (btnUpload) btnUpload.onclick = openUploadDocumentModal;
    }, 100);
}

/**
 * Rendert ein einzelnes Dokument-Listenelement
 */
function renderDocumentItem(document, membersData) {
    const uploader = membersData[document.uploaderId];
    const uploaderName = uploader?.name || 'Unbekannt';
    
    // Icon basierend auf Dateityp
    const icon = getFileIcon(document.fileType);
    const iconColor = getFileIconColor(document.fileType);
    
    // Kategorie-Badge Farbe
    const categoryColor = getCategoryColor(document.category);
    
    const timestamp = document.createdAt?.toDate ? 
        document.createdAt.toDate().toLocaleString('de-DE', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Gerade eben';
    
    return `
        <a href="${document.fileURL}" target="_blank" rel="noopener noreferrer" 
           class="glass-list-item p-4 rounded-lg flex items-center gap-4 hover:bg-white/10 transition-all group">
            <div class="${iconColor} flex-shrink-0">
                <i data-lucide="${icon}" class="w-8 h-8"></i>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-white truncate">${document.title}</h3>
                    <span class="px-2 py-0.5 ${categoryColor} text-xs rounded-full flex-shrink-0">
                        ${document.category}
                    </span>
                </div>
                <p class="text-sm text-text-secondary truncate">${document.fileName}</p>
                <p class="text-xs text-text-secondary mt-1">
                    Hochgeladen von ${uploaderName} • ${timestamp}
                </p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
                <div class="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    <i data-lucide="external-link" class="w-5 h-5"></i>
                </div>
                <button id="delete-doc-${document.id}" 
                        class="icon-button-ghost text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Dokument löschen">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </div>
        </a>
    `;
}

/**
 * Gibt das passende Icon für den Dateityp zurück
 */
function getFileIcon(fileType) {
    if (!fileType) return 'file';
    
    if (fileType.includes('pdf')) return 'file-text';
    if (fileType.includes('image')) return 'image';
    if (fileType.includes('word') || fileType.includes('doc')) return 'file-text';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'table';
    if (fileType.includes('zip') || fileType.includes('rar')) return 'archive';
    
    return 'file';
}

/**
 * Gibt die Farbe für das Icon zurück
 */
function getFileIconColor(fileType) {
    if (!fileType) return 'text-gray-400';
    
    if (fileType.includes('pdf')) return 'text-red-400';
    if (fileType.includes('image')) return 'text-blue-400';
    if (fileType.includes('word') || fileType.includes('doc')) return 'text-blue-500';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'text-green-500';
    if (fileType.includes('zip') || fileType.includes('rar')) return 'text-yellow-500';
    
    return 'text-gray-400';
}

/**
 * Gibt die Farbe für die Kategorie-Badge zurück
 */
function getCategoryColor(category) {
    const colors = {
        'Versicherung': 'bg-blue-500/20 text-blue-400',
        'Verträge': 'bg-green-500/20 text-green-400',
        'Rechnungen': 'bg-yellow-500/20 text-yellow-400',
        'Medizinisch': 'bg-red-500/20 text-red-400',
        'Sonstiges': 'bg-gray-500/20 text-gray-400'
    };
    return colors[category] || colors['Sonstiges'];
}

/**
 * Modal zum Hochladen eines Dokuments öffnen
 */
function openUploadDocumentModal() {
    const modalId = 'modal-upload-document';
    
    const modalContent = `
        <form id="upload-document-form">
            <h2 class="text-2xl font-bold text-gradient mb-6">Dokument hochladen</h2>
            
            <div class="space-y-4">
                <div>
                    <label for="document-title" class="form-label text-sm text-secondary mb-1 block">
                        Titel
                    </label>
                    <input type="text" id="document-title" class="form-input" required 
                           placeholder="z.B. Versicherungspolice 2025">
                </div>
                
                <div>
                    <label for="document-category" class="form-label text-sm text-secondary mb-1 block">
                        Kategorie
                    </label>
                    <select id="document-category" class="form-input" required>
                        <option value="">Bitte wählen...</option>
                        <option value="Versicherung">Versicherung</option>
                        <option value="Verträge">Verträge</option>
                        <option value="Rechnungen">Rechnungen</option>
                        <option value="Medizinisch">Medizinisch</option>
                        <option value="Sonstiges">Sonstiges</option>
                    </select>
                </div>
                
                <div>
                    <label for="document-file" class="form-label text-sm text-secondary mb-1 block">
                        Datei
                    </label>
                    <input type="file" id="document-file" class="form-input" required
                           accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.zip,.rar">
                    <p class="text-xs text-text-secondary mt-1">
                        Erlaubt: PDF, Word, Excel, Bilder, ZIP (max. 10MB)
                    </p>
                </div>
                
                <div id="upload-progress-container" class="hidden">
                    <div class="w-full bg-background-glass rounded-full h-2">
                        <div id="upload-progress-bar" class="bg-primary-rose h-2 rounded-full transition-all" style="width: 0%"></div>
                    </div>
                    <p id="upload-progress-text" class="text-sm text-text-secondary mt-2 text-center">0%</p>
                </div>
            </div>
            
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass mt-6">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="document-submit-btn" class="cta-primary-glow">
                    <span class="btn-text">Hochladen</span>
                </button>
            </div>
        </form>
    `;
    
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-lg w-full', padding: 'lg' }), modalId);
    
    document.getElementById('upload-document-form').onsubmit = handleDocumentUpload;
}

/**
 * Dokument hochladen und in Firestore speichern
 */
async function handleDocumentUpload(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('document-submit-btn');
    showButtonSpinner(submitBtn);
    
    const title = document.getElementById('document-title').value.trim();
    const category = document.getElementById('document-category').value;
    const fileInput = document.getElementById('document-file');
    const file = fileInput.files[0];
    
    if (!title || !category || !file) {
        showNotification("Bitte alle Felder ausfüllen.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }
    
    try {
        const { currentFamilyId, currentUser, currentUserData } = getCurrentUser();
        
        // Upload mit zentraler Utility
        const { uploadWithProgressUI, generateStoragePath } = await import('./utils/uploads.js');
        const storagePath = generateStoragePath('documents', currentFamilyId, file.name);
        
        const downloadURL = await uploadWithProgressUI(
            file,
            storagePath,
            'upload-progress-bar',
            'upload-progress-text'
        );
        
        // Dokument in Firestore speichern
        const documentsCol = collection(db, 'families', currentFamilyId, 'documents');
        await addDoc(documentsCol, {
            title: title,
            category: category,
            fileURL: downloadURL,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploaderId: currentUser.uid,
            uploaderName: currentUserData.name,
            createdAt: serverTimestamp()
        });
        
        showNotification("Dokument erfolgreich hochgeladen!", "success");
        closeModal('modal-upload-document');
        
    } catch (error) {
        console.error("Fehler beim Hochladen:", error);
        showNotification(error.message || "Fehler beim Speichern des Dokuments.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Dokument löschen
 */
async function handleDeleteDocument(documentId) {
    if (!confirm("Möchtest du dieses Dokument wirklich löschen?")) return;
    
    try {
        const { currentFamilyId } = getCurrentUser();
        const docRef = doc(db, 'families', currentFamilyId, 'documents', documentId);
        
        await deleteDoc(docRef);
        showNotification("Dokument gelöscht.", "success");
        
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
        showNotification("Fehler beim Löschen des Dokuments.", "error");
    }
}
